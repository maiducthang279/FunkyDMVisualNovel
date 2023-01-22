import './App.scss';
import { ConfigProvider } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root';
import GamePage from './components/GamePage';
import GamePlay from './components/GamePlay/GamePlay';
import HomePage from './components/HomePage/HomePage';
import Login from './components/LoginPage/Login';
import { RecoilRoot } from 'recoil';
import { HelmetProvider } from 'react-helmet-async';
import { homeLoader } from './components/HomePage';

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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'game/:gameId',
        element: <GamePage />,
        children: [
          {
            path: 'gameplay',
            element: <GamePlay />,
          },
        ],
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: '',
        element: <HomePage />,
        loader: homeLoader,
      },
    ],
  },
]);

const helmetContext = {};

function App() {
  return (
    <RecoilRoot>
      <HelmetProvider context={helmetContext}>
        <ConfigProvider
          theme={{
            token: theme,
          }}
        >
          <RouterProvider router={router} />
        </ConfigProvider>
      </HelmetProvider>
    </RecoilRoot>
  );
}

export default App;
