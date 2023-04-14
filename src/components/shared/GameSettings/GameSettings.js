import React, { useEffect, useState } from 'react';
import { Modal, Col, Slider, Divider, Space, Row, Form } from 'antd';
import './GameSettings.scss';
import { SettingFilled } from '@ant-design/icons';
import { MenuButton } from '../Button';

const GameSettings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [setting, setSetting] = useState({
    textSpeed: 50,
    music: 100,
    sFX: 100,
    voice: 100,
  });

  useEffect(() => {
    loadSetting();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onFinish = (value) => {
    localStorage.setItem('setting', JSON.stringify(value));
  };
  const handleSummit = () => {
    form.submit();
    setIsModalOpen(false);
  };

  const loadSetting = () => {
    if (localStorage.getItem('setting') != null) {
      setSetting(JSON.parse(localStorage.getItem('setting')));
    }
  };

  return (
    <>
      <MenuButton onClick={showModal}>Cài đặt</MenuButton>
      <Modal
        centered
        open={isModalOpen}
        bodyStyle={{ height: 320 }}
        footer={[
          <MenuButton key={'ok'} onClick={handleSummit}>
            Xong
          </MenuButton>,
        ]}
      >
        <div className="modal-container">
          <Form initialValues={setting} onFinish={onFinish} form={form}>
            <Col span={24}>
              <h1 className="title">
                <SettingFilled /> Cài Đặt <SettingFilled />
              </h1>
              <div className="center">
                <Space split={<Divider type="vertical" className="split" />}>
                  <MenuButton>Âm Thanh</MenuButton>
                </Space>
              </div>
            </Col>
            <Row>
              <Col span={24}>
                <Row align="middle">
                  <Col className="options" span={6}>
                    Nhạc nền
                  </Col>
                  <Col className="options" span={18}>
                    <Form.Item className="slider" name="music">
                      <Slider />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row align="middle">
                  <Col className="options" span={6}>
                    Âm Thanh
                  </Col>
                  <Col className="options" span={18}>
                    <Form.Item className="slider" name="sFX">
                      <Slider />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row align="middle">
                  <Col className="options" span={6}>
                    Giọng nói
                  </Col>
                  <Col className="options" span={18}>
                    <Form.Item className="slider" name="voice">
                      <Slider />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <div className="center">
                  <Space split={<Divider type="vertical" className="split" />}>
                    <MenuButton>Chữ</MenuButton>
                  </Space>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Row align="middle">
                  <Col className="options" span={6}>
                    Tốc độ chữ
                  </Col>
                  <Col className="options" span={18}>
                    <Form.Item className="slider" name="textSpeed">
                      <Slider min={1} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default GameSettings;
