import './App.scss';
import { ConfigProvider } from 'antd';
import { Outlet } from 'react-router-dom';

const theme = {
  colorPrimary: '#457db2',
  colorSuccess: '#81c886',
  colorError: '#d35553',
  colorInfo: '#1e4366',
  colorWarning: '#c58b17',
  fontSize: 14,
  borderRadius: 2,
  wireframe: false,
};

function App() {
  return (
    <ConfigProvider
      theme={{
        token: theme,
      }}
    >
      <Outlet />
    </ConfigProvider>
  );
}

export default App;
