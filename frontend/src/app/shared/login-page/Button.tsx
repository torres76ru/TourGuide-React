import type { 
  MouseEventHandler, 
  ButtonHTMLAttributes 
} from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ children, className = "", onClick, type = 'button'}: ButtonProps) {
  return (
    <button className={`registration__button ${className}`} onClick={onClick} type={type}>
      {children}
    </button>
  ); 
}
