import React, { useState } from 'react';
import { Modal, Col, Slider, Divider, Space, Row } from 'antd';
import './GameSettings.scss';
import { SettingFilled } from '@ant-design/icons';
import { MenuButton } from '../Button';

const GameSettings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isText, setIsText] = useState(true);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showText = () => {
    setIsText(false);
  };

  const showSound = () => {
    setIsText(true);
  };

  return (
    <>
      <MenuButton onClick={showModal}>Cài đặt</MenuButton>
      <Modal
        centered
        open={isModalOpen}
        onCancel={handleCancel}
        bodyStyle={{height: 250}}
        footer={[
          <MenuButton key={'ok'} onClick={handleCancel}>
            Xong
          </MenuButton>,
        ]}
      >
        <div className="modal-container">
          <Col span={24}>
            <h1 className="title">
              <SettingFilled /> Cài Đặt <SettingFilled />
            </h1>
            <div className="center">
              <Space split={<Divider type="vertical" className="split" />}>
                <MenuButton onClick={showSound}>Âm Thanh</MenuButton>
                <MenuButton onClick={showText}>Chữ</MenuButton>
              </Space>
            </div>
          </Col>
          {isText ? (
            <Row>
              <Col span={24}>
                <Row align="middle">
                  <Col className="options" span={6}>
                    Nhạc nền
                  </Col>
                  <Col className="options" span={18}>
                    <Slider className="slider" defaultValue={100} />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row align="middle">
                  <Col className="options" span={6}>
                    Âm Thanh
                  </Col>
                  <Col className="options" span={18}>
                    <Slider className="slider" defaultValue={100} />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row align="middle">
                  <Col className="options" span={6}>
                    Giọng nói
                  </Col>
                  <Col className="options" span={18}>
                    <Slider className="slider" defaultValue={100} />
                  </Col>
                </Row>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col span={24}>
                <Row align="middle">
                  <Col className="options" span={6}>
                    Tốc độ chữ
                  </Col>
                  <Col className="options" span={18}>
                    <Slider className="slider" defaultValue={100} />
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </div>
      </Modal>
    </>
  );
};

export default GameSettings;
