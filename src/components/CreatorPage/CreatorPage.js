import { Button, Card, Col, Form, Input, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { addProject, getProjects } from '.';
import { userState } from '../../routes/store';
import ProjectTable from './ProjectTable';

const CreateNewProject = ({ onChange }) => {
  const [user] = useRecoilState(userState);
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
    const newProject = { ...values, creator: user.uid, members: [user.uid] };
    addProject(newProject).then((result) => {
      onChange(result.id, newProject);
      setIsModalOpen(false);
    });
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create new project
      </Button>
      <Modal
        title="Edit"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="createNewProject"
          layout="vertical"
          form={form}
          onFinish={handleFinish}
        >
          <Form.Item label={`Name`} name="name" initialValue={'New project'}>
            <Input placeholder="Input new project name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const CreatorPage = () => {
  const [user] = useRecoilState(userState);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (user) {
      getProjects(user.uid).then((result) => {
        setProjects(result.map((item) => ({ key: item.id, ...item })));
      });
    }
  }, [user]);

  const handleCreateNewProject = (id, project) => {
    setProjects((prevProjects) => [
      { key: id, id, ...project },
      ...prevProjects,
    ]);
  };

  const handleDeleteProject = (id) => {
    setProjects((prevProjects) =>
      prevProjects.filter((item) => item.id !== id)
    );
  };
  return (
    <Row>
      <Col
        xs={{ span: 22, offset: 1 }}
        sm={{ span: 20, offset: 2 }}
        lg={{ span: 18, offset: 3 }}
        xl={{ span: 18, offset: 3 }}
        xxl={{ span: 16, offset: 4 }}
      >
        <Card title="Project management">
          <Row justify={'end'}>
            <CreateNewProject
              onChange={handleCreateNewProject}
            ></CreateNewProject>
          </Row>
          <br />
          <ProjectTable
            projects={projects}
            onDeleteSuccess={handleDeleteProject}
          ></ProjectTable>
        </Card>
      </Col>
    </Row>
  );
};

export default CreatorPage;
