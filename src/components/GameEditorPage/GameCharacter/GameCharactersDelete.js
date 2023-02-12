import { DeleteOutlined } from '@ant-design/icons';
import { Input, Modal, Form, Button } from 'antd';
import React, { useState } from 'react';
import { deleteCharacter } from '.';

const GameCharacterDelete = ({ id, name, onSuccess = () => void 0 }) => {
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
    deleteCharacter(id)
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
      >
        Delete
      </Button>
      <Modal
        title="Delete character"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="character"
          layout="vertical"
          form={form}
          onFinish={handleFinish}
        >
          <Form.Item
            label={`Input character's name (${name}) to confirm deletion`}
            name="name"
            rules={[
              { required: true, message: 'Please input the title!' },
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

export default GameCharacterDelete;
