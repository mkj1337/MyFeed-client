import styles from './SecondModal.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import { scaleVariants } from '../../animation/Animations';
import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { AiOutlineUser } from 'react-icons/ai';
import { useEffect } from 'react';

interface User {
  id: number;
  name: string;
  username: string;
  userImg?: string;
}

interface SecondModalProps {
  close: React.Dispatch<React.SetStateAction<boolean>>;
  activeModal: boolean;
  users: User[];
  title?: string;
}

const SecondModal = ({
  close,
  activeModal,
  users,
  title,
}: SecondModalProps) => {
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activeModal]);

  return (
    <AnimatePresence mode="wait" onExitComplete={() => close(false)}>
      {activeModal && (
        <div className={styles.secondModal} onClick={() => close(false)}>
          <motion.div
            variants={scaleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={styles.container}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.top}>
              <h1>{title ? title : 'Followers'}</h1>
              <div className="close-btn" onClick={() => close(false)}>
                <IoClose />
              </div>
            </div>
            <hr />
            <ul className="followers">
              {users?.length > 0 &&
                users.map((user) => (
                  <li className={styles.users} key={user.id}>
                    <Link
                      to={`/profile/${user.username}`}
                      className={`${styles.link} ${styles.userInfo}`}
                      onClick={() => close(false)}
                    >
                      {user.userImg ? (
                        <img src={user.userImg} alt="" />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          <AiOutlineUser />
                        </div>
                      )}
                      <div>{user.name}</div>
                    </Link>
                    <hr />
                  </li>
                ))}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default SecondModal;
