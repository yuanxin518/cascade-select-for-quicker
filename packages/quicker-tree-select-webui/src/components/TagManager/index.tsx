import React, { useState } from 'react'
import { Button, Input, Label, Surface, Chip, Toast } from '@heroui/react'
import { Pencil, TrashBin, Plus, Check, Xmark } from '@gravity-ui/icons'

export interface Tag {
  id: number
  name: string
  color?: string | null
  createdAt: string
}

interface TagManagerProps {
  tags: Tag[]
  onCreateTag: (name: string, color?: string) => Promise<void>
  onUpdateTag: (id: number, name: string, color?: string) => Promise<void>
  onDeleteTag: (id: number) => Promise<void>
}

export const TagManager: React.FC<TagManagerProps> = ({ tags, onCreateTag, onUpdateTag, onDeleteTag }) => {
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#3B82F6')
  const [editTagName, setEditTagName] = useState('')
  const [editTagColor, setEditTagColor] = useState('')

  const handleStartCreate = () => {
    setIsCreating(true)
    setNewTagName('')
    setNewTagColor('#3B82F6')
  }

  const handleCancelCreate = () => {
    setIsCreating(false)
    setNewTagName('')
  }

  const handleCreate = async () => {
    if (!newTagName.trim()) {
      Toast.show({ content: '请输入标签名称', type: 'warning' })
      return
    }

    try {
      await onCreateTag(newTagName.trim(), newTagColor)
      Toast.show({ content: '创建成功', type: 'success' })
      setIsCreating(false)
      setNewTagName('')
    } catch (error) {
      Toast.show({ content: '创建失败', type: 'error' })
    }
  }

  const handleStartEdit = (tag: Tag) => {
    setEditingId(tag.id)
    setEditTagName(tag.name)
    setEditTagColor(tag.color || '#3B82F6')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTagName('')
  }

  const handleUpdate = async (id: number) => {
    if (!editTagName.trim()) {
      Toast.show({ content: '请输入标签名称', type: 'warning' })
      return
    }

    try {
      await onUpdateTag(id, editTagName.trim(), editTagColor)
      Toast.show({ content: '更新成功', type: 'success' })
      setEditingId(null)
    } catch (error) {
      Toast.show({ content: '更新失败', type: 'error' })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个标签吗？删除后相关数据项的关联也会被移除。')) {
      try {
        await onDeleteTag(id)
        Toast.show({ content: '删除成功', type: 'success' })
      } catch (error) {
        Toast.show({ content: '删除失败', type: 'error' })
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* 头部 */}
      <div className="flex justify-between items-center">
        <Label className="text-xl font-bold">标签管理</Label>
        {!isCreating && (
          <Button variant="primary" onClick={handleStartCreate} startContent={<Plus />}>
            创建标签
          </Button>
        )}
      </div>

      {/* 创建表单 */}
      {isCreating && (
        <Surface className="p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Label>标签名称</Label>
              <Input
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                placeholder="输入标签名称"
                fullWidth
              />
            </div>
            <div className="w-32">
              <Label>颜色</Label>
              <input
                type="color"
                value={newTagColor}
                onChange={e => setNewTagColor(e.target.value)}
                className="w-full h-10 rounded-lg border cursor-pointer"
              />
            </div>
            <Button variant="primary" onClick={handleCreate} startContent={<Check />}>
              保存
            </Button>
            <Button variant="ghost" onClick={handleCancelCreate} startContent={<Xmark />}>
              取消
            </Button>
          </div>
        </Surface>
      )}

      {/* 标签列表 */}
      <div className="space-y-2">
        {tags.length === 0 ? (
          <Surface className="p-6 text-center text-gray-500">暂无标签</Surface>
        ) : (
          tags.map(tag => (
            <Surface key={tag.id} className="p-3">
              {editingId === tag.id ? (
                // 编辑模式
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <Input
                      value={editTagName}
                      onChange={e => setEditTagName(e.target.value)}
                      placeholder="标签名称"
                      fullWidth
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="color"
                      value={editTagColor}
                      onChange={e => setEditTagColor(e.target.value)}
                      className="w-full h-10 rounded-lg border cursor-pointer"
                    />
                  </div>
                  <Button size="sm" variant="primary" onClick={() => handleUpdate(tag.id)} startContent={<Check />}>
                    保存
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit} startContent={<Xmark />}>
                    取消
                  </Button>
                </div>
              ) : (
                // 显示模式
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full border-2"
                      style={{ backgroundColor: tag.color || '#3B82F6' }}
                    />
                    <Chip variant="primary" style={{ backgroundColor: tag.color || undefined }}>
                      {tag.name}
                    </Chip>
                    <span className="text-sm text-gray-500">ID: {tag.id}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleStartEdit(tag)} startContent={<Pencil />}>
                      编辑
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      color="danger"
                      onClick={() => handleDelete(tag.id)}
                      startContent={<TrashBin />}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              )}
            </Surface>
          ))
        )}
      </div>
    </div>
  )
}
