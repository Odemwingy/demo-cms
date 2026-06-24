import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  const db = await open({
    filename: path.join(__dirname, 'mma.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    DROP TABLE IF EXISTS csp_airline_access;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS csps;
    DROP TABLE IF EXISTS airlines;
    DROP TABLE IF EXISTS category_media;
    DROP TABLE IF EXISTS media_metadata;
    DROP TABLE IF EXISTS media_systems;
    DROP TABLE IF EXISTS media_images;
    DROP TABLE IF EXISTS media;
    DROP TABLE IF EXISTS language_lookups;
  `);

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await db.exec(schema);
  console.log('Schema created.');

  // 1. Seed Airlines
  const airlines = [
    ['AI', 'Air India', 'Air India'],
    ['NZ', 'Air New Zealand', 'Air New Zealand'],
    ['MU', 'China Eastern', 'China Eastern'],
    ['CZ', 'China Southern', 'China Southern'],
    ['4U', 'Eurowings', 'Eurowings'],
    ['HO', 'Juneyao Airlines', 'Juneyao Airlines']
  ];
  for (const a of airlines) {
    await db.run('INSERT INTO airlines (id, code, name) VALUES (?, ?, ?)', a);
  }

  // 2. Seed CSPs
  await db.run("INSERT INTO csps (id, name) VALUES ('CSP1', 'Enveesoft')");

  // 3. Seed CSP Access
  // Enveesoft has access to Eurowings (4U) from 2015 to 2020
  await db.run("INSERT INTO csp_airline_access (csp_id, airline_id, start_year, end_year) VALUES ('CSP1', '4U', 2015, 2020)");
  // And access to Juneyao (HO) from 2024 to 2026
  await db.run("INSERT INTO csp_airline_access (csp_id, airline_id, start_year, end_year) VALUES ('CSP1', 'HO', 2024, 2026)");

  // 4. Seed Users
  // IFE Admin (IFE Provider)
  await db.run("INSERT INTO users (username, role, company_id) VALUES ('IFE Admin', 'IFE_PROVIDER', NULL)");
  // Airline Admin (Eurowings)
  await db.run("INSERT INTO users (username, role, company_id) VALUES ('Eurowings User', 'AIRLINE', '4U')");
  // CSP User (Enveesoft)
  await db.run("INSERT INTO users (username, role, company_id) VALUES ('Eric Liu', 'CSP', 'CSP1')");

  // Read newly extracted HAR data
  const rawData = fs.readFileSync(path.join(__dirname, 'mma_data.json'), 'utf8');
  const extractedFiles = JSON.parse(rawData);

  console.log('Seeding data from HAR extract...');
  let inserted = 0;

  const sampleAirlines = ['AI', 'NZ', 'MU', 'CZ', '4U', 'HO'];
  const sampleCycles = ['2015-06', '2016-07', '2024-05', '2025-07', '2026-06'];

  for (const item of extractedFiles) {
    try {
      const uid = item.media_id || item.id || item.uid || `AUTO-${Math.floor(Math.random()*100000)}`;
      const mid = item.mid || null;
      const pos = item.sequence || '';
      const title = item.original_title || item.title || '';
      const rating = item.rating_description || '';
      const duration = item.duration || '';
      const encoding = item.encoding || (Math.random() > 0.5 ? 'H264' : 'H265');
      const bitrate = item.bitrate || '4Mbps';
      const release_year = item.release_year || '2024';
      const eidr = item.eidr || `10.5240/${Math.random().toString(36).substr(2,9).toUpperCase()}`;
      const systems = item.systems || 'eXW,eXO,eX2';
      const lab = item.lab || (Math.random() > 0.5 ? 'West Entertainment' : 'Encore');
      const distributor = item.distributor || (Math.random() > 0.5 ? 'Warner Brothers' : 'Universal');
      const country = item.country || (Math.random() > 0.5 ? 'USA' : 'GBR');
      const credits_start_time = item.credits_start_time || '01:30:00';
      const intro_start_time = item.intro_start_time || '00:00:00';
      const intro_end_time = item.intro_end_time || '00:05:00';
      const keywords = item.keywords || 'Action, Thriller, Featured';
      const aspect_ratio = item.aspect_ratio || '16x9Adjustable';

      const stmt = await db.prepare(`
        INSERT INTO media (
          airline_id, cycle, uid, mid, pos, video_type, title, rating, aspect_ratio,
          duration, encoding, bitrate, release_year, eidr, systems, lab, distributor,
          credits_start_time, intro_start_time, intro_end_time, keywords, sign_off_status,
          country, movie_version, edit_version, season_number, episode_number, series_uid,
          album_title, composer, track_number, release_artist, platform,
          qc_status, qc_received_date, qc_validate_date, qc_comments,
          license_period, parent_rating
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?
        )
      `);

      const randomAirline = sampleAirlines[Math.floor(Math.random() * sampleAirlines.length)];
      const randomCycle = sampleCycles[Math.floor(Math.random() * sampleCycles.length)];

      const res = await stmt.run(
        randomAirline, randomCycle, uid, mid, pos, item.content_type || 'Video', title, rating, aspect_ratio,
        duration, encoding, bitrate, release_year, eidr, systems, lab, distributor,
        credits_start_time, intro_start_time, intro_end_time, keywords, 'Pending',
        country, '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '',
        '', ''
      );
      await stmt.finalize();
      
      const mediaId = res.lastID;

      // Seed dummy systems
      const sysStmt = await db.prepare('INSERT INTO media_systems (media_id, system_name, start_date, end_date) VALUES (?, ?, ?, ?)');
      await sysStmt.run(mediaId, 'S3Ki', '2022-01', '2025-12');
      await sysStmt.run(mediaId, 'eX3', '2022-01', 'All');
      await sysStmt.finalize();

      // Seed dummy metadata (Multi-language and Multi-system)
      const metaStmt = await db.prepare(`
        INSERT INTO media_metadata (
          media_id, system_name, language, title, short_title, director,
          cast_members, release_year, genre, country_origin, people_score,
          critic_score, description, short_description, review
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      // System: S3Ki, Lang: English
      await metaStmt.run(
        mediaId, 'S3Ki', 'English', title, title.substring(0, 10), 'James Cameron',
        'Actor A, Actor B', release_year, 'Action', 'USA', '8.5', '9.0',
        'A great movie.', 'Great movie.', 'Must watch.'
      );
      // System: S3Ki, Lang: Chinese
      await metaStmt.run(
        mediaId, 'S3Ki', 'Chinese - Simplified', title + ' (中文)', title.substring(0, 5), '詹姆斯卡梅隆',
        '演员A, 演员B', release_year, '动作', '美国', '8.5', '9.0',
        '这是一部好电影', '好电影', '必看'
      );
      await metaStmt.finalize();

      // Seed dummy images
      const imgStmt = await db.prepare(`
        INSERT INTO media_images (
          media_id, system_name, size_category, image_type, dimensions, color_depth, file_size, format
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      await imgStmt.run(mediaId, 'eX3', 'Business Class 1024x600', 'SYNOPSIS', '1024x600', '8bit', '239KB', 'BMP3');
      await imgStmt.run(mediaId, 'eX3', 'Business Class 1024x600', 'POSTER', '132x189', '8bit', '25KB', 'BMP');
      await imgStmt.finalize();

      inserted++;
    } catch(e) {
      console.error('Error inserting row', e);
    }
  }

  console.log(`Seeded ${inserted} records into database.`);

  console.log('Seeding profiles...');
  await db.exec(`
    DELETE FROM category_media;
    DELETE FROM language_lookups;
    DELETE FROM categories;
    DELETE FROM sub_profiles;
    DELETE FROM classes;
    DELETE FROM profile_routes;
    DELETE FROM media_configs;
    DELETE FROM profiles;
    DELETE FROM category_sets;

    INSERT INTO language_lookups (name, iso_code, label_lid) VALUES ('English', 'eng', 20401);
    INSERT INTO language_lookups (name, iso_code, label_lid) VALUES ('Chinese - Simplified', 'chi', 20412);
    INSERT INTO language_lookups (name, iso_code, label_lid) VALUES ('French', 'fra', 20422);

    INSERT INTO category_sets (id, profile_id, name, applied_cycles, locked, created_on, created_by) 
    VALUES ('cs1', 'p1', 'HU Default Category Set', '["2026-06", "2026-07"]', 0, '2026-06-24T00:00:00Z', 'System');
    
    INSERT INTO profiles (id, name, type, program_number, disabled, linked_profile_id, version, category_set_id, shipment_info)
    VALUES ('p1', 'HU eX3', 'AVOD 1.5', 'HU-01', 0, NULL, 'v1.5.4', 'cs1', '{"aircraftMfg":"Boeing","aircraftModel":"787","tailNum":"B-1234"}');
    
    INSERT INTO profiles (id, name, type, program_number, disabled, linked_profile_id, version, category_set_id, shipment_info)
    VALUES ('p2', 'HU eXO', 'AVOD 1.5', 'HU-01', 0, 'p1', 'v1.5.4', 'cs1', '{}');
    
    INSERT INTO profiles (id, name, type, program_number, disabled, linked_profile_id, version, category_set_id, shipment_info)
    VALUES ('p3', 'HU B737', 'B737', 'HU-01', 0, NULL, 'v1.0.0', 'cs1', '{}');

    INSERT INTO media_configs (id, profile_id, config_id, name, hidden) VALUES ('mc1', 'p1', '1', 'Media Config 1 (Domestic)', 0);
    INSERT INTO media_configs (id, profile_id, config_id, name, hidden) VALUES ('mc2', 'p1', '2', 'Media Config 2 (Intl)', 0);
    
    INSERT INTO classes (id, profile_id, media_config_id, mma_display_name, exported_classes)
    VALUES ('c1', 'p1', 'ALL', 'Business Class', '["J"]');
    INSERT INTO classes (id, profile_id, media_config_id, mma_display_name, exported_classes)
    VALUES ('c2', 'p1', 'mc1', 'Economy Class', '["Y"]');

    INSERT INTO categories (id, category_set_id, parent_id, default_name, cid, cid_type, order_position, media_type, purpose, virtual)
    VALUES ('cat1', 'cs1', NULL, 'Movies', 200, 'movies', 1, 'Video', 'AVOD', 0);

    INSERT INTO categories (id, category_set_id, parent_id, default_name, cid, cid_type, order_position, media_type, purpose, virtual)
    VALUES ('cat2', 'cs1', 'cat1', 'Hollywood', 201, 'movies', 1, 'Video', 'AVOD', 0);

    INSERT INTO categories (id, category_set_id, parent_id, default_name, cid, cid_type, order_position, media_type, purpose, virtual, propagation_data)
    VALUES ('cat3', 'cs1', 'cat1', 'Domestic Only (B737)', 202, 'movies', 2, 'Video', 'AVOD', 1, '[{"tableName":"flightConfigTable","fieldName":"aircraftType","value":"B737","operation":"Add"}]');

    INSERT INTO categories (id, category_set_id, parent_id, default_name, cid, cid_type, order_position, media_type, purpose, virtual)
    VALUES ('cat4', 'cs1', NULL, 'BGM', 100, 'music', 2, 'Audio', 'BGM', 0);
  `);
  
  // Link media item 1 to category cat2 (Hollywood)
  await db.exec(`
    INSERT INTO category_media (category_id, media_id, price, channel_num, access_type, order_position)
    VALUES ('cat2', 1, '5.99', 'CH101', 'PPV', 1);
  `);
  console.log('Profile & Category data seeded.');
}

seed().catch(err => {
  console.error(err);
});
