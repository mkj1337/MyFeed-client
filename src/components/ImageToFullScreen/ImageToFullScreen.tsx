import { AnimatePresence, motion } from 'framer-motion';

import styles from './ImageToFullScreen.module.scss';
import { useEffect } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { IoClose } from 'react-icons/io5';

type ImageToFullScreenProps = {
  images: any;
  close: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
  currentIndex?: number;
  setCurrentIndex?: React.Dispatch<React.SetStateAction<number>>;
};

const ImageToFullScreen = ({
  images,
  close,
  isActive,
  currentIndex,
  setCurrentIndex,
}: ImageToFullScreenProps) => {
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isActive]);

  const nextSlide = () => {
    setCurrentIndex &&
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
  };

  const prevSlide = () => {
    setCurrentIndex &&
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          className={styles.imageToFull}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => close(false)}
        >
          <div className={styles.imageContainer}>
            <div
              className={`close-btn ${styles.closeBtn}`}
              onClick={() => close(false)}
            >
              <IoClose />
            </div>
            <div
              className={styles.image}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.preventDefault()}
            >
              <img
                src={
                  images[currentIndex || 0].post_img ||
                  images[currentIndex || 0].post_gif
                }
                alt=""
              />
            </div>
            {images.length > 1 && (
              <>
                <div
                  className={`${styles.btn} ${styles.btnPrev}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                >
                  <RiArrowLeftSLine />
                </div>

                <div
                  className={`${styles.btn} ${styles.btnNext}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                >
                  <RiArrowRightSLine />
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageToFullScreen;
