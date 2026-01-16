# 携带状态的级联选择

## 初始化数据

```json
[
  {
    "tags": ["密码相关", "项目"],
    "value": ["123456", "456789"]
  },
  {
    "tags": ["密码相关", "个人"],
    "value": ["123456", "456789"]
  }
]
```

## 数据结构

```typescript
type DataSourceType = {
  tags: string[];
  value: string[];
};

type DataWithState = {
  state: {
    dataSource: DataSourceType[];
    /** 每次选中tag后，就加入进来 */
    selectedTags: string[];
  };
  /** 计算结果 */
  result: {
    /** dataSource中数据，过滤出selectedTags的数据后，剩下的tags */
    restRelatedTags: string[];
    /** 选中的tags绝对匹配的数据 */
    selectedTagsMatchedData: DataSourceTypes[];
  };
};
```
