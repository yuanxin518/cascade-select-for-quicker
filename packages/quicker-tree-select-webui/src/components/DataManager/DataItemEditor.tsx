import React, { useState } from 'react'
import { Button, Input, Label, Modal, Select, Chip, Toast, ListBox } from '@heroui/react'
import { Xmark } from '@gravity-ui/icons'

export interface DataItemFormData {
  id?: number
  title: string
  dataType: 'array' | 'object'
  dataContent: string // JSON string
  tags: string[]
}

interface DataItemEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: DataItemFormData) => Promise<void>
  initialData?: DataItemFormData
  availableTags: string[]
  mode: 'create' | 'edit'
}

export const DataItemEditor: React.FC<DataItemEditorProps> = ({ isOpen, onClose, onSave, initialData, availableTags, mode }) => {
  const [formData, setFormData] = useState<DataItemFormData>(
    initialData || {
      title: '',
      dataType: 'array',
      dataContent: '[]',
      tags: [],
    },
  )
  const [selectedTag, setSelectedTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddTag = () => {
    if (selectedTag && !formData.tags.includes(selectedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, selectedTag],
      }))
      setSelectedTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }))
  }

  const validateJSON = (value: string): boolean => {
    try {
      const parsed = JSON.parse(value)
      if (formData.dataType === 'array' && !Array.isArray(parsed)) {
        setError('数据类型为数组，但内容不是有效的数组')
        return false
      }
      if (formData.dataType === 'object' && (Array.isArray(parsed) || typeof parsed !== 'object')) {
        setError('数据类型为对象，但内容不是有效的对象')
        return false
      }
      return true
    } catch {
      setError('无效的 JSON 格式')
      return false
    }
  }

  const handleSubmit = async () => {
    setError(null)

    // 验证
    if (!formData.title.trim()) {
      setError('请输入标题')
      return
    }

    if (!validateJSON(formData.dataContent)) {
      return
    }

    if (formData.tags.length === 0) {
      setError('请至少选择一个标签')
      return
    }

    setIsSubmitting(true)
    try {
      await onSave(formData)
      Toast.show({ content: `${mode === 'create' ? '创建' : '更新'}成功`, type: 'success' })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
      Toast.show({ content: '操作失败', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <Label className="text-xl font-bold">{mode === 'create' ? '创建数据项' : '编辑数据项'}</Label>
      </Modal.Header>
      <Modal.Body className="space-y-4">
        {/* 标题 */}
        <div>
          <Label>标题</Label>
          <Input value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="输入数据项标题" fullWidth />
        </div>

        {/* 数据类型 */}
        <div>
          <Label>数据类型</Label>
          <Select
            value={[formData.dataType]}
            onChange={(keys: React.Key[]) => setFormData(prev => ({ ...prev, dataType: keys[0] as 'array' | 'object' }))}
            selectionMode="single"
            className="w-full"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item key="array" id="array" textValue="数组 (Array)">
                  数组 (Array)
                </ListBox.Item>
                <ListBox.Item key="object" id="object" textValue="对象 (Object)">
                  对象 (Object)
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* 数据内容 */}
        <div>
          <Label>数据内容 (JSON)</Label>
          <textarea
            value={formData.dataContent}
            onChange={e => setFormData(prev => ({ ...prev, dataContent: e.target.value }))}
            placeholder={formData.dataType === 'array' ? '["item1", "item2"]' : '{"key": "value"}'}
            className="w-full min-h-[120px] p-2 border rounded-lg font-mono text-sm"
          />
        </div>

        {/* 标签选择 */}
        <div>
          <Label>标签</Label>
          <div className="flex gap-2 mb-2">
            <Select value={selectedTag ? [selectedTag] : []} onChange={(keys: React.Key[]) => setSelectedTag((keys[0] as string) || '')} selectionMode="single" className="w-full">
              <Select.Trigger>
                <Select.Value placeholder="选择标签" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {availableTags.map(tag => (
                    <ListBox.Item key={tag} id={tag} textValue={tag}>
                      {tag}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
            <Button onClick={handleAddTag} disabled={!selectedTag}>
              添加
            </Button>
          </div>

          {/* 已选标签 */}
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <Chip key={tag} variant="primary" color="accent">
                {tag}
                <Xmark className="cursor-pointer ml-1" onClick={() => handleRemoveTag(tag)} width={12} />
              </Chip>
            ))}
          </div>
        </div>

        {/* 错误提示 */}
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
          取消
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? '保存中...' : '保存'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
