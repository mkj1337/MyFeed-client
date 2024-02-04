import React, { useRef } from 'react';
import styles from '../../pages/Profile/Profile.module.scss';
import { motion } from 'framer-motion';
import purify from 'dompurify';

// Icons
import {
  AiOutlineInstagram,
  AiOutlineYoutube,
  AiOutlineUser,
  AiOutlineLinkedin,
  AiFillEdit,
} from 'react-icons/ai';
import { SlLocationPin } from 'react-icons/sl';

// Components
import FollowButton from '../../components/FollowButton/FollowButton';
import { scale2Variants } from '../../animation/Animations';
import { useAuth } from '../../context/AuthContext';
import { replaceMessage } from '../../utils/utils';
import { PostProps } from '../../interfaces/posts';
import { CurrentUserProps, User } from '../../interfaces/users';

interface ProfileInfoProps {
  posts: PostProps[];
  username: string;
  userInfo: CurrentUserProps | any;
  setIsImageFull: React.Dispatch<React.SetStateAction<boolean>>;
  setFollowersActive: React.Dispatch<React.SetStateAction<boolean>>;
  setEditActive: React.Dispatch<React.SetStateAction<boolean>>;
  followers: User[];
}

const ProfileInfo = ({
  posts,
  username,
  userInfo,
  setIsImageFull,
  setFollowersActive,
  setEditActive,
  followers,
}: ProfileInfoProps) => {
  const { currentUser } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  const countAmoutOfMedia = () => {
    if (posts?.length > 0) {
      return posts?.reduce((acc: any, curr: any) => {
        const images = curr.media.filter((img: any) => img.post_img);
        return acc + images.length;
      }, 0);
    }
    return 0;
  };

  const bioParsed = replaceMessage(userInfo ? userInfo[0]?.bio || ' ' : '');

  return (
    <motion.div
      variants={scale2Variants}
      initial="hidden"
      animate="visible"
      className={styles.userProf}
      ref={profileRef}
    >
      <div className={styles.profilePic}>
        {userInfo[0]?.userImg ? (
          <img
            src={userInfo[0]?.userImg}
            alt=""
            loading="lazy"
            onClick={() => setIsImageFull(true)}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <AiOutlineUser />
          </div>
        )}
      </div>
      <div className={styles.userInfo}>
        {userInfo[0]?.name && (
          <h2 className={styles.name}>{userInfo[0]?.name}</h2>
        )}
        {userInfo[0]?.username && (
          <p className={styles.username}>@{userInfo[0]?.username}</p>
        )}
        <div className={styles.socialMedia}>
          {userInfo[0]?.instagram_url && (
            <a href={userInfo[0]?.instagram_url} target={'_blank'}>
              <AiOutlineInstagram />
            </a>
          )}
          {userInfo[0]?.x_url && (
            <a href={userInfo[0]?.x_url} target={'_blank'}>
              <AiOutlineLinkedin />
            </a>
          )}
          {userInfo[0]?.youtube_url && (
            <a href={userInfo[0]?.youtube_url} target={'_blank'}>
              <AiOutlineYoutube />
            </a>
          )}
        </div>
        {userInfo[0]?.location && (
          <div className={styles.location}>
            <SlLocationPin />
            <span>{userInfo[0]?.location.toUpperCase()}</span>
          </div>
        )}
        {currentUser?.username.toString() === username ? (
          ''
        ) : (
          <div className={styles.buttons}>
            <FollowButton username={username} />
            <button>Message</button>
          </div>
        )}
        <div className={styles.info}>
          <div>
            {posts?.length > 0 ? posts?.length + ' ' : '0 '}
            <span>Posts</span>
          </div>
          <div>
            {countAmoutOfMedia()}
            <span> Media</span>
          </div>
          <div
            onClick={() =>
              followers?.length ? setFollowersActive(true) : null
            }
            style={{ cursor: 'pointer' }}
          >
            {followers?.length || 0}
            <span> Followers</span>
          </div>
        </div>
        {bioParsed.length && (
          <p
            className={styles.bio}
            dangerouslySetInnerHTML={{
              __html: purify.sanitize(bioParsed),
            }}
          />
        )}
      </div>
      {currentUser?.username.toString() === username && (
        <div className={styles.edit}>
          <button onClick={() => setEditActive(true)}>
            <AiFillEdit />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileInfo;
