import { DeleteOutlined } from '@ant-design/icons';
import { Input, Modal, Form, Button } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteGame } from '.';

const GameDelete = ({ id, title, onSuccess = () => void 0 }) => {
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
    deleteGame(id)
      .then(() => {
        onSuccess(id);
      })
      .finally(() => {
        setIsModalOpen(false);
      });
  };

  return (
    <>
      <Link to={`#`} onClick={showModal}>
        <Button type="link" icon={<DeleteOutlined />}>
          Delete
        </Button>
      </Link>
      <Modal
        title="Delete game"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="project"
          layout="vertical"
          form={form}
          onFinish={handleFinish}
        >
          <Form.Item
            label={`Input game's title (${title}) to confirm deletion`}
            name="title"
            rules={[
              { required: true, message: 'Please input the title!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('title') === title) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Wrong title!'));
                },
              }),
            ]}
          >
            <Input placeholder="Title" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default GameDelete;
