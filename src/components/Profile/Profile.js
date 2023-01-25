import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoaderData, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../../routes/store';
import Header from '../shared/Header';

import './Profile.scss';

const { Text, Title, Paragraph } = Typography;

const Profile = () => {
  const { userId } = useParams();
  const [currentUser] = useRecoilState(userState);
  const profileLoaderData = useLoaderData();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile(userId ? profileLoaderData : currentUser);
  }, [currentUser, profileLoaderData, userId]);

  if (!profile) {
    return <></>;
  }
  return (
    <Row className="profile_container">
      <Col
        xs={{ span: 22, offset: 1 }}
        sm={{ span: 20, offset: 2 }}
        lg={{ span: 18, offset: 3 }}
        xl={{ span: 18, offset: 3 }}
        xxl={{ span: 16, offset: 4 }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              {(currentUser?.uid === userId ||
                currentUser?.uid === profile.uid) && (
                <Row justify="end">
                  <Space>
                    <Link to={'/profile/settings'}>
                      <Button shape="circle" icon={<SettingOutlined />} />
                    </Link>
                  </Space>
                </Row>
              )}
              <Row>
                <Col
                  span={24}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Row justify="center">
                    {profile.photoURL ? (
                      <Avatar size={98} src={profile.photoURL} />
                    ) : (
                      <Avatar size={98} icon={<UserOutlined />} />
                    )}
                  </Row>
                </Col>
                <Col span={24}>
                  <Title level={2} style={{ textAlign: 'center', margin: 0 }}>
                    {profile.displayName}
                  </Title>
                </Col>
                <Divider type="horizontal"></Divider>
                <Col span={24}>
                  <Paragraph
                    ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}
                  >
                    <Text>{profile.description}</Text>
                  </Paragraph>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Profile;
