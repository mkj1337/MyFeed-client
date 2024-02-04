import styles from './Profile.module.scss';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Components
import { Loader } from '../../components/Loader/Loader';
import { useFetch } from '../../hooks/useFetch';
import { EditProfileModal } from '../../components/EditProfileModal/EditProfileModal';
import ImageToFullScreen from '../../components/ImageToFullScreen/ImageToFullScreen';
import SecondModal from '../../components/SecondModal/SecondModal';
import ProfileContent from '../../components/ProfileContent/ProfileContent';
import ProfileInfo from '../../components/ProfileInfo/ProfileInfo';

const Profile = () => {
  const username = useLocation().pathname.split('/')[2];
  const [editActive, setEditActive] = useState<boolean>(false);
  const [followersActive, setFollowersActive] = useState<boolean>(false);
  const [isImageFull, setIsImageFull] = useState<boolean>(false);

  // fetch posts
  const {
    isLoading: isPostLoading,
    error: postError,
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

  useEffect(() => {
    if (userInfo) {
      document.documentElement.style.setProperty(
        '--bg',
        `url(${userInfo[0]?.profileImg})`
      );
    }
  }, [userInfo]);

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
              <ProfileInfo
                posts={posts}
                username={username}
                userInfo={userInfo}
                setIsImageFull={setIsImageFull}
                setEditActive={setEditActive}
                setFollowersActive={setFollowersActive}
                followers={followers}
              />
              <hr />
              <ProfileContent
                isLoading={isPostLoading}
                error={postError}
                posts={posts}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
