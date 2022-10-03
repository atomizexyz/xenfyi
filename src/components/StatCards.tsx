import CountUp from "react-countup";

interface ProgressStat {
  title: string;
  percentComplete: number;
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
          value={props.percentComplete}
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
}

const formatDate = (date: number) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const _date = `0${d.getDate()}`.slice(-2);
  return `${year}/${month}/${_date}`;
};

// days since date
const daysSince = (date: number) => {
  return (Date.now() - date) / 1000 / 86400;
};

export const DateStatCard = (props: DateStat) => {
  return (
    <div className="stat">
      <div className="stat-title">{props.title}</div>
      <code className="stat-value text-lg md:text-3xl text-right">
        <CountUp
          end={daysSince(props.dateTs)}
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
  number: number;
  separator?: string;
  decimals?: number;
  suffix?: string;
}

export const NumberStatCard = (props: NumberStat) => {
  return (
    <div className="stat">
      <div className="stat-title">{props.title}</div>
      <code className="stat-value text-lg md:text-3xl text-right">
        <CountUp
          end={props.number}
          preserveValue={true}
          separator={props?.separator ?? ","}
          decimals={props?.decimals ?? 2}
          suffix={props.suffix ?? ""}
        />
      </code>
      <div className="stat-desc text-right"></div>
    </div>
  );
};

interface ChainStat {
  name: string;
  id: number;
}

export const ChainStatCard = (props: ChainStat) => {
  return (
    <div className="stat">
      <div className="stat-title">Chain</div>
      <code className="stat-value text-lg md:text-3xl text-right">
        {props.name}
      </code>
      <div className="stat-desc text-right">{`Chain ID: ${props.id}`}</div>
    </div>
  );
};
