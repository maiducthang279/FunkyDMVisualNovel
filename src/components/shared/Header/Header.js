import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Popover, Row, Space } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { permissionState, userState } from '../../../routes/store';
import { logout } from '../../../services/firebaseServices';

import './Header.scss';

const UserPopoverContent = () => {
  const [permission] = useRecoilState(permissionState);
  return (
    <Space direction="vertical">
      <Link to={'/profile'}>Profile</Link>
      {['moderator', 'admin'].includes(permission) && (
        <Link to={'/management'}>Management</Link>
      )}
      <Link
        to={'#'}
        onClick={() => {
          logout();
        }}
      >
        Logout
      </Link>
    </Space>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const [user] = useRecoilState(userState);
  const [permission] = useRecoilState(permissionState);
  const goHome = () => {
    navigate('/');
  };
  const renderUserMenu = () => {
    if (!user) {
      return (
        <Row justify={'end'} align="middle">
          <Col>
            <Link to={`/login`}>
              <Button shape="round" icon={<UserOutlined />}>
                Login
              </Button>
            </Link>
          </Col>
        </Row>
      );
    }
    return (
      <Row justify={'space-between'} align="middle">
        <Col>
          <Space>
            {['creator', 'moderator', 'admin'].includes(permission) && (
              <Link to={`/creator`}>
                <Button type="default" ghost>
                  <EditOutlined /> For Creator
                </Button>
              </Link>
            )}
          </Space>
        </Col>
        <Col>
          <Popover
            placement="bottomRight"
            content={<UserPopoverContent />}
            trigger="click"
            arrowPointAtCenter
          >
            {user.photoURL ? (
              <Avatar src={user.photoURL} />
            ) : (
              <Avatar icon={<UserOutlined />} />
            )}
          </Popover>
        </Col>
      </Row>
    );
  };
  return (
    <Row className="header" align="middle" gutter={16}>
      <Col className="logo" onClick={goHome}>
        <h1>Visual Novel</h1>
      </Col>
      <Col className="user_profile" flex={'1'}>
        {renderUserMenu()}
      </Col>
    </Row>
  );
};

export default Header;
