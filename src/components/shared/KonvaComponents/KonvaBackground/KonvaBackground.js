import React, { useEffect, useState } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import { useWindowSize } from '../../../../hook/useWindowSize';
import { calculateAspectRatioCover } from '../../../../services/util';

const KonvaBackground = ({ url, ...rest }) => {
  const { width, height } = useWindowSize();
  const [image, status] = useImage(url);
  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (status === 'loaded' && !!image) {
      const { width: resizeWidth, height: resizeHeight } =
        calculateAspectRatioCover(image.width, image.height, width, height);
      setImageSize({
        width: resizeWidth,
        height: resizeHeight,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, width, height]);

  return status === 'loaded' ? (
    <Image
      image={image}
      width={imageSize.width}
      height={imageSize.height}
      offsetX={imageSize.width / 2}
      offsetY={height}
      {...rest}
    />
  ) : null;
};

export default KonvaBackground;
