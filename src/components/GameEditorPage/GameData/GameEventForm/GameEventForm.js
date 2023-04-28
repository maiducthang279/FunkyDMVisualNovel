import {
  Button,
  Col,
  Divider,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
} from 'antd';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { useRecoilValue } from 'recoil';
import {
  backgroundsState,
  charactersState,
  currentEditedSceneState,
  scenesState,
  variablesState,
} from '../../../../routes/store';
import { defaultImage } from '../../../../services/util';
import { EVENT_TYPES } from '../../gameEditor.util';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import './GameEventForm.scss';
const { Option } = Select;

const GameEventForm = ({ form, nextNodeOptions }) => {
  const backgrounds = useRecoilValue(backgroundsState);
  const characters = useRecoilValue(charactersState);
  const scenes = useRecoilValue(scenesState);
  const currentScene = useRecoilValue(currentEditedSceneState);
  const variables = useRecoilValue(variablesState);
  const eventType = Form.useWatch('eventType', form);
  const characterId = Form.useWatch(['params', 'characterId'], form);

  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    if (characterId) {
      const currentSelected = characters?.find(({ id }) => id === characterId);
      if (currentSelected) {
        const currentImageUrl = form.getFieldValue([
          'params',
          'characterImage',
        ]);
        if (
          !currentSelected.images.some((image) => image.url === currentImageUrl)
        ) {
          form.setFieldValue(
            ['params', 'characterImage'],
            currentSelected.images[0]?.url
              ? currentSelected.images[0]?.url
              : undefined
          );
        }
      }
      setSelectedCharacter(characters?.find(({ id }) => id === characterId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characters, characterId]);
  const renderForm = () => {
    switch (eventType) {
      case 'Set Background':
        return (
          <Form.Item
            name={['params', 'backgroundUrl']}
            rules={[{ required: true, message: 'Can not be empty!' }]}
          >
            <Select placeholder="Background" onChange={() => form.submit()}>
              {backgrounds.map((background) => (
                <Option
                  value={background.url}
                  label={background.name}
                  key={background.id}
                >
                  <Row gutter={[6, 6]}>
                    <Col span={12}>
                      <Image
                        width={'100%'}
                        height={'6rem'}
                        style={{ objectFit: 'cover' }}
                        preview={false}
                        src={background.url}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = defaultImage;
                        }}
                      />
                    </Col>
                    <Col>{background.name}</Col>
                  </Row>
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      case 'Remove Background':
        return (
          <>
            <Form.Item
              name={['params', 'effect']}
              rules={[{ required: true, message: 'Can not be empty!' }]}
            >
              <Select
                placeholder="Effect"
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'fade', label: 'Fade' },
                ]}
                onChange={() => form.submit()}
              ></Select>
            </Form.Item>
          </>
        );
      case 'Set Character':
        return (
          <>
            <Form.Item
              name={['params', 'characterId']}
              rules={[{ required: true, message: 'Can not be empty!' }]}
            >
              <Select placeholder="Character" onChange={() => form.submit()}>
                {characters.map((character) => (
                  <Option
                    value={character.id}
                    label={character.name}
                    key={character.id}
                  >
                    <Row gutter={[6, 6]}>
                      <Col span={6}>
                        <Image
                          width={'100%'}
                          height={'6rem'}
                          style={{ objectFit: 'contain' }}
                          preview={false}
                          src={character.images[0]?.url}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = defaultImage;
                          }}
                        />
                      </Col>
                      <Col>{character.name}</Col>
                    </Row>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {selectedCharacter && (
              <Form.Item
                name={['params', 'characterImage']}
                rules={[{ required: true, message: 'Can not be empty!' }]}
              >
                <Select
                  placeholder="Display image"
                  onChange={() => form.submit()}
                >
                  {selectedCharacter.images.map((image, index) => (
                    <Option value={image.url} label={image.name} key={index}>
                      <Row gutter={[6, 6]}>
                        <Col span={6}>
                          <Image
                            width={'100%'}
                            height={'6rem'}
                            style={{ objectFit: 'contain' }}
                            preview={false}
                            src={image.url}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null;
                              currentTarget.src = defaultImage;
                            }}
                          />
                        </Col>
                        <Col>{image.name}</Col>
                      </Row>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            <Form.Item
              name={['params', 'characterPosition']}
              rules={[{ required: true, message: 'Can not be empty!' }]}
            >
              <Select
                placeholder="Position"
                options={[
                  { value: 'left', label: 'Left' },
                  { value: 'right', label: 'Right' },
                ]}
                onChange={() => form.submit()}
              ></Select>
            </Form.Item>
          </>
        );
      case 'Remove Character':
        return (
          <>
            <Form.Item
              name={['params', 'characterPosition']}
              rules={[{ required: true, message: 'Can not be empty!' }]}
            >
              <Select
                placeholder="Position"
                options={[
                  { value: 'left', label: 'Left' },
                  { value: 'right', label: 'Right' },
                ]}
                onChange={() => form.submit()}
              ></Select>
            </Form.Item>
          </>
        );
      case 'Go to Next Scene':
        return (
          <Form.Item
            name={['params', 'nextSceneId']}
            rules={[{ required: true, message: 'Can not be empty!' }]}
          >
            <Select
              placeholder="Scene"
              options={scenes
                .filter((scene) => scene.id !== currentScene.id)
                .map((scene) => ({
                  value: scene.id,
                  label: scene.name,
                }))}
              onChange={() => form.submit()}
            ></Select>
          </Form.Item>
        );
      case 'End Game':
        return (
          <Form.Item
            name={['params', 'credit']}
            rules={[{ required: true, message: 'Can not be empty!' }]}
          >
            <ReactQuill
              theme="snow"
              onBlur={() => form.submit()}
              modules={{
                toolbar: [
                  [{ header: [] }, { font: [] }],
                  [{ size: [] }],
                  ['bold', 'italic', 'underline'],
                  [
                    { list: 'ordered' },
                    { list: 'bullet' },
                    { indent: '-1' },
                    { indent: '+1' },
                  ],
                  ['link', 'image'],
                  ['clean'],
                  [
                    { align: '' },
                    { align: 'center' },
                    { align: 'right' },
                    { align: 'justify' },
                  ],
                ],
              }}
              formats={[
                'header',
                'font',
                'size',
                'color',
                'bold',
                'italic',
                'underline',
                'list',
                'bullet',
                'indent',
                'link',
                'image',
                'align',
              ]}
            />
          </Form.Item>
        );
      case 'Store Variable':
        return (
          <>
            <Form.Item
              name={['params', 'variableId']}
              rules={[{ required: true, message: 'Can not be empty!' }]}
            >
              <Select
                placeholder="Variable"
                options={variables.map((variable) => ({
                  value: variable.id,
                  label: variable.name,
                }))}
                onChange={() => form.submit()}
              ></Select>
            </Form.Item>
            <Form.Item
              name={['params', 'value']}
              rules={[{ required: true, message: 'Can not be empty!' }]}
            >
              <Input placeholder="Value" onChange={() => form.submit()}></Input>
            </Form.Item>
          </>
        );
      case 'Check Variable':
        return (
          <>
            <Form.Item
              name={['params', 'variableId']}
              rules={[{ required: true, message: 'Can not be empty!' }]}
            >
              <Select
                placeholder="Variable"
                options={variables.map((variable) => ({
                  value: variable.id,
                  label: variable.name,
                }))}
                onChange={() => form.submit()}
              ></Select>
            </Form.Item>
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
                        <Form.Item
                          {...restField}
                          name={[name, 'operator']}
                          rules={[
                            { required: true, message: 'Can not be empty!' },
                          ]}
                        >
                          <Select
                            placeholder="Operator"
                            options={[
                              {
                                value: 'equal',
                                label: '=',
                              },
                              {
                                value: 'not equal',
                                label: '\u2260',
                              },
                            ]}
                            onChange={() => form.submit()}
                          ></Select>
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'value']}
                          rules={[
                            { required: true, message: 'Can not be empty!' },
                          ]}
                        >
                          <Input
                            placeholder="Value"
                            onBlur={() => form.submit()}
                            onPressEnter={() => form.submit()}
                          ></Input>
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'nextId']}>
                          <Select
                            showSearch
                            placeholder="Node"
                            options={nextNodeOptions}
                            onChange={() => form.submit()}
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
          </>
        );
      default:
        return null;
    }
  };
  return (
    <>
      <Divider>Event Type</Divider>
      <Form.Item name={'eventType'}>
        <Select
          showSearch
          placeholder="Event"
          options={EVENT_TYPES}
          rules={[{ required: true, message: 'Can not be empty!' }]}
          onChange={() => form.submit()}
        ></Select>
      </Form.Item>
      {renderForm()}
      {eventType !== 'Check Variable' && (
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
              onChange={() => form.submit()}
            ></Select>
          </Form.Item>
        </>
      )}
    </>
  );
};

export default GameEventForm;
