import React, { useCallback, useEffect, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { useWindowSize } from '../../hook/useWindowSize';
import KonvaBackground from '../shared/KonvaComponents/KonvaBackground';
import KonvaCharacter from '../shared/KonvaComponents/KonvaCharacter';

import './GamePlay.scss';
import { MenuButton } from '../shared/Button';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import ChoiceModal from '../shared/ChoiceModal';
import { convertNodeToData } from '../../services/dataService';
import { openNotification } from '../GameEditorPage/gameEditor.util';
import AnimatedContent from '../shared/AnimatedContent';

const GamePlayScene = ({ currentScene }) => {
  const { width, height } = useWindowSize();

  const [data, setData] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);

  const [currentDialog, setCurrentDialog] = useState(null);
  const [currentChoice, setCurrentChoice] = useState(null);

  const [leftCharacter, setLeftCharacter] = useState(null);
  const [rightCharacter, setRightCharacter] = useState(null);
  const [background, setBackground] = useState(null);

  const [isDisable, setIsDisable] = useState(false);
  const [isShowAll, setIsShowAll] = useState(false);
  const [showAllText, setShowAllText] = useState(false);
  const [isSkipText, setIsSkipText] = useState(false);

  const [setting, setSetting] = useState({
    textSpeed: 50,
    music: 100,
    sFX: 100,
    voice: 100,
  });

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
    [currentNode, isShowAll]
  );

  useEffect(() => {
    setData(convertNodeToData(currentScene.data.nodes));
    setCurrentNode(currentScene.data.nodes[0]);

    loadSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleKeyPress]);

  useEffect(() => {
    if (currentNode == null) {
      return;
    }
    const { type } = currentNode;
    switch (type) {
      case 'root':
        goToNextStep();
        break;
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
    setShowAllText(false);
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
      case 'Remove Character':
        removeCharacter(params);
        break;
      case 'Set Background':
        initBackground(params);
        break;
      case 'Go to Next Scene':
        openNotification({
          message: 'End',
          description: 'This is end node!',
        });
        break;
      default:
        break;
    }
  }, []);

  const initCharacter = (params) => {
    const { characterPosition } = params;
    if (characterPosition === 'left') {
      setLeftCharacter(params);
    }
    if (characterPosition === 'right') {
      setRightCharacter(params);
    }
  };
  const removeCharacter = (params) => {
    const { characterPosition } = params;
    if (characterPosition === 'left') {
      setLeftCharacter(null);
    }
    if (characterPosition === 'right') {
      setRightCharacter(null);
    }
  };
  const initBackground = (params) => {
    const { backgroundUrl } = params;
    setBackground(backgroundUrl);
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
    if (
      currentNode != null &&
      currentNode?.nextId != null &&
      currentNode?.nextId !== ''
    ) {
      if (currentNode.type === 'dialog' && !isShowAll) {
        setShowAllText(true);
      } else {
        setCurrentNode(data.get(currentNode.nextId));
      }
    }
  };

  const loadSetting = () => {
    if (localStorage.getItem('setting') != null) {
      setSetting(JSON.parse(localStorage.getItem('setting')));
    }
  };

  const skipToOption = (node) => {
    const nextNode = data.get(node.nextId);
    if (!nextNode) {
      setIsSkipText(false);
      return;
    }
    setIsSkipText(true);
    goToStep(nextNode);
    if (nextNode.type !== 'choice') {
      setTimeout(() => skipToOption(nextNode), 250);
    } else {
      setIsSkipText(false);
    }
  };

  const goToStep = (node) => {
    if (node != null) {
      setCurrentNode(node);
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
              url={leftCharacter.characterImage}
              isLeft={true}
              isMain={
                currentDialog?.characterId != null &&
                currentDialog?.characterId === leftCharacter.characterId
              }
            ></KonvaCharacter>
          )}
          {rightCharacter && (
            <KonvaCharacter
              url={rightCharacter.characterImage}
              isLeft={false}
              isMain={
                currentDialog?.characterId != null &&
                currentDialog?.characterId === rightCharacter.characterId
              }
            ></KonvaCharacter>
          )}
        </Layer>
      </Stage>
      <div className="game_gui">
        <div
          className={`content ${
            currentDialog?.extraProps?.italic ? 'italic' : ''
          }`}
        >
          {currentDialog?.characterName && (
            <h1>{`${currentDialog?.characterName}:`}</h1>
          )}
          <div className="paragraph">
            {isSkipText ? (
              currentDialog?.content
            ) : (
              <AnimatedContent
                content={currentDialog?.content}
                interval={10 + (100 - setting.textSpeed) * 0.4}
                showAllText={showAllText}
                onDisplayStatusChange={(stt) => setIsShowAll(stt)}
              ></AnimatedContent>
            )}
          </div>
        </div>
        <div className="footer">
          <Space split={' - '}>
            <MenuButton
              disabled={isDisable}
              onClick={() => skipToOption(currentNode)}
            >
              Bỏ qua
            </MenuButton>
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

export default GamePlayScene;
