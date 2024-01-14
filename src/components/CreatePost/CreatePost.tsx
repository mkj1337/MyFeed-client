import styles from './CreatePost.module.scss';
import { FormEvent, useState } from 'react';
import axios from 'axios';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import GifPicker, { TenorImage } from 'gif-picker-react';

// icons
import { GoFileMedia } from 'react-icons/go';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineGif, AiOutlineUser } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import { CreatePostProps } from '../../interfaces/posts';

const CreatePost = ({ comment, parentId, border }: CreatePostProps) => {
  const MAX_SIZE = 3;
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const postId = useLocation().pathname.split('/')[2];
  const [images, setImages] = useState<any>([]);
  const [text, setDesc] = useState<string>('');
  const [showOption, setShowOption] = useState<boolean>(!comment);
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [showGifs, setShowGifs] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [gif, setGif] = useState<string>('');
  const [video, setVideo] = useState<any>();

  const mediaHandler = (e: React.ChangeEvent<any>) => {
    const reader = new FileReader();
    if (images.length > MAX_SIZE)
      return toast.info(`max amount of images is ${MAX_SIZE}!`);
    for (let i = 0; i < e.target.files.length; i++) {
      reader.onload = () => {
        if (reader.readyState === 2) {
          if (e.target.files[0].type.includes('video')) {
            setVideo(reader.result);
            setImages([{ file: e.target.files[0] }]);
            toast.info('Only one video file is allowed!');
            return;
          }
          setImages((prevPost: any) => [
            ...prevPost,
            {
              file: e.target.files[i],
              previewURL: reader.result,
            },
          ]);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const removeFile = (i: number) => {
    setImages((prevPost: any) =>
      [...prevPost].filter((_, index) => index !== i)
    );
  };

  const postMedia = images.map((images: any) => images.file);

  const handleDisableSubmitButton = () => {
    return (
      (gif.length === 0 && images.length === 0 && text.length === 0) ||
      !(text.length < 500) ||
      isCreating
    );
  };

  const publishPost = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      const data = new FormData();
      data.append('text', text);
      postMedia.forEach((postM: any) => {
        data.append('post', postM);
      });
      data.append('gif', gif);
      data.append('parentId', parentId);

      const headers = {
        'Content-Type': `${
          !images ? 'application/json' : 'multipart/form-data'
        }`,
      };

      const res = await axios.post(
        comment ? `/api/posts/post/comment/${postId}` : '/api/posts/create',
        data,
        {
          withCredentials: true,
          headers,
        }
      );

      toast.success(res.data.message);
      !comment ? navigate(`/post/${res.data.postId}`) : navigate(0);
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
    setIsCreating(false);
  };

  const handleEmoji = (emojiData: EmojiClickData) => {
    setDesc((prev) => prev + emojiData.emoji);
  };

  const handleGif = (gif: TenorImage) => {
    setGif(gif.url);
  };

  const handleShowOption = () => {
    if (comment) {
      setShowOption(true);
    }
  };

  const handleButtonText = () => {
    if (isCreating) {
      return 'Publishing...';
    }

    return comment ? 'Comment' : 'Publish';
  };

  return (
    <div
      className={`${styles.createPost} ${
        border === 'border' ? styles.border : undefined
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.top}>
        <div className={styles.userImage}>
          {currentUser?.userImg ? (
            <img src={currentUser?.userImg} alt="" />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <AiOutlineUser />
            </div>
          )}
        </div>
        <div className={styles.textInput}>
          <textarea
            name="text"
            className={text.length < 500 ? '' : styles.maxLength}
            placeholder={comment ? 'write your answer' : "what's on your mind?"}
            value={text}
            maxLength={500}
            onChange={(e) => setDesc(e.target.value)}
            onFocus={handleShowOption}
          ></textarea>
          <div className={styles.previewContainer}>
            <>
              {images.length > 0 &&
                images.map((file: any, index: number) => (
                  <div className={styles.imagePreview} key={index}>
                    <img src={file.previewURL} alt="" />
                    <div
                      className={`${styles.closeBtn} close-btn`}
                      onClick={() => removeFile(index)}
                    >
                      <IoClose />
                    </div>
                  </div>
                ))}
              {gif && (
                <div className={styles.imagePreview}>
                  <img src={gif} alt="" />
                  <div
                    className={`${styles.closeBtn} close-btn`}
                    onClick={() => setGif('')}
                  >
                    <IoClose />
                  </div>
                </div>
              )}
            </>
          </div>
          {video && (
            <div className={styles.imagePreview}>
              <video controls width={400} height={400}>
                <source src={video} type="video/mp4" />
              </video>
              <div
                className={`${styles.closeBtn} closeBtn`}
                onClick={() => setVideo('')}
              >
                <IoClose />
              </div>
            </div>
          )}
        </div>
      </div>
      {showOption && (
        <>
          <span
            className={text.length < 500 ? styles.textLength : styles.maxLength}
          >
            {text ? text.length : 0} / 500
          </span>
          <div className={styles.options}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className={`${styles.addMedia} addMedia`}>
                <label htmlFor="img-input">
                  <GoFileMedia />
                </label>
                <input
                  type="file"
                  id="img-input"
                  className="uploadFile"
                  name="images"
                  accept="*"
                  onChange={mediaHandler}
                  multiple
                />
              </div>
              <div
                className="addGif"
                onMouseEnter={() => setShowGifs(true)}
                onMouseLeave={() => setShowGifs(false)}
              >
                <AiOutlineGif />
                {showGifs && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '39px',
                      zIndex: 100,
                    }}
                  >
                    <GifPicker
                      tenorApiKey={import.meta.env.VITE_TENOR_KEY}
                      theme={Theme.DARK}
                      onGifClick={handleGif}
                      width={275}
                      height={300}
                    />
                  </div>
                )}
              </div>
              <div
                className="addEmoji"
                onMouseEnter={() => setShowEmoji(true)}
                onMouseLeave={() => setShowEmoji(false)}
              >
                <MdOutlineEmojiEmotions />
                {showEmoji && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '39px',
                      zIndex: 100,
                    }}
                  >
                    <EmojiPicker
                      previewConfig={{ showPreview: false }}
                      theme={Theme.DARK}
                      onEmojiClick={handleEmoji}
                      width={275}
                      height={300}
                    />
                  </div>
                )}
              </div>
            </div>
            <button
              className={styles.submitPost}
              onClick={publishPost}
              disabled={handleDisableSubmitButton()}
            >
              {handleButtonText()}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CreatePost;
