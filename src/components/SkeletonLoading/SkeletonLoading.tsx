import styles from './SkeletonLoading.module.scss';

const SkeletonLoading = () => {
  return (
    <div className={`${styles.loader} ${styles.skeletonPost}`}>
      <div className={styles.skeletonAvatar}></div>
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonHeader}></div>
        <div className={styles.skeletonText}></div>
      </div>
    </div>
  );
};

export const AvatarLoading = () => {
  return (
    <div
      className={`${styles.loader} ${styles.skeletonPost} ${styles.friends}`}
    >
      <div className={styles.skeletonAvatar}></div>
    </div>
  );
};

export default SkeletonLoading;
