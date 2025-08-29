import { IconArrowBack } from "shared/ui/ArrowBackSvg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const BackButton = ({ className, ...props }: ButtonProps) => {
  return (
    <button
      onClick={() => window.history.back()}
      style={{ background: "none", border: "none", cursor: "pointer" }}
      className={className}
      {...props}
    >
      <IconArrowBack />
    </button>
  );
};

export default BackButton;
