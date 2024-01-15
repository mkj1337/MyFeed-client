import { AiOutlineGif } from 'react-icons/ai';
import styles from './PostMedia.module.scss';
import { PostMediaProps } from '../../interfaces/posts';

const PostMedia = ({ setCurrentIndex, index, ...m }: PostMediaProps) => {
  return (
    <div className={styles.mediaContent}>
      {m?.post_img || m?.post_gif ? (
        <img
          src={m?.post_img ? m?.post_img : m?.post_gif}
          alt=""
          loading="lazy"
          onClick={() => setCurrentIndex(index)}
        />
      ) : (
        <video controls onClick={() => setCurrentIndex(index)}>
          <source src={m?.post_video} />
        </video>
      )}
      {m?.post_gif && (
        <div className="gif-cap">
          <AiOutlineGif />
        </div>
      )}
    </div>
  );
};

export default PostMedia;
