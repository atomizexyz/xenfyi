import { useAccount } from "wagmi";
import Container from "~/components/Container";
import XenCrypto from "~/abi/XENCrypto.json";
import { PercentageField, DaysField } from "~/components/FormFields";
import { useState } from "react";
import Link from "next/link";

const Mint = () => {
  const { address } = useAccount();
  const [currentStateStep, setCurrentStateStep] = useState(0);
  const disable = currentStateStep == 2;

  const xenContract = {
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
  };

  const Claim = (props: any) => {
    return (
      <div className="flex flex-col space-y-4">
        <h2 className="card-title text-neutral">Claim</h2>
        <DaysField disabled={props.disabled} />
        <button className="btn glass text-neutral" disabled={props.disabled}>
          Start Mint
        </button>
      </div>
    );
  };

  const ClaimShare = (props: any) => {
    return (
      <div className="flex flex-col space-y-4">
        <h2 className="card-title text-neutral">Claim + Share</h2>
        <div className="form-control w-full">
          <label className="label text-neutral">
            <span className="label-text text-neutral">WALLET ADDRESS</span>
            <span className="label-text-alt text-error">Required</span>
          </label>
          <input
            type="text"
            placeholder="0x"
            className="input input-bordered w-full text-neutral"
            disabled={props.disabled}
          />
          <label className="label">
            <span className="label-text-alt text-neutral">
              Wallet address where you want to share your XEN
            </span>
          </label>
        </div>

        <PercentageField disabled={props.disabled} />

        <button className="btn glass text-neutral" disabled={props.disabled}>
          Claim + Share
        </button>
      </div>
    );
  };

  const ClaimStake = (props: any) => {
    return (
      <div className="flex flex-col space-y-4">
        <h2 className="card-title text-neutral">Claim + Stake</h2>

        <PercentageField disabled={props.disabled} />
        <DaysField disabled={props.disabled} />

        <button className="btn glass text-neutral" disabled={props.disabled}>
          Claim + Stake
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
            <a className="step step-neutral">Minting</a>
          </Link>

          <Link href="/mint/3">
            <a className="step step-neutral">Claim</a>
          </Link>
        </ul>

        <div className="card glass">
          <div className="card-body">
            <div className="flex flex-col w-full border-opacity-50">
              <Claim disabled={disable} />
              <div className="divider">OR</div>
              <ClaimShare disabled={disable} />
              <div className="divider">OR</div>
              <ClaimStake disabled={disable} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Mint;
