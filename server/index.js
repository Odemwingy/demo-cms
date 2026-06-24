import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let db;

// Initialize database
async function initDb() {
  db = await open({
    filename: path.join(__dirname, 'mma.db'),
    driver: sqlite3.Database
  });
  console.log('Database connected.');
}

// GET all mock users
app.get('/api/auth/users', async (req, res) => {
  try {
    const users = await db.all('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET allowed airlines & cycles for a user
app.get('/api/airlines', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: 'user_id is required' });

    const user = await db.get('SELECT * FROM users WHERE id = ?', [user_id]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let allowedAirlines = [];
    if (user.role === 'IFE_PROVIDER') {
      allowedAirlines = await db.all('SELECT * FROM airlines');
      // For IFE provider, attach a mock set of ALL available cycles
      allowedAirlines = allowedAirlines.map(a => ({ ...a, cycles: ['2015-06', '2016-07', '2024-05', '2025-07', '2026-06'] }));
    } else if (user.role === 'AIRLINE') {
      allowedAirlines = await db.all('SELECT * FROM airlines WHERE id = ?', [user.company_id]);
      allowedAirlines = allowedAirlines.map(a => ({ ...a, cycles: ['2015-06', '2016-07', '2024-05', '2025-07', '2026-06'] }));
    } else if (user.role === 'CSP') {
      const accesses = await db.all('SELECT * FROM csp_airline_access WHERE csp_id = ?', [user.company_id]);
      const airlineIds = accesses.map(a => a.airline_id);
      if (airlineIds.length > 0) {
        const placeholders = airlineIds.map(() => '?').join(',');
        const airlinesData = await db.all(`SELECT * FROM airlines WHERE id IN (${placeholders})`, airlineIds);
        
        allowedAirlines = airlinesData.map(a => {
          const access = accesses.find(acc => acc.airline_id === a.id);
          // Mock cycles based on allowed years
          const allMockCycles = ['2015-06', '2016-07', '2024-05', '2025-07', '2026-06'];
          const allowedCycles = allMockCycles.filter(c => {
            const year = parseInt(c.split('-')[0], 10);
            return year >= access.start_year && year <= access.end_year;
          });
          return { ...a, cycles: allowedCycles };
        });
      }
    }

    res.json(allowedAirlines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET media filtered by airline and cycle, with optional search
app.get('/api/media', async (req, res) => {
  try {
    const { airline_id, cycle, search } = req.query;
    let query = 'SELECT * FROM media WHERE 1=1';
    let params = [];
    
    if (airline_id) {
      query += ' AND airline_id = ?';
      params.push(airline_id);
    }
    if (cycle) {
      query += ' AND cycle = ?';
      params.push(cycle);
    }
    if (search) {
      query += ' AND (title LIKE ? OR uid LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    const media = await db.all(query, params);
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET profiles with nested data
app.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await db.all('SELECT * FROM profiles');
    const category_sets = await db.all('SELECT * FROM category_sets');
    const media_configs = await db.all('SELECT * FROM media_configs');
    const classes = await db.all('SELECT * FROM classes');
    
    // Process and attach nested relations
    const formattedProfiles = profiles.map(p => ({
      ...p,
      categorySet: category_sets.find(c => c.id === p.category_set_id) || null,
      mediaConfigs: media_configs.filter(m => m.profile_id === p.id),
      classes: classes.filter(c => c.profile_id === p.id)
    }));
    
    res.json(formattedProfiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET specific media by UID
app.get('/api/media/:uid', async (req, res) => {
  try {
    const item = await db.get('SELECT * FROM media WHERE uid = ?', [req.params.uid]);
    if (item) {
      item.systems_config = await db.all('SELECT * FROM media_systems WHERE media_id = ?', [item.id]);
      item.metadata = await db.all('SELECT * FROM media_metadata WHERE media_id = ?', [item.id]);
      item.images = await db.all('SELECT * FROM media_images WHERE media_id = ?', [item.id]);
      res.json(item);
    } else {
      res.status(404).json({ error: 'Media not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE specific media
app.put('/api/media/:uid', async (req, res) => {
  try {
    const item = await db.get('SELECT id FROM media WHERE uid = ?', [req.params.uid]);
    if (!item) return res.status(404).json({ error: 'Media not found' });
    
    const fields = req.body;
    const mediaId = item.id;
    
    // Separate flat fields
    const flatFields = {};
    for (const k in fields) {
      if (k !== 'systems_config' && k !== 'metadata' && k !== 'images') {
        flatFields[k] = fields[k];
      }
    }
    
    const keys = Object.keys(flatFields);
    if (keys.length > 0) {
      const setClause = keys.map(k => `${k} = ?`).join(', ');
      const values = keys.map(k => flatFields[k]);
      values.push(req.params.uid);
      await db.run(`UPDATE media SET ${setClause} WHERE uid = ?`, values);
    }

    if (fields.metadata) {
      await db.run('DELETE FROM media_metadata WHERE media_id = ?', [mediaId]);
      for (const m of fields.metadata) {
        await db.run(`INSERT INTO media_metadata (media_id, system_name, language, title, short_title, director, cast_members, release_year, genre, country_origin, people_score, critic_score, description, short_description, review) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [mediaId, m.system_name, m.language, m.title, m.short_title, m.director, m.cast_members, m.release_year, m.genre, m.country_origin, m.people_score, m.critic_score, m.description, m.short_description, m.review]);
      }
    }
    
    const updated = await db.get('SELECT * FROM media WHERE uid = ?', [req.params.uid]);
    updated.systems_config = await db.all('SELECT * FROM media_systems WHERE media_id = ?', [mediaId]);
    updated.metadata = await db.all('SELECT * FROM media_metadata WHERE media_id = ?', [mediaId]);
    updated.images = await db.all('SELECT * FROM media_images WHERE media_id = ?', [mediaId]);
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// NEW: Sign Off Cycle
app.post('/api/sign-off', async (req, res) => {
  try {
    await db.run("UPDATE media SET sign_off_status = 'Full Sign-Off' WHERE sign_off_status != 'Full Sign-Off'");
    res.json({ success: true, message: 'All pending media fully signed off.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NEW: Integrity Check
app.post('/api/integrity-check', async (req, res) => {
  try {
    // Mock integrity check logic based on documentation
    const pending = await db.get("SELECT COUNT(*) as count FROM media WHERE sign_off_status != 'Full Sign-Off'");
    if (pending.count > 0) {
      res.json({ success: false, message: `Integrity Check Failed: ${pending.count} media items are not fully signed off.` });
    } else {
      res.json({ success: true, message: 'Integrity Check Passed: All media are signed off and ready for export.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NEW: Export Cycle
app.post('/api/export', async (req, res) => {
  try {
    // Mock export generation
    res.json({ success: true, message: 'Cycle exported successfully as XML.', url: '/exports/cycle_export_2026.xml' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NEW: Create Version
app.post('/api/version/:uid', async (req, res) => {
  try {
    const master = await db.get('SELECT * FROM media WHERE uid = ?', [req.params.uid]);
    if (!master) return res.status(404).json({ error: 'Master not found' });
    
    const newUid = master.uid + '_V' + Math.floor(Math.random() * 100);
    const fields = Object.keys(master).filter(k => k !== 'id' && k !== 'uid' && k !== 'parent_uid');
    
    const insertCols = ['uid', 'parent_uid', ...fields].join(', ');
    const placeholders = ['?', '?', ...fields.map(() => '?')].join(', ');
    const values = [newUid, master.uid, ...fields.map(k => master[k])];
    
    await db.run(`INSERT INTO media (${insertCols}) VALUES (${placeholders})`, values);
    res.json({ success: true, uid: newUid, message: 'Version created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// NEW: Get Categories for a Category Set
app.get('/api/categories/:categorySetId', async (req, res) => {
  try {
    const categories = await db.all('SELECT * FROM categories WHERE category_set_id = ? ORDER BY order_position ASC', [req.params.categorySetId]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NEW: Add a Category
app.post('/api/categories', async (req, res) => {
  try {
    const { category_set_id, parent_id, media_config_id, class_id, language_id, default_name, cid, cid_type, order_position, media_type, purpose, virtual, propagation_data } = req.body;
    const id = 'cat_' + Math.floor(Math.random() * 1000000);
    await db.run(`INSERT INTO categories (id, category_set_id, parent_id, media_config_id, class_id, language_id, default_name, cid, cid_type, order_position, media_type, purpose, virtual, propagation_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, category_set_id, parent_id || null, media_config_id || 'all', class_id || 'all', language_id || 'all', default_name, cid, cid_type || 'movies', order_position || 0, media_type || 'Video', purpose || 'AVOD', virtual ? 1 : 0, propagation_data || '[]']
    );
    const newCat = await db.get('SELECT * FROM categories WHERE id = ?', [id]);
    res.json(newCat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NEW: Update a Category
app.put('/api/categories/:id', async (req, res) => {
  try {
    const fields = req.body;
    const keys = Object.keys(fields).filter(k => k !== 'id');
    if (keys.length > 0) {
      const setClause = keys.map(k => `${k} = ?`).join(', ');
      const values = keys.map(k => fields[k]);
      values.push(req.params.id);
      await db.run(`UPDATE categories SET ${setClause} WHERE id = ?`, values);
    }
    const updated = await db.get('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NEW: Delete a Category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NEW: ISO Language Lookups
app.get('/api/languages', async (req, res) => {
  try {
    const languages = await db.all('SELECT * FROM language_lookups');
    res.json(languages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NEW: Category Media Mapping
app.get('/api/categories/:cid/media', async (req, res) => {
  try {
    const cid = req.params.cid;
    const media = await db.all(`
      SELECT m.*, cm.price, cm.channel_num, cm.access_type, cm.order_position
      FROM media m
      JOIN category_media cm ON m.id = cm.media_id
      WHERE cm.category_id = ?
      ORDER BY cm.order_position ASC
    `, [cid]);
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories/:cid/media', async (req, res) => {
  try {
    const cid = req.params.cid;
    const bindings = req.body;
    
    await db.run('BEGIN TRANSACTION');
    await db.run('DELETE FROM category_media WHERE category_id = ?', [cid]);
    
    for (const b of bindings) {
      await db.run(`
        INSERT INTO category_media (category_id, media_id, price, channel_num, access_type, order_position)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [cid, b.media_id, b.price || null, b.channel_num || null, b.access_type || null, b.order_position || null]);
    }
    
    await db.run('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
});

// Start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
});
