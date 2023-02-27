import { Col, Divider, Form, Image, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  backgroundsState,
  charactersState,
  currentEditedSceneState,
  scenesState,
} from '../../../../routes/store';
import { defaultImage } from '../../../../services/util';
import { EVENT_TYPES } from '../../gameEditor.util';

import './GameEventForm.scss';
const { Option } = Select;

const GameEventForm = ({ form }) => {
  const backgrounds = useRecoilValue(backgroundsState);
  const characters = useRecoilValue(charactersState);
  const scenes = useRecoilValue(scenesState);
  const currentScene = useRecoilValue(currentEditedSceneState);
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
    </>
  );
};

export default GameEventForm;
