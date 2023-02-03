import React, { useCallback, useEffect, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { useWindowSize } from '../../hook/useWindowSize';
import KonvaBackground from '../shared/KonvaComponents/KonvaBackground';
import KonvaCharacter from '../shared/KonvaComponents/KonvaCharacter';

import './GamePlay.scss';
import { MenuButton } from '../shared/Button';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadMockData } from '../../services/dataService';
import ChoiceModal from '../shared/ChoiceModal';
import SaveAndLoad from '../shared/SaveAndLoad/SaveAndLoad';
import moment from 'moment/moment';

const GamePlay = () => {
  const [searchParams] = useSearchParams();
  const { width, height } = useWindowSize();
  const [data, setData] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);

  const [currentDialog, setCurrentDialog] = useState(null);
  const [currentChoice, setCurrentChoice] = useState(null);

  const [leftCharacter, setLeftCharacter] = useState(null);
  const [rightCharacter, setRightCharacter] = useState(null);
  const [background, setBackground] = useState(null);

  const [isDisable, setIsDisable] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setData(loadMockData());
  }, []);

  useEffect(() => {
    if (data != null) {
      const slot = searchParams.get("slot");
      if (slot) {
        loadGame(slot);
      } else {
        setCurrentNode(data.get(0));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setIsDisable(true);
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
    navigate('/game');
  };

  const getStageSize = () => ({
    width: width || window.innerWidth,
    height: height || window.innerHeight,
  });

  const handleOptionClick = (option) => {
    setCurrentNode(data.get(option.nextId));
    setCurrentChoice(null);
    setIsDisable(false);
  };

  const goToNextStep = () => {
    if (currentNode.nextId != null) {
      setCurrentNode(data.get(currentNode.nextId));
    }
  };


  const saveGame = (slot) => {
    const saveData = {
      currentNode,
      currentDialog,
      currentChoice,
      leftCharacter,
      rightCharacter,
      background,
      dateTime: moment().format("hh:mm | DD/MM/YYYY"),
    }
    localStorage.setItem(
      slot,
      JSON.stringify(saveData)
    )
  }

  const loadGame = (slot) => {
    if (localStorage.getItem(slot) != null) {
      const loadData = JSON.parse(localStorage.getItem(slot));
      setCurrentNode(loadData.currentNode);
      setCurrentDialog(loadData.currentDialog);
      setCurrentChoice(loadData.currentChoice);
      setLeftCharacter(loadData.leftCharacter);
      setRightCharacter(loadData.rightCharacter);
      setBackground(loadData.background);
    }
  }

  const skipToOption = (node) => {
    const nextNode = data.get(node.nextId);
    if (!nextNode) {
      return;
    }
    goToStep(nextNode);
    console.log("currentnode:",node.type);
    console.log("nextnode:",data.get(node.nextId).type);
    if (nextNode.type !== "choice") {
      setTimeout(() => skipToOption(nextNode), 500);
    }
  }

  const goToStep = (node) => {
    if (node != null) {
      setCurrentNode(node);
    }
  }

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
            <MenuButton disabled={isDisable} onClick={() => skipToOption(currentNode)}>Bỏ qua</MenuButton>
            <MenuButton onClick={() => backToMenu()}>Về trang chủ</MenuButton>
            <SaveAndLoad type="Save" onSave={(slot) => saveGame(slot)} />
            <MenuButton disabled={isDisable} onClick={() => goToNextStep()}>
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
