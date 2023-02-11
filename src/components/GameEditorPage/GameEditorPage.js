import {
  ApartmentOutlined,
  ArrowLeftOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  MenuOutlined,
  PictureOutlined,
  SaveOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Button, Col, Drawer, Form, Row, Space, Tooltip } from 'antd';
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
} from '../../routes/store';
import LoadingEffectIcon from '../shared/LoadingEffectIcon';
import GameBackgrounds from './GameBackground';
import GameCharacters from './GameCharacter';
import GameData from './GameData/GameData';
import './GameEditorPage.scss';
import GameMetadataForm from './GameMetadata';
import GameScenes from './GameScene';

const DRAWERS = {
  MAIN_MENU: 'MAIN_MENU',
  SETTING: 'SETTING',
  SCENE: 'SCENE',
  CHARACTER: 'CHARACTER',
  BACKGROUND: 'BACKGROUND',
};

const GameEditorPage = () => {
  const loaderData = useLoaderData();

  const [metadataForm] = Form.useForm();

  const [game, setGame] = useRecoilState(currentEditedGameState);
  const [, setProject] = useRecoilState(currentEditedGameProjectState);
  const [, setCharacters] = useRecoilState(charactersState);
  const [, setBackgrounds] = useRecoilState(backgroundsState);
  const [, setScenes] = useRecoilState(scenesState);
  const [, setCurrentScene] = useRecoilState(currentEditedSceneState);

  const [formState, setFormState] = useRecoilState(formStatusState);
  const [isPublishing, setIsPublishing] = useState(false);

  const [openedDrawer, setOpenedDrawer] = useState(null);

  useEffect(() => {
    setGame(loaderData.game);
    setProject(loaderData.project);
    setCharacters(loaderData.characters);
    setBackgrounds(loaderData.backgrounds);
    setScenes(loaderData.scenes);
    if (loaderData.scenes.length > 0) {
      setCurrentScene(loaderData.scenes[0]);
    }
    console.log(loaderData);
    return () => {
      setGame(null);
      setProject(null);
      setCharacters([]);
      setBackgrounds([]);
      setScenes([]);
    };
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
    metadataForm.submit();
    setFormState(FORM_STATUS.SAVED);
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
        <Tooltip title="Scene" placement="left">
          <Button
            type="primary"
            shape="circle"
            icon={<ApartmentOutlined />}
            onClick={() => handleOpenDrawer(DRAWERS.SCENE)}
          />
        </Tooltip>
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
      </Space>
      <div className="main">
        <GameData />
      </div>
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
      >
        <GameMetadataForm game={game} form={metadataForm} />
      </Drawer>
      <Drawer
        title="Scene"
        placement="right"
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
    </div>
  );
};

export default GameEditorPage;