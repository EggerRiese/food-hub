

export const Pill = ({name}: {name:string}) => {
    const select = (event : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log(event.target);
    }

    return (
        <div className="pill group">
            <span className="text" onClick={select}>{name}</span>
        </div>
    )
}