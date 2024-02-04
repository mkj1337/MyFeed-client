import styles from '../../pages/Profile/Profile.module.scss';

import { useState } from 'react';
import CategoryButtons from '../CategoryButtons/CategoryButtons';
import { CONTENT_TYPE } from '../../constants';
import {  PostProps } from '../../interfaces/posts';
import { Loader } from '../Loader/Loader';
import { Media } from '../Media/Media';
import Posts from '../Posts/Posts';

interface ProfileContentProps {
    isLoading: boolean;
    error: string;
    posts: PostProps[];
}

const ProfileContent = ({isLoading, error, posts}: ProfileContentProps) => {
  const [category, setCategory] = useState<string>('posts');

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
    return [];
  };
  return (
    <>
      <CategoryButtons
        setCategory={setCategory}
        category={category}
        secondCat="media"
      />
      <div
        className={
          category === CONTENT_TYPE.posts
            ? styles.postsContainer
            : getImages().length > 0
            ? styles.mediaPost
            : ''
        }
      >
        {error && <span>{ error}</span>}
        {category === CONTENT_TYPE.media ? (
          isLoading ? (
            <div className={styles.loaderContainer}>
              <Loader />
            </div>
          ) : getImages().length > 0 ? (
            getImages().map((post: any) => <Media key={post.id} {...post} />)
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
          isLoading ? (
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
  );
};

export default ProfileContent;
