import styles from './PostCard.module.scss';
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
        className={styles.singlePost}
      >
        <div className={styles.userInfo}>
          <Link to={`/profile/${username}`}>
            <div className={styles.userImage}>
              {userImg ? (
                <img src={userImg} alt="" />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <AiOutlineUser />
                </div>
              )}
            </div>
            <span>{name}</span>
          </Link>
          <div
            className={styles.shareButton}
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
        <Link to={`/post/${postId}`} className={styles.content}>
          {postText && postText.length > 270 ? (
            <>
              {collapseContent ? (
                <p
                  className={styles.desc}
                  dangerouslySetInnerHTML={{ __html: message }}
                />
              ) : (
                <p
                  className={styles.desc}
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
              className={styles.desc}
              dangerouslySetInnerHTML={{ __html: purify.sanitize(message) }}
            />
          )}
          <div className={styles.mediaContainer}>
            {media.length > 0 &&
              media.map((m: any) => <PostMedia key={m.id} {...m} />)}
          </div>
        </Link>
        <div className={styles.postInfo}>
          <div className={styles.buttons}>
            <div className={styles.buttonsLeft}>
              <div className={styles.heartBtn}>
                <motion.div variants={buttonVariants} whileTap="tap">
                  {liked ? (
                    <FaHeart className={`${styles.btn} ${styles.active}`} onClick={disLike} />
                  ) : (
                    <FaRegHeart className={styles.btn} onClick={sendLike} />
                  )}
                </motion.div>
                {postLikes.length > 0 && <span>{postLikes.length}</span>}
              </div>
              <div className={styles.chat}>
                <BsChat className={styles.btn} color="white" />
                {comments.length > 0 && <span>{comments.length}</span>}
              </div>
              <div className={styles.chat}>
                <FiRepeat className={styles.btn} />
              </div>
            </div>
            <div className={styles.buttonsRight}>
              <div className={styles.createdAt}>
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
