import Container from "~/components/containers/Container";
import CardContainer from "~/components/containers/CardContainer";
import { NextPage } from "next";

const Manage: NextPage = () => {
  return (
    <Container className="max-w-5xl">
      <CardContainer>Manage</CardContainer>
    </Container>
  );
};

export default Manage;
