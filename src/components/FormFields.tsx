import { ethers } from "ethers";

export const AmountField = (props: any) => {
  return (
    <div className="form-control w-full">
      <label className="label text-neutral">
        <span className="label-text text-neutral">AMOUNT</span>
        <span className="label-text-alt text-error">{props.errorMessage}</span>
      </label>
      <input
        type="text"
        placeholder="0.0"
        className="input input-bordered w-full text-neutral"
        disabled={props.disabled}
        {...props.register}
      />
      <label className="label">
        <span className="label-text-alt text-neutral">
          XEN amount up to balance
        </span>
        <span className="label-text-alt text-neutral">
          {`Balance: ${ethers.utils.formatUnits(props.value, props.decimals)}`}
          <button
            onClick={() =>
              props.setValue(
                "startStakeAmount",
                ethers.utils.formatUnits(props.value, props.decimals)
              )
            }
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

export const DaysField = (props: any) => {
  return (
    <div className="form-control w-full">
      <label className="label text-neutral">
        <span className="label-text text-neutral">DAYS</span>
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
        <span className="label-text-alt text-neutral">Number of days</span>
      </label>
    </div>
  );
};

export const PercentageField = (props: any) => {
  return (
    <div className="form-control w-full">
      <label className="label text-neutral">
        <span className="label-text text-neutral">SHARE PERCENTAGE</span>
        <span className="label-text-alt text-error">{props.errorMessage}</span>
      </label>
      <input
        type="text"
        placeholder="1% — 100%"
        className="input input-bordered w-full text-neutral"
        disabled={props.disabled}
        {...props.register}
      />
      <label className="label">
        <span className="label-text-alt text-neutral">XEN percentage</span>
      </label>
    </div>
  );
};

export const WalletAddressField = (props: any) => {
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
