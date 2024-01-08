import styles from './Loader.module.scss';

export const Loader = () => {
  return (
    <div className={styles.waveLoader}>
      <div className={styles.shimmeringWave}></div>
    </div>
  );
};
