interface InputProps {
  label: string;
  id: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function Input({ label, id, type, placeholder = "", value, onChange, error}: InputProps) {
    return (
    <>
        <label htmlFor={id}>{label}</label>
        <input className={`registration__input ${error ? "input-error" : ""}`}  type={type} id={id} value={value}
        onChange={onChange} placeholder={placeholder}/>
        {error && <span className="error-message">{error}</span>}
    </>
    )
}