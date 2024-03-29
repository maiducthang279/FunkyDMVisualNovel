import React from 'react';
import { Circle, Group, Rect, Text } from 'react-konva';
import { getColor } from '../createTree.util';
import { createNodeSize, NodeDefaultSize } from '../gameEditor.util';

const GameNode = ({
  node,
  x = 0,
  y = 0,
  fontSize = NodeDefaultSize.fontSize,
  isFocused,
  onClick = (_nodeId) => void 0,
  onDragEnd = (_event) => void 0,
  onContextMenu = (_event) => void 0,
  onDblClick = (_event) => void 0,
  onDragMove = (_event) => void 0,
  onDragStart = (_event) => void 0,
}) => {
  const { padding, width, height, optionHeight } = createNodeSize(
    fontSize,
    node.content?.length > 0
  );
  const typeWidth = 100;

  const handleOnDragEnd = (event) => {
    const newX = Math.round(event.target.attrs.x / 10) * 10;
    const newY = Math.round(event.target.attrs.y / 10) * 10;
    onDragEnd({
      x: newX,
      y: newY,
      node: node,
    });
  };

  const handleOnContextMenu = () => {
    onContextMenu(node);
  };

  const handleDblClick = () => {
    onDblClick(node);
  };

  const handleDragMove = (event) => {
    onDragMove({
      x: event.target.attrs.x,
      y: event.target.attrs.y,
      node: node,
    });
  };

  const handleDragStart = (event) => {
    onDragStart({
      x: event.target.attrs.x,
      y: event.target.attrs.y,
      node: node,
    });
  };

  const getOptionContent = (item) => {
    if (item.content) {
      return item.content;
    }
    if (item.value) {
      return `${getOperator(item.operator)} ${item.value}`;
    }
    return '';
  };

  const getOperator = (operator) => {
    switch (operator) {
      case 'equal':
        return '=';
      case 'not equal':
        return '\u2260';
      default:
        return '';
    }
  };

  return (
    <Group
      x={x}
      y={y}
      onClick={() => onClick(node.id)}
      onTap={() => onClick(node.id)}
      draggable
      onContextMenu={handleOnContextMenu}
      onDblClick={handleDblClick}
      onDragEnd={handleOnDragEnd}
      onDragMove={handleDragMove}
      onDragStart={handleDragStart}
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
      {node.eventType && (
        <>
          <Rect
            x={-fontSize / 2 - padding / 2}
            y={-fontSize / 2 - padding / 2}
            width={width + fontSize / 2 + padding / 2}
            height={fontSize + padding}
            stroke={getColor(node.type)}
            fill="white"
            strokeWidth={2}
            cornerRadius={fontSize + padding}
            shadowColor={isFocused ? getColor(node.type) : undefined}
            shadowBlur={isFocused ? 5 : 1}
          />
          <Text
            x={typeWidth - fontSize / 2 - padding / 2}
            y={-fontSize - padding / 2}
            text={node.eventType}
            width={width - typeWidth + fontSize / 2 + padding / 2}
            height={fontSize * 2 + padding}
            fontSize={fontSize * 0.8}
            padding={padding / 2}
            ellipsis
            fill="black"
            align="left"
            verticalAlign="middle"
          ></Text>
        </>
      )}
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
        text={node.type?.toUpperCase()}
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
      {node.content && (
        <Text
          y={fontSize + padding * 2}
          text={node.content}
          width={width}
          height={fontSize * 4 + padding * 2}
          fontSize={fontSize}
          padding={padding}
          ellipsis
        ></Text>
      )}
      {node.nextId ? (
        <Circle
          x={width}
          y={height / 2}
          radius={6}
          fill={getColor(node.type)}
        ></Circle>
      ) : null}
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
            text={`${index + 1}. ${getOptionContent(item)}`}
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
