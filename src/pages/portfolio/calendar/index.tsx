import Container from "~/components/containers/Container";
import CardContainer from "~/components/containers/CardContainer";
import { NextPage } from "next";

const Calendar: NextPage = () => {
  return (
    <Container className="max-w-5xl">
      <CardContainer>Calendar</CardContainer>
    </Container>
  );
};

export default Calendar;
