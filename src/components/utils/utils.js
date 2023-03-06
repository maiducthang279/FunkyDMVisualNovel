import _ from 'lodash';

export const calculateDialogTime = (content, textSpeed) => {
  return content.split(' ').length * calculateDialogInterval(textSpeed) * 1000;
};

export const calculateDialogInterval = (textSpeed) => 0.15 - textSpeed / 1000;

export const downloadObjectAsJson = (exportObj, exportName) => {
  var dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const getListImage = async (nodes, prevImages, res) => {
  const listImage = nodes
    .map((node) => {
      if (node.type === 'event') {
        switch (node.eventType) {
          case 'Set Character':
            return node.params.characterImage;
          case 'Set Background':
            return node.params.backgroundUrl;
          default:
            return null;
        }
      }
      return null;
    })
    .filter((url) => !!url);
  const result = _.xor(listImage, prevImages);
  const images = await Promise.all(result.map((r) => loadImage(r)));
  return [res, result, images];
};

export const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
