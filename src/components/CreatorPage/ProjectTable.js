import { Space, Table } from 'antd';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../../routes/store';
import ProjectDelete from './ProjectDelete';

const ProjectTable = ({ projects = [], onDeleteSuccess = () => void 0 }) => {
  const [user] = useRecoilState(userState);
  const columns = [
    {
      title: 'Project name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Link to={`/projects/${record.id}`}>{record.name}</Link>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          {user.uid === record.creator && (
            <ProjectDelete
              title={record.name}
              id={record.id}
              onSuccess={onDeleteSuccess}
            />
          )}
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={projects} />;
};

export default ProjectTable;
