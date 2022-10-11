import type { NextPage } from "next";
import Container from "~/components/Container";
import { useNetwork, Chain, useContractRead } from "wagmi";
import { xenContract } from "~/lib/xen-contract";
import PortfolioAddressRow from "~/components/PortfolioAddressRow";
import { useLocalStorage } from "usehooks-ts";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray } from "react-hook-form";
import { WALLET_ADDRESS_REGEX } from "~/lib/helpers";
import * as yup from "yup";
import { CountDataCard } from "~/components/StatCards";
import { useEffect, useState } from "react";

const Portfolio: NextPage = () => {
  const { chain } = useNetwork() as { chain: Chain };
  const [mintTotal, setMintTotal] = useState(0);
  const [stakeTotal, setStakeTotal] = useState(0);
  const [disableDelete, setDisableDelete] = useState(true);
  const [storedAddresses, setStoredAddresses] = useLocalStorage<string[]>(
    "storedAddresses",
    []
  );

  const { data: globalRankData } = useContractRead({
    ...xenContract(chain),
    functionName: "globalRank",
    // watch: true,
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
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      newAddress: "",
      portfolio: storedAddresses.map((address) => ({
        address: address,
        mint: 0,
        stake: 0,
        isChecked: false,
      })),
    },
  });

  const watchAllFields = watch();

  // console.log(watchAllFields);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "portfolio",
  });

  const TableHeaderFooter = () => {
    return (
      <tr>
        <th className="bg-transparent">
          <button
            name="delete"
            id="delete"
            type="button"
            className="btn btn-xs glass text-neutral"
            disabled={disableDelete}
            onClick={() => {
              // remove all checked fields by id
              const checkedIds = fields
                .filter((field) => field.isChecked)
                .map((field, index) => index);
              remove(checkedIds);
            }}
          >
            Delete
          </button>
        </th>
        <th className="bg-transparent">Address</th>
        <th className="bg-transparent text-right">Mint</th>
        <th className="bg-transparent text-right">Stake</th>
      </tr>
    );
  };

  const onSubmit = (data: any) => {
    const addressSet = new Set([...storedAddresses, data.newAddress]);
    const fieldsSet = fields.map((field) => field.address);

    const uniqueAddresses = Array.from(addressSet);
    setStoredAddresses(uniqueAddresses);

    if (fieldsSet.length !== uniqueAddresses.length) {
      const newAddress = uniqueAddresses.filter(
        (address) => !fieldsSet.includes(address)
      )[0];
      append({
        address: newAddress,
        mint: 0,
        stake: 0,
        isChecked: false,
      });
    }
    resetField("newAddress");
  };

  useEffect(() => {
    if (fields) {
      const mintTotal = fields.reduce((acc, field) => acc + field.mint, 0);
      const stakeTotal = fields.reduce((acc, field) => acc + field.stake, 0);
      setMintTotal(mintTotal);
      setStakeTotal(stakeTotal);
    }

    const hasChecked = watchAllFields.portfolio.some(
      (field: any) => field.isChecked
    );
    setDisableDelete(!hasChecked);
    console.log(watchAllFields);
  }, [fields, watchAllFields]);

  return (
    <Container className="max-w-5xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 w-full">
          <div className="card flex glass">
            <div className="card-body">
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
                          // setValue={setValue}
                        />
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <TableHeaderFooter />
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          <div className="card flex w-full glass">
            <div className="card-body">
              <h2 className="card-title">Add New Address</h2>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-neutral">Address</span>
                  <span className="label-text-alt text-error">
                    <ErrorMessage errors={errors} name="newAddress" />
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="input input-bordered w-full"
                  disabled={storedAddresses.length == 15}
                  {...register("newAddress", { required: true })}
                />
                <label className="label">
                  <span className="label-text-alt text-neutral">
                    Public key for address
                  </span>
                  <span className="label-text-alt"></span>
                </label>
              </div>
              <div className="form-control w-full">
                <button
                  type="submit"
                  className="btn glass text-neutral"
                  disabled={storedAddresses.length == 15}
                >
                  Add New Address
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Container>
  );
};

export default Portfolio;
