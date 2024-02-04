import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom';
import ScrollToTop, { ProtectedRoute } from './utils/utils';
import { useAuth } from './context/AuthContext';

// Components
import Leftbar from './components/Leftbar/Leftbar';
import Navbar from './components/Navbar/Navbar';

// Pages
import Home from './pages/Home/Home';
import Signup from './pages/Signup/Signup';
import Signin from './pages/Signin/Signin';
import Post from './pages/Post/Post';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';
import MessageBox from './components/MessageBox/MessageBox';
import Following from './pages/Following/Following';
import SettingsLeftbar from './components/SettingsLeftbar/SettingsLeftbar';
import Account from './pages/Settings/Account/Account';
import Notifications from './pages/Settings/Notifications/Notifications';
import Privacy from './pages/Settings/Privacy/Privacy';
import Language from './pages/Settings/Language/Language';

const Layout = () => {
  return (
    <div className="app">
      <ScrollToTop />
      <Leftbar />
      <div className="wrapper">
        <Navbar />
        <Outlet />
      </div>
      <MessageBox />
    </div>
  );
};

const SettingsLayout = () => {
  return (
    <div className="settings-layout__container">
      <SettingsLeftbar />
      <Outlet />
    </div>
  );
};

const App = () => {
  const { currentUser } = useAuth();

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: '/', element: <Home /> },
        { path: '/following', element: <Following /> },
        { path: '/profile/:username', element: <Profile /> },
        { path: '/post/:postId', element: <Post /> },
        {
          path: '/settings',
          element: <SettingsLayout />,
          children: [
            { path: '/settings/account', element: <Account /> },
            { path: '/settings/notifications', element: <Notifications /> },
            { path: '/settings/privacy', element: <Privacy /> },
            { path: '/settings/language', element: <Language /> },
          ],
        },
      ],
    },
    {
      path: '/signin',
      element: currentUser ? <Navigate to={'/'} replace /> : <Signin />,
    },
    {
      path: '/signup',
      element: currentUser ? <Navigate to={'/'} replace /> : <Signup />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={true}
        closeOnClick={false}
        closeButton={false}
        pauseOnHover={false}
        draggable={true}
        theme="dark"
      />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
