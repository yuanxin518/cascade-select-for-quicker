import React, { useState } from 'react'
import { Button, Label, Surface, Chip, Toast } from '@heroui/react'
import { Pencil, TrashBin, Plus } from '@gravity-ui/icons'
import { DataItemEditor, type DataItemFormData } from './DataItemEditor'

export interface DataItemWithTags {
  id: number
  title: string
  dataType: 'array' | 'object'
  dataContent: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface DataManagerProps {
  dataItems: DataItemWithTags[]
  availableTags: string[]
  onCreateItem: (data: DataItemFormData) => Promise<void>
  onUpdateItem: (id: number, data: DataItemFormData) => Promise<void>
  onDeleteItem: (id: number) => Promise<void>
}

export const DataManager: React.FC<DataManagerProps> = ({
  dataItems,
  availableTags,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DataItemWithTags | null>(null)
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create')

  const handleCreate = () => {
    setEditingItem(null)
    setEditorMode('create')
    setIsEditorOpen(true)
  }

  const handleEdit = (item: DataItemWithTags) => {
    setEditingItem(item)
    setEditorMode('edit')
    setIsEditorOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个数据项吗？')) {
      try {
        await onDeleteItem(id)
        Toast.show({ content: '删除成功', type: 'success' })
      } catch (error) {
        Toast.show({ content: '删除失败', type: 'error' })
      }
    }
  }

  const handleSave = async (data: DataItemFormData) => {
    if (editorMode === 'create') {
      await onCreateItem(data)
    } else if (editingItem) {
      await onUpdateItem(editingItem.id, data)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN')
  }

  const formatDataPreview = (content: string, maxLength = 50) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <div className="space-y-4">
      {/* 头部 */}
      <div className="flex justify-between items-center">
        <Label className="text-xl font-bold">数据管理</Label>
        <Button variant="primary" onClick={handleCreate} startContent={<Plus />}>
          创建数据项
        </Button>
      </div>

      {/* 数据列表 */}
      <div className="space-y-3">
        {dataItems.length === 0 ? (
          <Surface className="p-6 text-center text-gray-500">暂无数据项</Surface>
        ) : (
          dataItems.map(item => (
            <Surface key={item.id} className="p-4 space-y-2">
              {/* 标题和操作按钮 */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Label className="text-lg font-semibold">{item.title}</Label>
                  <div className="text-sm text-gray-500 mt-1">
                    类型: {item.dataType === 'array' ? '数组' : '对象'} | 更新时间: {formatDate(item.updatedAt)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(item)} startContent={<Pencil />}>
                    编辑
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="danger"
                    onClick={() => handleDelete(item.id)}
                    startContent={<TrashBin />}
                  >
                    删除
                  </Button>
                </div>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <Chip key={tag} size="sm" variant="secondary">
                    {tag}
                  </Chip>
                ))}
              </div>

              {/* 数据预览 */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <code className="text-sm text-gray-700">{formatDataPreview(item.dataContent, 100)}</code>
              </div>
            </Surface>
          ))
        )}
      </div>

      {/* 编辑器弹窗 */}
      <DataItemEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        initialData={
          editingItem
            ? {
                id: editingItem.id,
                title: editingItem.title,
                dataType: editingItem.dataType,
                dataContent: editingItem.dataContent,
                tags: editingItem.tags,
              }
            : undefined
        }
        availableTags={availableTags}
        mode={editorMode}
      />
    </div>
  )
}
