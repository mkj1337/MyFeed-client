import styles from './ShareModal.module.scss';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
} from 'react-share';

interface ShareModalProps {
  url: string;
}

const ShareModal = ({ url }: ShareModalProps) => {
  return (
    <div className={styles.shareModal}>
      <FacebookShareButton url={url} quote="some text" hashtag="#myFeed">
        <FacebookIcon size={25} round />
      </FacebookShareButton>
      <FacebookMessengerShareButton appId="" url={url}>
        <FacebookMessengerIcon size={25} round />
      </FacebookMessengerShareButton>
      <TwitterShareButton url={url}>
        <TwitterIcon size={25} round />
      </TwitterShareButton>
      <TelegramShareButton url={url}>
        <TelegramIcon size={25} round />
      </TelegramShareButton>
    </div>
  );
};

export default ShareModal;
