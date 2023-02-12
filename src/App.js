import './App.scss';
import { ConfigProvider } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root';
import GamePage, { gameLoader } from './components/GamePage';
import HomePage from './components/HomePage/HomePage';
import Login from './components/LoginPage/Login';
import { RecoilRoot } from 'recoil';
import { HelmetProvider } from 'react-helmet-async';
import { homeLoader } from './components/HomePage';
import Profile, { profileLoader, ProfileSetting } from './components/Profile';
import Management from './components/Admin';
import MainPage from './components/MainPage';
import CreatorPage from './components/CreatorPage';
import ProjectPage, { projectLoader } from './components/ProjectPage';
import ErrorPage from './ErrorPage';
import GameEditorPage, { gameEditorLoader } from './components/GameEditorPage';
import ProtectedRoute from './components/shared/ProtectedRoute/ProtectedRoute';

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
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'game/:gameId',
        element: <GamePage />,
        loader: gameLoader,
      },
      {
        path: 'game-editor/:gameId',
        element: (
          <ProtectedRoute permission={'EDIT_GAME'}>
            <GameEditorPage />
          </ProtectedRoute>
        ),
        loader: gameEditorLoader,
      },
      {
        path: '',
        element: <MainPage />,
        children: [
          {
            path: 'profile/:userId',
            element: <Profile />,
            loader: profileLoader,
          },
          {
            path: 'profile/settings',
            element: <ProfileSetting />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'creator',
            element: <CreatorPage />,
          },
          {
            path: 'projects/:projectId',
            element: <ProjectPage />,
            loader: projectLoader,
          },
          {
            path: 'management',
            element: <Management />,
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
