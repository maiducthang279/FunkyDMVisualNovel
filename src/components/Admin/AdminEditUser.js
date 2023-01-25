import { EditOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Select } from 'antd';
import { doc } from 'firebase/firestore';
import { useState } from 'react';
import { firestore } from '../../services/firebase';
import { updateData } from '../../services/firebaseServices';

const { Option } = Select;

const AdminEditUser = ({
  id,
  defaultPermission,
  onChange,
  disabled = false,
}) => {
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

  const handleFinish = (values) => {
    updateData(doc(firestore, 'users', id), {
      permission: values.permission || '',
    }).then(() => {
      onChange(id, values.permission);
      setIsModalOpen(false);
    });
  };

  return (
    <>
      <Button type="link" onClick={showModal} disabled={disabled}>
        <EditOutlined /> Edit
      </Button>
      <Modal
        title="Edit"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="adminEditUser"
          layout="vertical"
          form={form}
          onFinish={handleFinish}
        >
          <Form.Item
            label={`Role`}
            name="permission"
            initialValue={defaultPermission || 'user'}
          >
            <Select>
              <Option value="moderator">Moderator</Option>
              <Option value="creator">Creator</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminEditUser;
