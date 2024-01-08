import styles from './Media.module.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { scale2Variants } from '../../animation/Animations';
import { Link } from 'react-router-dom';

//icons
import { RxViewNone } from 'react-icons/rx';
import { FaHeart } from 'react-icons/fa';
import { BsFillChatFill } from 'react-icons/bs';
import { PostMediaProps } from '../../interfaces/posts';

export const Media = ({ ...post }: PostMediaProps) => {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);

  useEffect(() => {
    const getLike = async () => {
      const { data } = await axios.get(`/api/likes/post/${post?.post_id}`);
      setLikes(data.length);
    };
    getLike();
  }, [post?.post_id]);

  useEffect(() => {
    const getLike = async () => {
      const { data } = await axios.get(`/api/likes/${post?.post_id}`);
      setLiked(data.length ? true : false);
    };
    getLike();
  }, [liked]);

  return (
    <Link to={`/post/${post.post_id}`}>
      <motion.div
        variants={scale2Variants}
        initial="hidden"
        animate="visible"
        className={styles.wrapper}
      >
        <div className={styles.box}>
          {post.post_img ? (
            <img src={post?.post_img} alt="" className="img" />
          ) : (
            <div className={styles.postPlaceHolder}>
              <RxViewNone />
            </div>
          )}
          <div className={styles.postStats}>
            <span>
              {liked ? <FaHeart color="red" /> : <FaHeart color="white" />}{' '}
              {likes || 0}
            </span>
            <span>
              <BsFillChatFill color="white" /> 0
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
