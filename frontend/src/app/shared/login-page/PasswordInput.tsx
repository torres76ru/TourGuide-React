import { useState, useRef, useEffect } from "react";

interface PasswordInputProps {
  id: string;
  className?: string;
}

export default function PasswordInput({ id, className = "" }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [displayValue, setDisplayValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Обновляем отображаемое значение при изменении пароля или видимости
    useEffect(() => {
        setDisplayValue(showPassword ? password : "•".repeat(password.length));
    }, [password, showPassword]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const cursorPos = e.target.selectionStart || 0;

        // Если пароль скрыт, вычисляем реальное значение на основе изменений
        if (!showPassword) {
            let newPassword = password.split("");

            // Определяем, было ли добавление или удаление символа
            if (newValue.length > displayValue.length) {
                // Добавление символа (берем последний введенный)
                const addedChar = newValue.slice(cursorPos - 1, cursorPos);
                newPassword.splice(cursorPos - 1, 0, addedChar);
            } else if (newValue.length < displayValue.length) {
                // Удаление символа (удаляем по позиции курсора)
                newPassword.splice(cursorPos, 1);
            }

            setPassword(newPassword.join(""));
        } else {
            // Если пароль видимый, просто обновляем его
            setPassword(newValue);
        }
    };

    // Восстанавливаем позицию курсора после обновления
    useEffect(() => {
        if (inputRef.current) {
            const cursorPos = inputRef.current.selectionStart;
            inputRef.current.setSelectionRange(cursorPos, cursorPos);
        }
    }, [displayValue]);

    return (
        <>
            <label htmlFor={id}>Пароль</label>
            <div className={`registration__password-container ${className}`}>
                <input ref={inputRef} className="registration__input" type="text" id={id} value={displayValue} onChange={handlePasswordChange}
                />
                <button type="button" className="registration__eye-btn" onClick={togglePasswordVisibility}
                >
                    <img className="registration__eye-icon"
                        src={showPassword ? "/src/assets/icons/PasswordEye-close.svg" : "/src/assets/icons/PasswordEye-open.svg"}
                        alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
                    />
                </button>
            </div>
        </>
    );
}