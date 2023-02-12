import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Collapse,
  Divider,
  Image,
  Row,
  Space,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { addNewCharacter, updateCharacter } from '.';
import {
  charactersState,
  currentEditedGameProjectState,
} from '../../../routes/store';
import { defaultImage } from '../../../services/util';
import './GameCharacters.scss';
import GameCharacterDelete from './GameCharactersDelete';
import UploadImage from '../../shared/UploadImage';
import LoadingEffectIcon from '../../shared/LoadingEffectIcon';

const { Panel } = Collapse;
const { Paragraph } = Typography;

const CharacterImage = ({ image, onChange }) => {
  const [currentValue, setCurrentValue] = useState(null);

  useEffect(() => {
    setCurrentValue(image);
  }, [image]);
  const handleChangeImageName = (value) => {
    const newImage = {
      ...currentValue,
      name: value,
    };
    setCurrentValue(newImage);
    onChange && onChange(newImage);
  };
  const handleDeleteImage = () => {
    onChange && onChange(null);
  };
  if (!currentValue) {
    return null;
  }
  return (
    <div className="character_image">
      <div className="title">
        <Paragraph
          editable={{
            onChange: (value) => handleChangeImageName(value),
          }}
        >
          {currentValue.name}
        </Paragraph>
        <Space>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteImage}
          >
            Delete
          </Button>
        </Space>
      </div>
      <div className="image_container">
        <Image
          src={currentValue.url}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = defaultImage;
          }}
        />
      </div>
    </div>
  );
};

const GameCharacters = () => {
  const project = useRecoilValue(currentEditedGameProjectState);
  const [characters, setCharacters] = useRecoilState(charactersState);
  const [isLoading, setIsloading] = useState(false);

  const handleAddChacracter = () => {
    const newCharacter = {
      name: 'Default Name',
      images: [],
      projectId: project.id,
    };
    addNewCharacter(newCharacter).then((result) => {
      setCharacters([{ id: result.id, ...newCharacter }, ...characters]);
    });
  };
  const handleChangeCharacterName = (characterId, value) => {
    setCharacters((prev) =>
      prev.map((item) =>
        item.id === characterId ? { ...item, name: value } : item
      )
    );
  };
  const handleChangeImage = (characterId, index, value) => {
    setCharacters((prev) =>
      prev.map((item) =>
        item.id === characterId
          ? {
              ...item,
              images: item.images
                .map((img, i) => (index === i ? value : img))
                .filter((img) => img != null),
            }
          : item
      )
    );
  };
  const handleAddImage = (characterId, value) => {
    setCharacters((prev) =>
      prev.map((item) =>
        item.id === characterId
          ? {
              ...item,
              images: [
                ...item.images,
                { name: 'Default Name', url: value, projectId: project.id },
              ],
            }
          : item
      )
    );
  };

  const handleSaveCharacter = (characterId) => {
    const updatedCharacter = characters.find(({ id }) => id === characterId);
    if (updatedCharacter && !isLoading) {
      setIsloading(true);
      updateCharacter(characterId, updatedCharacter).finally(() => {
        setIsloading(false);
      });
    }
  };
  const handleDeleteCharacter = (characterId) => {
    setCharacters(characters.filter(({ id }) => id !== characterId));
  };
  return (
    <div className="game_characters">
      <Row justify={'end'}>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddChacracter}
          >
            Add Character
          </Button>
        </Col>
      </Row>
      <br />
      <div>
        <Collapse accordion>
          {characters.map((character) => (
            <Panel header={character.name} key={character.id}>
              <Row justify={'end'}>
                <Space split={<Divider type="vertical" />}>
                  <GameCharacterDelete
                    id={character.id}
                    name={character.name}
                    onSuccess={handleDeleteCharacter}
                  ></GameCharacterDelete>
                  <Button
                    type="link"
                    size="small"
                    icon={
                      <LoadingEffectIcon
                        isLoading={isLoading}
                        icon={<SaveOutlined />}
                      ></LoadingEffectIcon>
                    }
                    onClick={() => handleSaveCharacter(character.id)}
                  >
                    Save
                  </Button>
                </Space>
              </Row>
              <div className="character_name">
                <Paragraph>
                  <b>Name:&nbsp;</b>
                </Paragraph>
                <Paragraph
                  style={{ flexGrow: 1 }}
                  editable={{
                    onChange: (value) =>
                      handleChangeCharacterName(character.id, value),
                  }}
                >
                  {character.name}
                </Paragraph>
              </div>
              <div className="title">
                <p>
                  <b>Images: </b>
                </p>
                <Space>
                  <UploadImage
                    onChange={(value) => handleAddImage(character.id, value)}
                  >
                    <Button type="link" icon={<PlusOutlined />}>
                      Add
                    </Button>
                  </UploadImage>
                </Space>
              </div>
              {character.images.map((image, index) => (
                <CharacterImage
                  image={image}
                  key={index}
                  onChange={(value) =>
                    handleChangeImage(character.id, index, value)
                  }
                />
              ))}
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default GameCharacters;
