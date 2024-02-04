import styles from './Home.module.scss';

// Components
import CreatePost from '../../components/CreatePost/CreatePost';
import { useAuth } from '../../context/AuthContext';
import Trending from '../../components/Trending/Trending';


import PageContent from '../../components/PageContent/PageContent';

export const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className={`${styles.wrapper} ${styles.home}`}>
      <div className={styles.container}>
        {currentUser && <CreatePost />}
        <PageContent />
      </div>
      <Trending />
    </div>
  );
};

export default Home;
