import Container from "~/components/containers/Container";
import CardContainer from "~/components/containers/CardContainer";
import { NextPage } from "next";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { chainList } from "~/lib/client";
import { NumberStatCard } from "~/components/StatCards";
import PortfolioNav from "~/components/nav/PortfolioNav";

const Calendar: NextPage = () => {
  const MaturityDateRow: NextPage = () => {
    const date = new Date();
    // add random number of days to date
    date.setDate(date.getDate() + Math.floor(Math.random() * 100));
    return (
      <tr>
        <td className="align-top">
          <DayPicker defaultMonth={date} disableNavigation selected={date} />
        </td>
        <td className="w-4/12 align-top">
          <div className="flex flex-col">
            <NumberStatCard title="USD Value" value={200} decimals={0} />
            <NumberStatCard title="XEN Value" value={200} decimals={0} />
            <NumberStatCard title="Total Addresses" value={200} decimals={0} />
          </div>
        </td>
        <td className="align-top">
          <div className="card-actions pt-4">
            {chainList.map((chain, index) => (
              <div key={index} className="badge badge-outline">
                {chain.name}
              </div>
            ))}
          </div>
        </td>
      </tr>
    );
  };

  const CalendarHeaderRow: NextPage = () => {
    return (
      <tr>
        <th>Date</th>
        <th>Metrics</th>
        <th>Chains</th>
      </tr>
    );
  };

  return (
    <Container className="max-w-5xl">
      <PortfolioNav />
      <CardContainer>
        <div className="overflow-x-auto">
          <table className="table table-compact w-full">
            <thead>
              <CalendarHeaderRow />
            </thead>
            <tbody>
              <MaturityDateRow />
              <MaturityDateRow />
            </tbody>
          </table>
        </div>
      </CardContainer>
    </Container>
  );
};

export default Calendar;
