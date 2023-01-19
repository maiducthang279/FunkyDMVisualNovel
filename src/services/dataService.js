import { mockData } from './mockData';

export const loadMockData = () => {
  const data = new Map();
  mockData.forEach((item) => {
    data.set(item.id, item);
  });
  return data;
};
