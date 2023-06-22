import React, { useState } from "react"

interface Props {
    onClick: React.MouseEventHandler<HTMLElement>;
    name: string;
}

export const Pill: React.FC<Props> = ({onClick ,name}: Props) => {
    const [isActive, setActive] = useState(false);

    const toggleClass = () => {
        setActive(!isActive);
    };

    return (
        <div className={isActive ? "pill group active-pill" : "pill group"} onClick={toggleClass}>
            <span className="text" onClick={onClick}>{name}</span>
        </div>
    );
};