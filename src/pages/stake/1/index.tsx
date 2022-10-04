import Container from "~/components/Container";
import { useBalance, useAccount } from "wagmi";

import { DaysField, AmountField } from "~/components/FormFields";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import Link from "next/link";

import { DateStatCard, DataCard } from "~/components/StatCards";

const Stake = () => {
  const { address } = useAccount();

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
            <a className="step">Staking</a>
          </Link>

          <Link href="/stake/3">
            <a className="step">End Stake</a>
          </Link>
        </ul>

        <div className="card glass">
          <div className="card-body">
            <div className="flex flex-col space-y-4">
              <h2 className="card-title text-neutral">Start Stake</h2>
              <AmountField
                balance={balanceData?.formatted ?? "0.0"}
                disabled={disabled}
              />
              <DaysField disabled={disabled} />

              <div className="stats glass text-neutral">
                <DataCard title="Yield" value={"10"} description={"10%"} />
                <DateStatCard title="Maturity" dateTs={maturity} />
              </div>

              <div className="alert shadow-lg glass">
                <div>
                  <InformationCircleIcon className="w-16 h-16" />
                  <div>
                    <h3 className="font-bold">Staking Terms</h3>
                    <div className="text-xs">
                      Withdraw original Stake amount plus Yield at any time
                      after Maturity Date, or original Stake amount with 0
                      (zero) Yield at anu time before Maturity Date. One stake
                      at a time per one address.
                    </div>
                  </div>
                </div>
              </div>
              <button className="btn glass text-neutral" disabled={disabled}>
                Start Stake
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Stake;
