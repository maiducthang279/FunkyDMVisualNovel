import { Card, Col, Row, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { permissionState } from '../../routes/store';
import AdminGameTable from './AdminGameTable';
import AdminUserTable from './AdminUserTable';

const Management = () => {
  const [permission] = useRecoilState(permissionState);
  const [tabs, setTabs] = useState([]);
  useEffect(() => {
    const items = [];
    if (permission === 'admin') {
      items.push({
        label: `User`,
        key: '1',
        children: <AdminUserTable></AdminUserTable>,
      });
    }
    if (['admin', 'moderator'].includes(permission || '')) {
      items.push({
        label: `Game`,
        key: '2',
        children: <AdminGameTable></AdminGameTable>,
      });
    }
    setTabs(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission]);
  return (
    <Row>
      <Col
        xs={{ span: 22, offset: 1 }}
        sm={{ span: 20, offset: 2 }}
        lg={{ span: 18, offset: 3 }}
        xl={{ span: 18, offset: 3 }}
        xxl={{ span: 16, offset: 4 }}
      >
        <Card>
          <Tabs defaultActiveKey="1" items={tabs} />
        </Card>
      </Col>
    </Row>
  );
};

export default Management;
