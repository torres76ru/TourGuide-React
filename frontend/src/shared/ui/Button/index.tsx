import React from "react";
import clsx from "clsx";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className,
  ...props
}) => (
  <button
    className={clsx(styles.button, styles[variant], className)}
    {...props}
  >
    {children}
  </button>
);

export default Button;
