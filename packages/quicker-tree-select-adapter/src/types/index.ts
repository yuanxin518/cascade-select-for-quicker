import type { DataSourceType } from 'quicker-tree-select-core/types'
import type { DataItemWithTags } from 'quicker-tree-select-datasource'

export interface DataAdapter<TInput = any, TOutput = any> {
  import(source: TInput): Promise<DataSourceType[]>
  export(data: DataSourceType[]): Promise<TOutput>
}

export interface AdapterOptions {
  validate?: boolean
  transform?: (data: any) => any
}

export type JSONAdapterInput = string | DataSourceType[]

export interface SQLiteAdapterOutput {
  dataItems: DataItemWithTags[]
  totalCount: number
}
