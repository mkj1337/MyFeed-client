import styles from './Leftbar.module.scss';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

// Icons
import { BiHomeAlt } from 'react-icons/bi';
import { IoPlayOutline, IoChatbubblesOutline } from 'react-icons/io5';
import { IoIosLogOut } from 'react-icons/io';
import { AiOutlineFire, AiOutlineUser } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { buttonVariants } from '../../animation/Animations';
import { useMenu } from '../../context/MenuContext';
import FriendsList from '../FriendsList/FriendsList';
import { useFetch } from '../../hooks/useFetch';
import { useEffect, useState } from 'react';
import useMediaQuery from '../../hooks/useMediaQuerie';
import PopUp from '../PopUp/PopUp';

const Leftbar = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { showMenu, changeMenu } = useMenu();
  const [isActive, setIsActive] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 800px)');

  const handleSignOut = async (): Promise<void> => {
    try {
      await axios.post('/api/auth/signout', {
        withCredentials: true,
      });
      setCurrentUser(null);
      localStorage.removeItem('user');
      handleMenu();
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const { data: friends, isLoading: isFriendsLoading } = useFetch({
    baseURL: '/api/users',
  });

  const handleMenu = () => {
    changeMenu(showMenu === styles.active ? '' : styles.active);
  };

  useEffect(() => {
    if (showMenu === styles.active && !isDesktop) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showMenu]);

  return (
    <>
      <PopUp
        title="Do you want to sign out ?"
        isActive={isActive}
        setIsActive={setIsActive}
        callback={handleSignOut}
      />
      <div className={`${styles.leftbar} ${showMenu}`}>
        <div className={styles.menu}>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            className={styles.item}
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
              onClick={handleMenu}
            >
              <BiHomeAlt className={styles.icon} />
              <h3>Home</h3>
            </NavLink>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            className={styles.item}
          >
            <div className={styles.container} onClick={() => setIsActive(true)}>
              <IoIosLogOut className={styles.icon} />
              <h3>Sign out</h3>
            </div>
          </motion.div>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            className={styles.item}
          >
            <NavLink
              to={`/profile/${currentUser?.username}`}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
              onClick={handleMenu}
            >
              {currentUser?.userImg ? (
                <img src={currentUser?.userImg} alt={``} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <AiOutlineUser />
                </div>
              )}
              <h3 style={{ textTransform: 'capitalize' }}>
                {currentUser?.username}
              </h3>
            </NavLink>
          </motion.div>
          <hr />
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            className={styles.item}
          >
            <NavLink to="*" onClick={handleMenu}>
              <AiOutlineFire className={styles.icon} />
              <h3>Trending</h3>
            </NavLink>
          </motion.div>
          {currentUser && (
            <>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                className={styles.item}
              >
                <NavLink to="/following" onClick={handleMenu}>
                  <IoPlayOutline className={styles.icon} />
                  <h3>Following</h3>
                </NavLink>
              </motion.div>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                className={styles.item}
              >
                <NavLink to="/messages" onClick={handleMenu}>
                  <IoChatbubblesOutline className={styles.icon} />
                  <h3>Messages</h3>
                </NavLink>
              </motion.div>
            </>
          )}
          <hr />
          <FriendsList friends={friends} isFriendsLoading={isFriendsLoading} />
          <hr />
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            className={`${styles.item} ${styles.settings}`}
          >
            <NavLink to="/settings/account" onClick={handleMenu}>
              <FiSettings className={styles.icon} />
              <h3>Settings</h3>
            </NavLink>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Leftbar;
