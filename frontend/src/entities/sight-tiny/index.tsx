import style from "./style.module.scss";

interface SightTinyProps {
  img_url?: string;
  title?: string;
  town?: string;
}

export const SightTiny = ({ img_url, title, town }: SightTinyProps) => {
  return (
    <div className={style.row}>
      <div className={style.preview}>
        <img src={img_url} alt="Достопримечательность" />
      </div>
      <div className={style.info}>
        <h2 className={style.title}>{title}</h2>
        <p className={style.town}>{town}</p>
      </div>
    </div>
  );
};
