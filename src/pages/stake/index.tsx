// import Container from "~/components/Container";
// import { useContractRead, useBalance, useAccount } from "wagmi";
// import XenCrypto from "~/abi/XENCrypto.json";
// import { useStep } from "usehooks-ts";
// import { clsx } from "clsx";
// import { DaysField, AmountField } from "~/components/FormFields";
// import { InformationCircleIcon } from "@heroicons/react/outline";
// import { useState, useEffect } from "react";
// import { daysRemaining, percentComplete } from "~/lib/helpers";
// import { useRouter } from "next/router";

// import {
//   ProgressStatCard,
//   NumberStatCard,
//   DateStatCard,
//   DataCard,
// } from "~/components/StatCards";

// const steps: any[] = [
//   {
//     id: 1,
//     title: "Start Stake",
//   },
//   {
//     id: 2,
//     title: "Staking",
//   },
//   {
//     id: 3,
//     title: "End Stake",
//   },
// ];

// const Stake = () => {
//   const { address } = useAccount();
//   const router = useRouter();

//   const [currentStep, helpers] = useStep(steps.length);
//   const { setStep } = helpers;
//   const [yeild, setYeild] = useState(0);
//   const [maturity, setMaturity] = useState<number>(Date.now());
//   const [currentStateStep, setCurrentStateStep] = useState(0);

//   const { data: balanceData } = useBalance({
//     addressOrName: address,
//     token: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
//   });

//   const { data: userStakeData } = useContractRead({
//     addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
//     contractInterface: XenCrypto.abi,
//     functionName: "getUserStake",
//     overrides: { from: address },
//   });

//   const mintItems = [
//     {
//       title: "Balance",
//       value: balanceData?.formatted,
//       suffix: "",
//     },
//     {
//       title: "Amount",
//       value: userStakeData?.amount,
//       suffix: "",
//     },
//     {
//       title: "APY",
//       value: userStakeData?.apy,
//       suffix: "%",
//     },
//     {
//       title: "Term",
//       value: userStakeData?.term,
//       suffix: "",
//     },
//   ];

//   const progressDaysRemaining = daysRemaining(userStakeData?.maturityTs);
//   const progressPercentComplete = percentComplete(
//     progressDaysRemaining,
//     userStakeData?.term
//   );

//   const EndStakeStep = () => {
//     const disabled = currentStateStep == 2;

//     return (
//       <div className="flex flex-col space-y-4">
//         <h2 className="card-title text-neutral">End Stake</h2>
//         <button className="btn glass text-neutral" disabled={disabled}>
//           End Stake
//         </button>
//       </div>
//     );
//   };

//   const StartStakeStep = () => {
//     const disabled = currentStateStep == 2;
//     return (
//       <div className="flex flex-col space-y-4">
//         <h2 className="card-title text-neutral">Start Stake</h2>
//         <AmountField
//           balance={balanceData?.formatted ?? "0.0"}
//           disabled={disabled}
//         />
//         <DaysField disabled={disabled} />

//         <div className="stats glass text-neutral">
//           <DataCard title="Yield" value={"10"} description={"10%"} />
//           <DateStatCard title="Maturity" dateTs={maturity} />
//         </div>

//         <div className="alert shadow-lg glass">
//           <div>
//             <InformationCircleIcon className="w-16 h-16" />
//             <div>
//               <h3 className="font-bold">Staking Terms</h3>
//               <div className="text-xs">
//                 Withdraw original Stake amount plus Yield at any time after
//                 Maturity Date, or original Stake amount with 0 (zero) Yield at
//                 anu time before Maturity Date. One stake at a time per one
//                 address.
//               </div>
//             </div>
//           </div>
//         </div>
//         <button className="btn glass text-neutral" disabled={disabled}>
//           Start Stake
//         </button>
//       </div>
//     );
//   };

//   const StakingStep = () => {
//     return (
//       <>
//         <h2 className="card-title">Staking</h2>
//         <div className="stats stats-vertical bg-transparent text-neutral">
//           <ProgressStatCard
//             title="Progress"
//             percentComplete={progressPercentComplete}
//             max={userStakeData?.term ?? 0.0}
//             daysRemaining={progressDaysRemaining}
//           />
//           {mintItems.map((item, index) => (
//             <NumberStatCard
//               key={index}
//               title={item.title}
//               number={item.value}
//               suffix={item.suffix}
//             />
//           ))}
//         </div>
//       </>
//     );
//   };

//   useEffect(() => {
//     const queryStep = parseInt(router.query.step as string);
//     if (queryStep && queryStep > 0 && queryStep < 4) {
//       setStep(queryStep);
//     }
//     setYeild(10);
//   }, [router.query.step, setStep, userStakeData]);

//   return (
//     <Container>
//       <div className="flew flex-row space-y-8 ">
//         <ul className="steps w-full">
//           {steps.map((step, index) => {
//             return (
//               <button
//                 onClick={() => {
//                   setStep(step.id);
//                   router.query.step = step.id;
//                   router.push(router);
//                 }}
//                 key={index}
//                 className={clsx("step", {
//                   "step-neutral": currentStep >= step.id,
//                 })}
//               >
//                 {step.title}
//               </button>
//             );
//           })}
//         </ul>
//         <div className="card glass">
//           <div className="card-body">
//             {(() => {
//               switch (currentStep) {
//                 case 2:
//                   return <StakingStep />;
//                 case 3:
//                   return <EndStakeStep />;
//                 default:
//                   return <StartStakeStep />;
//               }
//             })()}
//           </div>
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default Stake;
