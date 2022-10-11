import { clsx } from "clsx";

const CardContainer = ({ className, ...props }: any) => {
  return (
    <div className={clsx("card glass card-compact lg:card-normal", className)}>
      <div className="card-body text-neutral" {...props} />
    </div>
  );
};

export default CardContainer;
