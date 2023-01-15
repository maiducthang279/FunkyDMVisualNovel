import { Col, Row } from 'antd';
import React from 'react';
import './GamePage.scss';

import logo from '../../assets/images/zyro-image.png';
import { MenuButton } from '../shared/Button';
import { useNavigate } from 'react-router-dom';
import GameSettings from '../shared/GameSettings/GameSettings.js';

const GamePage = () => {
  const navigate = useNavigate();
  const startGame = () => {
    navigate('/game/gameplay');
  };
  return (
    <div>
      <div className="background">
        <img
          src="https://cdnb.artstation.com/p/assets/images/images/052/085/069/large/nils-firas-living-room-render-v001.jpg?1658914986"
          alt="main page"
        ></img>
      </div>
      <div>
        <div className="menu_container">
          <div className="menu">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <img className="logo" src={logo} alt="logo"></img>
              </Col>
              <Col span={24}>
                <h1 className="title">Mèo Hàng Xóm</h1>
              </Col>
              <Col span={24}>
                <MenuButton>Tiếp tục</MenuButton>
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
            </Row>
          </div>
          <div className="background-gradient" span={''}></div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
