import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  readOnly?: boolean;
  classLable?: string;
  classInput?: string; 
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  id,
  type = 'text',
  placeholder = "",
  value,
  onChange,
  error,
  readOnly = false,
  classLable ="",
  classInput ="",
  ...props
}, ref) => {
  return (
    <>
      {label && <label className={classLable} htmlFor={id}>{label}</label>}
      <input
        ref={ref} 
        className={clsx(styles.input, error && styles.input_error, classInput)}
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        {...props}
      />
      {error && <span className={styles.error_message}>{error}</span>}
    </>
  );
});

Input.displayName = 'Input'; // Для отладки в React DevTools

export default Input;