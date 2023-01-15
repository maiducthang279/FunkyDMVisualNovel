import React, { useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import { useWindowSize } from '../../hook/useWindowSize';
import KonvaBackground from '../shared/KonvaComponents/KonvaBackground';
import cat1 from '../../assets/images/zyro-image (1).png';
import cat2 from '../../assets/images/zyro-image.png';
import KonvaCharacter from '../shared/KonvaComponents/KonvaCharacter';

import './GamePlay.scss';
import { MenuButton } from '../shared/Button';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const mockData = [
  {
    character: 'Búp',
    content: 'Chào bạn!',
  },
  {
    character: 'Gin',
    content: 'Hê lô',
  },
  {
    character: 'Gin',
    content: 'Tôi mới thấy bạn lần đầu.',
  },
  {
    character: 'Búp',
    content: 'Mình là Búp.',
  },
  {
    character: 'Gin',
    content: 'Búp trong Búp măng non.',
  },
  {
    character: 'Búp',
    content: 'Nô nô nô. Búp trong Búp.',
  },
];

const GamePlay = () => {
  const { width, height } = useWindowSize();
  const [step, setStep] = useState(0);
  const [currentNode, setCurrentNode] = useState(mockData[0]);

  const navigate = useNavigate();

  const backToMenu = () => {
    navigate('/game');
  };

  const getStageSize = () => ({
    width: width || window.innerWidth,
    height: height || window.innerHeight,
  });

  const goToNextStep = () => {
    const nextStep = (step + 1) % mockData.length;
    setStep(nextStep);
    setCurrentNode(mockData[nextStep]);
  };

  return (
    <>
      <Stage width={getStageSize().width} height={getStageSize().height}>
        <Layer
          offsetX={-getStageSize().width / 2}
          offsetY={-getStageSize().height}
        >
          <KonvaBackground
            url={
              'https://cdnb.artstation.com/p/assets/images/images/052/085/069/large/nils-firas-living-room-render-v001.jpg?1658914986'
            }
          ></KonvaBackground>
          <Rect
            x={-50}
            y={-50}
            width={100}
            height={100}
            fill={'#ff0000'}
          ></Rect>
        </Layer>
        <Layer
          offsetX={-getStageSize().width / 2}
          offsetY={-getStageSize().height}
        >
          <KonvaCharacter
            url={cat1}
            isLeft={true}
            isMain={currentNode.character === 'Búp'}
          ></KonvaCharacter>
          <KonvaCharacter
            url={cat2}
            isLeft={false}
            isMain={currentNode.character === 'Gin'}
          ></KonvaCharacter>
        </Layer>
      </Stage>
      <div className="game_gui">
        <div className="content">
          <h1>{`${currentNode.character}:`}</h1>
          <p>{currentNode.content}</p>
        </div>
        <div className="footer">
          <Space split={' - '}>
            <MenuButton onClick={() => backToMenu()}>Về trang chủ</MenuButton>
            <MenuButton>Lưu</MenuButton>
            <MenuButton onClick={() => goToNextStep()}>
              Tiếp theo <CaretRightOutlined />
            </MenuButton>
          </Space>
        </div>
      </div>
    </>
  );
};

export default GamePlay;
