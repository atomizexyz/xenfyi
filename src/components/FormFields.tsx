import { ethers } from "ethers";

export const MaxValueField: React.FC<any> = (props) => {
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
          {`${Number(
            ethers.utils.formatUnits(props.value, props.decimals)
          ).toLocaleString("en-US")}`}
          <button
            type="button"
            onClick={() =>
              props.setValue(
                props.register.name,
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

export const WalletAddressField: React.FC<any> = (props) => {
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
