import {
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Divider, Form, Input, Row, Select, Space, Tag } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { currentEditedSceneState } from '../../../routes/store';
import { getColor } from '../createTree.util';

import './GameData.scss';

const GameNodeForm = ({ form, node, onFinish }) => {
  const [currentScene] = useRecoilState(currentEditedSceneState);
  const nextNodeOptions = useMemo(() => {
    const actionOptions = [{ value: '', label: 'None' }];

    return currentScene !== null && node != null
      ? [
          ...actionOptions,
          ...currentScene.data.nodes
            .filter((item) => item.type !== 'root' || item.id !== node.id)
            .map((item) => ({
              value: item.id,
              label: `${item.name} - ${item.type}`,
            })),
        ]
      : [];
  }, [currentScene, node]);

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
            hidden={node.type === 'root'}
          >
            <Input.TextArea placeholder="Input content here" autoSize />
          </Form.Item>
        )}

        {['dialog', 'root'].includes(node.type) && (
          <Form.Item label="Next to" name={'nextId'}>
            <Select
              showSearch
              placeholder="Node"
              style={{ width: '100%' }}
              options={nextNodeOptions}
            ></Select>
          </Form.Item>
        )}
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
                          options={nextNodeOptions()}
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
      </Form>
    </div>
  );
};

export default GameNodeForm;
