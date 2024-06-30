import React from "react";
import { Container, Text, Paper, Accordion } from "@mantine/core";
import { questions } from "../data/faqData";

const FAQPage = () => {
  const faqItems = questions.map((item) => (
    <Accordion.Item key={item.question} value={item.question}>
      <Accordion.Control>
        <Text
          style={{
            fontWeight: 700,
          }}
        >
          {item.question}
        </Text>
      </Accordion.Control>
      <Accordion.Panel>
        <Text>{item.answer}</Text>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Container my={40}>
      <Paper shadow="sm" p="lg" withBorder>
        <Text
          style={{ fontSize: "2rem" }}
          align="center"
          mb="lg"
          variant="gradient"
          gradient={{ from: "red", to: "indigo", deg: 149 }}
        >
          Frequently Asked Questions
        </Text>
        <Accordion defaultValue={questions[0]?.question}>{faqItems}</Accordion>
      </Paper>
    </Container>
  );
};

export default FAQPage;
