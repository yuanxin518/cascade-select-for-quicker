import { z } from 'zod'

/** 数据类型枚举 */
export enum DataType {
  ARRAY = 'array',
  OBJECT = 'object',
}

/** 数据项 Schema */
export const DataItemSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  dataType: z.nativeEnum(DataType),
  dataContent: z.string(), // JSON string
  createdAt: z.string(),
  updatedAt: z.string(),
})

/** 标签 Schema */
export const TagSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  color: z.string().nullable().optional(),
  createdAt: z.string(),
})

/** 创建数据项 DTO */
export const CreateDataItemSchema = z.object({
  title: z.string().min(1),
  dataType: z.nativeEnum(DataType),
  dataContent: z.union([z.array(z.string()), z.record(z.string())]),
  tagIds: z.array(z.number().int().positive()).optional(),
})

/** 更新数据项 DTO */
export const UpdateDataItemSchema = z.object({
  title: z.string().min(1).optional(),
  dataType: z.nativeEnum(DataType).optional(),
  dataContent: z.union([z.array(z.string()), z.record(z.string())]).optional(),
})

/** 创建标签 DTO */
export const CreateTagSchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
})

/** 更新标签 DTO */
export const UpdateTagSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().optional(),
})

/** 数据项过滤器 */
export const DataItemFiltersSchema = z.object({
  tagIds: z.array(z.number().int().positive()).optional(),
  title: z.string().optional(),
})

/** 类型导出 */
export type DataItem = z.infer<typeof DataItemSchema>
export type Tag = z.infer<typeof TagSchema>
export type CreateDataItemDTO = z.infer<typeof CreateDataItemSchema>
export type UpdateDataItemDTO = z.infer<typeof UpdateDataItemSchema>
export type CreateTagDTO = z.infer<typeof CreateTagSchema>
export type UpdateTagDTO = z.infer<typeof UpdateTagSchema>
export type DataItemFilters = z.infer<typeof DataItemFiltersSchema>

/** 带标签的数据项 */
export interface DataItemWithTags extends DataItem {
  tags: Tag[]
}
