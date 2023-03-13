import { notification } from 'antd';

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
        characterId: '',
        characterName: '',
        isCustomName: false,
        extraProps: {},
      };
      break;
    case 'choice':
      newNode = {
        content: '',
        options: [],
        extraProps: {},
      };
      break;
    case 'event':
      newNode = {
        eventType: 'None',
        params: {},
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

export const EVENT_TYPES = [
  { value: 'None', label: 'None' },
  { value: 'Set Background', label: 'Set Background' },
  { value: 'Set Character', label: 'Set Character' },
  { value: 'Remove Character', label: 'Remove Character' },
  { value: 'Go to Next Scene', label: 'Go to Next Scene' },
  { value: 'End Game', label: 'End Game' },
];

export const openNotification = (data) => {
  notification.success({
    ...data,
  });
};
