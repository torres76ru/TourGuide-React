import Button from 'shared/ui/Button';
import style from './ConfirmModal.module.scss';

interface ConfirmModalProps {
  coords: [number, number];
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ coords, onConfirm, onCancel }: ConfirmModalProps) => (
  <div className={style.ConfirmModal}>
    <div className={style.ConfirmModalBody}>
      <h3>Подтвердите точку</h3>
      <p>
        Координаты:{' '}
        <b>
          {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
        </b>
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <Button onClick={onConfirm}>Подтвердить</Button>
        <Button onClick={onCancel}>Отмена</Button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
