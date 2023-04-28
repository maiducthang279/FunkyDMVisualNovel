import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import { useWindowSize } from '../../../../hook/useWindowSize';
import { calculateAspectRatioCover } from '../../../../services/util';

const KonvaBackground = ({ url, effect, removeBackground, ...rest }) => {
  const { width, height } = useWindowSize();
  const [image, status] = useImage(url);
  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
  });
  const imageRef = useRef(null);

  useEffect(() => {
    if (status === 'loaded' && !!image) {
      const { width: resizeWidth, height: resizeHeight } =
        calculateAspectRatioCover(image.width, image.height, width, height);
      setImageSize({
        width: resizeWidth,
        height: resizeHeight,
      });
      imageRef.current.to({
        duration: 1,
        opacity: 1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, width, height]);

  useEffect(() => {
    if (effect === 'fade') {
      imageRef.current.to({
        duration: 1,
        opacity: 0,
      });
    } else {
      imageRef.current?.to({
        duration: 1,
        opacity: 1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect]);

  return status === 'loaded' ? (
    <Image
      ref={(node) => (imageRef.current = node)}
      image={image}
      width={imageSize.width}
      height={imageSize.height}
      offsetX={imageSize.width / 2}
      offsetY={height}
      opacity={0}
      {...rest}
    />
  ) : null;
};

export default KonvaBackground;
