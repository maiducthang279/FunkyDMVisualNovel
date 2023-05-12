import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import './GamePage.scss';

import { MenuButton } from '../shared/Button';
import { useLoaderData, useNavigate } from 'react-router-dom';
import GameSettings from '../shared/GameSettings/GameSettings';
import SaveAndLoad from '../shared/SaveAndLoad/SaveAndLoad';
import { useRecoilState } from 'recoil';
import { currentEditedGameState } from '../../routes/store';
import GamePlay from '../GamePlay';
import DOMPurify from 'dompurify';

const GamePage = () => {
  const loaderData = useLoaderData();
  const navigate = useNavigate();

  const [game, setGame] = useRecoilState(currentEditedGameState);
  const [saveSlot, setSaveSlot] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isEndGame, setIsEndGame] = useState(false);
  const [credit, setCredit] = useState('');

  useEffect(() => {
    setGame(loaderData);
    setCredit(loaderData.credit || '');
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

  if (game && isEndGame) {
    return (
      <div className="game_page_container">
        <div className="background">
          <img src={game.background} alt="main page"></img>
        </div>
        <div className="credit">
          <div
            className="credit_content credit-animation"
            style={{
              transition: `transform ${
                credit.split('<p>').length + 10
              }s ease-in`,
            }}
          >
            <div className="the_end">Credit</div>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(credit),
              }}
            />
          </div>
          <div className="credit_footer">
            <MenuButton onClick={() => setIsEndGame(false)}>
              Về trang chủ
            </MenuButton>
          </div>
        </div>
      </div>
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
                <MenuButton onClick={() => setIsEndGame(true)}>
                  Credit
                </MenuButton>
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
