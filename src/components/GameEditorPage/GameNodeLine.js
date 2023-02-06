import { Line } from 'react-konva';
import { getColor, PlayableContentNodePaddingX } from './createTree.util';
import { NodeDefaultSize } from './gameEditor.util';

const GameNodeLine = ({ treeLine }) => {
  const { previousNode, nextNode } = treeLine;
  const getPoints = () => {
    const startPoint = getStartPoint();
    const endPoint = getEndPoint();
    const middlePadding = (PlayableContentNodePaddingX * 1) / 2;
    return [
      ...startPoint,
      startPoint[0] + middlePadding,
      startPoint[1],
      endPoint[0] - middlePadding,
      endPoint[1],
      ...endPoint,
    ];
  };

  const getStartPoint = () => {
    const { x, y, node } = previousNode;
    switch (node.type) {
      case 'choice':
        const nodeHeight = node.content
          ? NodeDefaultSize.contentHeight
          : NodeDefaultSize.noContentHeight;
        const index =
          node.options?.findIndex(
            (item) => item.nextNode === nextNode.node.id
          ) || 0;
        return [
          x + NodeDefaultSize.width + NodeDefaultSize.padding,
          y +
            nodeHeight +
            NodeDefaultSize.optionHeight * index +
            (NodeDefaultSize.optionHeight / 2 - NodeDefaultSize.padding / 4),
        ];
      default:
        return [
          x + NodeDefaultSize.width,
          y + NodeDefaultSize.contentHeight / 2,
        ];
    }
  };
  const getEndPoint = () => [
    nextNode.x - NodeDefaultSize.padding / 2,
    nextNode.y,
  ];

  return (
    <Line
      points={getPoints()}
      stroke={getColor(previousNode.node.type)}
      strokeWidth={4}
      bezier={true}
    ></Line>
  );
};

export default GameNodeLine;
