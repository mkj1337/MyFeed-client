import styles from './Signin.module.scss';

import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Loader } from '../../components/Loader/Loader';

const Signin = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputs = { email, password };

  const handleSignin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    try {
      setIsLoading(true);
      const res = await axios.post('/api/auth/signin', inputs, {
        withCredentials: true,
      });

      setTimeout(() => {
        setCurrentUser(res.data);
        setIsLoading(false);
        navigate('/');
      }, 250);
    } catch (err: any) {
      setError(err.response.data.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.signin}>
      <h1 className={styles.brandName}>
        <span>My</span>Feed
      </h1>
      <div className={styles.container}>
        <p>
          <span>Test Account:</span>
          <br />
          email: admin@gmail.com <br /> password: Admin123
        </p>
        <h2>Sign In</h2>

        <form onSubmit={handleSignin}>
          {error && <span className={styles.error}>{error}</span>}
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>Forgot Your Password?</span>
          <button
            className={styles.submit}
            type="submit"
            disabled={!email || !password}
          >
            Sign In
          </button>
          <hr />
          <Link to="/signup" className={`${styles.regBtn} ${styles.link}`}>
            Sign Up
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signin;
