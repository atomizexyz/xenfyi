import { clsx } from "clsx";
import { NextPage } from "next";

interface StatusBadgeProps {
  id: number;
  mintPageOverride: number;
  stakePageOverride: number;
  offset: string;
}

export const StatusBadge: NextPage<{ status: StatusBadgeProps }> = ({
  status,
}) => {
  const renderBadge = (status: StatusBadgeProps) => {
    switch (status.id) {
      case 1:
        return (
          <>
            {(status.mintPageOverride == 2 || status.mintPageOverride == 3) && (
              <div
                className={clsx(
                  "absolute badge badge-lg shadow-md glass",
                  status.offset,
                  {
                    "bg-error": status.mintPageOverride == 3,
                  }
                )}
              >
                💎
              </div>
            )}
          </>
        );
      case 2:
        return (
          <>
            {(status.stakePageOverride == 2 ||
              status.stakePageOverride == 3) && (
              <div
                className={clsx(
                  "absolute badge badge-lg shadow-md glass",
                  status.offset,
                  {
                    "bg-error": status.stakePageOverride == 3,
                  }
                )}
              >
                🔒
              </div>
            )}
          </>
        );
      default:
        return <></>;
    }
  };

  return renderBadge(status);
};
