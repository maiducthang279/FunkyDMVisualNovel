import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import { useWindowSize } from '../../../../hook/useWindowSize';
import { calculateAspectRatioFitByHeight } from '../../../../services/util';

const KonvaCharacter = ({ url, isLeft, isMain, ...rest }) => {
  const padding = 96;

  const { width, height } = useWindowSize();
  const [image, status] = useImage(url);
  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
  });

  const imageRef = useRef();

  useEffect(() => {
    if (!!imageRef.current && !!image) {
      imageRef.current.to({
        scaleX: isMain ? 1.15 : 1,
        scaleY: isMain ? 1.15 : 1,
        duration: 0.1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMain, image]);

  useEffect(() => {
    if (status === 'loaded' && !!image) {
      const { width: resizeWidth, height: resizeHeight } =
        calculateAspectRatioFitByHeight(
          image.width,
          image.height,
          height - 3 * padding
        );
      setImageSize({
        width: resizeWidth,
        height: resizeHeight,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, width, height]);

  return status === 'loaded' ? (
    <Image
      ref={(node) => (imageRef.current = node)}
      image={image}
      x={isLeft ? -width / 4 : +width / 4}
      y={-padding}
      width={imageSize.width}
      height={imageSize.height}
      offsetX={imageSize.width / 2}
      offsetY={imageSize.height}
      {...rest}
    />
  ) : null;
};

export default KonvaCharacter;
