import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Row, Space, Typography } from 'antd';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { addNewScene, deleteScene, updateScene } from '.';
import {
  currentEditedGameState,
  currentEditedSceneState,
  scenesState,
} from '../../../routes/store';
import './GameScenes.scss';
import GameScenesDelete from './GameScenesDelete';

const { Paragraph } = Typography;

const GameScenes = () => {
  const game = useRecoilValue(currentEditedGameState);
  const [scenes, setScenes] = useRecoilState(scenesState);
  const [currentScene, setCurrentScene] = useRecoilState(
    currentEditedSceneState
  );

  const handleAddScene = () => {
    const newScene = {
      name: `Scene ${scenes.length + 1}`,
      gameId: game.id,
      data: {},
    };
    addNewScene(newScene).then((result) => {
      setScenes([...scenes, { id: result.id, ...newScene }]);
    });
  };
  const handleChangeSceneName = (sceneId, value) => {
    updateScene(sceneId, {
      name: value,
    }).then(() => {
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
    });
  };
  const handleDeleteScene = (sceneId) => {
    deleteScene(sceneId).then(() => {
      setScenes(scenes.filter(({ id }) => id !== sceneId));
    });
  };
  const handleSelecteScene = (scene) => {
    setCurrentScene(scene);
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
        {scenes.map((scene) => (
          <div
            className={`scene_container ${
              currentScene?.id === scene.id ? 'active' : ''
            }`}
            key={scene.id}
          >
            <Paragraph
              editable={{
                onChange: (value) => handleChangeSceneName(scene.id, value),
              }}
            >
              {scene.name}
            </Paragraph>
            <Space split={<Divider type="vertical" />}>
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
              ></Button>
            </Space>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameScenes;
