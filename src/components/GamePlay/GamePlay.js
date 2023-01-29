import React, { useCallback, useEffect, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { useWindowSize } from '../../hook/useWindowSize';
import KonvaBackground from '../shared/KonvaComponents/KonvaBackground';
import KonvaCharacter from '../shared/KonvaComponents/KonvaCharacter';

import './GamePlay.scss';
import { MenuButton } from '../shared/Button';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { loadMockData } from '../../services/dataService';
import ChoiceModal from '../shared/ChoiceModal';

const GamePlay = () => {
  const { width, height } = useWindowSize();
  const [data, setData] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);

  const [currentDialog, setCurrentDialog] = useState(null);
  const [currentChoice, setCurrentChoice] = useState(null);

  const [leftCharacter, setLeftCharacter] = useState(null);
  const [rightCharacter, setRightCharacter] = useState(null);
  const [background, setBackground] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setData(loadMockData());
  }, []);

  useEffect(() => {
    if (data != null) {
      setCurrentNode(data.get(0));
    }
  }, [data]);

  useEffect(() => {
    if (currentNode == null) {
      return;
    }
    const { type } = currentNode;
    switch (type) {
      case 'dialog':
        handleDialog(currentNode);
        break;
      case 'choice':
        handleChoice(currentNode);
        break;
      case 'event':
        handleEvent(currentNode);
        goToNextStep();
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode]);

  const handleDialog = useCallback((currentNodeData) => {
    setCurrentDialog(currentNodeData);
  }, []);

  const handleChoice = useCallback((currentNodeData) => {
    setCurrentChoice(currentNodeData);
  }, []);

  const handleEvent = useCallback((currentNodeData) => {
    const { eventType, params } = currentNodeData;
    switch (eventType) {
      case 'Set Character':
        initCharacter(params);
        break;
      case 'Set Background':
        initBackground(params);
        break;
      default:
        break;
    }
  }, []);

  const initCharacter = (params) => {
    const { position } = params;
    if (position === 'left') {
      setLeftCharacter(params);
    }
    if (position === 'right') {
      setRightCharacter(params);
    }
  };
  const initBackground = (params) => {
    const { backgroundImage } = params;
    setBackground(backgroundImage);
  };

  const backToMenu = () => {
    navigate('/game/0');
  };

  const getStageSize = () => ({
    width: width || window.innerWidth,
    height: height || window.innerHeight,
  });

  const handleOptionClick = (option) => {
    setCurrentNode(data.get(option.nextId));
    setCurrentChoice(null);
  };

  const goToNextStep = () => {
    if (currentNode.nextId != null) {
      setCurrentNode(data.get(currentNode.nextId));
    }
  };

  return currentNode != null ? (
    <>
      <Stage width={getStageSize().width} height={getStageSize().height}>
        <Layer
          offsetX={-getStageSize().width / 2}
          offsetY={-getStageSize().height}
        >
          {background && <KonvaBackground url={background}></KonvaBackground>}
        </Layer>
        <Layer
          offsetX={-getStageSize().width / 2}
          offsetY={-getStageSize().height}
        >
          {leftCharacter && (
            <KonvaCharacter
              url={leftCharacter.image}
              isLeft={true}
              isMain={
                currentDialog?.character?.id != null &&
                currentDialog?.character?.id === leftCharacter.id
              }
            ></KonvaCharacter>
          )}
          {rightCharacter && (
            <KonvaCharacter
              url={rightCharacter.image}
              isLeft={false}
              isMain={
                currentDialog?.character?.id != null &&
                currentDialog?.character?.id === rightCharacter.id
              }
            ></KonvaCharacter>
          )}
        </Layer>
      </Stage>
      <div className="game_gui">
        <div className="content">
          {currentDialog?.character && (
            <h1>{`${currentDialog?.character?.name}:`}</h1>
          )}
          <p>{currentDialog?.content}</p>
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
      {currentChoice && (
        <ChoiceModal
          content={currentChoice.content}
          options={currentChoice.options}
          onOptionClick={handleOptionClick}
        />
      )}
    </>
  ) : null;
};

export default GamePlay;
