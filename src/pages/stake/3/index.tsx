import Container from "~/components/Container";
import { useBalance, useAccount } from "wagmi";
import { useState } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

const Stake = () => {
  const { address } = useAccount();
  const router = useRouter();

  const [yeild, setYeild] = useState(0);
  const [maturity, setMaturity] = useState<number>(Date.now());
  const [currentStateStep, setCurrentStateStep] = useState(0);
  const disabled = currentStateStep == 2;

  const { data: balanceData } = useBalance({
    addressOrName: address,
    token: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
  });

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
            <div className="flex flex-col space-y-4">
              <h2 className="card-title text-neutral">End Stake</h2>
              <button className="btn glass text-neutral" disabled={disabled}>
                End Stake
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Stake;
