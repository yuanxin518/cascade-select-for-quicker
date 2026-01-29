# 图标导入错误修复

## 问题

```
Uncaught SyntaxError: The requested module doesn't provide an export named: 'Settings'
```

## 原因

`@gravity-ui/icons` 包中没有 `Settings` 图标，正确的图标名称是 `Gear`。

## 修复

### 修改的文件

1. **src/App.tsx**
   ```typescript
   // 修改前
   import { Xmark, Settings, ArrowRotateRight } from '@gravity-ui/icons'
   
   // 修改后
   import { Xmark, Gear, ArrowRotateRight } from '@gravity-ui/icons'
   ```

2. **src/components/DataSourceConfig/index.tsx**
   ```typescript
   // 修改前
   import { Settings, Check, Xmark } from '@gravity-ui/icons'
   
   // 修改后
   import { Gear, Check, Xmark } from '@gravity-ui/icons'
   ```

### 使用位置

- App.tsx: 配置按钮图标
- DataSourceConfig/index.tsx: 弹窗标题图标

## 验证

✅ Vite 已自动热更新  
✅ 页面可以正常访问  
✅ 图标导入错误已解决

## 可用的设置相关图标

`@gravity-ui/icons` 包中可用的设置相关图标：

- `Gear` - 齿轮图标（标准设置图标）
- `GearDot` - 带点的齿轮
- `GearBranches` - 带分支的齿轮
- `GearPlay` - 带播放的齿轮
- `CloudGear` - 云端齿轮

## 状态

🎉 **问题已解决！**

现在可以正常访问应用：http://127.0.0.1:5173/

---

**修复时间**: 2026-01-29 16:56  
**影响范围**: 图标导入  
**修复方式**: 替换图标名称
