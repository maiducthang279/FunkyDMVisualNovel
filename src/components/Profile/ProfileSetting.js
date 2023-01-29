import { MailOutlined, UserOutlined } from '@ant-design/icons';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../../routes/store';
import {
  getUserData,
  updateUserProfile,
} from '../../services/firebaseServices';
import UploadImage from '../shared/UploadImage/UploadImage';
import './Profile.scss';

const { Text } = Typography;

const ProfileSetting = () => {
  const [user, setUser] = useRecoilState(userState);
  const [profile, setProfile] = useState(null);
  const [form] = Form.useForm();
  const photoUrl = Form.useWatch('photoURL', form);

  const [submitIsDisable, setSubmitIsDisable] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      getUserData(user?.uid).then((result) => {
        if (result.exists()) {
          setProfile(result?.data());
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (!!profile) {
      setSubmitIsDisable(true);
    }
  }, [profile]);

  const handleChange = () => {
    const currentValue_JSON = JSON.stringify(form.getFieldsValue());
    const formData_JSON = JSON.stringify(profile);

    if (currentValue_JSON !== formData_JSON) {
      setSubmitIsDisable(false);
    } else {
      setSubmitIsDisable(true);
    }
  };

  if (!profile) {
    return null;
  }

  const handleAvaterChange = (url) => {
    form.setFieldValue('photoURL', url);
  };

  const onFinish = (values) => {
    setUpdating(true);
    setIsUpdated(false);
    updateUserProfile(values)
      .then(() => {
        setIsUpdated(true);
        setProfile(values);
        setUser({ ...user, ...values });
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <Row className="profile_container">
      <Col
        xs={{ span: 22, offset: 1 }}
        sm={{ span: 18, offset: 3 }}
        lg={{ span: 12, offset: 6 }}
        xl={{ span: 8, offset: 8 }}
      >
        <Card>
          <Form
            name="updateProfile"
            form={form}
            initialValues={profile}
            onFinish={onFinish}
            onChange={handleChange}
            onReset={() => {
              setSubmitIsDisable(true);
              setIsUpdated(false);
            }}
          >
            <Row gutter={[16, 16]}>
              {isUpdated && (
                <Col span={24}>
                  <Alert
                    message={'Profile update successful!'}
                    type="success"
                  />
                </Col>
              )}
              <Col xs={24} sm={8} lg={6} xl={6}>
                <Row justify="center">
                  <UploadImage
                    onChange={handleAvaterChange}
                    previewImageStyle={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                    }}
                    initialValue={photoUrl}
                  >
                    <div className="upload_avatar">
                      {profile.photoURL ? (
                        <Avatar size={98} src={photoUrl} />
                      ) : (
                        <Avatar size={98} icon={<UserOutlined />} />
                      )}
                      <div className="upload_avatar_hover">
                        <Text type="secondary">Change avatar</Text>
                      </div>
                    </div>
                  </UploadImage>
                </Row>
                <Form.Item name="photoURL" hidden>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={16} lg={18} xl={18}>
                <Form.Item name="email">
                  <Input prefix={<MailOutlined />} readOnly disabled />
                </Form.Item>
                <Form.Item
                  name="displayName"
                  rules={[
                    { required: true, message: 'Please input the content!' },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Display name" />
                </Form.Item>
                <Form.Item
                  name="description"
                  rules={[
                    {
                      max: 100,
                      message:
                        'Description length should less than 100 characters',
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Description"
                    maxLength={100}
                  />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={updating || submitIsDisable}
                    >
                      Save
                    </Button>
                    <Button htmlType="reset">Reset</Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfileSetting;
