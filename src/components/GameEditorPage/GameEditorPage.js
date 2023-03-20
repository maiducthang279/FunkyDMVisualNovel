import {
  ApartmentOutlined,
  ArrowLeftOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  CodeOutlined,
  ExportOutlined,
  MenuOutlined,
  PictureOutlined,
  SaveOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Button, Col, Drawer, Form, Row, Space, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { publishGame } from '.';
import {
  currentEditedGameState,
  currentEditedGameProjectState,
  formStatusState,
  FORM_STATUS,
  charactersState,
  backgroundsState,
  scenesState,
  currentEditedSceneState,
  isPlayingState,
  variablesState,
} from '../../routes/store';
import GamePlayScene from '../GamePlay/GamePlayScene';
import LoadingEffectIcon from '../shared/LoadingEffectIcon';
import { downloadObjectAsJson } from '../utils/utils';
import GameBackgrounds from './GameBackground';
import GameCharacters from './GameCharacter';
import GameData from './GameData/GameData';
import { openNotification } from './gameEditor.util';
import './GameEditorPage.scss';
import GameMetadataForm from './GameMetadata';
import GameScenes, { updateScene } from './GameScene';
import GameVariable from './GameVariable';

const DRAWERS = {
  MAIN_MENU: 'MAIN_MENU',
  SETTING: 'SETTING',
  SCENE: 'SCENE',
  CHARACTER: 'CHARACTER',
  BACKGROUND: 'BACKGROUND',
  VARIABLE: 'VARIABLE',
};

const GameEditorPage = () => {
  const loaderData = useLoaderData();

  const [metadataForm] = Form.useForm();

  const [isPlaying] = useRecoilState(isPlayingState);

  const [game, setGame] = useRecoilState(currentEditedGameState);
  const [, setProject] = useRecoilState(currentEditedGameProjectState);
  const [, setCharacters] = useRecoilState(charactersState);
  const [, setBackgrounds] = useRecoilState(backgroundsState);
  const [, setScenes] = useRecoilState(scenesState);
  const [, setVariables] = useRecoilState(variablesState);
  const [currentScene, setCurrentScene] = useRecoilState(
    currentEditedSceneState
  );

  const [formState, setFormState] = useRecoilState(formStatusState);
  const [isPublishing, setIsPublishing] = useState(false);

  const [openedDrawer, setOpenedDrawer] = useState(null);

  useEffect(() => {
    const currentEditGameVariables = JSON.parse(
      localStorage.getItem(`edit-variable-${loaderData.game.id}`)
    );

    setGame(loaderData.game);
    setProject(loaderData.project);
    setCharacters(loaderData.characters);
    setBackgrounds(loaderData.backgrounds);
    setScenes(loaderData.scenes);
    if (currentEditGameVariables && currentEditGameVariables.length > 0) {
      setVariables(
        loaderData.game.variables?.map((variable) => {
          const savedCurrentVariable = currentEditGameVariables?.find(
            ({ id }) => id === variable.id
          );
          return {
            ...variable,
            current: savedCurrentVariable?.current || variable.default,
          };
        }) || []
      );
    } else {
      setVariables(
        loaderData.game.variables?.map((variable) => ({
          ...variable,
          current: variable.default,
        })) || []
      );
    }
    if (loaderData.scenes.length > 0) {
      setCurrentScene(loaderData.scenes[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    if (formState !== FORM_STATUS.SAVED) {
      window.addEventListener('beforeunload', handler);
      return () => {
        window.removeEventListener('beforeunload', handler);
      };
    }
    return () => {};
  }, [formState]);

  const handleOpenDrawer = (drawer) => {
    setOpenedDrawer(drawer);
  };

  const handleCloseDrawer = () => {
    setOpenedDrawer(null);
  };

  const handlePublish = () => {
    if (isPublishing) {
      return;
    }
    const isPublish = !(game.status === 'Published');
    setIsPublishing(true);
    publishGame(game.id, isPublish)
      .then(() => {
        setGame({
          ...game,
          status: isPublish ? 'Published' : 'Work in progress',
        });
      })
      .finally(() => {
        setIsPublishing(false);
      });
  };
  const handleSave = () => {
    if (formState === FORM_STATUS.SAVING) {
      return;
    }
    if (formState === FORM_STATUS.DIRTY) {
      metadataForm.submit();
    }
    updateScene(currentScene.id, currentScene)
      .then(() => {
        setScenes((prev) =>
          prev.map((item) =>
            item.id === currentScene.id ? currentScene : item
          )
        );
        openNotification({
          message: 'Saved',
          description: 'Current game was saved!',
        });
      })
      .finally(() => {
        setFormState(FORM_STATUS.SAVED);
      });
  };
  const handleExport = () => {
    const exportedData = {
      metadata: metadataForm.getFieldsValue(),
      scene: currentScene,
    };
    downloadObjectAsJson(
      exportedData,
      `${game.name}-${moment().format()}-export-data`
    );
  };
  const handleGoBackHome = () => {
    window.location = '/';
  };

  if (!game) {
    return null;
  }

  return (
    <div className="game_editor_form_container">
      <Space className="action" direction="vertical">
        <Tooltip title="Main menu" placement="left">
          <Button
            type="primary"
            shape="circle"
            icon={<MenuOutlined />}
            onClick={() => handleOpenDrawer(DRAWERS.MAIN_MENU)}
          />
        </Tooltip>
        <Tooltip title="Scene" placement="left">
          <Button
            type="primary"
            shape="circle"
            icon={<ApartmentOutlined />}
            onClick={() => handleOpenDrawer(DRAWERS.SCENE)}
          />
        </Tooltip>
      </Space>
      <Space className="action right" direction="vertical">
        <Tooltip title="Setting" placement="left">
          <Button
            type="primary"
            shape="circle"
            icon={<SettingOutlined />}
            onClick={() => handleOpenDrawer(DRAWERS.SETTING)}
          />
        </Tooltip>
        <div className="divider"></div>
        <Tooltip title="Character" placement="left">
          <Button
            type="primary"
            shape="circle"
            icon={<TeamOutlined />}
            onClick={() => handleOpenDrawer(DRAWERS.CHARACTER)}
          />
        </Tooltip>
        <Tooltip title="Background" placement="left">
          <Button
            type="primary"
            shape="circle"
            icon={<PictureOutlined />}
            onClick={() => handleOpenDrawer(DRAWERS.BACKGROUND)}
          />
        </Tooltip>
        <Tooltip title="Variable" placement="left">
          <Button
            type="primary"
            shape="circle"
            icon={<CodeOutlined />}
            onClick={() => handleOpenDrawer(DRAWERS.VARIABLE)}
          />
        </Tooltip>
      </Space>
      <div className={`main ${isPlaying ? 'hide' : ''}`}>
        <GameData />
      </div>
      {isPlaying && (
        <div className="main">
          <GamePlayScene currentScene={currentScene} />
        </div>
      )}
      <Drawer
        title="Main menu"
        placement="left"
        onClose={handleCloseDrawer}
        open={openedDrawer === DRAWERS.MAIN_MENU}
        bodyStyle={{ padding: 0 }}
      >
        <Row
          style={{ flexDirection: 'column', height: '100%' }}
          justify={'space-between'}
        >
          <Col>
            <Row style={{ flexDirection: 'column' }} justify={'start'}>
              <Col>
                <div className="main_menu_button" onClick={handleSave}>
                  <Space>
                    <LoadingEffectIcon
                      isLoading={formState === FORM_STATUS.SAVING}
                      icon={<SaveOutlined />}
                    />
                    <p>Save</p>
                  </Space>
                </div>
              </Col>
              <Col>
                <div className="main_menu_button" onClick={handleExport}>
                  <Space>
                    <LoadingEffectIcon
                      isLoading={formState === FORM_STATUS.SAVING}
                      icon={<ExportOutlined />}
                    />
                    <p>Export data</p>
                  </Space>
                </div>
              </Col>
              <Col>
                <div className="main_menu_button" onClick={handlePublish}>
                  <Space>
                    {game.status === 'Published' ? (
                      <>
                        <LoadingEffectIcon
                          isLoading={isPublishing}
                          icon={<CloudDownloadOutlined />}
                        />
                        <p>Unpublish game</p>
                      </>
                    ) : (
                      <>
                        <LoadingEffectIcon
                          isLoading={isPublishing}
                          icon={<CloudUploadOutlined />}
                        />
                        <p>Publish game</p>
                      </>
                    )}
                  </Space>
                </div>
              </Col>
            </Row>
          </Col>
          <Col>
            <div className="main_menu_button" onClick={handleGoBackHome}>
              <Space>
                <ArrowLeftOutlined />
                <p>Back to Home</p>
              </Space>
            </div>
          </Col>
        </Row>
      </Drawer>
      <Drawer
        title="Settings"
        placement="right"
        onClose={handleCloseDrawer}
        open={openedDrawer === DRAWERS.SETTING}
        extra={
          <Button type="primary" onClick={() => metadataForm.submit()}>
            Save
          </Button>
        }
      >
        <GameMetadataForm game={game} form={metadataForm} />
      </Drawer>
      <Drawer
        title="Scene"
        placement="left"
        onClose={handleCloseDrawer}
        open={openedDrawer === DRAWERS.SCENE}
      >
        <GameScenes />
      </Drawer>
      <Drawer
        title="Characters"
        placement="right"
        onClose={handleCloseDrawer}
        open={openedDrawer === DRAWERS.CHARACTER}
      >
        <GameCharacters />
      </Drawer>
      <Drawer
        title="Backgrounds"
        placement="right"
        onClose={handleCloseDrawer}
        open={openedDrawer === DRAWERS.BACKGROUND}
      >
        <GameBackgrounds />
      </Drawer>
      <Drawer
        title="Variables"
        placement="right"
        onClose={handleCloseDrawer}
        open={openedDrawer === DRAWERS.VARIABLE}
      >
        <GameVariable />
      </Drawer>
    </div>
  );
};

export default GameEditorPage;
