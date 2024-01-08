import styles from './MessageBox.module.scss';
import { MdKeyboardArrowUp } from 'react-icons/md';

const MessageBox = () => {
  return (
    <div className={styles.messageBox}>
      <h1 className={styles.messageTitle}>
        <MdKeyboardArrowUp /> Messages
      </h1>
    </div>
  );
};

export default MessageBox;
