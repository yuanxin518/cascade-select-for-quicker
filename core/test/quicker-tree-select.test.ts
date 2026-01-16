// describe("每一步tag选择正确性", () => {
//     const data = [
//         {
//             tags: ["密码相关", "项目"],
//             value: ["123456", "456789"],
//         },
//         {
//             tags: ["密码相关", "个人"],
//             value: ["123456", "456789"],
//         },
//     ];

import { initDataWithState } from "../quicker-tree-select";

//     test("初始可选tags", () => {
//         // 第一步选择项应该是所有tags,去重
//         const { getCurrentData } = initData(data);
//         const currentData = getCurrentData();

//         expect(currentData).toEqual({
//             restRelatedTags: ["密码相关", "项目", "个人"],
//             currentTagsData: [],
//         });
//     });

//     test('选择一个tag后,下一步关联的tag。 回到上一步', () => {
//         // 第一步选择项应该是所有tags,去重
//         const { handleSelectTag, getCurrentData, backToPreviousStep } = initData(data);

//         handleSelectTag("密码相关");
//         expect(getCurrentData()).toEqual({
//             restRelatedTags: ["项目", "个人"],
//             currentTagsData: [],
//         });

//         handleSelectTag('项目');
//         expect(getCurrentData()).toEqual({
//             restRelatedTags: [],
//             currentTagsData: [{
//                 tags: ["密码相关", "项目"],
//                 value: ["123456", "456789"],
//             }],
//         });

//         backToPreviousStep();
//         expect(getCurrentData()).toEqual({
//             restRelatedTags: ["项目", "个人"],
//             currentTagsData: [],
//         });
//     })

// });

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
      selectedTags: ["密码相关"],
    },
  };

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
      state: {
        dataSource: data,
        selectedTags: ["密码相关", "项目"],
      },
      result: {
        restRelatedTags: [],
        selectedTagsMatchedData: [
          {
            tags: ["密码相关", "项目"],
            value: ["123456", "456789"],
          },
        ],
      },
    });
  });
});
