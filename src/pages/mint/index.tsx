import { useAccount } from "wagmi";
import Container from "~/components/Container";
import { useContractRead } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";
import { clsx } from "clsx";
import { useTheme } from "next-themes";

const Mint = () => {
  const { address } = useAccount();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { data: userMintData } = useContractRead({
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    functionName: "getUserMint",
    overrides: { from: address },
  });

  console.log(userMintData?.user.toString());
  return (
    <Container>
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <li className="step step-neutral">Start Mint</li>
          <li className="step step-neutral">Minting</li>
          <li className="step">Claim</li>
        </ul>

        <div className="card glass">
          <div className="card-body">
            {userMintData?.user.toString() ===
            "0x0000000000000000000000000000000000000000" ? (
              <div className="flex flex-col space-y-4">
                <h2
                  className={clsx("card-title", {
                    "text-neutral": !isDark,
                    "text-primary-content": isDark,
                  })}
                >
                  Mint XEN
                </h2>
                <div className="form-control w-full">
                  <label
                    className={clsx("label", {
                      "text-neutral": !isDark,
                      "text-primary-content": isDark,
                    })}
                  >
                    <span className="label-text text-neutral">MINT DAYS</span>
                    <span className="label-text-alt text-red-400">
                      Required
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type days"
                    value={100}
                    className={clsx("input input-bordered w-full", {
                      "text-neutral": !isDark,
                      "text-primary-content": isDark,
                    })}
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      Select the number of days you want to mint between 0 and
                      100
                    </span>
                  </label>
                </div>
                <button
                  className={clsx("btn glass", {
                    "text-neutral": !isDark,
                    "text-primary-content": isDark,
                  })}
                >
                  Start Mint
                </button>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Mint;
