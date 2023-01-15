export const calculateAspectRatioFit = (
  srcWidth,
  srcHeight,
  maxWidth,
  maxHeight
) => {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return { width: srcWidth * ratio, height: srcHeight * ratio };
};
export const calculateAspectRatioFitByHeight = (
  srcWidth,
  srcHeight,
  maxHeight
) => {
  const ratio = maxHeight / srcHeight;

  return { width: srcWidth * ratio, height: srcHeight * ratio };
};

export const calculateAspectRatioCover = (
  srcWidth,
  srcHeight,
  maxWidth,
  maxHeight
) => {
  const ratio = Math.max(maxWidth / srcWidth, maxHeight / srcHeight);

  return { width: srcWidth * ratio, height: srcHeight * ratio };
};
