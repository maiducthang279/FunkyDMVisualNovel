import { Drawer, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { useRecoilState } from 'recoil';
import { useWindowSize } from '../../../hook/useWindowSize';
import { currentEditedSceneState } from '../../../routes/store';
import uniqid from 'uniqid';
import GameNode from './GameNode';

import './GameData.scss';
import ContextMenu from '../../shared/ContextMenu';
import GameNodeForm from './GameNodeForm';
import GameNodeLine from './GameNodeLine';
import { checkNodeHasLink, createLine } from '../createTree.util';
import * as _ from 'lodash';
import { makeNewNode } from '../gameEditor.util';

const createMenuItem = ({ name, key, type = 'default' }) => ({
  name,
  key,
  type,
});

const DEFAULT_MENU_ITEMS = [
  createMenuItem({
    name: 'New dialog...',
    key: 'dialog',
  }),
  createMenuItem({
    name: 'New choice...',
    key: 'choice',
  }),
  createMenuItem({
    name: 'New event...',
    key: 'event',
  }),
  createMenuItem({
    name: 'Edit...',
    key: 'edit',
    type: 'node',
  }),
  createMenuItem({
    name: 'Delete',
    key: 'delete',
    type: 'node',
  }),
  createMenuItem({
    name: 'Duplicate',
    key: 'duplicate',
    type: 'node',
  }),
  createMenuItem({
    name: 'Duplicate after this',
    key: 'duplicateAfterThis',
    type: 'node',
  }),
];

const GameData = () => {
  const [nodeForm] = Form.useForm();
  const { width, height } = useWindowSize();
  const [currentScene, setCurrentScene] = useRecoilState(
    currentEditedSceneState
  );
  const [listNode, setListNode] = useState([]);
  const [listLine, setListLine] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [currentLines, setCurrentLines] = useState([]);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [canvasX, setCanvasX] = useState(0);
  const [canvasY, setCanvasY] = useState(0);
  const [isShowContextMenu, setIsShowContextMenu] = useState(false);
  const [displayMenuItem, setDisplayMenuItem] = useState(['default', 'node']);
  const [contextNode, setContextNode] = useState(null);

  useEffect(() => {
    const initNodes = currentScene?.data.nodes || [];
    setListNode(initNodes);
    setListLine(createLine(initNodes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScene]);

  const getStageSize = () => ({
    width: width || window.innerWidth,
    height: height || window.innerHeight,
  });

  const createNewNode = (type, event) =>
    setCurrentScene((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        nodes: [
          ...prev.data.nodes,
          makeNewNode(type, {
            id: uniqid(),
            x: event.x - 200,
            y: event.y - getStageSize().height / 2,
          }),
        ],
      },
    }));
  const duplicateNode = (node, optionId = null) =>
    setCurrentScene((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        nodes: [
          ...prev.data.nodes,
          {
            ...node,
            id: optionId || uniqid(),
            name: node.name + ' copy',
            x: node.x + 250,
            y: node.y,
            nextId: null,
            options: !!node.options
              ? node.options.map(({ nextId, ...rest }) => ({ ...rest }))
              : null,
          },
        ],
      },
    }));
  const duplicateAfterThisNode = (node) => {
    const newId = uniqid();
    duplicateNode(node, newId);
    if (['dialog', 'event'].includes(node.type)) {
      updateNode({
        ...node,
        nextId: newId,
      });
    }
  };
  const updateNode = (updatedNode) =>
    setCurrentScene((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        nodes: prev.data.nodes.map((node) =>
          node.id === updatedNode.id
            ? {
                ...node,
                ...updatedNode,
              }
            : node
        ),
      },
    }));
  const deleteNode = (node) => {
    if (!checkNodeHasLink(node.id, listLine)) {
      if (currentNode.id === node.id) {
        setCurrentNode(null);
      }
      setCurrentScene((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          nodes: prev.data.nodes.filter(({ id }) => id !== node.id),
        },
      }));
    } else {
      window.alert(
        'You cannot delete the node that has links to other nodes. Please remove all links before deleting a node.'
      );
    }
  };

  const startEditNode = (node) => {
    if (currentNode == null) {
      nodeForm.setFieldsValue(node);
      setCurrentNode(node);
    } else {
      const editingNode = {
        ...currentNode,
        ...nodeForm.getFieldsValue(),
      };
      if (_.isEqual(editingNode, currentNode)) {
        nodeForm.setFieldsValue(node);
        setCurrentNode(node);
      } else {
        window.alert('Please save node before switch');
      }
    }
  };

  const handleNodeClick = () => {};

  const handleSaveNode = (updatedNode) => {
    updateNode(updatedNode);
    setCurrentNode({
      ...currentNode,
      ...updatedNode,
    });
  };

  const handleContextMenu = (event) => {
    event.evt.preventDefault();
    setX(event.evt.x);
    setY(event.evt.y);
    setCanvasX(event.target.attrs.x);
    setCanvasY(event.target.attrs.y);
    setIsShowContextMenu(true);
  };

  const handleNodeContextMenu = (node) => {
    if (node.type === 'root') {
      return;
    }
    setContextNode(node);
    setDisplayMenuItem(['default', 'node']);
  };

  const handleNodeDblClick = (node) => {
    startEditNode(node);
  };

  const handleNodeDragMove = (event) => {
    setTimeout(() => {
      setCurrentLines((prev) => {
        return prev.map((line) => {
          if (line.rootId === event.node.id) {
            return {
              ...line,
              previousNode: {
                ...line.previousNode,
                x: event.x,
                y: event.y,
              },
            };
          }
          if (line.nextId === event.node.id) {
            return {
              ...line,
              nextNode: {
                ...line.nextNode,
                x: event.x,
                y: event.y,
              },
            };
          }
          return line;
        });
      });
    }, 0);
  };

  const handleNodeDragStart = (event) => {
    setCurrentLines(
      listLine.filter(
        (line) => line.rootId === event.node.id || line.nextId === event.node.id
      )
    );
    setListLine(
      listLine.filter(
        (line) =>
          !(line.rootId === event.node.id || line.nextId === event.node.id)
      )
    );
  };

  const handleNodeDragEnd = (event) => {
    setTimeout(() => {
      updateNode({
        ...event.node,
        x: event.x,
        y: event.y,
      });
      setCurrentLines([]);
    }, 10);
  };

  const handleContextMenuClick = (key, event) => {
    switch (key) {
      case 'dialog':
        createNewNode('dialog', event);
        break;
      case 'choice':
        createNewNode('choice', event);
        break;
      case 'event':
        createNewNode('event', event);
        break;
      case 'edit':
        startEditNode(contextNode);
        break;
      case 'delete':
        deleteNode(contextNode);
        break;
      case 'duplicate':
        duplicateNode(contextNode);
        break;
      case 'duplicateAfterThis':
        duplicateAfterThisNode(contextNode);
        break;
      default:
        break;
    }
    setContextNode(null);
  };

  if (!currentScene) {
    return null;
  }
  return (
    <div className="stage_container">
      <Stage
        width={getStageSize().width}
        height={getStageSize().height}
        draggable
        onContextMenu={handleContextMenu}
        name="stage"
      >
        <Layer offsetY={-getStageSize().height / 2} offsetX={-200}>
          {listLine.map((line) => (
            <GameNodeLine
              line={line}
              key={`${line.previousNode.id}-${line.optionIndex ?? ''}-${
                line.nextNode.id
              }`}
            ></GameNodeLine>
          ))}
        </Layer>
        <Layer offsetY={-getStageSize().height / 2} offsetX={-200}>
          {currentLines.map((line) => (
            <GameNodeLine
              line={line}
              key={`${line.previousNode.id}-${line.optionIndex ?? ''}-${
                line.nextNode.id
              }`}
            ></GameNodeLine>
          ))}
        </Layer>
        <Layer offsetY={-getStageSize().height / 2} offsetX={-200}>
          {listNode.map((item) => (
            <GameNode
              node={item}
              key={item.id}
              x={item.x}
              y={item.y}
              isFocused={item.id === currentNode?.id}
              onClick={handleNodeClick}
              onContextMenu={handleNodeContextMenu}
              onDblClick={handleNodeDblClick}
              onDragMove={handleNodeDragMove}
              onDragEnd={handleNodeDragEnd}
              onDragStart={handleNodeDragStart}
            />
          ))}
        </Layer>
      </Stage>
      <Drawer
        placement="right"
        onClose={() => setCurrentNode(null)}
        mask={false}
        open={!!currentNode}
        width={(width || window.innerWidth) >= 425 ? 425 : '100%'}
      >
        <GameNodeForm
          form={nodeForm}
          node={currentNode}
          onFinish={handleSaveNode}
        ></GameNodeForm>
      </Drawer>
      <ContextMenu
        menu={DEFAULT_MENU_ITEMS}
        isShow={isShowContextMenu}
        x={x}
        y={y}
        canvasX={canvasX}
        canvasY={canvasY}
        displayType={displayMenuItem}
        onClick={handleContextMenuClick}
        onClose={() => {
          setDisplayMenuItem(['default']);
          setIsShowContextMenu(false);
        }}
      ></ContextMenu>
    </div>
  );
};

export default GameData;
