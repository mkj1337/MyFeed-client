import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { BsChat } from 'react-icons/bs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FiRepeat } from 'react-icons/fi';
import { AiOutlineUser } from 'react-icons/ai';
import axios from 'axios';
import purify from 'dompurify';

import './PostCard.scss';
import { replaceMessage } from '../../../utils/utils';
import ShareModal from '../../ShareModal/ShareModal';
import PostMedia from '../../PostMedia/PostMedia';
import { buttonVariants } from '../../../animation/Animations';
import { CommentProps } from '../../../interfaces/comments';

const PostCard = ({ post }: any) => {
  const {
    media,
    userImg,
    name,
    username,
    postText,
    createdAt,
    id: postId,
  } = post;

  const [collapseContent, setCollapseContent] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [postLikes, setPostLikes] = useState<any>(0);
  const [comments, setComments] = useState<CommentProps[]>([]);

  const sendLike = async () => {
    setLiked(true);
    try {
      await axios.post(`/api/likes/${post.id}`);
    } catch (err) {
      setLiked(false);
      console.log(err instanceof Error ? err.message : 'Unexpected error', err);
    }
  };

  const disLike = async () => {
    setLiked(false);
    try {
      await axios.delete(`/api/likes/${post.id}`);
    } catch (err) {
      setLiked(true);
      console.log(err);
    }
  };

  useEffect(() => {
    const getLikes = async () => {
      const { data } = await axios.get(`/api/likes/post/${post?.id}`);
      setPostLikes(data);
    };
    getLikes();
  }, [liked]);

  useEffect(() => {
    const getLike = async () => {
      const { data } = await axios.get(`/api/likes/${post?.id}`);
      setLiked(data.length ? true : false);
    };
    getLike();
  }, [liked]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `/api/posts/post/comments/${post?.id}`
        );
        setComments(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchComments();
  }, []);

  const handleShare = () => {
    setShowShare(true);
  };

  const message = replaceMessage(postText);

  // const handleImageToFullScreen = (e: React.MouseEvent) => {
  //   if (e.target instanceof HTMLImageElement) {
  //     setShowImageFull(true);
  //   }
  // };

  dayjs.extend(relativeTime);
  dayjs.extend(customParseFormat);

  return (
    <AnimatePresence>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -20 },
        }}
        initial={{ y: 10, scale: 0.8, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.1 }}
        key={post.id}
        className="single-post"
      >
        <div className="single-post__top">
          <Link to={`/profile/${username}`}>
            <div className="user-image">
              {userImg ? (
                <img src={userImg} alt="" />
              ) : (
                <div className="img-placeholder">
                  <AiOutlineUser />
                </div>
              )}
            </div>
            <span>{name}</span>
          </Link>
          <div
            className="share-button"
            onMouseEnter={handleShare}
            onMouseLeave={() => setShowShare(false)}
          >
            {showShare ? (
              <ShareModal url={`https://www.devdomain.site/post/${postId}`} />
            ) : (
              <BiDotsHorizontalRounded />
            )}
          </div>
        </div>
        <Link to={`/post/${postId}`} className="single-post__content">
          {postText && postText.length > 270 ? (
            <>
              {collapseContent ? (
                <p
                  className="desc"
                  dangerouslySetInnerHTML={{ __html: message }}
                />
              ) : (
                <p
                  className="desc"
                  dangerouslySetInnerHTML={{
                    __html: message.substring(0, 270),
                  }}
                />
              )}
              <span
                className="collapse-content"
                onClick={() => setCollapseContent((prev) => !prev)}
              >
                {collapseContent ? ' Read less' : ' Read more'}
              </span>
            </>
          ) : (
            <p
              className="desc"
              dangerouslySetInnerHTML={{ __html: purify.sanitize(message) }}
            />
          )}
          <div className="media-container">
            {media.length > 0 &&
              media.map((m: any) => <PostMedia key={m.id} {...m} />)}
          </div>
        </Link>
        <div className="single-post__info">
          <div className="buttons">
            <div className="buttons__left">
              <div className="heartBtn">
                <motion.div variants={buttonVariants} whileTap="tap">
                  {liked ? (
                    <FaHeart className="btn active" onClick={disLike} />
                  ) : (
                    <FaRegHeart className="btn" onClick={sendLike} />
                  )}
                </motion.div>
                {postLikes.length > 0 && <span>{postLikes.length}</span>}
              </div>
              <div className="chat">
                <BsChat className="btn" color="white" />
                {comments.length > 0 && <span>{comments.length}</span>}
              </div>
              <div className="chat">
                <FiRepeat className="btn" />
              </div>
            </div>
            <div className="buttons__right">
              <div className="created-at">
                {dayjs(createdAt).startOf('seconds').fromNow()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostCard;
