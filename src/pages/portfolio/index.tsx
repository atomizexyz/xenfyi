import type { NextPage } from "next";
import Container from "~/components/containers/Container";
import { useNetwork, Chain, useContractRead } from "wagmi";
import { xenContract } from "~/lib/xen-contract";
import PortfolioAddressRow from "~/components/PortfolioAddressRow";
import { useLocalStorage } from "usehooks-ts";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray } from "react-hook-form";
import { WALLET_ADDRESS_REGEX, MAX_PROFILE_WALLETS } from "~/lib/helpers";
import * as yup from "yup";
import { CountDataCard } from "~/components/StatCards";
import { useEffect, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/outline";
import CardContainer from "~/components/containers/CardContainer";

const Portfolio: NextPage = () => {
  const { chain } = useNetwork() as { chain: Chain };
  const [mintTotal, setMintTotal] = useState(0);
  const [stakeTotal, setStakeTotal] = useState(0);
  const [storedAddresses, setStoredAddresses] = useLocalStorage<string[]>(
    "storedAddresses",
    []
  );

  const { data: globalRankData } = useContractRead({
    ...xenContract(chain),
    functionName: "globalRank",
    watch: true,
  });

  const schema = yup
    .object()
    .shape({
      newAddress: yup
        .string()
        .required("Crypto address required")
        .matches(WALLET_ADDRESS_REGEX, {
          message: "Invalid address",
          excludeEmptyString: true,
        }),
    })
    .required();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      newAddress: "",
      portfolio: storedAddresses
        .slice(0, MAX_PROFILE_WALLETS)
        .map((address) => ({
          address: address,
          mint: 0,
          stake: 0,
        })),
    },
  });

  const watchAllFields = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "portfolio",
  });

  const TableHeaderFooter = () => {
    return (
      <tr>
        <th className="bg-transparent"></th>
        <th className="bg-transparent">Address</th>
        <th className="bg-transparent text-right">Mint</th>
        <th className="bg-transparent text-right">Mint End</th>
        <th className="bg-transparent text-right">Stake</th>
        <th className="bg-transparent text-right">Stake End</th>
      </tr>
    );
  };

  const onSubmit = (data: any) => {
    const newAddressArray = data.newAddress.split(",");
    const addressSet = new Set([...storedAddresses, ...newAddressArray]);

    const fieldsSet = fields.map((field) => field.address);

    const uniqueAddresses = Array.from(addressSet);
    setStoredAddresses(uniqueAddresses);

    uniqueAddresses.forEach((address) => {
      if (!fieldsSet.includes(address)) {
        append({
          address: address,
          mint: 0,
          stake: 0,
        });
      }
    });
    resetField("newAddress");
  };

  useEffect(() => {
    if (fields) {
      const mintTotal = fields.reduce((acc, field) => acc + field.mint, 0);
      const stakeTotal = fields.reduce((acc, field) => acc + field.stake, 0);
      setMintTotal(mintTotal);
      setStakeTotal(stakeTotal);
    }
  }, [fields, setStoredAddresses, storedAddresses, watchAllFields]);

  return (
    <Container className="max-w-5xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 w-full">
          <CardContainer>
            <h2 className="card-title">Portfolio</h2>

            <div className="flex stats stats-vertical lg:stats-horizontal glass w-full text-neutral flex-col lg:flex-row">
              <CountDataCard
                title="Mint Total"
                value={mintTotal}
                description="XEN"
              />
              <CountDataCard
                title="Stake Total"
                value={stakeTotal}
                description="XEN"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="table table-compact w-full">
                <thead>
                  <TableHeaderFooter />
                </thead>
                <tbody>
                  {fields.map((item, index) => (
                    <tr key={index}>
                      <PortfolioAddressRow
                        chain={chain}
                        globalRankData={Number(globalRankData ?? 0)}
                        item={item}
                        index={index}
                        register={register}
                        remove={remove}
                        storedAddresses={storedAddresses}
                        setStoredAddresses={setStoredAddresses}
                      />
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <TableHeaderFooter />
                </tfoot>
              </table>
            </div>
          </CardContainer>

          <CardContainer>
            <div className="flex flex-col space-y-4">
              <h2 className="card-title">Add New Addresses</h2>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-neutral">Addresses</span>
                  <span className="label-text-alt text-error">
                    <ErrorMessage errors={errors} name="newAddress" />
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="0x...,0x...,0x..."
                  className="input input-bordered w-full"
                  disabled={storedAddresses.length > MAX_PROFILE_WALLETS}
                  {...register("newAddress", { required: true })}
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
                    <h3 className="font-bold">15 Max Addresses</h3>
                    <div className="text-xs">
                      You can add a maximum of 15 addresses to your portfolio.
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-control w-full">
                <button
                  type="submit"
                  className="btn glass text-neutral"
                  disabled={storedAddresses.length > MAX_PROFILE_WALLETS}
                >
                  Add New Address
                </button>
              </div>
            </div>
          </CardContainer>
        </div>
      </form>
    </Container>
  );
};

export default Portfolio;
