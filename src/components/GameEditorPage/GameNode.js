import React from 'react';
import { Circle, Group, Rect, Text } from 'react-konva';
import { getColor } from './createTree.util';
import { createNodeSize, NodeDefaultSize } from './gameEditor.util';

const GameNode = ({
  node,
  x = 0,
  y = 0,
  fontSize = NodeDefaultSize.fontSize,
  isFocused,
  onClick = (_nodeId) => void 0,
}) => {
  const { padding, width, height, optionHeight } = createNodeSize(
    fontSize,
    false
  );
  const typeWidth = 100;

  return (
    <Group
      x={x}
      y={y}
      onClick={() => onClick(node.id)}
      onTap={() => onClick(node.id)}
    >
      <Rect
        x={0}
        y={0}
        width={width}
        height={height + optionHeight * (node.options?.length || 0)}
        fill="white"
        shadowColor={isFocused ? getColor(node.type) : undefined}
        shadowBlur={isFocused ? 10 : undefined}
      />
      <Rect
        x={-fontSize / 2 - padding / 2}
        y={-fontSize / 2 - padding / 2}
        width={typeWidth}
        height={fontSize + padding}
        fill={getColor(node.type)}
        cornerRadius={fontSize + padding}
        shadowColor={isFocused ? getColor(node.type) : undefined}
        shadowBlur={isFocused ? 5 : 1}
      />
      <Text
        x={-fontSize / 2 - padding / 2}
        y={-fontSize / 2 - padding / 2 + 2}
        text={node.type}
        width={typeWidth}
        height={fontSize + padding}
        fontSize={fontSize}
        padding={padding / 2}
        fontStyle="bold"
        fill="white"
        align="center"
      ></Text>
      <Text
        y={padding}
        text={node.name}
        width={width}
        height={fontSize * 1 + padding * 2}
        fontSize={fontSize}
        fontStyle="bold"
        padding={padding}
        ellipsis
      ></Text>
      {node.nextNode && (
        <Circle
          x={width}
          y={height / 2}
          radius={6}
          fill={getColor(node.type)}
        ></Circle>
      )}
      {node.options?.map((item, index) => (
        <Group key={index} x={0} y={height + index * optionHeight}>
          <Rect width={width} height={optionHeight} fill="white" />
          <Rect
            x={padding}
            y={0}
            width={width}
            height={optionHeight - padding / 2}
            fill={getColor(node.type)}
            cornerRadius={optionHeight - padding / 2}
            shadowColor="#888888"
            shadowBlur={1}
          />
          <Text
            x={padding}
            y={0}
            text={`${index + 1}. ${item.content}`}
            width={width}
            height={optionHeight - padding / 2}
            fontSize={fontSize}
            padding={padding / 2}
            fill="white"
            ellipsis
          ></Text>
        </Group>
      ))}
    </Group>
  );
};

export default GameNode;
