import type { DataSourceType } from 'quicker-tree-select-core/types'
import type { DataAdapter, JSONAdapterInput, AdapterOptions } from '../types'

export class JSONAdapter implements DataAdapter<JSONAdapterInput, string> {
  constructor(private options?: AdapterOptions) {}

  async import(source: JSONAdapterInput): Promise<DataSourceType[]> {
    let data: any

    if (typeof source === 'string') {
      try {
        data = JSON.parse(source)
      } catch (error) {
        throw new Error(`Invalid JSON format: ${error}`)
      }
    } else {
      data = source
    }

    if (!Array.isArray(data)) {
      throw new Error('Data must be an array')
    }

    const validated = data.map((item, index) => {
      if (!item.tags || !Array.isArray(item.tags)) {
        throw new Error(`Item at index ${index} missing valid 'tags' array`)
      }
      if (!item.data) {
        throw new Error(`Item at index ${index} missing 'data' field`)
      }

      return {
        tags: item.tags,
        data: item.data,
      } as DataSourceType
    })

    if (this.options?.transform) {
      return validated.map(this.options.transform)
    }

    return validated
  }

  async export(data: DataSourceType[]): Promise<string> {
    return JSON.stringify(data, null, 2)
  }

  async importFromFile(filePath: string): Promise<DataSourceType[]> {
    const fs = await import('fs/promises')
    const content = await fs.readFile(filePath, 'utf-8')
    return this.import(content)
  }

  async exportToFile(data: DataSourceType[], filePath: string): Promise<void> {
    const fs = await import('fs/promises')
    const json = await this.export(data)
    await fs.writeFile(filePath, json, 'utf-8')
  }
}
