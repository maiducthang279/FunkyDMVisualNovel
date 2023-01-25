import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space, Table, TableColumnsType } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers } from '.';
import AdminEditUser from './AdminEditUser';

const AdminUserTable = () => {
  const columns = [
    {
      title: '',
      dataIndex: 'photoURL',
      key: 'photoURL',
      width: '48px',
      render: (_, record) =>
        record.photoURL ? (
          <Avatar size={'small'} src={record.photoURL} />
        ) : (
          <Avatar size={'small'} icon={<UserOutlined />} />
        ),
    },
    {
      title: 'Display name',
      dataIndex: 'displayName',
      key: 'displayName',
    },
    {
      title: 'Permission',
      dataIndex: 'permission',
      key: 'permission',
      sorter: (a, b) => a.permission.localeCompare(b.permission),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <AdminEditUser
            id={record.id}
            defaultPermission={record.permission}
            onChange={handleRoleChange}
            disabled={record.permission === 'admin'}
          ></AdminEditUser>
          <Link to={`/profile/${record.id}`}>Profile</Link>
        </Space>
      ),
    },
  ];
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then((result) => {
      setUsers(result.map((item) => ({ key: item.id, ...item })));
    });
  }, []);

  const handleRoleChange = (id, permission) => {
    setUsers([
      ...users.map((user) => (user.id === id ? { ...user, permission } : user)),
    ]);
  };
  return <Table columns={columns} dataSource={users} />;
};

export default AdminUserTable;
