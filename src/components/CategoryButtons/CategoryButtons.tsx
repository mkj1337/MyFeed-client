import { useEffect } from 'react';
import styles from './CategoryButtons.module.scss';
import { CONTENT_TYPE } from '../../constants';

interface CategoryButtonsProps {
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  firstCat?: string;
  secondCat?: string;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
  refresh?: boolean;
}

const CategoryButtons = ({
  setCategory,
  category,
  setRefresh,
  refresh,
  firstCat,
  secondCat,
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
        {firstCat ? firstCat : 'Posts'}
      </button>
      <button
        onClick={() => handleClick(secondCat || 'Media')}
        className={category === secondCat ? styles.active : ''}
      >
        {secondCat ? 'Media' : 'photos'}
      </button>
    </div>
  );
};
export default CategoryButtons;
