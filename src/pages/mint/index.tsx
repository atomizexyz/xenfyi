import { useAccount } from "wagmi";
import Container from "~/components/Container";
import { useContractRead } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";

const Mint = () => {
  const { address } = useAccount();

  const { data: userMintData } = useContractRead({
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    functionName: "getUserMint",
    overrides: { from: address },
  });

  return (
    <Container>
      <div className="card glass">
        <div className="card-body">
          <h2 className="card-title">Mint</h2>
          <ul>
            {userMintData && (
              <>
                <li>amplifier {userMintData.amplifier.toString()}</li>
                <li>eaaRate {userMintData.eaaRate.toString()}</li>
                <li>maturityTs {userMintData.maturityTs.toString()}</li>
                <li>rank {userMintData.rank.toString()}</li>
                <li>term {userMintData.term.toString()}</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default Mint;
