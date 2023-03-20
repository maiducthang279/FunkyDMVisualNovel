import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Image, Row, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { addNewBackground, deleteBackground, updateBackground } from '.';
import {
  backgroundsState,
  currentEditedGameProjectState,
} from '../../../routes/store';
import { defaultImage } from '../../../services/util';
import UploadImage from '../../shared/UploadImage';
import './GameBackgrounds.scss';
import GameBackgroundDelete from './GameBackgroundsDelete';
const { Paragraph } = Typography;
const BackgroundImage = ({ image }) => {
  const [currentValue, setCurrentValue] = useState(null);

  const [backgrounds, setBackgrounds] = useRecoilState(backgroundsState);

  useEffect(() => {
    setCurrentValue(image);
  }, [image]);
  const handleChangeImageName = (value) => {
    const newImage = {
      ...currentValue,
      name: value,
    };
    updateBackground(newImage.id, newImage).then(() => {
      setCurrentValue(newImage);
    });
  };
  const handleDeleteImage = () => {
    deleteBackground(currentValue.id).then(() => {
      setBackgrounds(backgrounds.filter(({ id }) => id !== currentValue.id));
    });
  };
  if (!currentValue) {
    return null;
  }
  return (
    <div className="background_image">
      <div className="title">
        <Paragraph
          editable={{
            onChange: (value) => handleChangeImageName(value),
          }}
        >
          {currentValue.name}
        </Paragraph>
        <Space split={<Divider type="vertical" />}>
          <GameBackgroundDelete
            id={currentValue.id}
            name={currentValue.name}
            onSuccess={handleDeleteImage}
          ></GameBackgroundDelete>
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

const GameBackgrounds = () => {
  const project = useRecoilValue(currentEditedGameProjectState);
  const [backgrounds, setBackgrounds] = useRecoilState(backgroundsState);
  const handleAddBackground = (value) => {
    const newBackground = {
      name: 'Default Name',
      url: value,
      projectId: project.id,
    };
    addNewBackground(newBackground).then((result) => {
      setBackgrounds([{ id: result.id, ...newBackground }, ...backgrounds]);
    });
  };
  return (
    <div className="game_backgrounds">
      <UploadImage onChange={(value) => handleAddBackground(value)}>
        <Button block icon={<PlusOutlined />}>
          Add Background
        </Button>
      </UploadImage>

      <Divider></Divider>
      <div>
        {backgrounds.map((background) => (
          <BackgroundImage image={background} key={background.id} />
        ))}
      </div>
    </div>
  );
};

export default GameBackgrounds;
