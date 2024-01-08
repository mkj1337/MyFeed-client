import axios from 'axios';
import './EditPostModal.scss';
import { FormEvent, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// icons
import { useNavigate } from 'react-router-dom';
import { scaleVariants } from '../../animation/Animations';
import { toast } from 'react-toastify';

type EditPostModalProps = {
  close: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  postId: number | string;
  postSrc?: string | null;
  postDesc?: string;
};

export const EditPostModal = ({
  close,
  isOpen,
  postId,
  postSrc,
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
      if (postSrc) {
        data.append('public_id', postSrc);
      }
      const res = await axios.post(`/api/posts/edit/${postId}`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      close(false);
      toast.success(res.data.message);
      setTimeout(() => navigate(0), 150);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();

    const public_id = postSrc ? postSrc : null;
    try {
      const res = await axios.post(
        `/api/posts/delete/${postId}`,
        { public_id },
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
            <button className='submit' type="submit" disabled={isDisabled()}>
              SUBMIT CHANGES
            </button>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
};
