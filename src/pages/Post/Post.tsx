import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import purify from 'dompurify';

import styles from './Post.module.scss';

//icons
import { IoArrowBackSharp } from 'react-icons/io5';
import { useFetch } from '../../hooks/useFetch';
import { useEffect, useRef, useState } from 'react';
import ShareModal from '../../components/ShareModal/ShareModal';
import { FiRepeat } from 'react-icons/fi';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { BsChat } from 'react-icons/bs';
import { AiFillEdit, AiOutlineUser } from 'react-icons/ai';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import CreatePost from '../../components/CreatePost/CreatePost';
import { useDoubleTap } from 'use-double-tap';
import { CommentProps } from '../../interfaces/comments';
import { generateRandomNum, replaceMessage } from '../../utils/utils';
import { buttonVariants } from '../../animation/Animations';
import Comments from '../../components/Comments/Comments';
import { EditPostModal } from '../../components/EditPostModal/EditPostModal';
import PostMedia from '../../components/PostMedia/PostMedia';
import ImageToFullScreen from '../../components/ImageToFullScreen/ImageToFullScreen';
import SkeletonLoading from '../../components/SkeletonLoading/SkeletonLoading';
import SecondModal from '../../components/SecondModal/SecondModal';

const Post = () => {
  const location = useLocation().pathname.split('/');
  const [showShare, setShowShare] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [doubleClick, setDoubleClick] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [postLikes, setPostLikes] = useState<any>(0);
  const [editPost, setEditPost] = useState<boolean>(false);
  const [showLikes, setShowLikes] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [isNewComment, setIsNewComment] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showImageFull, setShowImageFull] = useState<boolean>(false);
  const postId = location[2];
  const { currentUser } = useAuth();
  const activeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: post, isLoading: isPostLoading } = useFetch({
    baseURL: `/api/posts/${postId}`,
  });

  const handleShare = () => {
    setShowShare(true);
  };

  const message = replaceMessage(post?.postText);

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
      const { data } = await axios.get(`/api/likes/post/${postId}`);
      setPostLikes(data);
    };
    getLikes();
  }, [liked]);

  useEffect(() => {
    const getLike = async () => {
      const { data } = await axios.get(`/api/likes/${postId}`);
      setLiked(data.length ? true : false);
    };
    getLike();
  }, [liked]);

  const bindDoubleClick = useDoubleTap((e: any) => {
    liked ? null : sendLike();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setCursorPosition({
      x: e.clientX - rect.left - 50,
      y: e.clientY - rect.top - 50,
    });
    setDoubleClick(true);
    setTimeout(() => {
      setDoubleClick(false);
    }, 700);
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `/api/posts/post/comments/${post?.id}`
        );
        setComments(data);
        setIsNewComment(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchComments();
  }, [post?.id, isNewComment]);

  const handleImageToFullScreen = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLImageElement) {
      setShowImageFull(true);
    }
  };

  dayjs.extend(relativeTime);
  dayjs.extend(customParseFormat);
  
  return (
    <>
      <SecondModal
        close={setShowLikes}
        activeModal={showLikes}
        users={postLikes}
        title="Likes"
      />
      {post && (
        <EditPostModal
          key={post?.id}
          close={setEditPost}
          isOpen={editPost}
          postId={post.id}
          postMedia={post?.media}
          postDesc={post?.postText}
        />
      )}
      {post && (
        <ImageToFullScreen
          images={post?.media}
          close={setShowImageFull}
          isActive={showImageFull}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      )}

      <div className={styles.post}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.backBtn}>
              <IoArrowBackSharp size={20} onClick={() => navigate(-1)} />
            </div>
            <h1>Post</h1>
          </div>
          <hr />
          {isPostLoading && <SkeletonLoading />}
          {!isPostLoading && (
            <>
              <div className={styles.userInfo}>
                <Link
                  to={`/profile/${post?.username}`}
                  className={styles.userWrapper}
                >
                  <div className={styles.userImage}>
                    {post?.userImg ? (
                      <img src={post?.userImg} alt="" loading="lazy" />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        <AiOutlineUser />
                      </div>
                    )}
                  </div>
                  <span>{post?.name}</span>
                </Link>
                <div className={styles.infoRight}>
                  <div
                    className={styles.shareButton}
                    onMouseEnter={handleShare}
                    onMouseLeave={() => setShowShare(false)}
                  >
                    {showShare ? (
                      <ShareModal
                        url={`https://devdomain.site/profile/${post?.username}`}
                      />
                    ) : (
                      <BiDotsHorizontalRounded />
                    )}
                  </div>
                  {currentUser?.username == post?.username && (
                    <div
                      className={styles.editBtn}
                      onClick={() => setEditPost(true)}
                    >
                      <AiFillEdit />
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.postContent} {...bindDoubleClick}>
                {doubleClick && currentUser && (
                  <motion.div
                    initial={{
                      opacity: 1,
                      scale: 1.1,
                      rotate: generateRandomNum(0, 30),
                      x: cursorPosition.x,
                      y: cursorPosition.y,
                    }}
                    animate={{
                      opacity: 0,
                      scale: 0.5,
                      transition: { duration: 0.7 },
                    }}
                    className={styles.likeBox}
                    ref={activeRef}
                  >
                    <FaHeart />
                  </motion.div>
                )}
                {post?.postText && (
                  <p
                    className={styles.desc}
                    dangerouslySetInnerHTML={{
                      __html: purify.sanitize(message),
                    }}
                  />
                )}
                <div
                  className="media-container"
                  onClick={(e) => handleImageToFullScreen(e)}
                >
                  {post?.media.length > 0 &&
                    post?.media.map((m: any, index: number) => (
                      <PostMedia
                        key={m.id}
                        {...m}
                        setCurrentIndex={() => setCurrentIndex(index)}
                      />
                    ))}
                </div>
              </div>
              <hr />
              <div className={styles.postInfo}>
                <div className={styles.buttons}>
                  <div className={styles.buttonsWrapper}>
                    <div className={styles.heartBtn}>
                      <motion.div variants={buttonVariants} whileTap="tap">
                        {liked ? (
                          <FaHeart
                            className={`${styles.btn} ${styles.active}`}
                            onClick={disLike}
                          />
                        ) : (
                          <FaRegHeart
                            className={styles.btn}
                            onClick={sendLike}
                          />
                        )}
                      </motion.div>
                      <span onClick={() => setShowLikes(true)}>
                        {postLikes.length}
                      </span>
                    </div>
                    <div className={styles.chat}>
                      <BsChat className={styles.btn} />
                      <span>{comments.length}</span>
                    </div>
                    <div className={styles.repost}>
                      <FiRepeat className={styles.btn} />
                    </div>
                  </div>

                  <div className={styles.createdAt}>
                    {post?.updatedAt ? (
                      <>
                        <div>updated</div>
                        {dayjs(post?.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
                      </>
                    ) : (
                      dayjs(post?.createdAt).startOf('seconds').fromNow()
                    )}
                  </div>
                </div>
              </div>
              <hr />
              {currentUser?.id && <CreatePost comment />}

              {comments.length > 0 ? (
                <Comments comments={comments} />
              ) : (
                <p style={{ textAlign: 'center', paddingTop: '130px' }}>
                  <b>No Comments Yet!</b>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Post;
