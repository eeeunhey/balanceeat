import React, { useState } from "react";
import styles from './Navbar.module.css'
import MobileNavbar from "./MobileNavbar";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState(false);
  const [open, setOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const goLogin = () => {
    navigate('/login');
  };

  const goJoin = () => {
    navigate('/join');
  }

  return (
    <>
      <div className={styles.header}>
        <Link to={'/'} className={styles.logo}><img className={styles.logo_img} src={'logo3.png'}></img></Link>
          <ul className={styles.nav_menu}>
            <li><Link to={'/'}>Home</Link></li>
            <li>Log</li>
            <li>Recommend</li>
            <li>Report</li>
            <li>Settings</li>
          </ul>
        <div className={styles.nav_right}>
          <div className={styles.hamburger} onClick={() => setOpen(true)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          { login
          ? <div className={styles.user_icon} onClick={() => setShowProfileMenu(prev => !prev)}>U</div>
          : <div className={styles.login} onClick={goLogin}>LOGIN</div>
          }
          { !login &&
          <div className={styles.login} onClick={goJoin}>JOIN</div>
          }
        </div>
      </div>

      {login && showProfileMenu && (
        <div className={styles.profile_menu}>
          <div className={styles.menu_item}>마이페이지</div>
          <div className={styles.menu_item}>로그아웃</div>
        </div>
      )}

      <MobileNavbar open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Navbar;
