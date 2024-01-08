import styles from './Trending.module.scss';

const Trending = () => {
  return (
    <div className={styles.trending}>
      <div className={styles.trendingContainer}>
        <h1>Trending</h1>
        <div className={styles.trendingContent}>
          {[0, 1, 2, 3, 4].map((_, index) => (
            <div className={styles.trendingItem} key={index}>
              <h3 className={styles.trendingTitle}>{`#item${index + 1}`}</h3>
              <span className={styles.trendingQuantity}>
                {Math.floor(Math.random() * 1000)} posts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trending;
