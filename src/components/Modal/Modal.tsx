import { AnimatePresence, motion } from 'framer-motion';

import styles from './Modal.module.scss';
import { useEffect } from 'react';

type ImageToFullScreenProps = {
  children: React.ReactElement;
  close: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
};

const Modal = ({ children, close, isActive }: ImageToFullScreenProps) => {
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isActive]);

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          className={styles.modalV1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => close(false)}
        >
          <div className={styles.container} onClick={(e) => e.preventDefault()}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
