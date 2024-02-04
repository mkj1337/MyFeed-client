import { useState } from 'react';
import { CONTENT_TYPE } from '../../constants';
import CategoryButtons from '../CategoryButtons/CategoryButtons';
import { PostProps } from '../../interfaces/posts';
import SkeletonLoading from '../SkeletonLoading/SkeletonLoading';
import Posts from '../Posts/Posts';
import { usePosts } from '../../hooks/usePosts';
import { CurrentUserProps } from '../../interfaces/users';

interface PageContentProps {
  baseUrl?: string;
  following?: boolean;
  currentUser?: CurrentUserProps | null;
}

const PageContent = ({
  baseUrl = '/api/posts',
  following = false,
  currentUser,
}: PageContentProps) => {
  const [category, setCategory] = useState<string>('posts');
  const [refresh, setRefresh] = useState<boolean>(false);

  const { isLoading, posts } = usePosts<PostProps>({
    type: following ? 'POST' : 'GET',
    baseURL: baseUrl,
    dep: refresh,
    sendData: following ? [currentUser?.username] : null
  });

  return (
    <>
      <CategoryButtons
        setRefresh={setRefresh}
        refresh={refresh}
        setCategory={setCategory}
        category={category}
        secondCat="media"
      />

      {category === CONTENT_TYPE.posts && <Posts posts={posts} />}
      {category === CONTENT_TYPE.posts &&
        (!isLoading || posts.length > 0) &&
        [1, 2, 3].map((postId) => <SkeletonLoading key={postId} />)}
      {category === CONTENT_TYPE.media && <div>not available yet.</div>}
      {isLoading && [1, 2, 3].map((postId) => <SkeletonLoading key={postId} />)}
    </>
  );
};

export default PageContent;
