import { useAccount } from "wagmi";
import Container from "~/components/Container";
import XenCrypto from "~/abi/XENCrypto.json";
import { DaysField } from "~/components/FormFields";
import { MintData } from "~/lib/helpers";
import { useState } from "react";
import Link from "next/link";

const Mint = () => {
  const { address } = useAccount();
  const [mintData, setMintData] = useState<MintData>();
  const [currentStateStep, setCurrentStateStep] = useState(0);

  const xenContract = {
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
  };

  const StartMintStep = () => {
    const disabled = currentStateStep == 2;

    return (
      <div className="flex flex-col space-y-4">
        <h2 className="card-title text-neutral">Start Mint</h2>
        <DaysField disabled={disabled} />
        <button className="btn glass text-neutral" disabled={disabled}>
          Start Mint
        </button>
      </div>
    );
  };

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
            <StartMintStep />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Mint;
