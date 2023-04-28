import { Button, Space, Table } from 'antd';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../../routes/store';
import GameDelete from './GameDelete';
import { CopyOutlined, ExportOutlined } from '@ant-design/icons';

const GameTable = ({
  project,
  games = [],
  onDeleteSuccess = () => void 0,
  onMakeACopy = () => void 0,
  onExport = () => void 0,
}) => {
  const [user] = useRecoilState(userState);
  const columns = [
    {
      title: 'Game name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Link to={`/game-editor/${record.id}`}>{record.name}</Link>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          {project.memberIds.includes(user.uid) && (
            <>
              <Button
                type="link"
                size="small"
                icon={<ExportOutlined />}
                onClick={() => onExport(record.id)}
              >
                Export
              </Button>
              <Button
                type="link"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => onMakeACopy(record.id)}
              >
                Make a copy
              </Button>
              <GameDelete
                title={record.name}
                id={record.id}
                onSuccess={onDeleteSuccess}
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={games} />;
};

export default GameTable;
