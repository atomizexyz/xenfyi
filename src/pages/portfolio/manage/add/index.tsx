import { NextPage } from "next";
import Container from "~/components/containers/Container";
import CardContainer from "~/components/containers/CardContainer";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { WALLET_ADDRESS_REGEX, MAX_PROFILE_WALLETS } from "~/lib/helpers";
import { useTranslation } from "next-i18next";
import { useLocalStorage } from "usehooks-ts";

const Add: NextPage = () => {
  const { t } = useTranslation("common");
  const [storedAddresses, setStoredAddresses] = useLocalStorage<
    Record<string, string>
  >("storedAddresses", {});

  return (
    <Container className="max-w-5xl">
      <div className="flew flex-row space-y-8 ">
        <CardContainer>
          <div className="flex flex-col space-y-4">
            <h2 className="card-title">Add New Addresses</h2>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-neutral">Wallet Name</span>
                <span className="label-text-alt text-error">
                  {/* <ErrorMessage errors={errors} name="newAddress" /> */}
                </span>
              </label>
              <input
                type="text"
                placeholder="XEN Wallet"
                className="input input-bordered w-full"
                //   disabled={storedAddresses.length > MAX_PROFILE_WALLETS}
                //   {...register("newAddress", { required: true })}
              />
              <label className="label">
                <span className="label-text-alt text-neutral">
                  Public key for addresses separated by commas
                </span>
                <span className="label-text-alt"></span>
              </label>

              <label className="label">
                <span className="label-text text-neutral">Addresses</span>
                <span className="label-text-alt text-error">
                  {/* <ErrorMessage errors={errors} name="newAddress" /> */}
                </span>
              </label>
              <textarea
                placeholder="0x...,0x...,0x..."
                className="textarea textarea-bordered w-full h-32"
                //   disabled={storedAddresses.length > MAX_PROFILE_WALLETS}
                //   {...register("newAddress", { required: true })}
              />
              <label className="label">
                <span className="label-text-alt text-neutral">
                  Public key for addresses separated by commas
                </span>
                <span className="label-text-alt"></span>
              </label>
            </div>

            <div className="alert shadow-lg glass">
              <div>
                <div>
                  <InformationCircleIcon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold">
                    {MAX_PROFILE_WALLETS} Max Addresses
                  </h3>
                  <div className="text-xs">
                    You can add a maximum of {MAX_PROFILE_WALLETS} addresses to
                    your portfolio.
                  </div>
                </div>
              </div>
            </div>

            <div className="form-control w-full">
              <button
                type="submit"
                className="btn glass text-neutral"
                //   disabled={storedAddresses.length > MAX_PROFILE_WALLETS}
              >
                Add New Address
              </button>
            </div>
          </div>
        </CardContainer>
        {/* OR */}
        <div className="divider">{t("or").toUpperCase()}</div>
        {/* OR */}
        <CardContainer>
          <div className="flex flex-col space-y-4">
            <h2 className="card-title">Batch Up Addresses</h2>
            <div className="form-control w-full">
              <input
                type="file"
                className="file-input file-input-bordered w-full"
              />
            </div>

            <div className="alert shadow-lg glass">
              <div>
                <div>
                  <InformationCircleIcon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold">File Name Must Be Wallet Name</h3>
                  <div className="text-xs">
                    Select a file with the name of the wallet and all of the
                    associated addresses you want to add to that wallet
                  </div>
                </div>
              </div>
            </div>

            <div className="form-control w-full">
              <button
                type="submit"
                className="btn glass text-neutral"
                //   disabled={storedAddresses.length > MAX_PROFILE_WALLETS}
              >
                Upload Batch Wallet
              </button>
            </div>
          </div>
        </CardContainer>
      </div>
    </Container>
  );
};

export default Add;
