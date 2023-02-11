export const createNodeSize = (fontSize, hasContent) => {
  const padding = fontSize;
  const width = fontSize * 12;
  const contentHeight = fontSize * 5 + padding * 3.5;
  const noContentHeight = fontSize * 1 + padding * 3;
  const height = hasContent ? contentHeight : noContentHeight;
  const optionHeight = fontSize + padding * 1.5;
  return {
    fontSize,
    padding,
    width,
    height,
    contentHeight,
    noContentHeight,
    optionHeight,
  };
};

export const NodeDefaultSize = createNodeSize(14, true);

export const makeNewNode = (type, data) => {
  let newNode;
  switch (type) {
    case 'dialog':
      newNode = {
        content: '',
        nextId: '',
      };
      break;
    case 'choice':
      newNode = {
        content: '',
        options: [],
      };
      break;
    case 'event':
      newNode = {
        nextId: '',
      };
      break;
    default:
      newNode = {};
      break;
  }

  return {
    type,
    name: `New ${type}`,
    ...newNode,
    ...data,
  };
};
