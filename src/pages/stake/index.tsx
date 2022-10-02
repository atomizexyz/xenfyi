import { useAccount } from "wagmi";
import Container from "~/components/Container";
import { useContractRead } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";

const Stake = () => {
  const { address } = useAccount();

  const { data: userStakeData } = useContractRead({
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    functionName: "getUserStake",
    overrides: { from: address },
  });
  return (
    <Container>
      <div className="card glass">
        <div className="card-body">
          <h2 className="card-title">Stake</h2>
          <ul>
            {userStakeData && (
              <>
                <li>amount {userStakeData.amount.toString()}</li>
                <li>apy {userStakeData.apy.toString()}</li>
                <li>maturityTs {userStakeData.maturityTs.toString()}</li>
                <li>term {userStakeData.term.toString()}</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default Stake;
