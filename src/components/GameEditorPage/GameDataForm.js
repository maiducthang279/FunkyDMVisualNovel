import { Col, Drawer, Row } from 'antd';
import React, { useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { useWindowSize } from '../../hook/useWindowSize';

const GameDataForm = ({ value, onChange }) => {
  const { width, height } = useWindowSize();
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);

  const getStageSize = () => ({
    width: width || window.innerWidth,
    height: height || window.innerHeight,
  });
  return (
    <>
      <Stage
        width={getStageSize().width}
        height={getStageSize().height}
        draggable
      >
        <Layer offsetY={-getStageSize().height / 2} offsetX={-200}></Layer>
        <Layer offsetY={-getStageSize().height / 2} offsetX={-200}></Layer>
      </Stage>
      <Drawer
        placement="right"
        onClose={() => setIsOpenSidebar(false)}
        mask={false}
        open={isOpenSidebar && !!currentNode}
        width={(width || window.innerWidth) >= 576 ? 576 : '100%'}
      >
        <Row>
          <Col span={24}></Col>
        </Row>
      </Drawer>
    </>
  );
};

export default GameDataForm;
