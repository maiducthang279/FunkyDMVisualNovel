import { PlusOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { addNewGame, inviteMember } from '.';
import { userState } from '../../routes/store';
import GameTable from './GameTable';

const CreateNewGame = ({ projectId, onChange }) => {
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
    const newGame = { ...values, projectId };
    addNewGame(newGame).then((result) => {
      onChange(result.id, newGame);
      setIsModalOpen(false);
    });
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create new game
      </Button>
      <Modal
        title="Edit"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="createNewGame"
          layout="vertical"
          form={form}
          onFinish={handleFinish}
        >
          <Form.Item label={`Name`} name="name" initialValue={'New game'}>
            <Input placeholder="Input new game name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const ProjectPage = () => {
  const project = useLoaderData();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userState);
  const [invitedId, setInvitedId] = useState('');
  const [members, setMembers] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (!!currentUser) {
      if (!project.memberIds.includes(currentUser.uid)) {
        navigate('/');
      } else {
        setMembers(project.members || []);
        setGames(project.games || []);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  const invite = () => {
    if (invitedId?.length > 0) {
      inviteMember(project.id, members, invitedId)
        .then((result) => {
          setMembers((prevMembers) => [...prevMembers, result]);
        })
        .catch(() => {
          alert('Wrong ID!');
        });
    }
  };

  const handleCreateNewGame = (id, game) => {
    setGames((prevProjects) => [{ key: id, id, ...game }, ...prevProjects]);
  };

  const handleDeleteGame = (id) => {
    setGames((prevGames) => prevGames.filter((item) => item.id !== id));
  };

  return (
    <Row className="project_container">
      <Col
        xs={{ span: 22, offset: 1 }}
        sm={{ span: 20, offset: 2 }}
        lg={{ span: 18, offset: 3 }}
        xl={{ span: 18, offset: 3 }}
        xxl={{ span: 16, offset: 4 }}
      >
        <Card title={project.name}>
          <div>
            <Space align="center">
              <p>
                <b>Creator: </b>
              </p>
              <Avatar.Group>
                <Tooltip title={project.creator.displayName}>
                  <Avatar src={project.creator.photoURL}></Avatar>
                </Tooltip>
              </Avatar.Group>
            </Space>
          </div>
          <div>
            <Space align="center">
              <p>
                <b>Member: </b>
              </p>
              <Avatar.Group>
                {members.map((member) => (
                  <Tooltip title={member.displayName} key={member.id}>
                    <Avatar src={member.photoURL}></Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </Space>
          </div>
          {project.creator.id === currentUser.uid && (
            <>
              <Divider />
              <div>
                <Input.Group compact>
                  <Input
                    addonBefore="ID:"
                    style={{ width: 'calc(100% - 200px)' }}
                    placeholder="User Id"
                    value={invitedId}
                    onChange={({ target }) => setInvitedId(target.value)}
                  />
                  <Button
                    style={{ width: '200px' }}
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => invite()}
                  >
                    Invite
                  </Button>
                </Input.Group>
              </div>
            </>
          )}
          <Divider />
          <Row justify={'end'}>
            <CreateNewGame
              projectId={project.id}
              onChange={handleCreateNewGame}
            ></CreateNewGame>
          </Row>
          <br />
          <div>
            <GameTable
              project={project}
              games={games}
              onDeleteSuccess={handleDeleteGame}
            ></GameTable>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ProjectPage;
