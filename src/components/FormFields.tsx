import type { NextPage } from "next";
import { useTranslation } from "next-i18next";

export const MaxValueField: NextPage<any> = (props) => {
  const { t } = useTranslation("common");

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
            {t("form-field.max")}
          </button>
        </span>
      </label>
    </div>
  );
};

export const WalletAddressField: NextPage<any> = (props) => {
  const { t } = useTranslation("common");

  return (
    <div className="form-control w-full">
      <label className="label text-neutral">
        <span className="label-text text-neutral">
          {t("form-field.wallet-address")}
        </span>
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
          {t("form-field.wallet-address-description")}
        </span>
      </label>
    </div>
  );
};
