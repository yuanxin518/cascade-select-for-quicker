import React, { useState, useEffect } from 'react'
import { Button, Input, Label, Modal, Select, Toast, Chip, ListBox } from '@heroui/react'
import { Gear, Check, Xmark } from '@gravity-ui/icons'
import type { DataSourceConfig } from '../../types/datasource-config'
import { DataSourceTypeEnum, loadDataSourceConfig, saveDataSourceConfig, getDefaultDataSourceConfig } from '../../types/datasource-config'
import { DataSourceFactory } from '../../services/datasource-factory'

interface DataSourceConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onConfigChange: (config: DataSourceConfig) => void
  currentConfig: DataSourceConfig
}

export const DataSourceConfigModal: React.FC<DataSourceConfigModalProps> = ({ isOpen, onClose, onConfigChange, currentConfig }) => {
  const [dataSourceType, setDataSourceType] = useState<DataSourceTypeEnum>(currentConfig.type)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)

  // JSON File 配置
  const [jsonFilePath, setJsonFilePath] = useState(currentConfig.type === DataSourceTypeEnum.JSON_FILE ? currentConfig.filePath : '/data/data.json')

  // JSON URL 配置
  const [jsonUrl, setJsonUrl] = useState(currentConfig.type === DataSourceTypeEnum.JSON_URL ? currentConfig.url : '')
  const [jsonHeaders, setJsonHeaders] = useState(currentConfig.type === DataSourceTypeEnum.JSON_URL ? JSON.stringify(currentConfig.headers || {}, null, 2) : '{}')

  // SQLite API 配置
  const [sqliteApiUrl, setSqliteApiUrl] = useState(currentConfig.type === DataSourceTypeEnum.SQLITE_API ? currentConfig.apiUrl : 'http://localhost')
  const [sqlitePort, setSqlitePort] = useState(currentConfig.type === DataSourceTypeEnum.SQLITE_API ? currentConfig.port?.toString() || '3000' : '3000')
  const [sqliteDatabase, setSqliteDatabase] = useState(currentConfig.type === DataSourceTypeEnum.SQLITE_API ? currentConfig.database || '' : '')
  const [sqliteHeaders, setSqliteHeaders] = useState(currentConfig.type === DataSourceTypeEnum.SQLITE_API ? JSON.stringify(currentConfig.headers || {}, null, 2) : '{}')

  const buildConfig = (): DataSourceConfig | null => {
    try {
      switch (dataSourceType) {
        case DataSourceTypeEnum.JSON_FILE:
          return {
            type: DataSourceTypeEnum.JSON_FILE,
            filePath: jsonFilePath,
          }

        case DataSourceTypeEnum.JSON_URL:
          return {
            type: DataSourceTypeEnum.JSON_URL,
            url: jsonUrl,
            headers: JSON.parse(jsonHeaders),
          }

        case DataSourceTypeEnum.SQLITE_API:
          return {
            type: DataSourceTypeEnum.SQLITE_API,
            apiUrl: sqliteApiUrl,
            port: sqlitePort ? parseInt(sqlitePort) : undefined,
            database: sqliteDatabase || undefined,
            headers: JSON.parse(sqliteHeaders),
          }

        default:
          return null
      }
    } catch (error) {
      Toast.show({ content: '配置格式错误', type: 'error' })
      return null
    }
  }

  const handleTest = async () => {
    const config = buildConfig()
    if (!config) return

    setIsTesting(true)
    setTestResult(null)

    try {
      const dataSource = DataSourceFactory.create(config)
      const success = await dataSource.testConnection()

      if (success) {
        setTestResult('success')
        Toast.show({ content: '连接测试成功', type: 'success' })
      } else {
        setTestResult('error')
        Toast.show({ content: '连接测试失败', type: 'error' })
      }
    } catch (error) {
      setTestResult('error')
      Toast.show({ content: `测试失败: ${error}`, type: 'error' })
    } finally {
      setIsTesting(false)
    }
  }

  const handleSave = () => {
    const config = buildConfig()
    if (!config) return

    saveDataSourceConfig(config)
    onConfigChange(config)
    Toast.show({ content: '配置已保存', type: 'success' })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <Label className="text-xl font-bold flex items-center gap-2">
          <Gear width={24} />
          数据源配置
        </Label>
      </Modal.Header>

      <Modal.Body className="space-y-4 max-h-[70vh] overflow-y-auto">
        {/* 数据源类型选择 */}
        <div>
          <Label>数据源类型</Label>
          <Select value={[dataSourceType]} onChange={(keys: React.Key[]) => setDataSourceType(keys[0] as DataSourceTypeEnum)} selectionMode="single" className="w-full">
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item key={DataSourceTypeEnum.JSON_FILE} id={DataSourceTypeEnum.JSON_FILE} textValue="JSON 文件（本地）">
                  JSON 文件（本地）
                </ListBox.Item>
                <ListBox.Item key={DataSourceTypeEnum.JSON_URL} id={DataSourceTypeEnum.JSON_URL} textValue="JSON URL（远程）">
                  JSON URL（远程）
                </ListBox.Item>
                <ListBox.Item key={DataSourceTypeEnum.SQLITE_API} id={DataSourceTypeEnum.SQLITE_API} textValue="SQLite API 服务">
                  SQLite API 服务
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* JSON File 配置 */}
        {dataSourceType === DataSourceTypeEnum.JSON_FILE && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <Label className="font-semibold">JSON 文件配置</Label>
            <div>
              <Label>文件路径（相对于 public 目录）</Label>
              <Input value={jsonFilePath} onChange={e => setJsonFilePath(e.target.value)} placeholder="/data/data.json" fullWidth />
              <div className="text-sm text-gray-500 mt-1">示例: /data/data.json</div>
            </div>
          </div>
        )}

        {/* JSON URL 配置 */}
        {dataSourceType === DataSourceTypeEnum.JSON_URL && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <Label className="font-semibold">JSON URL 配置</Label>
            <div>
              <Label>URL 地址</Label>
              <Input value={jsonUrl} onChange={e => setJsonUrl(e.target.value)} placeholder="https://example.com/data.json" fullWidth />
            </div>
            <div>
              <Label>自定义请求头（JSON 格式）</Label>
              <textarea
                value={jsonHeaders}
                onChange={e => setJsonHeaders(e.target.value)}
                placeholder='{"Authorization": "Bearer token"}'
                className="w-full min-h-[80px] p-2 border rounded-lg font-mono text-sm"
              />
            </div>
          </div>
        )}

        {/* SQLite API 配置 */}
        {dataSourceType === DataSourceTypeEnum.SQLITE_API && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <Label className="font-semibold">SQLite API 配置</Label>
            <div>
              <Label>API 地址</Label>
              <Input value={sqliteApiUrl} onChange={e => setSqliteApiUrl(e.target.value)} placeholder="http://localhost" fullWidth />
            </div>
            <div>
              <Label>端口</Label>
              <Input type="number" value={sqlitePort} onChange={e => setSqlitePort(e.target.value)} placeholder="3000" fullWidth />
            </div>
            <div>
              <Label>数据库名称（可选）</Label>
              <Input value={sqliteDatabase} onChange={e => setSqliteDatabase(e.target.value)} placeholder="my-database" fullWidth />
            </div>
            <div>
              <Label>自定义请求头（JSON 格式）</Label>
              <textarea
                value={sqliteHeaders}
                onChange={e => setSqliteHeaders(e.target.value)}
                placeholder='{"Authorization": "Bearer token"}'
                className="w-full min-h-[80px] p-2 border rounded-lg font-mono text-sm"
              />
            </div>
          </div>
        )}

        {/* 测试结果 */}
        {testResult && (
          <div className="flex items-center gap-2">
            {testResult === 'success' ? (
              <Chip variant="primary" color="success">
                <Check width={16} /> 连接成功
              </Chip>
            ) : (
              <Chip variant="primary" color="danger">
                <Xmark width={16} /> 连接失败
              </Chip>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="ghost" onClick={onClose}>
          取消
        </Button>
        <Button variant="secondary" onClick={handleTest} disabled={isTesting}>
          {isTesting ? '测试中...' : '测试连接'}
        </Button>
        <Button variant="primary" onClick={handleSave}>
          保存配置
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
