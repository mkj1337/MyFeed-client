import { useEffect } from 'react';
import styles from './CategoryButtons.module.scss';
import { CONTENT_TYPE } from '../../constants';

interface CategoryButtonsProps {
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  first_cat?: string;
  seconds_cat?: string;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
  refresh?: boolean;
}

const CategoryButtons = ({
  setCategory,
  category,
  setRefresh,
  refresh,
  first_cat,
  seconds_cat,
}: CategoryButtonsProps) => {
  const handleClick = (cat: string) => {
    // window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    setCategory(cat);
    setRefresh && setRefresh((prev) => !prev);
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, [refresh, category]);

  return (
    <div className={styles.category}>
      <button
        onClick={() => handleClick(CONTENT_TYPE.posts)}
        className={category === CONTENT_TYPE.posts ? styles.active : ''}
      >
        {first_cat ? first_cat : 'Posts'}
      </button>
      <button
        onClick={() => handleClick(seconds_cat || 'Media')}
        className={category === seconds_cat ? styles.active : ''}
      >
        {seconds_cat ? 'Media' : 'photos'}
      </button>
    </div>
  );
};
export default CategoryButtons;
