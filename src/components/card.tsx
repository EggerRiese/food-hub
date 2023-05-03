import type { RouterOutputs } from "~/utils/api";

type Dish = RouterOutputs["dish"]["getDishById"];
export const Card = (props: Dish) => {

    if (props === null) {
        return <div></div>;
    }

    return (
        <div key={props.id} className="card group" style={{backgroundImage: 'url('+ props.url +')'}}>
            <span className="heading">{props.name}</span>
        </div>
    );
};