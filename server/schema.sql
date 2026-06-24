DROP TABLE IF EXISTS media;
CREATE TABLE IF NOT EXISTS airlines (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS csps (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    role TEXT NOT NULL, -- 'IFE_PROVIDER', 'AIRLINE', 'CSP'
    company_id TEXT -- points to airline_id or csp_id depending on role, NULL for IFE_PROVIDER
);

CREATE TABLE IF NOT EXISTS csp_airline_access (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    csp_id TEXT NOT NULL,
    airline_id TEXT NOT NULL,
    start_year INTEGER,
    end_year INTEGER,
    FOREIGN KEY(csp_id) REFERENCES csps(id),
    FOREIGN KEY(airline_id) REFERENCES airlines(id)
);

CREATE TABLE media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    airline_id TEXT,
    cycle TEXT,
    uid TEXT UNIQUE NOT NULL,
    mid TEXT,
    pos TEXT,
    chn TEXT,
    grp TEXT,
    title TEXT,
    soundtracks TEXT,
    subtitles TEXT,
    duration TEXT,
    rating TEXT,
    trailer TEXT,
    img TEXT,
    inf TEXT,
    aspect_ratio TEXT,
    filename TEXT,
    filesize TEXT,
    adv TEXT,
    video_type TEXT,
    encoding TEXT,
    bitrate TEXT,
    lab TEXT,
    distributor TEXT,
    release_year TEXT,
    eidr TEXT,
    credits_start_time TEXT,
    country TEXT,
    keywords TEXT,
    user_media_id TEXT,
    intro_start_time TEXT,
    intro_end_time TEXT,
    systems TEXT, -- Legacy basic comma separated string
    sign_off_status TEXT DEFAULT 'Pending',
    vls_type TEXT,
    original_artist TEXT,
    ppv TEXT,
    parent_uid TEXT,
    content_type TEXT,
    lru TEXT,
    overhead_lid TEXT,
    purpose TEXT,
    audio_type TEXT,
    content_owner TEXT,
    upc_isrc TEXT,
    game_type TEXT,
    developer TEXT,
    publisher TEXT,
    os_version TEXT,
    author TEXT,
    isbn TEXT,
    language TEXT,
    movie_version TEXT,
    edit_version TEXT,
    season_number TEXT,
    episode_number TEXT,
    series_uid TEXT,
    album_title TEXT,
    composer TEXT,
    track_number TEXT,
    release_artist TEXT,
    platform TEXT,
    qc_status TEXT,
    qc_received_date TEXT,
    qc_validate_date TEXT,
    qc_comments TEXT,
    license_period TEXT,
    parent_rating TEXT
);

CREATE TABLE IF NOT EXISTS media_systems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_id INTEGER NOT NULL,
    system_name TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    FOREIGN KEY(media_id) REFERENCES media(id)
);

CREATE TABLE IF NOT EXISTS media_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_id INTEGER NOT NULL,
    system_name TEXT NOT NULL,
    language TEXT NOT NULL,
    title TEXT,
    short_title TEXT,
    director TEXT,
    cast_members TEXT,
    release_year TEXT,
    genre TEXT,
    country_origin TEXT,
    people_score TEXT,
    critic_score TEXT,
    description TEXT,
    short_description TEXT,
    review TEXT,
    FOREIGN KEY(media_id) REFERENCES media(id)
);

CREATE TABLE IF NOT EXISTS media_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_id INTEGER NOT NULL,
    system_name TEXT NOT NULL,
    size_category TEXT NOT NULL,
    image_type TEXT NOT NULL, -- e.g., 'SYNOPSIS', 'POSTER'
    dimensions TEXT,
    color_depth TEXT,
    file_size TEXT,
    format TEXT,
    file_url TEXT,
    image_ext_id TEXT,
    FOREIGN KEY(media_id) REFERENCES media(id)
);

CREATE TABLE IF NOT EXISTS category_sets (
    id TEXT PRIMARY KEY,
    profile_id TEXT,
    name TEXT NOT NULL,
    applied_cycles TEXT, -- JSON array of strings
    locked BOOLEAN DEFAULT 0,
    created_on TEXT,
    created_by TEXT,
    FOREIGN KEY(profile_id) REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    program_number TEXT,
    disabled BOOLEAN DEFAULT 0,
    linked_profile_id TEXT,
    version TEXT,
    category_set_id TEXT,
    shipment_info TEXT, -- JSON string
    FOREIGN KEY(category_set_id) REFERENCES category_sets(id),
    FOREIGN KEY(linked_profile_id) REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS media_configs (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL,
    config_id TEXT NOT NULL,
    name TEXT NOT NULL,
    hidden BOOLEAN DEFAULT 0,
    FOREIGN KEY(profile_id) REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS profile_routes (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL,
    media_config_id TEXT NOT NULL,
    name TEXT NOT NULL,
    origin TEXT,
    dest TEXT,
    flight_num TEXT,
    FOREIGN KEY(profile_id) REFERENCES profiles(id),
    FOREIGN KEY(media_config_id) REFERENCES media_configs(id)
);

CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL,
    media_config_id TEXT NOT NULL,
    mma_display_name TEXT NOT NULL,
    exported_classes TEXT, -- JSON array
    FOREIGN KEY(profile_id) REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS sub_profiles (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL,
    name TEXT NOT NULL,
    config_data TEXT, -- JSON string
    FOREIGN KEY(profile_id) REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    category_set_id TEXT NOT NULL,
    parent_id TEXT,
    media_config_id TEXT DEFAULT 'all',
    class_id TEXT DEFAULT 'all',
    language_id TEXT DEFAULT 'all',
    default_name TEXT NOT NULL,
    cid INTEGER NOT NULL,
    cid_type TEXT DEFAULT 'movies',
    order_position INTEGER,
    media_type TEXT,
    purpose TEXT,
    status_sheet BOOLEAN DEFAULT 1,
    ppv BOOLEAN DEFAULT 0,
    hide_empty BOOLEAN DEFAULT 0,
    force_export BOOLEAN DEFAULT 0,
    disabled BOOLEAN DEFAULT 0,
    virtual BOOLEAN DEFAULT 0,
    enable_stream_index BOOLEAN DEFAULT 0,
    lock_type TEXT DEFAULT 'Unlocked',
    other_info TEXT,
    metadata TEXT,
    images TEXT, -- JSON array
    propagation_data TEXT, -- JSON array
    FOREIGN KEY(category_set_id) REFERENCES category_sets(id),
    FOREIGN KEY(parent_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS category_media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id TEXT NOT NULL,
    media_id INTEGER NOT NULL,
    price TEXT, 
    channel_num TEXT, 
    access_type TEXT, 
    order_position INTEGER, 
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY(media_id) REFERENCES media(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS language_lookups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    iso_code TEXT NOT NULL,
    label_lid INTEGER NOT NULL
);

