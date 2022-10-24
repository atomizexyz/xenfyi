import type { NextPage } from "next";
import { ethers } from "ethers";

export const MaxValueField: NextPage<any> = (props) => {
  return (
    <div className="form-control w-full">
      <label className="label text-neutral">
        <span className="label-text text-neutral">{props.title}</span>
        <span className="label-text-alt text-error">{props.errorMessage}</span>
      </label>
      <input
        type="text"
        placeholder="0"
        className="input input-bordered w-full text-neutral"
        disabled={props.disabled}
        {...props.register}
      />
      <label className="label">
        <span className="label-text-alt text-neutral">{props.description}</span>
        <span className="label-text-alt text-neutral">
          {`${Number(props.value).toLocaleString("en-US")}`}
          <button
            type="button"
            onClick={() => props.setValue(props.register.name, props.value)}
            className="btn btn-xs glass text-neutral ml-2"
            disabled={props.disabled}
          >
            MAX
          </button>
        </span>
      </label>
    </div>
  );
};

export const WalletAddressField: NextPage<any> = (props) => {
  return (
    <div className="form-control w-full">
      <label className="label text-neutral">
        <span className="label-text text-neutral">WALLET ADDRESS</span>
        <span className="label-text-alt text-error">{props.errorMessage}</span>
      </label>
      <input
        type="text"
        placeholder="0x"
        className="input input-bordered w-full text-neutral"
        disabled={props.disabled}
        {...props.register}
      />
      <label className="label">
        <span className="label-text-alt text-neutral">
          Wallet address where you want to share your XEN
        </span>
      </label>
    </div>
  );
};
