import { Card, Description, Label, ListBox, toast } from "@heroui/react";

import type {
  ArrayDataSourceType,
  DataSourceType,
  ObjectDataSourceType,
} from "quicker-tree-select-core/types";

type TagMatchDataItemRenderProps = {
  /** 匹配数据项中data字段值 */
  value: DataSourceType["data"];
};

export const TagMatchDataItemRenderWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <Card
      variant="default"
      className="flex flex-col min-w-[180px] max-w-[800px]"
    >
      <Description>点击下方选项复制</Description>
      <div>{children}</div>
    </Card>
  );
};

export const TagMatchDataItemRender: React.FC<TagMatchDataItemRenderProps> = ({
  value,
}) => {
  /** 点击后触发事件 */
  const triggerClickFn = (item: string | [string, string]) => {
    let toStringValue = "";

    if (typeof item === "string") {
      toStringValue = item;
    } else if (Array.isArray(item)) {
      toStringValue = item.join("：");
    } else if (item !== null && typeof item === "object") {
      toStringValue = JSON.stringify(item);
    }
    navigator.clipboard
      .writeText(toStringValue)
      .then(() => {
        toast("已复制到剪贴板", {
          description: toStringValue,
          timeout: 3000,
        });
      })
      .catch((err) => {
        toast("复制失败", {
          description: String(err),
        });
      });
  };

  if (Array.isArray(value)) {
    const itemAssert = value as unknown as ArrayDataSourceType;
    if (!itemAssert.length) return null;

    return (
      <ListBox>
        {itemAssert.map((item, index) => (
          <ListBox.Item
            key={`${item}_${index}`}
            id={`${item}_${index}`}
            textValue={`${item}_${index}`}
          >
            <div className="flex flex-col" onClick={() => triggerClickFn(item)}>
              <Label>{`${item}_${index}`}</Label>
            </div>
          </ListBox.Item>
        ))}
      </ListBox>
    );
  }

  if (typeof value === "object") {
    const itemAssert = value as unknown as ObjectDataSourceType;
    const itemEntries = Object.entries(itemAssert);
    if (!itemEntries.length) return null;

    return (
      <ListBox>
        {itemEntries.map(([key, value]) => (
          <ListBox.Item key={key} id={key} textValue={value}>
            <div
              className="flex flex-col"
              onClick={() => triggerClickFn([key, value])}
            >
              <Label>{key}</Label>
              <Description>{value}</Description>
            </div>
          </ListBox.Item>
        ))}
      </ListBox>
    );
  }
};
