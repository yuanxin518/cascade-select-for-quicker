import type { DataSourceType } from 'quicker-tree-select-core/types'

/** 数据源类型 */
export enum DataSourceTypeEnum {
  JSON_FILE = 'json_file', // 本地 JSON 文件
  JSON_URL = 'json_url', // 远程 JSON URL
  SQLITE_API = 'sqlite_api', // SQLite API 服务
  SQLITE_WASM = 'sqlite_wasm', // SQLite WASM (浏览器端)
}

/** JSON 文件数据源配置 */
export interface JSONFileConfig {
  type: DataSourceTypeEnum.JSON_FILE
  filePath: string // 文件路径（相对于 public 目录）
}

/** JSON URL 数据源配置 */
export interface JSONURLConfig {
  type: DataSourceTypeEnum.JSON_URL
  url: string // 远程 URL
  headers?: Record<string, string> // 自定义请求头
}

/** SQLite API 数据源配置 */
export interface SQLiteAPIConfig {
  type: DataSourceTypeEnum.SQLITE_API
  apiUrl: string // API 服务地址
  port?: number // 端口
  database?: string // 数据库名称
  headers?: Record<string, string> // 自定义请求头
}

/** SQLite WASM 数据源配置 */
export interface SQLiteWASMConfig {
  type: DataSourceTypeEnum.SQLITE_WASM
  dbFile: File | string // 数据库文件
}

/** 数据源配置联合类型 */
export type DataSourceConfig = JSONFileConfig | JSONURLConfig | SQLiteAPIConfig | SQLiteWASMConfig

/** 数据源接口 */
export interface IDataSource {
  /** 获取数据 */
  fetchData(): Promise<DataSourceType[]>

  /** 测试连接 */
  testConnection(): Promise<boolean>

  /** 获取配置 */
  getConfig(): DataSourceConfig
}

/** 数据源配置存储键 */
export const DATA_SOURCE_CONFIG_KEY = 'quicker-tree-select-datasource-config'

/** 保存数据源配置到 localStorage */
export function saveDataSourceConfig(config: DataSourceConfig): void {
  localStorage.setItem(DATA_SOURCE_CONFIG_KEY, JSON.stringify(config))
}

/** 从 localStorage 加载数据源配置 */
export function loadDataSourceConfig(): DataSourceConfig | null {
  const stored = localStorage.getItem(DATA_SOURCE_CONFIG_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored) as DataSourceConfig
  } catch {
    return null
  }
}

/** 获取默认数据源配置 */
export function getDefaultDataSourceConfig(): SQLiteAPIConfig {
  return {
    type: DataSourceTypeEnum.SQLITE_API,
    apiUrl: 'http://localhost',
    port: 3000,
    headers: {},
  }
}
