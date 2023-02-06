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

export const createTree = (nodes) => {
  const tree = new Map();
  const updatedNodeIds = [];
  nodes.forEach((node) => {
    tree.set(node.id, {
      parents: [],
      children: getChildrenNodeIds(node),
      level: 0,
      wideLevel: 0,
      x: -NodeDefaultSize.width - PlayableContentNodePaddingX,
      y: 0,
      node,
    });
  });
  tree.forEach((treeNode) => {
    if (!updatedNodeIds.includes(treeNode.node.id)) {
      updateParents(treeNode, tree, updatedNodeIds);
    }
  });
  const rootNode = tree.get('root');
  const nodeInsideRoot = [];
  if (rootNode) {
    let currentOffset = 0;
    updateLevel(rootNode, tree, []);
    updatePosition(
      rootNode,
      tree,
      nodeInsideRoot,
      rootNode.y - rootNode.wideLevel / 2 + currentOffset
    );
    currentOffset += rootNode.wideLevel;
  }
  const nodeOutsideRoot = Array.from(tree.values()).filter(
    (item) => !nodeInsideRoot.includes(item.node.id)
  );
  let currentOutsideOffset = 0;
  nodeOutsideRoot.forEach((item) => {
    const wideLevel = getNodeWide(item.node);
    item.y = currentOutsideOffset;
    currentOutsideOffset += wideLevel + PlayableContentNodePaddingY;
  });

  return tree;
};

export const createTreeLine = (tree) => {
  const treeLine = new Map();
  const treeRootNode = tree.get('root');
  if (treeRootNode) {
    createLine(treeRootNode, tree, treeLine, []);
  }
  return treeLine;
};

const updateParents = (treeNode, tree, updatedNodes) => {
  if (!updatedNodes.includes(treeNode.node.id)) {
    updatedNodes.push(treeNode.node.id);
    treeNode.children.forEach((childId) => {
      const childNode = tree.get(childId);
      if (childNode) {
        if (!childNode.parents.includes(treeNode.node.id)) {
          childNode.parents.push(treeNode.node.id);
        }
        updateParents(childNode, tree, updatedNodes);
      }
    });
  }
};

const updateLevel = (treeNode, tree, updatedNodes) => {
  if (!updatedNodes.includes(treeNode.node.id)) {
    updatedNodes.push(treeNode.node.id);
    const childrenWide = treeNode.children
      .map((childId) => {
        const childNode = tree.get(childId);
        if (childNode) {
          if (
            childNode.level <= treeNode.level &&
            !updatedNodes.includes(childNode.node.id)
          ) {
            childNode.level = treeNode.level + 1;
          }
          return updateLevel(childNode, tree, updatedNodes);
        }
        return 0;
      })
      .reduce((arr, value) => (arr += value), 0);
    const nodeWide = getNodeWide(treeNode.node);
    treeNode.wideLevel = Math.max(childrenWide, nodeWide);
    return treeNode.wideLevel;
  }
  return 0;
};

const updatePosition = (treeNode, tree, updatedNodes, offset = 0) => {
  if (!updatedNodes.includes(treeNode.node.id)) {
    updatedNodes.push(treeNode.node.id);
    treeNode.x =
      (NodeDefaultSize.width + PlayableContentNodePaddingX) * treeNode.level;
    treeNode.y = offset + treeNode.wideLevel / 2;

    let currentOffset = 0;
    treeNode.children
      .filter((item) => !updatedNodes.includes(item))
      .forEach((childId) => {
        const childNode = tree.get(childId);
        if (childNode && !updatedNodes.includes(childNode.node.id)) {
          updatePosition(
            childNode,
            tree,
            updatedNodes,
            treeNode.y - treeNode.wideLevel / 2 + currentOffset
          );
          currentOffset += childNode.wideLevel;
        }
      });
  }
};

const createLine = (treeNode, tree, treeLine, updatedNodes) => {
  if (!updatedNodes.includes(treeNode.node.id)) {
    updatedNodes.push(treeNode.node.id);
    treeNode.children.forEach((childId) => {
      const childNode = tree.get(childId);
      if (childNode) {
        treeLine.set(`${treeNode.node.id}-${childId}`, {
          previousNode: treeNode,
          nextNode: childNode,
        });
        createLine(childNode, tree, treeLine, updatedNodes);
      }
    });
  }
};

const getNodeWide = (node) => {
  switch (node.type) {
    case 'choice':
      return (
        (node.content.length > 0
          ? NodeDefaultSize.contentHeight
          : NodeDefaultSize.noContentHeight) +
        (node.options?.length || 0) * NodeDefaultSize.optionHeight +
        PlayableContentNodePaddingY
      );
    default:
      return NodeDefaultSize.height + PlayableContentNodePaddingY;
  }
};

const getChildrenNodeIds = (node) =>
  node.nextId
    ? [node.nextId]
    : node.options?.filter((otp) => !!otp.nextId).map((opt) => opt.nextId) ||
      [];
