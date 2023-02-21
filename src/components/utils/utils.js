export const calculateDialogTime = (content, textSpeed) => {
  return content.split(' ').length * calculateDialogInterval(textSpeed) * 1000;
};

export const calculateDialogInterval = (textSpeed) => 0.15 - textSpeed / 1000;
