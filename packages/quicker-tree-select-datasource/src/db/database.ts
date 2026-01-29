import Database from 'better-sqlite3'
import path from 'path'

/** 数据库初始化 SQL */
const INIT_SQL = `
-- 数据项表
CREATE TABLE IF NOT EXISTS data_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  data_type TEXT NOT NULL CHECK(data_type IN ('array', 'object')),
  data_content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  color TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 数据项和标签的关联表
CREATE TABLE IF NOT EXISTS data_item_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data_item_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  FOREIGN KEY (data_item_id) REFERENCES data_items(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(data_item_id, tag_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_data_item_tags_data_item ON data_item_tags(data_item_id);
CREATE INDEX IF NOT EXISTS idx_data_item_tags_tag ON data_item_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- 更新时间触发器
CREATE TRIGGER IF NOT EXISTS update_data_items_timestamp
AFTER UPDATE ON data_items
BEGIN
  UPDATE data_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
`

export class DatabaseManager {
  private db: Database.Database

  constructor(dbPath?: string) {
    const finalPath = dbPath || path.join(process.cwd(), 'data', 'quicker-tree-select.db')
    this.db = new Database(finalPath)
    this.db.pragma('foreign_keys = ON')
    this.initialize()
  }

  /** 初始化数据库 */
  private initialize() {
    this.db.exec(INIT_SQL)
  }

  /** 获取数据库实例 */
  getDatabase(): Database.Database {
    return this.db
  }

  /** 关闭数据库连接 */
  close() {
    this.db.close()
  }

  /** 开始事务 */
  transaction<T>(fn: () => T): T {
    return this.db.transaction(fn)()
  }
}
