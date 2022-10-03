import { useAccount } from "wagmi";
import Container from "~/components/Container";
import { useContractRead } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";
import { useState } from "react";
import { clsx } from "clsx";
import { useTheme } from "next-themes";

const Mint = () => {
  const { address } = useAccount();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [isMinted, setIsMinted] = useState(false);

  const { data: userMintData } = useContractRead({
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    functionName: "getUserMint",
    overrides: { from: address },
  });

  return (
    <Container>
      <div className="card glass">
        <div className="card-body">
          {isMinted ? (
            <>
              <h2 className="card-title">Mint</h2>
              <ul>
                {userMintData && (
                  <>
                    <li>amplifier {userMintData.amplifier.toString()}</li>
                    <li>eaaRate {userMintData.eaaRate.toString()}</li>
                    <li>maturityTs {userMintData.maturityTs.toString()}</li>
                    <li>rank {userMintData.rank.toString()}</li>
                    <li>term {userMintData.term.toString()}</li>
                  </>
                )}
              </ul>
            </>
          ) : (
            <div className="flex flex-col space-y-4">
              <h2
                className={clsx("card-title", {
                  "text-neutral": !isDark,
                  "text-primary-content": isDark,
                })}
              >
                Mint XEN
              </h2>
              <input
                type="text"
                placeholder="Type days"
                value={100}
                className={clsx("input input-bordered w-full", {
                  "text-neutral": !isDark,
                  "text-primary-content": isDark,
                })}
              />
              <button
                className={clsx("btn glass", {
                  "text-neutral": !isDark,
                  "text-primary-content": isDark,
                })}
              >
                Start Mint
              </button>
              <button
                className={clsx("btn glass", {
                  "text-neutral": !isDark,
                  "text-primary-content": isDark,
                })}
              >
                Add XEN to Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Mint;
