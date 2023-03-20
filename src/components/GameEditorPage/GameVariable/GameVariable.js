import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Modal, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { editGameVariable } from '..';
import { currentEditedGameState, variablesState } from '../../../routes/store';
import uniqid from 'uniqid';
import './GameVariable.scss';

const GameValiableOptions = [{ value: 'string', label: 'String' }];

const VariableItem = ({
  variable,
  deleteModal,
  showModal,
  updateCurrentValue,
}) => {
  const [variables] = useRecoilState(variablesState);
  const [current, setCurrent] = useState('');
  useEffect(() => {
    const curVar = variables.filter(({ id }) => id === variable.id);
    setCurrent(
      curVar.current || curVar.default || variable.current || variable.default
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables]);
  const handleOnBlur = (event) => {
    updateCurrentValue(variable.id, event.target.value);
  };
  const onChange = (event) => {
    setCurrent(event.target.value);
  };
  return (
    <div className="variable_item">
      <Row className="variable_item_header" gutter={[8, 8]} align="middle">
        <Col flex={'auto'}>
          <p>
            <b>{variable.name}</b>
          </p>
        </Col>
        <Col>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteModal(variable)}
          >
            Delete
          </Button>
        </Col>
        <Col>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(variable)}
          >
            Edit
          </Button>
        </Col>
      </Row>
      <Row className="variable_item_input" gutter={[8, 8]} align="middle">
        <Col span={12}>
          <label>Default value</label>
          <Input value={variable.default} readOnly disabled />
        </Col>
        <Col span={12}>
          <label>Current value</label>
          <Input
            placeholder="Current value"
            defaultValue={variable.current || variable.default}
            value={current}
            onBlur={handleOnBlur}
            onChange={onChange}
          />
        </Col>
      </Row>
    </div>
  );
};

const GameVariable = () => {
  const game = useRecoilValue(currentEditedGameState);
  const [variables, setVariables] = useRecoilState(variablesState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const updateCurrentValue = (variableId, current) => {
    const newVariables = variables.map((variable) =>
      variable.id === variableId ? { ...variable, current } : variable
    );
    setVariables(newVariables);
    localStorage.setItem(
      `edit-variable-${game.id}`,
      JSON.stringify(newVariables)
    );
  };

  const showModal = (selectedVariable) => {
    if (selectedVariable != null) {
      const { current, ...rest } = selectedVariable;
      form.setFieldsValue({
        ...rest,
      });
    } else {
      form.setFieldsValue({
        id: null,
        type: 'string',
        name: '',
        default: '',
      });
    }
    setIsModalOpen(true);
  };

  const deleteModal = (selectedVariable) => {
    const newVariables = variables.filter(
      (item) => item.id !== selectedVariable.id
    );
    const currentEditGameVariables = JSON.parse(
      localStorage.getItem(`edit-variable-${game.id}`)
    );
    editGameVariable(
      game.id,
      newVariables.map(({ current, ...rest }) => rest)
    ).then(() => {
      setVariables(newVariables);
      if (currentEditGameVariables) {
        localStorage.setItem(
          `edit-variable-${game.id}`,
          JSON.stringify(
            currentEditGameVariables.filter(
              (item) => item.id !== selectedVariable.id
            )
          )
        );
      }
    });
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    let newVariables = [];
    if (values.id != null) {
      newVariables = variables.map((variable) =>
        variable.id === values.id ? { ...variable, ...values } : variable
      );
    } else {
      newVariables = [...variables, { ...values, id: uniqid() }];
    }
    editGameVariable(
      game.id,
      newVariables.map(({ current, ...rest }) => rest)
    ).then(() => {
      setVariables(newVariables);
      setIsModalOpen(false);
    });
  };

  return (
    <div className="game_variables">
      <Button block icon={<PlusOutlined />} onClick={() => showModal()}>
        Add Variable
      </Button>
      <Divider></Divider>
      <div>
        {variables?.map((variable) => (
          <VariableItem
            key={variable.id}
            variable={variable}
            showModal={showModal}
            deleteModal={deleteModal}
            updateCurrentValue={updateCurrentValue}
          />
        ))}
      </div>
      <Modal
        title="Add variable"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form name="variable" layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item name={'id'} hidden>
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Type"
            name={'type'}
            rules={[{ required: true, message: 'Can not be empty!' }]}
          >
            <Select placeholder="Type" options={GameValiableOptions}></Select>
          </Form.Item>
          <Form.Item
            label="Name"
            name={'name'}
            rules={[
              { required: true, message: 'Can not be empty!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!variables || variables.length === 0) {
                    return Promise.resolve();
                  }
                  if (
                    !variables.some(
                      ({ name, id }) =>
                        name === value && getFieldValue('id') !== id
                    )
                  ) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject('This name was used!');
                  }
                },
              }),
            ]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Default value"
            name={'default'}
            rules={[{ required: true, message: 'Can not be empty!' }]}
          >
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GameVariable;
