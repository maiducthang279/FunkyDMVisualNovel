import {
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Divider, Form, Input, Row, Select, Space, Tag } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  charactersState,
  currentEditedSceneState,
} from '../../../routes/store';
import { getColor } from '../createTree.util';
import { EVENT_TYPES } from '../gameEditor.util';

import './GameData.scss';
import GameEventForm from './GameEventForm/GameEventForm';

const defaultOptions = [{ value: '', label: 'None' }];

const GameNodeForm = ({ form, node, onFinish }) => {
  const characterIdValue = Form.useWatch('characterId', form);
  const [currentScene] = useRecoilState(currentEditedSceneState);
  const characters = useRecoilValue(charactersState);
  const nextNodeOptions = useMemo(() => {
    return currentScene !== null && node != null
      ? [
          ...defaultOptions,
          ...currentScene.data.nodes
            .filter((item) => item.type !== 'root' && item.id !== node.id)
            .map((item) => ({
              value: item.id,
              label: `${item.name} - ${item.type}`,
            })),
        ]
      : [];
  }, [currentScene, node]);
  const characterOptions = useMemo(
    () => [
      ...defaultOptions,
      ...characters.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    ],
    [characters]
  );

  useEffect(() => {
    if (characterIdValue === '') {
      form.setFieldValue('characterName', '');
    } else if (
      characterIdValue != null &&
      form.getFieldValue('characterName') === ''
    ) {
      const newName =
        characters.find(({ id }) => id === characterIdValue)?.name ?? '';
      if (newName !== '') {
        form.setFieldValue('characterName', newName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterIdValue]);

  if (!node) {
    return null;
  }
  return (
    <div className="node_form_container">
      <Form
        name="node"
        layout="vertical"
        onFinish={onFinish}
        initialValues={node}
        autoComplete="off"
        form={form}
      >
        <Tag color={getColor(node.type)}>{node.type}</Tag>
        <br />
        <Form.Item name={'id'} hidden>
          <Input readOnly />
        </Form.Item>
        <Form.Item name={'type'} hidden>
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name={'name'}
          rules={[
            { required: true, message: 'Please input the name!' },
            { max: 150, message: 'Maximum 150 characters' },
          ]}
        >
          <Input
            className="name_input"
            placeholder="Name"
            maxLength={150}
            size="large"
            bordered={false}
            suffix={<EditOutlined />}
            readOnly={node.type === 'root'}
          />
        </Form.Item>
        {['dialog', 'choice'].includes(node.type) && (
          <Form.Item
            name={'content'}
            rules={[{ max: 5000, message: 'Maximum 150 characters' }]}
          >
            <Input.TextArea placeholder="Input content here" autoSize />
          </Form.Item>
        )}
        {node.type === 'dialog' && (
          <>
            <Divider>Character</Divider>
            <Form.Item name={'characterId'}>
              <Select
                showSearch
                placeholder="Character"
                options={characterOptions}
              ></Select>
            </Form.Item>
            <Form.Item name={'characterName'}>
              <Input
                placeholder="Chacracter display name"
                disabled={characterIdValue == null || characterIdValue === ''}
              />
            </Form.Item>
          </>
        )}
        {node.type === 'event' && <GameEventForm form={form} />}
        {node.type === 'choice' && (
          <Form.List name={'options'}>
            {(fields, { add, remove }) => (
              <>
                <Divider orientation="left">Options</Divider>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ width: '100%', marginBottom: '1rem' }}
                    align="start"
                    direction="horizontal"
                  >
                    <div>
                      <Form.Item {...restField} name={[name, 'content']}>
                        <Input.TextArea
                          placeholder="Content"
                          autoSize
                        ></Input.TextArea>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'nextId']}>
                        <Select
                          showSearch
                          placeholder="Node"
                          options={nextNodeOptions}
                        ></Select>
                      </Form.Item>
                    </div>
                    <Button
                      disabled={
                        form.getFieldValue(['options', name, 'nextId']) &&
                        form.getFieldValue(['options', name, 'nextId']) !== ''
                      }
                      onClick={() => remove(name)}
                    >
                      <MinusCircleOutlined />
                    </Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add option
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        )}
        {['dialog', 'root', 'event'].includes(node.type) && (
          <>
            <Divider>Ref</Divider>
            <Form.Item label="Next to" name={'nextId'}>
              <Select
                showSearch
                placeholder="Node"
                style={{ width: '100%' }}
                options={nextNodeOptions}
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.label ?? '').includes(input)
                }
              ></Select>
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
};

export default GameNodeForm;
