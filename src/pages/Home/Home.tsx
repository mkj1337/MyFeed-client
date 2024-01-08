import styles from './Home.module.scss';

// Components
import { usePosts } from '../../hooks/usePosts';
import { useState } from 'react';
import CategoryButtons from '../../components/CategoryButtons/CategoryButtons';
import CreatePost from '../../components/CreatePost/CreatePost';
import { useAuth } from '../../context/AuthContext';
import Trending from '../../components/Trending/Trending';
import { PostProps } from '../../interfaces/posts';
import SkeletonLoading from '../../components/SkeletonLoading/SkeletonLoading';
import Posts from '../../components/Posts/Posts';
import { CONTENT_TYPE } from '../../constants';

export const Home = () => {
  const [category, setCategory] = useState<string>('posts');
  const [refresh, setRefresh] = useState<boolean>(false);
  const { currentUser } = useAuth();

  const { isLoading: isPostsLoading, posts } = usePosts<PostProps>({
    baseURL: '/api/posts',
    dep: refresh,
  });

  return (
    <div className={`sideWrapper ${styles.home}`}>
      <div className={styles.container}>
        {currentUser && <CreatePost />}
        <CategoryButtons
          setRefresh={setRefresh}
          refresh={refresh}
          setCategory={setCategory}
          category={category}
          seconds_cat="media"
        />

        {category === CONTENT_TYPE.posts && <Posts posts={posts} />}
        {category === CONTENT_TYPE.posts &&
          (!isPostsLoading || posts.length > 0) &&
          [1, 2, 3].map((postId) => <SkeletonLoading key={postId} />)}
        {category === CONTENT_TYPE.media && <div>not available yet.</div>}
        {isPostsLoading &&
          [1, 2, 3].map((postId) => <SkeletonLoading key={postId} />)}
      </div>
      <Trending />
    </div>
  );
};

export default Home;
