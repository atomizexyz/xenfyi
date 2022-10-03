import { useAccount } from "wagmi";
import Container from "~/components/Container";
import { useContractRead, useBalance } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";

const Stake = () => {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    addressOrName: address,
    token: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
  });

  const { data: userStakeData } = useContractRead({
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    functionName: "getUserStake",
    overrides: { from: address },
  });
  console.log(balanceData);
  return (
    <Container>
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <li className="step step-neutral">Start Stake</li>
          <li className="step step-neutral">Staking</li>
          <li className="step">End Stake</li>
        </ul>
        <div className="card glass">
          <div className="card-body">
            <h2 className="card-title">Stake</h2>
            {/* {balance} */}
            <ul>
              {userStakeData && (
                <>
                  <li>balance {balanceData?.formatted}</li>
                  <li>amount {userStakeData.amount.toString()}</li>
                  <li>apy {userStakeData.apy.toString()}</li>
                  <li>maturityTs {userStakeData.maturityTs.toString()}</li>
                  <li>term {userStakeData.term.toString()}</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Stake;
