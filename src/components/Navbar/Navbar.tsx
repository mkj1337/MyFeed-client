import styles from './Navbar.module.scss';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import leftBar from '../Leftbar/Leftbar.module.scss';

// Icons
import { BsSearch } from 'react-icons/bs';
import { RxHamburgerMenu } from 'react-icons/rx';
import { RiCloseFill } from 'react-icons/ri';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import { useAuth } from '../../context/AuthContext';
import { CurrentUserProps } from '../../interfaces/users';
import { useMenu } from '../../context/MenuContext';
import SearchModal from '../SearchModal/SearchModal';
import Modal from '../Modal/Modal';
import CreatePost from '../CreatePost/CreatePost';

const Navbar = () => {
  const [addPost, setAddPost] = useState<boolean>(false);
  const [users, setUsers] = useState<CurrentUserProps[]>([]);
  const { showMenu, changeMenu } = useMenu();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`/api/users/filter?q=${search}`);
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [search]);

  const handleBrand = () => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleOpenSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSearch(true);
    }
  };

  return (
    <>
      <Modal close={setAddPost} isActive={addPost}>
        <CreatePost border="border" />
      </Modal>
      <div className={styles.navWrapper}>
        <SearchModal
          search={search}
          setSearch={setSearch}
          users={users}
          setShowSearch={setShowSearch}
          showSearch={showSearch}
        />
        <div className={styles.nav} onClick={(e) => e.stopPropagation()}>
          <div className={styles.leftSide}>
            <h1>
              <NavLink to="/" onClick={handleBrand}>
                <span>My</span>Feed
              </NavLink>
            </h1>
            <div className={styles.burger}>
              {showMenu !== leftBar.active ? (
                <RxHamburgerMenu
                  className={styles.burgerIcon}
                  onClick={() =>
                    changeMenu(showMenu == leftBar.active ? '' : leftBar.active)
                  }
                />
              ) : (
                <RiCloseFill
                  className={styles.burgerIcon}
                  onClick={() =>
                    changeMenu(showMenu == leftBar.active ? '' : leftBar.active)
                  }
                />
              )}
            </div>
          </div>
          <div className={styles.buttons}>
            <button>
              {showSearch ? (
                <div
                  onClick={() => {
                    setSearch('');
                    setShowSearch(false);
                  }}
                >
                  <AiOutlineClose />
                </div>
              ) : (
                <div onClick={() => setShowSearch(true)}>
                  <BsSearch />
                </div>
              )}
              <input
                type="text"
                placeholder="Search"
                value={showSearch ? '' : search}
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
                onKeyDown={(e) => handleOpenSearch(e)}
              />
            </button>
            {currentUser && (
              <button
                className={styles.addPostBtn}
                onClick={() => setAddPost(!addPost)}
              >
                <AiOutlinePlus />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
