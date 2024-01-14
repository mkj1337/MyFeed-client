import axios from 'axios';
import './EditPostModal.scss';
import { FormEvent, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// icons
import { useNavigate } from 'react-router-dom';
import { scaleVariants } from '../../animation/Animations';
import { toast } from 'react-toastify';

interface postMedia {
  id: number;
  post_gif?: string;
  post_id?: string;
  post_img?: string;
  post_video?: string;
}

interface EditPostModalProps {
  close: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  postId: number | string;
  postMedia?: postMedia[];
  postDesc?: string;
}

export const EditPostModal = ({
  close,
  isOpen,
  postId,
  postMedia,
  postDesc,
}: EditPostModalProps) => {
  const [text, setDesc] = useState<string>(postDesc ? postDesc : '');
  const navigate = useNavigate();

  const isDisabled = () => {
    if (text === postDesc || text.length > 499) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('text', text);
      if (postMedia) {
        data.append('post_media', JSON.stringify(postMedia));
      }
      const res = await axios.post(`/api/posts/edit/${postId}`, data, {
        withCredentials: true,
      });
      close(false);
      toast.success(res.data.message);
      setTimeout(() => navigate(0), 150);
    } catch (err) {
      console.log(err);
    }
  };

  const media = postMedia
    ?.filter((d: any) => d.post_img || d.post_video)
    .map((i: any) => {
      return {
        post_img:
          i.post_img === null
            ? null
            : 'photos/' + i.post_img?.split('/')[8].split('.')[0],
        post_video:
          i.post_video === null
            ? null
            : 'videos/' + i.post_video?.split('/')[8]?.split('.')[0],
      };
    });

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();

    const post_media = media ? media : null;
    try {
      const res = await axios.post(
        `/api/posts/delete/${postId}`,
        { post_media },
        { withCredentials: true }
      );
      close(false);
      setTimeout(() => navigate(-1), 150);
      toast.success(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait" onExitComplete={() => close(false)}>
      {isOpen && (
        <div className={`editPostModal`} onClick={() => close(false)}>
          <motion.form
            variants={scaleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="wrapperAddPost"
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="postDesc">
              <textarea
                placeholder="text"
                maxLength={500}
                value={text}
                onChange={(e) => setDesc(e.target.value)}
              ></textarea>
              <span
                className={
                  text?.length >= 0 && text.length < 500
                    ? 'descLength'
                    : 'maxLength'
                }
              >
                {text ? text.length : 0} / 500
              </span>
            </div>
            <button onClick={handleDelete} className="delete">
              DELETE POST
            </button>
            <button className="submit" type="submit" disabled={isDisabled()}>
              SUBMIT CHANGES
            </button>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
};
