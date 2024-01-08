import './Comments.scss';
import { SingleComment } from './SingleComment';

const Comments = ({ comments }: any) => {
  const rootComments = comments.filter((comment: any) => !comment.parentId);

  return (
    <div className="nested-comments">
      {rootComments.map((comment: any) => (
        <SingleComment key={comment.id} comment={comment} comments={comments} />
      ))}
    </div>
  );
};

export default Comments;
