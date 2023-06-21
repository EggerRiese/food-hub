import React from "react"

interface Props {
    onClick: React.MouseEventHandler<HTMLElement>;
    name: string;
}

export const Pill: React.FC<Props> = ({onClick ,name}: Props) => {
    return (
        <div className="pill group">
            <span className="text" onClick={onClick}>{name}</span>
        </div>
    );
};