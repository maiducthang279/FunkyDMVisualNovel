import { NodeDefaultSize } from './gameEditor.util';

export const PlayableContentNodePaddingX = 100;
export const PlayableContentNodePaddingY = 50;

export const getColor = (type) => {
  switch (type) {
    case 'dialog':
      return '#3391A6';
    case 'choice':
      return '#8C4F88';
    case 'event':
      return '#73345D';
    default:
      return '#5697BF';
  }
};

export const createLine = (nodes) => {
  const posMap = new Map();
  nodes.forEach((node) => {
    posMap.set(node.id, node);
  });
  return nodes
    .map((node) =>
      getChildrenNodeIds(node).map(({ nextId, optionIndex }) => ({
        rootId: node.id,
        nextId: nextId,
        optionIndex,
        previousNode: posMap.get(node.id),
        nextNode: posMap.get(nextId),
      }))
    )
    .flat()
    .filter(({ previousNode, nextNode }) => !!previousNode && !!nextNode);
};

export const getChildrenNodeIds = (node) =>
  node.nextId
    ? [{ nextId: node.nextId, optionIndex: null }]
    : node.options
        ?.filter((otp) => !!otp.nextId)
        .map((opt, index) => ({ nextId: opt.nextId, optionIndex: index })) ||
      [];

export const checkNodeHasLink = (nodeId, links) => {
  console.log(
    links.some(({ rootId, nextId }) => rootId === nodeId || nextId === nodeId)
  );
  console.log(links);
  return links.some(
    ({ rootId, nextId }) => rootId === nodeId || nextId === nodeId
  );
};
