// styles
import './Comments.scss';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineUser, AiOutlineGif } from 'react-icons/ai';
import { useAuth } from '../../context/AuthContext';
import CreatePost from '../CreatePost/CreatePost';
import dayjs from 'dayjs';
import axios from 'axios';
import ImageToFullScreen from '../ImageToFullScreen/ImageToFullScreen';
import PopUp from '../PopUp/PopUp';


export interface CommentsProps {
  userId?: string;
  userImg?: string;
  commentGif?: string;
  commentImg?: string;
  parentId: string | number;
  replies?: any;
  name: string;
  desc: string;
  createdAt: string;
  toComment?: boolean;
  commentId?: (commentId: string | number) => void;
}

export const SingleComment = ({ comments, comment }: any) => {
  const childComments = comments.filter((c: any) => c.parentId === comment.id);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [contentExpand, setContentExpand] = useState(false);
  const [isReply, setIsReply] = useState<boolean>(false);
  const [isActive, setIsActive] = useState(false);
  const [isImageActive, setIsImageActive] = useState(false);

  const deleteComment = async () => {
    try {
      await axios.post('/api/posts/comments/delete', { commentId: comment.id });
      navigate(0);
    } catch (err) {
      console.log(err);
    }
  };

  const canReply = Boolean(currentUser);
  const canDelete = currentUser?.id === comment.userId;
  return (
    <>
      <PopUp
        title="Are you sure you want to delete this comment?"
        isActive={isActive}
        setIsActive={setIsActive}
        callback={deleteComment}
      />
      <ImageToFullScreen
        isActive={isImageActive}
        close={setIsImageActive}
        images={
          comment.commentImg
            ? [{ post_img: comment.commentImg }]
            : [{ post_img: comment.commentGif }]
        }
      />
      <div className="singleComment">
        <div className="userComment">
          <Link
            to={`/profile/${comment.username}`}
            className="userInfoComment link"
          >
            {comment.userImg ? (
              <img src={comment.userImg} alt="" />
            ) : (
              <div className="imgPlaceHolder">
                <AiOutlineUser />
              </div>
            )}
            <div>{comment.name}</div>
          </Link>
          <span className="createdAt">
            {dayjs(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="comment" onClick={() => setContentExpand(!contentExpand)}>
          {comment.commentText?.length > 80
            ? contentExpand
              ? comment.commentText
              : `${comment.commentText.slice(0, 80)}...`
            : comment.commentText}
        </p>
        {(comment.commentImg || comment.commentGif) && (
          <div className="media" onClick={() => setIsImageActive(true)}>
            <img src={comment.commentImg || comment.commentGif} alt="" />
            {comment.commentGif && (
              <div className="gif-cap">
                <AiOutlineGif />
              </div>
            )}
          </div>
        )}
        <div className="comment-options">
          {canReply && (
            <div className="option" onClick={() => setIsReply((prev) => !prev)}>
              Reply
            </div>
          )}
          {canDelete && (
            <div className="option" onClick={() => setIsActive(true)}>
              Delete
            </div>
          )}
        </div>
        {isReply && <CreatePost comment parentId={comment.id} />}

        <div className="replies">
          {childComments.map((childComment: any, index: any) => (
            <SingleComment
              key={index}
              comment={childComment}
              comments={comments}
            />
          ))}
        </div>
      </div>
    </>
  );
};
