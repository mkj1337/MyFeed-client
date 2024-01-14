import { useAuth } from '../../context/AuthContext';
import { ChangeEvent, useEffect, useState } from 'react';
import './EditProfileModal.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// icons
import { IoClose } from 'react-icons/io5';
import { AiOutlineLinkedin, AiOutlineUser, AiFillEdit } from 'react-icons/ai';
import { AiOutlineInstagram, AiOutlineYoutube } from 'react-icons/ai';
import { scaleVariants } from '../../animation/Animations';
import EditPictureModal from '../EditPictureModal/EditPictureModal';
import { toast } from 'react-toastify';
import SocialMediaLinks from './SocialMediaLinks';

type EditProfileModalProps = {
  close: React.Dispatch<React.SetStateAction<boolean>>;
  activeModal: boolean;
};

export const EditProfileModal = ({
  close,
  activeModal,
}: EditProfileModalProps) => {
  const { currentUser, setCurrentUser } = useAuth();

  const [userImgPreview, setUserImgPreview] = useState<any>(null);
  const [profImgPreview, setProfImgPreview] = useState<any>(null);
  const [avatar, setAvatar] = useState<string>(currentUser?.userImg || '');
  const [profile, setProfile] = useState<string>(currentUser?.profileImg || '');
  const [name, setName] = useState<string>(currentUser?.name || '');
  const [bio, setBio] = useState<string>(currentUser?.bio || '');
  const [username, setUsername] = useState<string>(currentUser?.username || '');
  const [location, setLocation] = useState<string>(currentUser?.location || '');
  const [socialMedia, setSocialMedia] = useState({
    instagram: currentUser?.instagram_url || '',
    x: currentUser?.x_url || '',
    youtube: currentUser?.youtube_url || '',
  });
  const [editImage, setEditImage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  const onFileChange = async (e: ChangeEvent<any>) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setUserImgPreview(reader.result);
    };

    reader.readAsDataURL(file);
    setAvatar(e.target.files[0]);
  };

  const onFileProfChange = async (e: ChangeEvent<any>) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setProfImgPreview(reader.result);
    };

    reader.readAsDataURL(file);
    setProfile(e.target.files[0]);
  };

  const handleForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const formdata = new FormData();
      formdata.append('avatar', avatar);
      formdata.append('profile', profile);
      formdata.append('name', name);
      formdata.append('username', username);
      formdata.append('bio', bio);
      formdata.append('location', location);
      formdata.append('x', socialMedia.x);
      formdata.append('instagram', socialMedia.instagram);
      formdata.append('youtube', socialMedia.youtube);
      const res = await axios.post(
        `/api/users/update/${currentUser?.id}`,
        formdata,
        { withCredentials: true }
      );
      const { message, ...other } = res.data;
      setCurrentUser(other);
      toast.success(message);
      navigate(`/profile/${other.username}`);
      close(false);
    } catch (err: any) {
      toast.error(err.response.data.sqlMessage);
    }
    setIsUpdating(false);
  };

  const handleCancel = () => {
    close(false);
  };

  const handleDisabled = () => {
    if (
      currentUser?.name === name &&
      currentUser?.username === username &&
      currentUser?.bio === bio &&
      currentUser?.userImg === avatar &&
      (currentUser?.profileImg ?? '') === profile &&
      currentUser?.location === location &&
      currentUser?.x_url === socialMedia.x &&
      currentUser?.instagram_url === socialMedia.instagram &&
      currentUser?.youtube_url === socialMedia.youtube
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSocialMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocialMedia((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activeModal]);

  return (
    <AnimatePresence mode="wait">
      {editImage?.length > 0 && editImage === profImgPreview && (
        <EditPictureModal
          image={profImgPreview}
          preview={setProfImgPreview}
          onClose={setEditImage}
          closePrev={close}
          cropShape="rect"
          aspect={15 / 5}
          output={setProfile}
          key={profImgPreview}
        />
      )}
      {editImage?.length > 0 && editImage === userImgPreview && (
        <EditPictureModal
          image={userImgPreview}
          preview={setUserImgPreview}
          onClose={setEditImage}
          closePrev={close}
          cropShape="round"
          aspect={1}
          output={setAvatar}
          key={userImgPreview}
        />
      )}
      {activeModal && (
        <div className={`editProfileModal`} onClick={() => close(false)}>
          <motion.div
            variants={scaleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="top">
              <h1>Edit Profile</h1>
              <div className="close-btn" onClick={() => close(false)}>
                <IoClose />
              </div>
            </div>
            <hr />
            <form>
              <div className="images">
                <label htmlFor="profile-image" className="profile-image">
                  {profImgPreview || currentUser?.profileImg ? (
                    <>
                      <img
                        src={
                          profImgPreview
                            ? profImgPreview
                            : currentUser?.profileImg
                        }
                        className="user-profile-background"
                      />
                      {profImgPreview && (
                        <button
                          type="button"
                          className="image-edit"
                          onClick={() => setEditImage(profImgPreview)}
                        >
                          <AiFillEdit />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="profile-placeholder"></div>
                  )}
                </label>
                <label htmlFor="userImage" className="user-image">
                  {userImgPreview || currentUser?.userImg ? (
                    <>
                      <img
                        src={
                          userImgPreview ? userImgPreview : currentUser?.userImg
                        }
                        className="userProfileImage"
                      />
                      {userImgPreview && (
                        <button
                          type="button"
                          className="image-edit"
                          onClick={() => setEditImage(userImgPreview)}
                        >
                          <AiFillEdit />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="imgPlaceHolder">
                      <AiOutlineUser />
                    </div>
                  )}
                </label>
              </div>
              <hr />
              <input
                type="file"
                name="file"
                onChange={onFileChange}
                id="userImage"
                accept="image/*"
              />
              <input
                type="file"
                name="file"
                onChange={onFileProfChange}
                id="profile-image"
                accept="image/*"
              />
              <label className="name">
                <span>Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <hr />
              <label className="username">
                <span>Username</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <hr />
              <label className="username">
                <span>Location</span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>
              <hr />
              <label className="bio">
                <span>Bio</span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </label>
              <hr />
              <SocialMediaLinks
                name="instagram"
                value={socialMedia.instagram}
                Icon={AiOutlineInstagram}
                setSocials={setSocialMedia}
              />
              <SocialMediaLinks
                name="youtube"
                value={socialMedia.youtube}
                Icon={AiOutlineYoutube}
                setSocials={setSocialMedia}
              />
              <SocialMediaLinks
                name="linkedin"
                value={socialMedia.x}
                Icon={AiOutlineLinkedin}
                setSocials={setSocialMedia}
              />
              <hr />
            </form>
            <div className="buttons">
              <button type="reset" onClick={handleCancel}>
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleForm}
                disabled={handleDisabled()}
              >
                {isUpdating ? 'Updating...' : 'Change'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
