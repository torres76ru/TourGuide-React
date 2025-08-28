import Burger from 'widgets/Burger/ui';
import logo from '../../shared/assets/logo.svg';
import search from '../../shared/assets/search.svg';
import styles from './Header.module.scss';
import Modal from 'widgets/Modal/ui';
import { useState, useEffect } from 'react'; // Добавляем useEffect
import Button from 'shared/ui/Button';
import { useNavigate } from 'react-router';
import cross from 'shared/assets/Cross.svg';
import MenuButton from 'shared/ui/MenuButton/ui/MenuButton';
import { useSelector } from 'react-redux';
import type { RootState } from 'app/store/mainStore';
import UserName from 'shared/ui/UserName/ui/UserName';

const Header = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);

  // Эффект для управления position: fixed у body
  useEffect(() => {
    if (isModalOpen) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Восстанавливаем скролл
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    // Cleanup функция
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isModalOpen]);

  const handleRedirect = (href: string) => {
    setModalOpen(false);
    navigate(href);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <header className={styles.header}>
      <Burger isOpen={isModalOpen} onClick={() => setModalOpen(!isModalOpen)} />

      <div className={styles.center} onClick={() => handleRedirect('/')}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <span className={styles.title}>TourGuide</span>
      </div>

      <div onClick={() => handleRedirect('/search')}>
        <img src={search} alt="Search" className={styles.search} />
      </div>

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <div className={styles.modalContent}>
          <div className={styles.container}>
            <button onClick={handleModalClose} className={styles.cross}>
              <img src={cross} alt="Крестик" />
            </button>
            {!user ? (
              <Button
                variant="black"
                style={{ width: '100%' }}
                onClick={() => handleRedirect('/auth')}
              >
                Войти
              </Button>
            ) : (
              <button onClick={() => handleRedirect('/user')} className={styles.user_btn}>
                <UserName
                  name={user.username}
                  headingStyle={{
                    fontWeight: 300,
                    fontSize: '20px',
                  }}
                  imageStyle={{
                    width: '38px',
                    height: '38px',
                  }}
                />
              </button>
            )}
          </div>

          <ul className={styles.buttons_list}>
            {/* <li>
              <MenuButton onClick={() => handleRedirect('/search')}>Поблизости</MenuButton>
            </li> */}
            <li>
              <MenuButton onClick={() => handleRedirect('/search')}>Поиск мест</MenuButton>
            </li>
            <li>
              <MenuButton onClick={() => handleRedirect('/map')}>Карта</MenuButton>
            </li>
            {/* {user && (
              <li>
                <MenuButton>Добавить место</MenuButton>
              </li>
            )} */}
            {/* {user && user.is_guide && (
              <li>
                <MenuButton onClick={() => handleRedirect('/excursion')}>Экскурсия</MenuButton>
              </li>
            )} */}
          </ul>
        </div>
      </Modal>
    </header>
  );
};

export default Header;
