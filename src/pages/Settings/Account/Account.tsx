import { useState } from 'react';
import styles from './Account.module.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import PopUp from '../../../components/PopUp/PopUp';

const Account = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const deleteAccount = async () => {
    try {
      await axios.delete('/api/auth/delete');
      setCurrentUser(null);
      navigate('/signin');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <PopUp
        title="Are you sure you want to delete your account ?"
        isActive={isActive}
        setIsActive={setIsActive}
        callback={deleteAccount}
      />
      <div className={styles.account}>
        <div className={styles.accountItem}>
          <h2 className={styles.accountItemTitle}>Delete Account</h2>
          <button
            className={styles.accountItemDelete}
            onClick={() => setIsActive(true)}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default Account;
