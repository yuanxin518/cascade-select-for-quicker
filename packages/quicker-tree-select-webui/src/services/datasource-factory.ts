import type { DataSourceType } from 'quicker-tree-select-core/types'
import type { IDataSource, DataSourceConfig, JSONFileConfig, JSONURLConfig, SQLiteAPIConfig } from '../types/datasource-config'
import { DataSourceTypeEnum } from '../types/datasource-config'

/** JSON 文件数据源 */
export class JSONFileDataSource implements IDataSource {
  constructor(private config: JSONFileConfig) {}

  async fetchData(): Promise<DataSourceType[]> {
    const response = await fetch(this.config.filePath)
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON file: ${response.status} ${response.statusText}`)
    }
    return response.json()
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.config.filePath, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  getConfig(): DataSourceConfig {
    return this.config
  }
}

/** JSON URL 数据源 */
export class JSONURLDataSource implements IDataSource {
  constructor(private config: JSONURLConfig) {}

  async fetchData(): Promise<DataSourceType[]> {
    const response = await fetch(this.config.url, {
      headers: this.config.headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch JSON from URL: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.config.url, {
        method: 'HEAD',
        headers: this.config.headers,
      })
      return response.ok
    } catch {
      return false
    }
  }

  getConfig(): DataSourceConfig {
    return this.config
  }
}

/** SQLite API 数据源 */
export class SQLiteAPIDataSource implements IDataSource {
  constructor(private config: SQLiteAPIConfig) {}

  private getBaseUrl(): string {
    const { apiUrl, port } = this.config
    if (port) {
      // 如果指定了端口，构建完整 URL
      const url = new URL(apiUrl)
      url.port = port.toString()
      // 移除末尾的斜杠
      return url.toString().replace(/\/$/, '')
    }
    // 移除末尾的斜杠
    return apiUrl.replace(/\/$/, '')
  }

  async fetchData(): Promise<DataSourceType[]> {
    const baseUrl = this.getBaseUrl()
    const url = `${baseUrl}/api/data-items/export`

    console.log('[SQLiteAPIDataSource] Fetching from:', url)
    console.log('[SQLiteAPIDataSource] Config:', this.config)

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
    })

    console.log('[SQLiteAPIDataSource] Response status:', response.status)

    if (!response.ok) {
      throw new Error(`Failed to fetch data from SQLite API: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    // 转换 SQLite API 格式到标准格式
    return this.convertFromAPIFormat(result)
  }

  async testConnection(): Promise<boolean> {
    try {
      const baseUrl = this.getBaseUrl()
      const url = `${baseUrl}/api/health`

      const response = await fetch(url, {
        headers: this.config.headers,
      })

      return response.ok
    } catch {
      return false
    }
  }

  getConfig(): DataSourceConfig {
    return this.config
  }

  /** 将 API 格式转换为标准格式 */
  private convertFromAPIFormat(apiData: any[]): DataSourceType[] {
    return apiData.map(item => ({
      tags: item.tags.map((tag: any) => tag.name),
      data: JSON.parse(item.dataContent),
    }))
  }
}

/** 数据源工厂 */
export class DataSourceFactory {
  static create(config: DataSourceConfig): IDataSource {
    switch (config.type) {
      case DataSourceTypeEnum.JSON_FILE:
        return new JSONFileDataSource(config)

      case DataSourceTypeEnum.JSON_URL:
        return new JSONURLDataSource(config)

      case DataSourceTypeEnum.SQLITE_API:
        return new SQLiteAPIDataSource(config)

      case DataSourceTypeEnum.SQLITE_WASM:
        throw new Error('SQLite WASM data source is not yet implemented')

      default:
        throw new Error(`Unknown data source type: ${(config as any).type}`)
    }
  }
}
