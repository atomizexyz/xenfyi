import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import Container from "~/components/Container";
import { PercentageField, DaysField } from "~/components/FormFields";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { xenContract } from "~/lib/xen-contract";

const Mint = () => {
  const { address } = useAccount();
  const [disabled, setDisabled] = useState(true);
  const { register, handleSubmit, watch } = useForm();
  const watchAllFields = watch();

  const { data } = useContractRead({
    ...xenContract,
    functionName: "getUserMint",
    overrides: { from: address },
    cacheOnBlock: true,
    watch: true,
  });

  /*** Claim  ***/

  const { config: configClaim } = usePrepareContractWrite({
    ...xenContract,
    functionName: "claimMintReward",
  });
  const { write: writeClaim } = useContractWrite(configClaim);
  const handleClaimSubmit = () => {
    writeClaim?.();
  };
  /*** Claim + Share ***/

  const { config: configClaimShare } = usePrepareContractWrite({
    ...xenContract,
    functionName: "claimMintRewardAndShare",
    args: [
      watchAllFields.claimShareAddress,
      watchAllFields.claimSharePercentage,
    ],
  });
  const { write: writeClaimShare } = useContractWrite(configClaimShare);
  const handleClaimShareSubmit = () => {
    writeClaimShare?.();
  };
  /*** Claim + Stake ***/

  const { config: configClaimStake } = usePrepareContractWrite({
    ...xenContract,
    functionName: "claimMintRewardAndStake",
    args: [watchAllFields.claimStakePercentage, watchAllFields.claimStakeDays],
  });
  const { write: writeClaimStake } = useContractWrite(configClaimStake);
  const handleClaimStakeSubmit = () => {
    writeClaimStake?.();
  };

  const utcTime = new Date().getTime() / 1000;
  useEffect(() => {
    if (
      address &&
      data &&
      !data.maturityTs.isZero() &&
      data.maturityTs < utcTime
    ) {
      setDisabled(false);
    }
  }, [address, data, utcTime]);

  return (
    <Container>
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/mint/1">
            <a className="step step-neutral">Start Mint</a>
          </Link>

          <Link href="/mint/2">
            <a className="step step-neutral">Minting</a>
          </Link>

          <Link href="/mint/3">
            <a className="step step-neutral">Claim</a>
          </Link>
        </ul>

        <div className="card glass">
          <div className="card-body">
            <div className="flex flex-col w-full border-opacity-50">
              <form onSubmit={handleSubmit(handleClaimSubmit)}>
                <div className="flex flex-col space-y-4">
                  <h2 className="card-title text-neutral">Claim</h2>
                  <button
                    type="submit"
                    className="btn glass text-neutral"
                    disabled={disabled}
                  >
                    Claim
                  </button>
                </div>
              </form>

              {/* OR */}

              <div className="divider">OR</div>
              {/* OR */}
              <form onSubmit={handleSubmit(handleClaimShareSubmit)}>
                <div className="flex flex-col space-y-4">
                  <h2 className="card-title text-neutral">Claim + Share</h2>
                  <div className="form-control w-full">
                    <label className="label text-neutral">
                      <span className="label-text text-neutral">
                        WALLET ADDRESS
                      </span>
                      <span className="label-text-alt text-error">
                        Required
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="0x"
                      className="input input-bordered w-full text-neutral"
                      disabled={disabled}
                      {...register("claimShareAddress")}
                    />
                    <label className="label">
                      <span className="label-text-alt text-neutral">
                        Wallet address where you want to share your XEN
                      </span>
                    </label>
                  </div>

                  <PercentageField
                    disabled={disabled}
                    register={register("claimSharePercentage")}
                  />

                  <button
                    type="submit"
                    className="btn glass text-neutral"
                    disabled={disabled}
                  >
                    Claim + Share
                  </button>
                </div>
              </form>

              {/* OR */}
              <div className="divider">OR</div>
              {/* OR */}
              <form onSubmit={handleSubmit(handleClaimStakeSubmit)}>
                <div className="flex flex-col space-y-4">
                  <h2 className="card-title text-neutral">Claim + Stake</h2>
                  <PercentageField
                    disabled={disabled}
                    register={register("claimStakePercentage")}
                  />
                  <DaysField
                    disabled={disabled}
                    register={register("claimStakeDays")}
                  />

                  <button
                    type="submit"
                    className="btn glass text-neutral"
                    disabled={disabled}
                  >
                    Claim + Stake
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Mint;
