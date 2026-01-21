import "./App.css";
import {
  Chip,
  CloseButton,
  Label,
  Separator,
  Surface,
  Toast,
} from "@heroui/react";

import { useQuickerTreeSelectData } from "./hooks/use-quicker-tree-select-data";
import { DataWithStateContext } from "./context/dataWithStateContext";
import { RestTagSelect } from "./components/RestTagSelect";
import React from "react";
import { TagMatchedDataView } from "./components/TagMatchDataView";

function App() {
  const quickerTreeSelectData = useQuickerTreeSelectData();
  const { selectedTags, handleRemoveTag, selectedTagsMatchedData } =
    quickerTreeSelectData;

  return (
    <DataWithStateContext.Provider value={quickerTreeSelectData}>
      <Toast.Container />
      <Surface
        className="flex max-w-[1000px] gap-3 p-6 flex-col border rounded-3xl border-[#eee]"
        variant="default"
      >
        <Label className="text-[var(--color-primary)]">选择标签</Label>
        <RestTagSelect />
        {selectedTags.length === 0 ? null : (
          <React.Fragment>
            <Separator className="my-3" />
            <Label className="text-[var(--color-primary)]">当前已选标签</Label>
            <div className="flex gap-3 justify-center">
              {selectedTags.map((tag) => (
                <Chip key={tag}>
                  {tag}
                  <CloseButton onClick={() => handleRemoveTag(tag)} />
                </Chip>
              ))}
            </div>
            <Separator className="my-3" />
            <Label className="text-[var(--color-primary)]">匹配数据</Label>
            <TagMatchedDataView dataList={selectedTagsMatchedData} />
          </React.Fragment>
        )}
      </Surface>
    </DataWithStateContext.Provider>
  );
}

export default App;
