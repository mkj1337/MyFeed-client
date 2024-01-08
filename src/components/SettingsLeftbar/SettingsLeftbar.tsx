import { NavLink } from 'react-router-dom';
import styles from './SettingsLeftbar.module.scss';

import { MdOutlineArrowForwardIos } from 'react-icons/md';

const SettingsLeftbar = () => {
  return (
    <div className={styles.settingsLeftbar}>
      <h1 className={styles.title}>Settings</h1>
      <div className={styles.settingsType}>
        <NavLink
          to="/settings/account "
          className={({ isActive }) =>
            isActive
              ? `${styles.settingsItem} ${styles.active}`
              : styles.settingsItem
          }
        >
          accout
          <MdOutlineArrowForwardIos />
        </NavLink>
        <NavLink
          to="/settings/notifications"
          className={({ isActive }) =>
            isActive
              ? `${styles.settingsItem} ${styles.active}`
              : styles.settingsItem
          }
        >
          notification
          <MdOutlineArrowForwardIos />
        </NavLink>
        <NavLink
          to="/settings/privacy"
          className={({ isActive }) =>
            isActive
              ? `${styles.settingsItem} ${styles.active}`
              : styles.settingsItem
          }
        >
          privacy
          <MdOutlineArrowForwardIos />
        </NavLink>
        <NavLink
          to="/settings/language"
          className={({ isActive }) =>
            isActive
              ? `${styles.settingsItem} ${styles.active}`
              : styles.settingsItem
          }
        >
          language
          <MdOutlineArrowForwardIos />
        </NavLink>
      </div>
    </div>
  );
};

export default SettingsLeftbar;
