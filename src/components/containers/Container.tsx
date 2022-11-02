import { clsx } from "clsx";

const Container = ({ className, ...props }: any) => {
  return (
    <div
      className={clsx(
        "mx-auto py-4 px-4 sm:px-6 lg:px-8 text-neutral",
        className
      )}
      {...props}
    />
  );
};

export default Container;
