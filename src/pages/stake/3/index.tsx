import Link from "next/link";
import Container from "~/components/Container";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { useForm } from "react-hook-form";
import { xenContract } from "~/lib/xen-contract";
import { useState, useEffect } from "react";

const Stake = () => {
  const [disabled, setDisabled] = useState(false);

  const { handleSubmit } = useForm();

  const { config, error } = usePrepareContractWrite({
    ...xenContract,
    functionName: "withdraw",
  });
  const { write: writeStake } = useContractWrite(config);
  const handleStakeSubmit = () => {
    writeStake?.();
  };

  return (
    <Container>
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/stake/1">
            <a className="step step-neutral">Start Stake</a>
          </Link>

          <Link href="/stake/2">
            <a className="step step-neutral">Staking</a>
          </Link>

          <Link href="/stake/3">
            <a className="step step-neutral">End Stake</a>
          </Link>
        </ul>
        <div className="card glass">
          <div className="card-body">
            <form onSubmit={handleSubmit(handleStakeSubmit)}>
              <div className="flex flex-col space-y-4">
                <h2 className="card-title text-neutral">End Stake</h2>
                <button
                  type="submit"
                  className="btn glass text-neutral"
                  disabled={disabled}
                >
                  End Stake
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Stake;
