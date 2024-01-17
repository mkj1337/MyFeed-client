import styles from './FriendsList.module.scss';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buttonVariants } from '../../animation/Animations';
import { AiOutlineUser } from 'react-icons/ai';
import { CurrentUserProps } from '../../interfaces/users';
import { AvatarLoading } from '../SkeletonLoading/SkeletonLoading';

interface FriendsListProps {
  friends: CurrentUserProps[];
  isFriendsLoading: boolean;
}

const FriendsList = ({ friends, isFriendsLoading }: FriendsListProps) => {
  console.log(isFriendsLoading);
  return (
    <div className={styles.friendsList}>
      {isFriendsLoading &&
        [1, 2, 3].map((postId) => <AvatarLoading key={postId} />)}
      {friends?.length > 0 &&
        friends.map((friend) => (
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            className={styles.friend}
            key={friend.id}
          >
            <NavLink
              to={`/profile/${friend?.username}`}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <div className={styles.userImage}>
                <div className={styles.statusBadge}></div>
                {friend?.userImg ? (
                  <img src={friend?.userImg} alt={``} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <AiOutlineUser />
                  </div>
                )}
              </div>

              <h3 style={{ textTransform: 'capitalize' }}>{friend?.name}</h3>
            </NavLink>
          </motion.div>
        ))}
    </div>
  );
};

export default FriendsList;
