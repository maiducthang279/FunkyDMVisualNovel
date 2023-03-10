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
import SaveAndLoad from '../shared/SaveAndLoad/SaveAndLoad';
import moment from 'moment';
import { sceneLoader } from '.';
import Loading from '../shared/Loading';
import { convertNodeToData } from '../../services/dataService';
import AnimatedContent from '../shared/AnimatedContent';
import { getListImage } from '../utils/utils';
import DOMPurify from 'dompurify';

const GamePlay = ({ game, loadGameSlot, onBack }) => {
  const { width, height } = useWindowSize();

  const [isLoading, setIsLoading] = useState(true);
  const [currentScene, setCurrentScene] = useState(null);
  const [data, setData] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [listImageUrl, setListImageUrl] = useState([]);
  const [listImage, setListImage] = useState([]);

  const [currentDialog, setCurrentDialog] = useState(null);
  const [currentChoice, setCurrentChoice] = useState(null);

  const [leftCharacter, setLeftCharacter] = useState(null);
  const [rightCharacter, setRightCharacter] = useState(null);
  const [background, setBackground] = useState(null);

  const [isDisable, setIsDisable] = useState(false);
  const [isShowAll, setIsShowAll] = useState(false);
  const [showAllText, setShowAllText] = useState(false);
  const [isSkipText, setIsSkipText] = useState(false);
  const [isDialogHiden, setIsDialogHiden] = useState(false);
  const [isEndGame, setIsEndGame] = useState(false);
  const [credit, setCredit] = useState('');

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
    if (loadGameSlot != null) {
      loadGame(loadGameSlot);
    } else {
      if (game.rootScene) {
        setIsLoading(true);
        sceneLoader(game.rootScene)
          .then((res) => {
            setCurrentScene(res);
            return getListImage(res.data.nodes, listImageUrl, res);
          })
          .then(([res, newImgUrl, newImg]) => {
            setListImage([...listImage, ...newImg]);
            setListImageUrl([...listImageUrl, ...newImgUrl]);
            setData(convertNodeToData(res.data.nodes));
            setCurrentNode(res.data.nodes[0]);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        window.alert('Error game. Please go back.');
      }
    }
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
        goToNextScene(params);
        break;
      case 'End Game':
        endGame(params);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const hideDialog = (params) => {
    const { isHidden } = params;
    setIsDialogHiden(isHidden);
  };

  const goToNextScene = (param) => {
    setIsLoading(true);
    hideDialog({ isHidden: true });
    sceneLoader(param.nextSceneId)
      .then((res) => {
        setCurrentScene(res);
        return getListImage(res.data.nodes, listImageUrl, res);
      })
      .then(([res, newImgUrl, newImg]) => {
        setListImage([...listImage, ...newImg]);
        setListImageUrl([...listImageUrl, ...newImgUrl]);
        setData(convertNodeToData(res.data.nodes));
        setCurrentNode(res.data.nodes[0]);
      })
      .finally(() => {
        hideDialog({ isHidden: false });
        setIsLoading(false);
      });
  };

  const endGame = (param) => {
    setIsEndGame(true);
    setCredit(param.credit);
  };

  const backToMenu = () => {
    onBack && onBack();
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

  const saveGame = (slot) => {
    const saveData = {
      currentSceneId: currentScene.id,
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
      setIsLoading(true);
      sceneLoader(loadData.currentSceneId)
        .then((res) => {
          setCurrentScene(res);
          return getListImage(res.data.nodes, listImageUrl, res);
        })
        .then(([res, newImgUrl, newImg]) => {
          setListImage([...listImage, ...newImg]);
          setListImageUrl([...listImageUrl, ...newImgUrl]);
          setData(convertNodeToData(res.data.nodes));
          setCurrentNode(loadData.currentNode);
          setCurrentDialog(loadData.currentDialog);
          setCurrentChoice(loadData.currentChoice);
          setLeftCharacter(loadData.leftCharacter);
          setRightCharacter(loadData.rightCharacter);
          setBackground(loadData.background);
        })
        .finally(() => {
          setIsLoading(false);
        });
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

  if (isEndGame) {
    return (
      <>
        <Stage width={getStageSize().width} height={getStageSize().height}>
          <Layer
            offsetX={-getStageSize().width / 2}
            offsetY={-getStageSize().height}
          >
            {background && <KonvaBackground url={background}></KonvaBackground>}
          </Layer>
        </Stage>
        <div className="credit">
          <div
            className="credit_content credit-animation"
            style={{
              transition: `transform ${
                credit.split('<p>').length + 10
              }s ease-in`,
            }}
          >
            <div className="the_end">K???t th??c</div>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(credit),
              }}
            />
          </div>
          <div className="credit_footer">
            <MenuButton onClick={() => backToMenu()}>V??? trang ch???</MenuButton>
          </div>
        </div>
      </>
    );
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
          {!isLoading && leftCharacter && (
            <KonvaCharacter
              url={leftCharacter.characterImage}
              isLeft={true}
              isMain={
                currentDialog?.characterId != null &&
                currentDialog?.characterId === leftCharacter.characterId
              }
            ></KonvaCharacter>
          )}
          {!isLoading && rightCharacter && (
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
        {isDialogHiden ? null : (
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
        )}
        {!isLoading ? (
          <div className="footer">
            <Space split={' - '}>
              <MenuButton
                disabled={isDisable}
                onClick={() => skipToOption(currentNode)}
              >
                Tua nhanh
              </MenuButton>
              <MenuButton onClick={() => backToMenu()}>V??? trang ch???</MenuButton>
              <SaveAndLoad
                gameId={game.id}
                type="Load"
                onLoad={(slot) => {
                  loadGame(slot);
                }}
              />
              <SaveAndLoad
                type="Save"
                gameId={game.id}
                onSave={(slot) => saveGame(slot)}
              />
              <MenuButton disabled={isDisable} onClick={() => goToNextStep()}>
                Ti???p theo <CaretRightOutlined />
              </MenuButton>
            </Space>
          </div>
        ) : null}
      </div>
      {currentChoice && (
        <ChoiceModal
          content={currentChoice.content}
          options={currentChoice.options}
          onOptionClick={handleOptionClick}
        />
      )}
      {isLoading ? <Loading /> : null}
    </>
  ) : (
    <Loading />
  );
};

export default GamePlay;
