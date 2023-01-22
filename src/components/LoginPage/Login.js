import {
  GoogleCircleFilled,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Divider, Form, Input, Space } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  createUser,
  login,
  loginWithGoogle,
  resetPasswordEmail,
} from '../../services/firebaseServices';
import './Login.scss';
import { Helmet } from 'react-helmet-async';
import React from 'react';
const Login = () => {
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();
  const [isRegister, setIsRegister] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const onFinish = (values) => {
    if (isRegister) {
      createUser(values.email, values.password, values.displayName)
        .then(() => {
          setIsRegister(false);
          setErrorMessage('');
        })
        .catch(handleError);
    } else {
      login(values.email, values.password)
        .then(() => {
          navigate('/');
        })
        .catch(handleError);
    }
  };
  const handleLoginWithGoogle = () => {
    loginWithGoogle()
      .then(() => {
        navigate('/');
      })
      .catch(handleError);
  };
  const handleResetPassword = () => {
    if (loginForm.getFieldError('email').length === 0) {
      resetPasswordEmail(loginForm.getFieldValue('email'))
        .then(() => {
          setInfoMessage('Password reset email was sent!');
        })
        .catch(handleError);
    }
  };

  const handleError = (error) => {
    switch (error.code) {
      case 'auth/account-exists-with-different-credential':
        setErrorMessage(
          'The email of this account was used in another account!'
        );
        break;
      case 'auth/user-not-found':
        setErrorMessage('User not found!');
        break;
      case 'auth/wrong-password':
        setErrorMessage('Wrong password!');
        break;
      case 'auth/email-already-in-use':
        setErrorMessage('Email already in use!');
        break;
      default:
        setErrorMessage('Sorry! Something wrong!');
        break;
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Diviby Blog</title>
        <meta name="description" content="Login" />
      </Helmet>
      <div className="login_container">
        <Card hoverable>
          <h1 style={{ textAlign: 'center' }}>FunkyDM Visual Novel</h1>
          <Divider type="horizontal"></Divider>
          {infoMessage.length > 0 && (
            <Alert message={infoMessage} type="info" />
          )}
          {errorMessage.length > 0 && (
            <Alert message={errorMessage} type="error" />
          )}
          <div>
            <Form
              name="normal_login"
              className="login-form"
              form={loginForm}
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="Mail"
                />
              </Form.Item>

              {isRegister ? (
                <>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Password!',
                      },
                      {
                        pattern:
                          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z.!@#$%^&*]{8,}$/,
                        message:
                          'Please input at least 8 characters, 1 number, 1 uppercase and 1 lowercase',
                      },
                      {
                        pattern: /^[0-9a-zA-Z.!@#$%^&*]{0,}$/,
                        message: 'Spectial character must be .!@#$%^&*',
                      },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              'The two passwords that you entered do not match!'
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      placeholder="Confirm password"
                    />
                  </Form.Item>
                  <Form.Item
                    name="displayName"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Display Name!',
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="Display Name"
                    />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Password!',
                      },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Link
                      className="login-form-forgot"
                      to="#"
                      onClick={handleResetPassword}
                    >
                      Forgot password
                    </Link>
                  </Form.Item>
                </>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  {isRegister ? 'Register' : 'Log in'}
                </Button>
                Or{' '}
                <Link to="#" onClick={() => setIsRegister(!isRegister)}>{`${
                  isRegister ? 'login' : 'register'
                } now!`}</Link>
              </Form.Item>
            </Form>
          </div>
          <Divider type="horizontal">Login with</Divider>
          <div className="login_with">
            <Space>
              <Button
                shape="circle"
                icon={<GoogleCircleFilled style={{ color: '#DB4437' }} />}
                size="large"
                onClick={handleLoginWithGoogle}
              ></Button>
            </Space>
          </div>
          <Divider type="horizontal"></Divider>
          <div style={{ textAlign: 'center' }}>
            <Link to="/">Back to home</Link>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Login;
