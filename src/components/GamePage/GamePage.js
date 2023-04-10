import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import './GamePage.scss';

import { MenuButton } from '../shared/Button';
import { useLoaderData, useNavigate } from 'react-router-dom';
import GameSettings from '../shared/GameSettings/GameSettings';
import SaveAndLoad from '../shared/SaveAndLoad/SaveAndLoad';
import { useRecoilState } from 'recoil';
import { currentEditedGameState } from '../../routes/store';
import Loading from '../shared/Loading';
import GamePlay from '../GamePlay';

const GamePage = () => {
  const loaderData = useLoaderData();
  const navigate = useNavigate();

  const [game, setGame] = useRecoilState(currentEditedGameState);
  const [saveSlot, setSaveSlot] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setGame(loaderData);
    setSaveSlot(null);
    return () => {
      setGame(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startGame = () => {
    setIsPlaying(true);
  };
  const exit = () => {
    navigate('/');
  };

  const loadGame = (slot) => {
    setSaveSlot(slot);
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <GamePlay
        game={game}
        loadGameSlot={saveSlot}
        onBack={() => {
          setIsPlaying(false);
          setSaveSlot(null);
        }}
      />
    );
  }

  return game ? (
    <div className="game_page_container">
      <div className="background">
        <img src={game.background} alt="main page"></img>
      </div>
      <div>
        <div className="menu_container">
          <div className="menu">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <h1 className="title">{game.name}</h1>
              </Col>
              <Col span={24}>
                <SaveAndLoad
                  gameId={game.id}
                  type="Load"
                  onLoad={(slot) => {
                    loadGame(slot);
                  }}
                >
                  Tiếp tục
                </SaveAndLoad>
              </Col>
              <Col span={24}>
                <MenuButton onClick={() => startGame()}>Bắt đầu</MenuButton>
              </Col>
              <Col span={24}>
                <GameSettings />
              </Col>
              <Col span={24}>
                <MenuButton>Credit</MenuButton>
              </Col>
              <Col span={24}>
                <MenuButton onClick={() => exit()}>Thoát</MenuButton>
              </Col>
            </Row>
          </div>
          <div className="background-gradient"></div>
        </div>
      </div>
    </div>
  ) : null;
};

export default GamePage;
