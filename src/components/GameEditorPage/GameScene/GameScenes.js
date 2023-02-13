import {
  CaretRightOutlined,
  EditOutlined,
  PauseOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Button, Col, Collapse, Divider, Row, Space, Typography } from 'antd';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { addNewScene, deleteScene, updateScene } from '.';
import {
  currentEditedGameState,
  currentEditedSceneState,
  isPlayingState,
  scenesState,
} from '../../../routes/store';
import LoadingEffectIcon from '../../shared/LoadingEffectIcon';
import { openNotification } from '../gameEditor.util';
import './GameScenes.scss';
import GameScenesDelete from './GameScenesDelete';

const { Paragraph } = Typography;

const GameScenes = () => {
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const game = useRecoilValue(currentEditedGameState);
  const [scenes, setScenes] = useRecoilState(scenesState);
  const [currentScene, setCurrentScene] = useRecoilState(
    currentEditedSceneState
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleAddScene = () => {
    const newScene = {
      name: `Scene ${scenes.length + 1}`,
      gameId: game.id,
      data: {
        global: {},
        nodes: [
          {
            id: 'root',
            name: 'root',
            type: 'root',
            nextId: 0,
          },
        ],
      },
    };
    addNewScene(newScene).then((result) => {
      setScenes([...scenes, { id: result.id, ...newScene }]);
    });
  };
  const handleChangeSceneName = (sceneId, value) => {
    setIsLoading(true);
    updateScene(sceneId, {
      name: value,
    })
      .then(() => {
        setScenes((prev) =>
          prev.map((item) =>
            item.id === sceneId
              ? {
                  ...item,
                  name: value,
                }
              : item
          )
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleSaveScene = () => {
    setIsLoading(true);
    updateScene(currentScene.id, currentScene)
      .then(() => {
        setScenes((prev) =>
          prev.map((item) =>
            item.id === currentScene.id ? currentScene : item
          )
        );
        openNotification({
          message: 'Saved',
          description: 'Current scene was saved!',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleDeleteScene = (sceneId) => {
    deleteScene(sceneId).then(() => {
      setScenes(scenes.filter(({ id }) => id !== sceneId));
    });
  };
  const handleSelecteScene = (scene) => {
    if (
      window.confirm('Are you save scene before starting edit another scene?')
    ) {
      setCurrentScene(scene);
    }
  };
  const handlePlayScene = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="game_scenes">
      <Row justify={'end'}>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddScene}
          >
            Add Scene
          </Button>
        </Col>
      </Row>
      <br />
      <div>
        <Collapse accordion defaultActiveKey={currentScene?.id}>
          {scenes.map((scene) => (
            <Collapse.Panel
              header={`${scene.name}${
                currentScene.id === scene.id ? ' - Editing ' : ''
              }`}
              key={scene.id}
            >
              <Row>
                <Paragraph>
                  <b>Name:&nbsp;</b>
                </Paragraph>
                <Paragraph
                  style={{ flexGrow: 1 }}
                  editable={{
                    onChange: (value) => handleChangeSceneName(scene.id, value),
                  }}
                >
                  {scene.name}
                </Paragraph>
              </Row>
              <Divider style={{ margin: '0.5rem' }} />
              <Row justify={'end'}>
                <Space split={<Divider type="vertical" />}>
                  {currentScene.id === scene.id ? (
                    <>
                      <Button
                        type="link"
                        size="small"
                        icon={
                          isPlaying ? <PauseOutlined /> : <CaretRightOutlined />
                        }
                        onClick={() => handlePlayScene()}
                      >
                        {isPlaying ? 'Stop' : 'Play'}
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        icon={
                          <LoadingEffectIcon
                            isLoading={isLoading}
                            icon={<SaveOutlined />}
                          ></LoadingEffectIcon>
                        }
                        onClick={() => handleSaveScene()}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <GameScenesDelete
                        id={scene.id}
                        name={scene.name}
                        onSuccess={handleDeleteScene}
                      ></GameScenesDelete>
                      <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleSelecteScene(scene)}
                      >
                        Edit
                      </Button>
                    </>
                  )}
                </Space>
              </Row>
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default GameScenes;
