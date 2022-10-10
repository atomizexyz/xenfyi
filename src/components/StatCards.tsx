import CountUp from "react-countup";
import { ethers } from "ethers";
import { UTC_TIME } from "~/lib/helpers";

interface ProgressStat {
  title: string;
  percentComplete: number;
  value: number;
  max: number;
  daysRemaining: number;
  dateTs: number;
}

export const ProgressStatCard: React.FC<ProgressStat> = (props) => {
  return (
    <div className="stat">
      <div className="stat-title">{props.title}</div>
      <div className="stat-value text-lg md:text-3xl text-right">
        <CountUp
          end={props.percentComplete}
          preserveValue={true}
          separator=","
          suffix="%"
          decimals={2}
        />
      </div>
      <div>
        <progress
          className="progress progress-secondary"
          value={props.value}
          max={props.max}
        ></progress>
      </div>
      <div className="stat-desc text-right">{formatDate(props.dateTs)}</div>
    </div>
  );
};

interface DateStat {
  title: string;
  dateTs: number;
  isPast: boolean;
}

const formatDate = (date: number) => {
  const d = new Date(date * 1000);
  const year = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const _date = `0${d.getDate()}`.slice(-2);
  const hour = `0${d.getHours()}`.slice(-2);
  const minute = `0${d.getMinutes()}`.slice(-2);
  const second = `0${d.getSeconds()}`.slice(-2);
  return `${year}/${month}/${_date} ${hour}:${minute}:${second}`;
};

// days since date
export const daysSince = (date: number) => {
  return Math.floor((UTC_TIME - date) / 86400);
};

export const daysUntil = (date: number) => {
  return Math.floor((date - UTC_TIME) / 86400);
};

export const DateStatCard: React.FC<DateStat> = (props) => {
  return (
    <div className="stat">
      <div className="stat-title">{props.title}</div>
      <code className="stat-value text-lg md:text-3xl text-right">
        <CountUp
          end={props.isPast ? daysSince(props.dateTs) : daysUntil(props.dateTs)}
          preserveValue={true}
          separator={","}
          suffix={" Days"}
        />
      </code>
      <div className="stat-desc text-right">{formatDate(props.dateTs)}</div>
    </div>
  );
};

interface NumberStat {
  title: string;
  value: number;
  separator?: string;
  decimals?: number;
  suffix?: string;
  description?: string;
  tokenDecimals?: number;
}

export const NumberStatCard: React.FC<NumberStat> = (props) => {
  let value = props.value;
  if (props.tokenDecimals != null) {
    value = Number(ethers.utils.formatUnits(props.value.toString(), 18));
  }
  return (
    <div className="stat">
      <div className="stat-title">{props.title}</div>
      <code className="stat-value text-lg md:text-3xl text-right">
        <CountUp
          end={value}
          preserveValue={true}
          separator={props?.separator ?? ","}
          decimals={props?.decimals ?? 2}
          suffix={props.suffix ?? ""}
        />
      </code>
      <div className="stat-desc text-right">{props.description}</div>
    </div>
  );
};

interface ChainStat {
  value: string;
  id: number;
}

export const ChainStatCard: React.FC<ChainStat> = (props) => {
  return (
    <div className="stat">
      <div className="stat-title">Chain</div>
      <code className="stat-value text-lg md:text-3xl text-right">
        {props.value}
      </code>
      <div className="stat-desc text-right">{`Chain ID: ${props.id}`}</div>
    </div>
  );
};

interface DataStat {
  title: string;
  value: string;
  description?: string;
}

export const DataCard: React.FC<DataStat> = (props) => {
  return (
    <div className="stat">
      <div className="stat-title">{props.title}</div>
      <code className="stat-value text-lg md:text-3xl text-right">
        {props.value}
      </code>
      <div className="stat-desc text-right">{props?.description}</div>
    </div>
  );
};

interface GrossRewardStat {
  title: string;
  value: number;
  suffix?: string;
  description?: string;
  descriptionNumber?: number;
  descriptionNumberSuffix?: string;
}

export const CountDataCard: React.FC<GrossRewardStat> = (props) => {
  return (
    <div className="stat">
      <div className="stat-title">{props.title}</div>
      <code className="stat-value text-lg md:text-3xl text-right">
        <CountUp
          end={props.value}
          preserveValue={true}
          separator=","
          suffix={props.suffix ?? ""}
        />
      </code>

      <div className="stat-desc text-right">
        {props?.descriptionNumber ? (
          <CountUp
            end={props.descriptionNumber}
            preserveValue={true}
            separator=","
            suffix={props.descriptionNumberSuffix ?? ""}
          />
        ) : (
          <>{props?.description}</>
        )}
      </div>
    </div>
  );
};

interface CountdownCardStat {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownCard: React.FC<CountdownCardStat> = (props) => {
  return (
    <div className="stat">
      <div className="stat-title">Matures in</div>
      <code className="stat-value text-lg md:text-3xl text-right">
        {props.days > 99 ? (
          <div className="">
            <div className="font-mono inline">{props.days}•</div>
            <span className="countdown font-mono">
              <span style={{ "--value": props.hours } as any}></span>:
              <span style={{ "--value": props.minutes } as any}></span>:
              <span style={{ "--value": props.seconds } as any}></span>
            </span>
          </div>
        ) : (
          <span className="countdown font-mono">
            <span style={{ "--value": props.days } as any}></span>•
            <span style={{ "--value": props.hours } as any}></span>:
            <span style={{ "--value": props.minutes } as any}></span>:
            <span style={{ "--value": props.seconds } as any}></span>
          </span>
        )}
      </code>
      <div className="stat-desc text-right">Day•Hours:Minutes:Seconds</div>
    </div>
  );
};
