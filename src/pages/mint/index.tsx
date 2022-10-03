import { useAccount } from "wagmi";
import Container from "~/components/Container";
import { useContractRead } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";
import CountUp from "react-countup";

const Mint = () => {
  const { address } = useAccount();

  const { data: userMintData } = useContractRead({
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    functionName: "getUserMint",
    overrides: { from: address },
  });

  const mintItems = [
    {
      title: "Amplifier",
      value: userMintData?.amplifier,
      suffix: "",
    },
    {
      title: "EAA Rate",
      value: userMintData?.eaaRate / 10,
      suffix: "%",
    },
    {
      title: "Rank",
      value: userMintData?.rank,
      suffix: "",
    },
    {
      title: "Term",
      value: userMintData?.term,
      suffix: "",
    },
  ];

  const daysRemaining = () => {
    return (Number(userMintData?.maturityTs) - Date.now() / 1000) / 86400;
  };
  const percentComplete = () => {
    return userMintData?.term - daysRemaining();
  };

  const estimatedXEN = () => {
    return 30;
  };

  const MintProgress = () => {
    return (
      <div className="stat">
        <div className="stat-title">Progress</div>
        <div className="stat-value text-lg md:text-3xl text-right">
          <CountUp
            end={percentComplete()}
            preserveValue={true}
            separator=","
            suffix="%"
            decimals={2}
          />
        </div>
        <div>
          <progress
            className="progress progress-secondary"
            value={percentComplete()}
            max={userMintData?.term ?? 0.0}
          ></progress>
        </div>
        <code className="stat-desc text-right">
          <CountUp
            end={daysRemaining()}
            preserveValue={true}
            separator=","
            prefix="Days Remaining: "
            decimals={0}
          />
        </code>
      </div>
    );
  };

  return (
    <Container>
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <li className="step step-neutral">Start Mint</li>
          <li className="step step-neutral">Minting</li>
          <li className="step">Claim</li>
        </ul>

        <div className="card glass">
          <div className="card-body">
            {userMintData?.user.toString() ===
            "0x0000000000000000000000000000000000000000" ? (
              <div className="flex flex-col space-y-4">
                <h2 className="card-title text-neutral">Mint XEN</h2>
                <div className="form-control w-full">
                  <label className="label text-neutral">
                    <span className="label-text text-neutral">MINT DAYS</span>
                    <span className="label-text-alt text-error">Required</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type days"
                    className="input input-bordered w-full text-neutral"
                  />
                  <label className="label">
                    <span className="label-text-alt text-neutral">
                      Select the number of days you want to mint between 0 and
                      100
                    </span>
                  </label>
                </div>
                <button className="btn glass text-neutral">Start Mint</button>
              </div>
            ) : (
              <>
                <h2 className="card-title">Mint</h2>

                <div className="stats stats-vertical bg-transparent text-neutral">
                  <MintProgress />
                  {mintItems.map((item, index) => (
                    <div className="stat" key={index}>
                      <div className="stat-title">{item.title}</div>
                      <code className="stat-value text-lg md:text-3xl text-right">
                        <CountUp
                          end={item.value}
                          preserveValue={true}
                          separator=","
                          suffix={item.suffix}
                          // decimals={2}
                        />
                      </code>
                      <div className="stat-desc text-right"></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Mint;
