const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'server', 'mma.db');
const db = new sqlite3.Database(dbPath);

const mediaItems = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed_media.json'), 'utf8'));

db.serialize(() => {
    let inserted = 0;
    
    db.run('BEGIN TRANSACTION');

    mediaItems.forEach(item => {
        db.run(`
            INSERT OR IGNORE INTO media (
                uid, title, video_type, audio_type, duration, filename, lab, rating
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            item.uid,
            item.title,
            item.video_type,
            item.audio_type,
            item.duration,
            item.filename,
            item.lab,
            item.rating_description
        ], function(err) {
            if (!err && this.changes > 0) inserted++;
        });
    });

    db.run('COMMIT', () => {
        console.log(`Successfully inserted ${inserted} records.`);
        
        // Count total rows
        db.get("SELECT count(*) as count FROM media", (err, row) => {
            if (row) {
                console.log(`Total rows in media table: ${row.count}`);
            }
            db.close();
        });
    });
});
