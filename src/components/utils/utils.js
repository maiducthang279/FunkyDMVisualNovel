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
