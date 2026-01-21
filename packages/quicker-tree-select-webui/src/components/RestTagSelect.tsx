import { Select, ListBox, Description } from "@heroui/react";
import { DataWithStateContext } from "../context/dataWithStateContext";
import { useContext } from "react";

export const RestTagSelect = () => {
  const context = useContext(DataWithStateContext);

  if (!context) return null;

  const { handleSelectTags, restRelatedTags, selectedTags, dataWithState } =
    context;

  /** 选择项数据源列表 */
  const selectOptions = Array.from(
    new Set(dataWithState.dataSource.flatMap((data) => data.tags)),
  );

  /** 禁用的tag列表 */
  const disabledTags = selectOptions.filter(
    (item) => !restRelatedTags.includes(item),
  );

  return (
    <Select
      className="w-[256px]"
      placeholder="请选择"
      onChange={(keys: React.Key[]) => handleSelectTags(keys as string[])}
      selectionMode="multiple"
      value={selectedTags}
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {selectOptions.map((tag) => (
            <ListBox.Item
              key={tag}
              id={tag}
              textValue={tag}
              isDisabled={disabledTags.includes(tag)}
            >
              {tag}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
      <Description>
        {restRelatedTags.length === 0 ? (
          <span className="text-[var(--color-warning)]">已无可选标签</span>
        ) : (
          "选择当前可选标签"
        )}
      </Description>
    </Select>
  );
};
