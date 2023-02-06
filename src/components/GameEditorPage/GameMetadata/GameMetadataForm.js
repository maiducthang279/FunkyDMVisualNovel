import { Col, Divider, Form, Image, Input, Row, Typography } from 'antd';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { editGameMetadata } from '..';
import { formStatusState, FORM_STATUS } from '../../../routes/store';
import { defaultImage } from '../../../services/util';
import Background from '../../shared/Background/Background';
import UploadImage from '../../shared/UploadImage/UploadImage';
import '../GameEditorPage.scss';

const { Title, Text } = Typography;

const GameMetadataForm = ({ game, form }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useRecoilState(formStatusState);
  const thumbnailPhotoUrlValue = Form.useWatch('thumbnail', form);
  const backgroundPhotoUrlValue = Form.useWatch('background', form);

  const handleThumbnailChange = (result) => {
    form.setFieldValue('thumbnail', result);
  };
  const handleBackgroundChange = (result) => {
    form.setFieldValue('background', result);
  };
  const onFinish = (values) => {
    const gameData = {
      ...values,
    };
    setIsLoading(true);
    setFormState(FORM_STATUS.SAVING);
    editGameMetadata(game.id, gameData).finally(() => {
      setIsLoading(false);
      setFormState(FORM_STATUS.SAVED);
    });
  };
  const onChange = () => {
    if (formState !== FORM_STATUS.DIRTY) {
      setFormState(FORM_STATUS.DIRTY);
    }
  };
  return (
    <Form
      name="game-metadata"
      layout="vertical"
      initialValues={game}
      onFinish={onFinish}
      autoComplete="off"
      form={form}
      disabled={isLoading}
      onChange={onChange}
    >
      <Row className="playable_metadata_container">
        <Col span={24}>
          <div>
            <Row justify={'space-between'} align={'middle'}>
              <Title level={3}>Metadata</Title>
            </Row>
            <Text>
              <Text type="danger">*</Text> Name
            </Text>
            <Form.Item
              name="name"
              rules={[
                { required: true, message: 'Please input the name!' },
                { max: 150, message: 'Maximum 150 characters' },
              ]}
            >
              <Input.TextArea
                placeholder="Name"
                autoSize={{ maxRows: 3 }}
                maxLength={150}
              />
            </Form.Item>

            <div className="group_form_item">
              <UploadImage
                onChange={handleThumbnailChange}
                previewImageStyle={{
                  width: '20rem',
                  maxHeight: '12rem',
                  objectFit: 'cover',
                }}
                initialValue={thumbnailPhotoUrlValue}
              >
                <div className="thumbnail_image upload_cover">
                  {thumbnailPhotoUrlValue ? (
                    <Image
                      src={thumbnailPhotoUrlValue}
                      preview={false}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = defaultImage;
                      }}
                    />
                  ) : (
                    <img
                      className="upload_empty_button"
                      alt="upload cover"
                      height={'12rem'}
                      src={defaultImage}
                    />
                  )}
                  <div className="upload_cover_hover">
                    <Text type="secondary">Upload thumbnail</Text>
                  </div>
                </div>
              </UploadImage>
              <Form.Item
                name="thumbnail"
                rules={[
                  { type: 'url', warningOnly: true },
                  { required: true, message: 'Please input a photo URL!' },
                ]}
              >
                <Input readOnly />
              </Form.Item>
            </div>

            <div className="group_form_item">
              <UploadImage
                onChange={handleBackgroundChange}
                previewImageStyle={{
                  width: '20rem',
                  maxHeight: '12rem',
                  objectFit: 'cover',
                }}
                initialValue={backgroundPhotoUrlValue}
              >
                <div className="background_image upload_cover">
                  {backgroundPhotoUrlValue ? (
                    <Background src={backgroundPhotoUrlValue}></Background>
                  ) : (
                    <img
                      className="upload_empty_button"
                      alt="upload cover"
                      height={'200px'}
                      src={defaultImage}
                    />
                  )}
                </div>
                <div className="upload_cover_hover">
                  <Text type="secondary">Upload background</Text>
                </div>
              </UploadImage>
              <Form.Item
                name="background"
                rules={[
                  { type: 'url', warningOnly: true },
                  { required: true, message: 'Please input a photo URL!' },
                ]}
              >
                <Input readOnly />
              </Form.Item>
            </div>

            <Divider></Divider>
            <Text>
              <Text type="danger">*</Text> Description
            </Text>
            <Form.Item name="description">
              <Input.TextArea
                autoSize={{ minRows: 2, maxRows: 6 }}
                placeholder="Description"
              />
            </Form.Item>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default GameMetadataForm;
