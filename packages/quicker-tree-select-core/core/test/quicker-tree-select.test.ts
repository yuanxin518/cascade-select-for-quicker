import { initDataWithState } from "../quicker-tree-select";

describe("携带状态的数据验证", () => {
  const data = [
    {
      tags: ["密码相关", "项目"],
      value: ["123456", "456789"],
    },
    {
      tags: ["密码相关", "个人"],
      value: ["123456", "456789"],
    },
  ];

  /** 选择过一个密码相关tag之后的数据 */
  const dataWithSelectOneTag = {
    result: {
      restRelatedTags: ["项目", "个人"],
      selectedTagsMatchedData: [
        {
          tags: ["密码相关", "项目"],
          value: ["123456", "456789"],
        },
        {
          tags: ["密码相关", "个人"],
          value: ["123456", "456789"],
        },
      ],
    },
    state: {
      selectedTags: ["密码相关"],
    },
    dataSource: [
      {
        tags: ["密码相关", "项目"],
        value: ["123456", "456789"],
      },
      {
        tags: ["密码相关", "个人"],
        value: ["123456", "456789"],
      },
    ],
  };

  test("初始值", () => {
    const { stateData } = initDataWithState(data);
    expect(stateData).toMatchSnapshot();
  });

  test("选择一个tag", () => {
    const { selectTag } = initDataWithState(data);
    const target = selectTag("密码相关");
    expect(target).toMatchSnapshot();
    expect(target).toEqual(dataWithSelectOneTag);
  });

  test("对选择一个tag后的数据进行初始化", () => {
    const { selectTag } = initDataWithState(data, dataWithSelectOneTag);
    const target = selectTag("项目");
    expect(target).toMatchSnapshot();
    expect(target).toEqual({
      result: {
        restRelatedTags: [],
        selectedTagsMatchedData: [
          {
            tags: ["密码相关", "项目"],
            value: ["123456", "456789"],
          },
        ],
      },
      state: {
        selectedTags: ["密码相关", "项目"],
      },
      dataSource: [
        {
          tags: ["密码相关", "项目"],
          value: ["123456", "456789"],
        },
        {
          tags: ["密码相关", "个人"],
          value: ["123456", "456789"],
        },
      ],
    });
  });

  test("连续选择", () => {
    const { selectTag } = initDataWithState(data);
    const target = selectTag("密码相关");
    expect(target).toMatchSnapshot();
    const target2 = selectTag("项目");
    expect(target2).toMatchSnapshot();
  });
});
