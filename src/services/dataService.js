export const convertNodeToData = (nodes) => {
  const data = new Map();
  nodes.forEach((item) => {
    data.set(item.id, item);
  });
  return data;
};
