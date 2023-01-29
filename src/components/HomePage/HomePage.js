import { CaretRightOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import GameCard from '../shared/GameCard';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import './HomePage.scss';
import { useSetRecoilState } from 'recoil';
import { backgroundState } from '../../routes/store';

const HomePage = () => {
  const games = useLoaderData();

  const setBackground = useSetRecoilState(backgroundState);

  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    if (games?.length > 0 && selectedGame == null) {
      setSelectedGame(games[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games]);

  useEffect(() => {
    if (selectedGame) {
      setBackground(selectedGame.background);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame]);

  const renderTag = (status) => {
    switch (status) {
      case 'Published':
        return <Tag color={'#457db2'}>Đã phát hành</Tag>;
      case 'Work in progress':
        return <Tag color={'#c58b17'}>Đang phát triển</Tag>;
      default:
        break;
    }
  };

  const handleSelectGame = (game) => {
    setSelectedGame(game);
  };

  return (
    <div className="home_container">
      <div className="content">
        <Row>
          <Col span={24}>
            <div className="game_list">
              <Splide
                options={{
                  width: '100%',
                  autoWidth: true,
                  padding: '1rem',
                  pagination: false,
                  wheel: true,
                  waitForTransition: true,
                }}
              >
                {games.map((game) => (
                  <SplideSlide key={game.id}>
                    <GameCard
                      game={game}
                      isActive={game.id === selectedGame?.id}
                      onClick={handleSelectGame}
                    />
                  </SplideSlide>
                ))}
              </Splide>
            </div>
          </Col>
        </Row>
        <Row>
          <Col
            xs={{ span: 22 }}
            sm={{ span: 20 }}
            lg={{ span: 14 }}
            xl={{ span: 12 }}
            xxl={{ span: 8 }}
          >
            {selectedGame && (
              <div className="game_detail">
                <div className="game_status">
                  {renderTag(selectedGame.status)}
                </div>
                <h1>{selectedGame.name}</h1>
                <div>
                  {selectedGame.status === 'Published' ? (
                    <Link to={`/game/${selectedGame.id}`}>
                      <Button
                        type="primary"
                        shape="round"
                        icon={<CaretRightOutlined />}
                      >
                        Start
                      </Button>
                    </Link>
                  ) : null}
                </div>
                <p>{selectedGame.description}</p>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
