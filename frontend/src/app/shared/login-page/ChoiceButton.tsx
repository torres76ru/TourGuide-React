import type { MouseEventHandler } from "react";

interface ChoiceButtonProps {
  label: string;
  iconSrc: string;
  altText: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function ChoiceButton({label, iconSrc, altText, onClick}:ChoiceButtonProps){
    return (
        <>
        <div className="registration__choice-colomn">
            <button onClick={onClick} className="registration__choice-btn"><img src={iconSrc} alt={altText}/></button>
            <span>{label}</span>
        </div>
        </>
    )
}