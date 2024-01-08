import {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import useMediaQuery from '../hooks/useMediaQuerie';

type StateType = {
  showMenu: string;
};

export const initState: StateType = {
  showMenu: '',
};

const enum REDUCER_ACTION_TYPE {
  SHOW_NAV,
}

type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload?: string;
};

const ThemeReducer = (state: StateType, action: ReducerAction): StateType => {
  const { type, payload } = action;

  switch (type) {
    case REDUCER_ACTION_TYPE.SHOW_NAV:
      return { ...state, showMenu: payload ?? '' };
    default:
      return state;
  }
};

const useMenuContext = (initState: StateType) => {
  const [state, dispatch] = useReducer(ThemeReducer, initState);
  const isDesktop = useMediaQuery('(min-width: 800px)');

  const changeMenu = (showMenu: string) => {
    dispatch({ type: REDUCER_ACTION_TYPE.SHOW_NAV, payload: showMenu });
  };

  useEffect(() => {
    changeMenu('');
  }, [isDesktop]);

  return { state, changeMenu };
};

type useMenuContextType = ReturnType<typeof useMenuContext>;

const initContextState: useMenuContextType = {
  state: initState,
  changeMenu: () => {},
};

export const MenuContext = createContext<useMenuContextType>(initContextState);

type ChildrenType = {
  children?: ReactElement | undefined;
};

export const MenuContextProvider = ({
  children,
}: ChildrenType): ReactElement => {
  return (
    <MenuContext.Provider value={useMenuContext(initState)}>
      {children}
    </MenuContext.Provider>
  );
};

type useMenuType = {
  showMenu: string;
  changeMenu: (showMenu: string) => void;
};

export const useMenu = (): useMenuType => {
  const {
    state: { showMenu },
    changeMenu,
  } = useContext(MenuContext);
  return { showMenu, changeMenu };
};
