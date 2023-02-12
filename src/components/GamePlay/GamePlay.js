import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import moment from 'moment';
import AnimatedText from 'react-animated-text-content';

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

  const [setting, setSetting] = useState({
    textSpeed: 50,
    music: 100,
    sFX: 100,
    voice: 100,
  });

  const navigate = useNavigate();

  const handleKeyPress = useCallback(
    (event) => {
      const key = event.key;
      if (event.repeat) {
        return;
      } else {
        if (key === 'Enter' || key === ' ') {
          goToNextStep();
        } else {
          return;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentNode]
  );

  useEffect(() => {
    setData(loadMockData());
    loadSetting();
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleKeyPress]);

  useEffect(() => {
    if (data != null) {
      const slot = searchParams.get('slot');
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
    const { backgroundUrl } = params;
    setBackground(backgroundUrl);
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
      dateTime: moment().format('hh:mm | DD/MM/YYYY'),
    };
    localStorage.setItem(slot, JSON.stringify(saveData));
  };

  const loadSetting = () => {
    if (localStorage.getItem('setting') != null) {
      setSetting(JSON.parse(localStorage.getItem('setting')));
    }
  };

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
  };

  const skipToOption = (node) => {
    const nextNode = data.get(node.nextId);
    if (!nextNode) {
      return;
    }
    goToStep(nextNode);
    if (nextNode.type !== 'choice') {
      setTimeout(() => skipToOption(nextNode), 500);
    }
  };

  const goToStep = (node) => {
    if (node != null) {
      setCurrentNode(node);
    }
  };

  const renderText = useMemo(
    () => (
      <AnimatedText
        type="words"
        interval={0.15 - setting.textSpeed / 1000}
        animation={{
          ease: 'ease',
        }}
      >
        {currentDialog?.content}
      </AnimatedText>
    ),
    [currentDialog?.content, setting.textSpeed]
  );

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
          <div className="paragraph">{renderText}</div>
        </div>
        <div className="footer">
          <Space split={' - '}>
            <MenuButton
              disabled={isDisable}
              onClick={() => skipToOption(currentNode)}
            >
              Bỏ qua
            </MenuButton>
            <MenuButton onClick={() => backToMenu()}>Về trang chủ</MenuButton>
            <SaveAndLoad
              type="Load"
              onLoad={(slot) => {
                loadGame(slot);
              }}
            />
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
