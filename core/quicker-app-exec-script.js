//.js 主函数 exec()
function exec() {
  // 获取数据源变量
  const dataSource = quickerGetVar("dataSource") ?? null;
  if (dataSource) {
    quickerSetVar("dataSource", JSON.parse(dataSource));
  } else {
    alert("未获取到数据源");
    return -1;
  }

  // 获取当前存在的数据状态
  const defaultStateDataJSON = quickerGetVar("stateData");
  const defaultStateData = defaultStateDataJSON
    ? JSON.parse(defaultStateDataJSON)
    : null;

  const { stateData, selectTag } = initDataWithState(
    JSON.parse(dataSource, defaultStateData)
  );

  //    ----- 更新操作行为
  // 设置当前此选择
  const selectTagState = quickerGetVar("selectTag");
  if (selectTagState) {
    selectTag(selectTagState);
  }

  //   -----

  // 为下一次弹窗记录可选数据
  quickerSetVar("restRelatedTags", stateData.result.restRelatedTags);
  // 为下一次弹窗记录匹配数据
  quickerSetVar(
    "selectedTagsMatchedData",
    stateData.result.selectedTagsMatchedData
  );
  // 为下一次弹窗记录总状态数据
  quickerSetVar("stateData", JSON.stringify(stateData));
  return 0; //返回0表示成功。返回其他数字表示失败。
}
