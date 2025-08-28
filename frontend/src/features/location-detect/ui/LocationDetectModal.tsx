const cities = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург'];

interface LocationDetectModalProps {
  city: string | null;
  onSelect: (city: string | null) => void;
}

const LocationDetectModal = ({ city, onSelect }: LocationDetectModalProps) => (
  <div className="modal">
    <h2>{city ? 'Ваш ли это город?' : 'Выберите город'}</h2>
    <select defaultValue={city || ''} onChange={(e) => onSelect(e.target.value)}>
      <option value="" disabled>
        Выберите город
      </option>
      {cities.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
    <button onClick={() => onSelect(city)}>Да, мой город</button>
  </div>
);

export default LocationDetectModal;
