PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS parents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  subscription_status TEXT NOT NULL DEFAULT 'inactive',
  subscription_plan TEXT,
  referred_by_agent_code TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS child_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  avatar TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  min_age INTEGER,
  max_age INTEGER,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  game_key TEXT NOT NULL,
  level_reached INTEGER NOT NULL DEFAULT 1,
  stars INTEGER NOT NULL DEFAULT 0,
  last_played TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(child_id, game_key),
  FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL DEFAULT '',
  bank_name TEXT NOT NULL DEFAULT '',
  bank_account TEXT NOT NULL DEFAULT '',
  commission_rate REAL NOT NULL DEFAULT 0.20,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_code TEXT NOT NULL,
  parent_id INTEGER NOT NULL,
  subscription_amount REAL NOT NULL DEFAULT 0,
  commission_amount REAL NOT NULL DEFAULT 0,
  payout_status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_child_profiles_parent ON child_profiles(parent_id);
CREATE INDEX IF NOT EXISTS idx_progress_child ON game_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_referrals_agent ON referrals(agent_code);
CREATE INDEX IF NOT EXISTS idx_referrals_parent ON referrals(parent_id);

INSERT OR IGNORE INTO games (game_key, title, description, min_age, max_age) VALUES
  ('huruf', 'Kenal Huruf', 'Belajar mengenal huruf dengan aktiviti interaktif.', 3, 7),
  ('nombor', 'Kenal Nombor', 'Belajar nombor dan kiraan asas.', 3, 7),
  ('warna', 'Kenal Warna', 'Kenal warna melalui permainan visual.', 3, 7);
