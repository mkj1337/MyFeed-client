
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles.scss';
import { AuthContextProvider } from './context/AuthContext.tsx';
import { MenuContextProvider } from './context/MenuContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthContextProvider>
    <MenuContextProvider>
      <App />
    </MenuContextProvider>
  </AuthContextProvider>
);
