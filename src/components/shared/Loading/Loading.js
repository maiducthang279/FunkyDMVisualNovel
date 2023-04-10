import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { isLoadingState } from '../../../routes/store';
import './Loading.scss';
import { useWindowSize } from '../../../hook/useWindowSize';

// const fontSize = 5;
const LoadingItem = ({ pos, offset, contents, contentLength, fontSize }) => {
  const size = Math.abs(offset) * fontSize * 2;
  const isNegative = pos < 0 ? -1 : 1;
  const isReverse = Math.abs(pos) % 2;
  return (
    <div
      className={`spin spin-${Math.abs(pos % 4)} ${isReverse ? 'reverse' : ''}`}
      style={{
        position: 'relative',
        width: 0,
        height: 0,
        top: fontSize / 2 + 'rem',
        left: isNegative * (contentLength / 2 + 0.5) * fontSize + 'rem',
        transformOrigin: `center`,
        backgroundColor: 'white',
      }}
    >
      <div
        className={`loading_circle`}
        style={{
          width: size + 'rem',
          height: size + 'rem',
          left: 0 + 'rem',
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center',
        }}
      ></div>
      {contents.map((character, i) => (
        <div
          key={i}
          className={`loading_item`}
          style={{
            width: fontSize + 'rem',
            height: fontSize + 'rem',
            fontSize: fontSize + 'rem',
            transform: `translate(${
              -fontSize * (offset + 0.5)
            }rem, -50%) rotate(${
              ((isReverse ? -1 : 1) * i) / contents.length
            }turn)`,
            transformOrigin: `${fontSize * (offset + 0.5)}rem center`,
            backgroundColor:
              character && character !== ' ' ? '#000000' : 'transparent',
          }}
        >
          {character}
        </div>
      ))}
    </div>
  );
};

const loadingText = () => {
  const contents = [
    '  LOADING~  ',
    '   ^v^UwU   ',
    'VISUAL NOVEL',
    '   -.-O.O   ',
    '  LOADING~  ',
    '   !*!@o@   ',
    '  Funky DM  ',
    '   "~"X-X   ',
  ];
  // const contents = ['VISUAL NOVEL'];
  const contentLength = 12;
  const data = [];
  for (let i = 0; i < contentLength; i++) {
    const element = contents.map((item) => item.charAt(i));
    data.push(element);
  }
  return [data, contentLength];
};

const LoadingContainer = () => {
  const [data, contentLength] = loadingText();
  const { width } = useWindowSize();
  const [fontSize, setFontSize] = useState(5);

  useEffect(() => {
    setFontSize(
      Math.max(Math.min(Math.floor(width / (contentLength + 2) / 16), 3), 1.5)
    );
  }, [width, contentLength]);

  return (
    <>
      {data
        .map((contents, i) => (
          <LoadingItem
            key={i}
            pos={i - contentLength / 2}
            offset={i < contentLength / 2 ? -(i + 1) : contentLength - i}
            contents={contents}
            contentLength={contentLength}
            fontSize={fontSize}
          ></LoadingItem>
        ))
        .flat()}
      <div
        className="loading_overlay"
        style={{
          width: fontSize * (contentLength + 2) + 'rem',
          height: fontSize + 'rem',
          borderRadius: fontSize + 'rem',
        }}
      ></div>
    </>
  );
};

const Loading = () => {
  const [isLoading] = useRecoilState(isLoadingState);
  const [isShow, setIsShow] = useState(true);
  const [isPreHide, setIsPreHide] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsShow(true);
      setIsPreHide(false);
    } else {
      setIsPreHide(true);
      setTimeout(() => {
        setIsShow(false);
      }, 500);
    }
  }, [isLoading]);

  return (
    <div className={`loading_container ${isShow ? 'show' : 'hide'}`}>
      <div className={`${isPreHide ? 'preHide' : 'preShow'}`}>
        <div className="loading">
          <LoadingContainer></LoadingContainer>
        </div>
      </div>
    </div>
  );
};

export default Loading;
