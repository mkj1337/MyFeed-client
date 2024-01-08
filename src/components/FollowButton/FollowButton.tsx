import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface FollowButtonProps {
  username: string | number;
}

const FollowButton = ({ username }: FollowButtonProps) => {
  const { currentUser } = useAuth();
  const [friends, setFriends] = useState<boolean>(false);
  const currUser = currentUser?.username;
  const navigate = useNavigate();

  const handleFollow = async (username: string | number) => {
    try {
      const currUser = currentUser?.username;
      if (!currUser) {
        navigate('/signin');
      }
      const res = await axios.post(`/api/follows/${username}`, {
        followerUsername: currUser,
      });
      setFriends(true);
      toast.success(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnFollow = async (username: string | number) => {
    try {
      const res = await axios.post(
        `/api/follows/unfollow/${username}`,
        {
          followerUsername: currUser,
        },
        { withCredentials: true }
      );
      setFriends(false);
      toast.success(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchFollow = async () => {
      try {
        const { data } = await axios.post(
          `/api/follows/get/${username}`,
          {
            followerUsername: currUser,
          },
          { withCredentials: true }
        );
        if (data.length) {
          setFriends(true);
        } else {
          setFriends(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchFollow();
  }, [username]);

  return (
    <>
      {!friends ? (
        <button onClick={() => handleFollow(username)}>Follow</button>
      ) : (
        <button onClick={() => handleUnFollow(username)}>Unfollow</button>
      )}
    </>
  );
};

export default FollowButton;
