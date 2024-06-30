import React from "react";
import { Container, Text, Paper } from "@mantine/core";
import { Accordion } from '@mantine/core';
import { questions } from "../data/faqData";

const item = questions.map((item) => (
    <Accordion.Item key={item.question} value={item.question}>
      <Accordion.Control icon={item.emoji}>{item.question}</Accordion.Control>
      <Accordion.Panel>{item.answer}</Accordion.Panel>
    </Accordion.Item>
));

const FAQPage = () => {

  return (
    <Container size="xs" my={40}>
      <Paper shadow="sm" p="lg" withBorder>
        <Text align="center" size="xl" weight={700}>
          FAQ
        </Text>
      </Paper>

      <Accordion defaultQuestion="Apples">
      {item}
      </Accordion>
      
    </Container>
  );
};

export default FAQPage;
