

export const Pill = ({name}: {name:string}) => {
    const select = (event : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log(event.target);
        console.log(event.currentTarget);
    }

    return (
        <div className="pill group">
            <span className="text" onClick={select}>{name}</span>
        </div>
    )
}