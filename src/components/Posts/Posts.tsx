import SinglePost from './PostCard/PostCard';

const Posts = ({ posts }: any) => {
  return (
    <>
      {posts.map((post: any) => {
        return <SinglePost post={post} key={post.id} />;
      })}
    </>
  );
};

export default Posts;
