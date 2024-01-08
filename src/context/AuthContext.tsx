import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactElement,
} from 'react';
import { CurrentUserProps } from '../interfaces/users';

const useAuthContext = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUserProps | null>(
    JSON.parse(`${localStorage.getItem('user')}`) || null
  );

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser, currentUser?.userImg]);
  return { currentUser, setCurrentUser };
};

type useAuthContextType = ReturnType<typeof useAuthContext>;

const initAuthContext: useAuthContextType = {
  currentUser: null,
  setCurrentUser: () => {},
};

export const AuthContext = createContext<useAuthContextType>(initAuthContext);

type ChildrenType = {
  children: ReactElement | undefined;
};

export const AuthContextProvider = ({ children }: ChildrenType) => {
  return (
    <AuthContext.Provider value={useAuthContext()}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): useAuthContextType => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  return { currentUser, setCurrentUser };
};
