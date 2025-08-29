import style from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={style.body}>
      <div className={style.logo}>TourGuide</div>
      <div className={style.info}>
        <span>
          Почта:
          <br /> TourGuide@mail.com
        </span>
        <br />
        <span>
          Телефон:
          <br /> +7 (958) 744-15-14
        </span>
        <br />
        <span>
          ИНН:
          <br /> 760212073618
        </span>
      </div>
    </footer>
  );
};

export default Footer;
