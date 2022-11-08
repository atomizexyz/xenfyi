import type { NextPage } from "next";
import Container from "~/components/containers/Container";
import { useNetwork, Chain } from "wagmi";
import PortfolioAddressRow from "~/components/PortfolioAddressRow";
import { useLocalStorage } from "usehooks-ts";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray } from "react-hook-form";
import { WALLET_ADDRESS_REGEX, MAX_PROFILE_WALLETS } from "~/lib/helpers";
import * as yup from "yup";
import { CountDataCard } from "~/components/StatCards";
import { useEffect, useState, useContext } from "react";
import { InformationCircleIcon } from "@heroicons/react/outline";
import CardContainer from "~/components/containers/CardContainer";
import XENContext from "~/contexts/XENContext";
import PortfolioNav from "~/components/nav/PortfolioNav";

const Manage: NextPage = () => {
  const { chain } = useNetwork() as { chain: Chain };
  const [mintTotal, setMintTotal] = useState(0);
  const [stakeTotal, setStakeTotal] = useState(0);

  // typescript key value object string string
  const [storedAddresses] = useLocalStorage<Record<string, string>>(
    "storedAddresses",
    {}
  );
  const { globalRank } = useContext(XENContext);

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
      portfolio: Object.keys(storedAddresses).slice(0, MAX_PROFILE_WALLETS),
      // .map((address) => ({
      //   address: address,
      //   mint: 0,
      //   stake: 0,
      // })),
    },
  });

  const watchAllFields = watch();

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "portfolio",
  // });

  const TableHeaderFooter = () => {
    return (
      <tr>
        <th className="bg-transparent hidden lg:table-cell"></th>
        <th className="bg-transparent hidden lg:table-cell">Address</th>
        <th className="bg-transparent hidden lg:table-cell text-right">Mint</th>
        <th className="bg-transparent hidden lg:table-cell text-right">
          Mint End
        </th>
        <th className="bg-transparent hidden lg:table-cell text-right">
          Stake
        </th>
        <th className="bg-transparent hidden lg:table-cell text-right">
          Stake End
        </th>
      </tr>
    );
  };

  const onSubmit = (data: any) => {
    const newAddressArray = data.newAddress.split(",");
    // const addressSet = new Set([...storedAddresses, ...newAddressArray]);

    // const fieldsSet = fields.map((field) => field.address);

    // const uniqueAddresses = Array.from(addressSet);
    // setStoredAddresses(uniqueAddresses);

    // uniqueAddresses.forEach((address) => {
    //   if (!fieldsSet.includes(address)) {
    //     append({
    //       address: address,
    //       mint: 0,
    //       stake: 0,
    //     });
    //   }
    // });
    resetField("newAddress");
  };

  useEffect(() => {
    // if (fields) {
    // const mintTotal = fields.reduce((acc, field) => acc + field.mint, 0);
    // const stakeTotal = fields.reduce((acc, field) => acc + field.stake, 0);
    //   setMintTotal(mintTotal);
    //   setStakeTotal(stakeTotal);
    // }
  }, []);

  return (
    <Container className="max-w-5xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <PortfolioNav />
        <CardContainer>
          <div className="space-y-4 w-full">
            <h2 className="card-title">Portfolio</h2>

            <div className="overflow-x-auto">
              <table className="table table-compact w-full">
                <thead>
                  <TableHeaderFooter />
                </thead>
                <tbody>
                  {/* {fields.map((item, index) => (
                    <tr key={index}>
                      <PortfolioAddressRow
                        chain={chain}
                        globalRankData={globalRank}
                        item={item}
                        index={index}
                        register={register}
                        remove={remove}
                        storedAddresses={storedAddresses}
                        setStoredAddresses={setStoredAddresses}
                      />
                    </tr>
                  ))} */}
                </tbody>
                <tfoot>
                  <TableHeaderFooter />
                </tfoot>
              </table>
            </div>

            <div className="flex justify-center w-full">
              <div className="btn-group">
                <button className="btn glass">1</button>
                <button className="btn glass">2</button>
                <button className="btn btn-disabled">...</button>
                <button className="btn glass">99</button>
                <button className="btn glass">100</button>
              </div>
            </div>
          </div>
        </CardContainer>
      </form>
    </Container>
  );
};

export default Manage;
