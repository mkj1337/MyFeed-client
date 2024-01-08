import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import styles from './PopUp.module.scss';

interface PopUpProps {
  title: string;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  callback?: () => Promise<void>;
}

const PopUp = ({ title, isActive, setIsActive, callback }: PopUpProps) => {
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className={styles.popUp} onClick={() => setIsActive(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={styles.container}
            onClick={(e) => e.stopPropagation()}
          >
            <p className={styles.message}>{title}</p>
            <div className={styles.controls}>
              <button
                onClick={() => setIsActive(false)}
                className={styles.controlsReject}
              >
                reject
              </button>
              <button onClick={callback} className={styles.controlsAccept}>
                accept
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopUp;
