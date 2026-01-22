import type { DataSourceType } from "quicker-tree-select-core/types";

const DEFAULT_DATA_URL = 'https://raw.githubusercontent.com/yuanxin518/cascade-select-for-quicker/main/packages/quicker-tree-select-core/data/data.json';

/**
 * 获取数据的简单函数
 * @param url 数据源 URL，默认为预设的 URL
 * @returns 返回包含 DataSourceType[] 的 Promise
 */
export const fetchDataSource = async (url: string = DEFAULT_DATA_URL): Promise<DataSourceType[]> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as DataSourceType[];
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
