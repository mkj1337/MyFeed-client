import styles from './Profile.module.scss';

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import purify from 'dompurify';

import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

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
import { Loader } from '../../components/Loader/Loader';
import CategoryButtons from '../../components/CategoryButtons/CategoryButtons';
import { useFetch } from '../../hooks/useFetch';
import FollowButton from '../../components/FollowButton/FollowButton';
import { scale2Variants } from '../../animation/Animations';
import { EditProfileModal } from '../../components/EditProfileModal/EditProfileModal';
import { replaceMessage } from '../../utils/utils';
import ImageToFullScreen from '../../components/ImageToFullScreen/ImageToFullScreen';
import { Media } from '../../components/Media/Media';
import Posts from '../../components/Posts/Posts';
import { CONTENT_TYPE } from '../../constants';
import SecondModal from '../../components/SecondModal/SecondModal';

const Profile = () => {
  const username = useLocation().pathname.split('/')[2];
  const [editActive, setEditActive] = useState<boolean>(false);
  const [followersActive, setFollowersActive] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('posts');
  const [isImageFull, setIsImageFull] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  // fetch posts
  const {
    isLoading: isPostsLoading,
    error: postsError,
    data: posts,
  } = useFetch({
    baseURL: `/api/posts/user/${username}`,
    dep: username,
  });

  // fetch followers
  const { error: followersError, data: followers } = useFetch({
    baseURL: `/api/follows/followers/${username}`,
    dep: username,
  });
  followersError ? console.error(followersError) : null;

  // fetch likes
  const { error: likesError } = useFetch({
    baseURL: `/api/likes/profile/${username}`,
    dep: username,
  });
  likesError ? console.error(likesError) : null;

  const { error: userInfoError, data: userInfo } = useFetch({
    baseURL: `/api/users/${username}`,
    dep: username,
  });
  userInfoError ? console.error(userInfoError) : null;

  const countAmoutOfMedia = () => {
    if (posts?.length > 0) {
      return posts?.reduce((acc: any, curr: any) => {
        const images = curr.media.filter((img: any) => img.post_img);
        return acc + images.length;
      }, 0);
    }
  };

  const getImages = () => {
    if (posts?.length > 0) {
      // Use map to extract media arrays from each post and flatten them
      const allMedia = posts.map((post: any) => post.media).flat();

      // Use filter to remove any null or undefined values from the array
      const filteredMedia = allMedia.filter(
        (media: any) => media !== null && media !== undefined && media.post_img
      );

      return filteredMedia;
    }
  };

  useEffect(() => {
    if (userInfo) {
      document.documentElement.style.setProperty(
        '--bg',
        `url(${userInfo[0]?.profileImg})`
      );
    }
  }, [userInfo]);

  const bioParsed = replaceMessage(
    userInfo ? userInfo[0]?.bio || ' ' : 'asdasd'
  );

  return (
    <>
      <EditProfileModal close={setEditActive} activeModal={editActive} />
      <SecondModal
        close={setFollowersActive}
        activeModal={followersActive}
        users={followers}
      />
      {userInfo && (
        <ImageToFullScreen
          images={[{ post_img: userInfo[0]?.userImg }]}
          close={setIsImageFull}
          isActive={isImageFull}
        />
      )}
      <div className={styles.profile}>
        <div className={styles.container}>
          {!(userInfo?.length > 0) ? (
            <div className={styles.loader}>
              <Loader />
            </div>
          ) : (
            <>
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
              <hr />
              <CategoryButtons
                setCategory={setCategory}
                category={category}
                seconds_cat="media"
              />
              <div
                className={
                  category === CONTENT_TYPE.posts
                    ? styles.postsContainer
                    : styles.mediaPost
                }
              >
                {postsError && <span>{postsError}</span>}
                {category === CONTENT_TYPE.media ? (
                  isPostsLoading ? (
                    <div className={styles.loaderContainer}>
                      <Loader />
                    </div>
                  ) : posts?.length > 0 ? (
                    getImages().map((post: any) => (
                      <Media key={post.id} {...post} />
                    ))
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '260px',
                      }}
                    >
                      <div>NO PHOTOS</div>
                    </div>
                  )
                ) : null}

                {category === CONTENT_TYPE.posts ? (
                  isPostsLoading ? (
                    <div className={styles.loaderContainer}>
                      <Loader />
                    </div>
                  ) : posts?.length > 0 ? (
                    <div className={styles.posts}>
                      <Posts posts={posts} />
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '260px',
                      }}
                    >
                      <div>NO POSTS</div>
                    </div>
                  )
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
