import Container from "~/components/containers/Container";
import CardContainer from "~/components/containers/CardContainer";
import { NextPage } from "next";

const Balance: NextPage = () => {
  return (
    <Container className="max-w-5xl">
      <CardContainer>Balance</CardContainer>
    </Container>
  );
};

export default Balance;
