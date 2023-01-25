import { DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';
import { useState } from 'react';

const ConfirmDelete = ({ message, onConfirmed, disabled = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    onConfirmed();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="link" onClick={showModal} disabled={disabled}>
        <DeleteOutlined /> Delete
      </Button>
      <Modal
        title="Delete"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Typography.Text>{message}</Typography.Text>
      </Modal>
    </>
  );
};

export default ConfirmDelete;
