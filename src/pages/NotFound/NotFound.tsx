import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.scss';
import NotFoundImg from '../../assets/404.gif';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.notFound}>
      <div className={styles.container}>
        <img src={NotFoundImg} alt="404" />
        <button className={styles.prevBtn} onClick={() => navigate('/signin')}>
          Go back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
