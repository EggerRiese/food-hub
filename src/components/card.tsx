import type { RouterOutputs } from "~/utils/api";
import Image from 'next/image';

type Dish = RouterOutputs["dish"]["getDishById"];
export const Card = (props: Dish) => {

    if (props === null) {
        return <div></div>;
    }

    return (
        <div key={props.id} className="card group">
            <span className="heading">{props.name}</span>
            <Image src={"/lasagna.jpg"} fill style={{objectFit: "cover"}} alt={props.name}/>
        </div>
    );
};