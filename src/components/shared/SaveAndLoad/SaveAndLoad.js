import React, { useState } from 'react';
import { Modal, Col, Row } from 'antd';
import { MenuButton } from '../Button';
import { DeleteOutlined } from '@ant-design/icons';

import "./SaveAndLoad.scss";

const saveSlot = [1, 2, 3, 4, 5];
function SaveAndLoad({onLoad, onSave, type }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        {saveSlot.map(i => (
          <Row key={i} align="middle" onClick={() => handleClickSaveSlot(`slot${i}`)}>
            <Col span={6}>

            </Col>
            <Col span={16}>
              <Row className="text">
                Save Slot {i}
              </Row>
              <Row className="text">
                00:00 | DD/MM/YYYY
              </Row>
            </Col>
            <Col span={2}>
              <MenuButton> <DeleteOutlined /> </MenuButton>
            </Col>
          </Row>
        ))}
      </Modal>
    </>
  );
}
export default SaveAndLoad;