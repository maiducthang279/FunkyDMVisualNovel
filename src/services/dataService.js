import { mockData, mockGames } from './mockData';

export const loadMockData = () => {
  const data = new Map();
  mockData.forEach((item) => {
    data.set(item.id, item);
  });
  return data;
};

export const convertNodeToData = (nodes) => {
  const data = new Map();
  nodes.forEach((item) => {
    data.set(item.id, item);
  });
  return data;
};

export const getGames = async () => {
  return await mockGames;
};
