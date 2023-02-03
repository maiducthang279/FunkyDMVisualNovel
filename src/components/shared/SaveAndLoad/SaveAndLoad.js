import React, { useEffect, useState } from 'react';
import { Modal, Col, Row } from 'antd';
import { MenuButton } from '../Button';
import { DeleteOutlined } from '@ant-design/icons';

import "./SaveAndLoad.scss";

function SaveAndLoad({ onLoad, onSave, type }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [saveData, setSaveData] = useState([]);

  useEffect(() => {
    loadDataFromLocalStorage();
  }, []);

  const loadDataFromLocalStorage = () => {
    setSaveData([1, 2, 3, 4, 5, 6, 7].map(i => {
      const saveSlotData = localStorage.getItem(i)
      return (saveSlotData ? JSON.parse(saveSlotData) : null)
    }))
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClickSaveSlot = (slot) => {
    if (onSave && type === "Save") {
      onSave(slot);
      loadDataFromLocalStorage();
    }
    if (onLoad && type === "Load") {
      onLoad(slot);
    }
  }

  return (
    <>
      {
        (type === "Load") ?
          <MenuButton onClick={showModal}>Tiếp tục</MenuButton> :
          <MenuButton onClick={showModal}>Lưu</MenuButton>
      }
      <Modal
        centered
        width={800}
        bodyStyle={{ height: 500, overflowY: 'scroll' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        title={[
          <h1 className="title">
            {(type === "Load") ? "Tiếp tục" : "Lưu"}
          </h1>
        ]}
        footer={[
          <MenuButton key={'ok'} onClick={handleCancel}>
            Quay Lại
          </MenuButton>,
        ]}
      >
        {saveData.map((item, index) => (item ?
          (
            <Row className="saveSlot" key={index} align="middle" onClick={() => handleClickSaveSlot(index + 1)}>
              <Col className="screenshot" span={6}>
                <img src={item.background} alt="background"></img>
              </Col>
              <Col span={16}>
                <Row className="text">
                  Save Slot {index + 1}
                </Row>
                <Row className="text">
                  {item.dateTime}
                </Row>
              </Col>
              <Col span={2}>
                <MenuButton> <DeleteOutlined /> </MenuButton>
              </Col>
            </Row>
          ) :
          (
            <Row className="saveSlot" key={index} align="middle" onClick={() => handleClickSaveSlot(index + 1)}>
              <Col className="screenshot" span={6}>
                <div className="emtpy_screenshot">
                  Empty Slot
                </div>
              </Col>
              <Col span={16}>
                <Row className="text">
                  Save Slot {index + 1}
                </Row>
                <Row className="text">
                  Empty Slot
                </Row>
              </Col>
              <Col span={2}>
                <MenuButton> <DeleteOutlined /> </MenuButton>
              </Col>
            </Row>
          )
        ))}
      </Modal>
    </>
  );
}
export default SaveAndLoad;