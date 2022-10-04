import {
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import Container from "~/components/Container";
import { DaysField } from "~/components/FormFields";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { xenContract } from "~/lib/xen-contract";

const Mint = () => {
  const { address } = useAccount();
  const [disabled, setDisabled] = useState(false);
  const { register, handleSubmit, watch } = useForm();
  const watchAllFields = watch();
  const onSubmit = () => {
    write?.();
  };

  const { data } = useContractReads({
    contracts: [
      {
        ...xenContract,
        functionName: "getUserMint",
      },
    ],
    overrides: { from: address },
    watch: true,
  });

  const { config, error } = usePrepareContractWrite({
    ...xenContract,
    functionName: "claimRank",
    args: [watchAllFields.startMintDays],
  });
  const { write } = useContractWrite(config);

  useEffect(() => {
    if (!data?.[0]?.term.isZero()) {
      setDisabled(true);
    }
  }, [data]);

  return (
    <Container>
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/mint/1">
            <a className="step step-neutral">Start Mint</a>
          </Link>

          <Link href="/mint/2">
            <a className="step">Minting</a>
          </Link>

          <Link href="/mint/3">
            <a className="step">Claim</a>
          </Link>
        </ul>

        <div className="card glass">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col space-y-4">
                <h2 className="card-title text-neutral">Start Mint</h2>
                <DaysField
                  disabled={disabled}
                  register={register("startMintDays")}
                />
                <button
                  type="submit"
                  className="btn glass text-neutral"
                  disabled={disabled}
                >
                  Start Mint
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Mint;
