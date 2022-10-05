import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import Container from "~/components/Container";
import { DaysField } from "~/components/FormFields";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { xenContract } from "~/lib/xen-contract";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Mint = () => {
  const { address } = useAccount();
  const router = useRouter();
  const [disabled, setDisabled] = useState(true);

  /*** CONTRACT READ SETUP  ***/

  const { data } = useContractRead({
    ...xenContract,
    functionName: "getUserMint",
    overrides: { from: address },
    cacheOnBlock: true,
    watch: true,
  });

  /*** FORM SETUP ***/

  const schema = yup
    .object()
    .shape({
      startMintDays: yup
        .number()
        .required("Days required")
        .positive("Days must be greater than 0")
        .typeError("Days required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const watchAllFields = watch();

  /*** CONTRACT WRITE SETUP ***/

  const { config, error } = usePrepareContractWrite({
    ...xenContract,
    functionName: "claimRank",
    args: [watchAllFields.startMintDays ?? 0],
  });
  const { write } = useContractWrite({
    ...config,
    onSuccess() {
      router.push("/mint/2");
    },
  });
  const onSubmit = () => {
    write?.();
  };

  /*** USE EFFECT ****/

  useEffect(() => {
    if (address && data && data.term.isZero()) {
      setDisabled(false);
    }
  }, [address, data]);

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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col space-y-4">
                <h2 className="card-title text-neutral">Start Mint</h2>
                <DaysField
                  disabled={disabled}
                  errorMessage={
                    <ErrorMessage errors={errors} name="startMintDays" />
                  }
                  register={register("startMintDays")}
                />
                <button
                  type="submit"
                  className="btn glass text-neutral"
                  disabled={disabled}
                >
                  Start Mint
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Mint;
