import CountUp from "react-countup";
import { ethers } from "ethers";

interface ProgressStat {
  title: string;
  percentComplete: number;
  value: number;
  max: number;
  daysRemaining: number;
}

export const ProgressStatCard = (props: ProgressStat) => {
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
      <code className="stat-desc text-right">
        <CountUp
          end={props.daysRemaining}
          preserveValue={true}
          separator=","
          prefix="Days Remaining: "
          decimals={0}
        />
      </code>
    </div>
  );
};

interface DateStat {
  title: string;
  dateTs: number;
  isPast: boolean;
}

const formatDate = (date: number) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const _date = `0${d.getDate()}`.slice(-2);
  return `${year}/${month}/${_date}`;
};

// days since date
export const daysSince = (date: number) => {
  return (Date.now() - date) / 1000 / 86400;
};

export const daysUntil = (date: number) => {
  return (date - Date.now()) / 1000 / 86400;
};

export const DateStatCard = (props: DateStat) => {
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

export const NumberStatCard = (props: NumberStat) => {
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

export const ChainStatCard = (props: ChainStat) => {
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

export const DataCard = (props: DataStat) => {
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
