import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import React, { useState } from 'react';
import { deleteScene } from '.';
import './GameScenes.scss';

const GameScenesDelete = ({ id, name, onSuccess = () => void 0 }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleFinish = () => {
    deleteScene(id)
      .then(() => {
        onSuccess(id);
      })
      .finally(() => {
        setIsModalOpen(false);
      });
  };

  return (
    <>
      <Button
        type="link"
        danger
        size="small"
        icon={<DeleteOutlined />}
        onClick={showModal}
      ></Button>
      <Modal
        title="Delete scene"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="scene"
          layout="vertical"
          form={form}
          onFinish={handleFinish}
        >
          <Form.Item
            label={`Input scene's name (${name}) to confirm deletion`}
            name="name"
            rules={[
              { required: true, message: 'Please input the name!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('name') === name) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Wrong name!'));
                },
              }),
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default GameScenesDelete;
