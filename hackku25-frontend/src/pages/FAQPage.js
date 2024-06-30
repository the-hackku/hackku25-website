import React, { useState } from "react";
import { Container, Text, Paper, Accordion, TextInput } from "@mantine/core";
import { questions } from "../data/faqData";

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredQuestions = questions.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const faqItems = filteredQuestions.map((item) => (
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
        <Text
          style={{
            paddingLeft: 20,
          }}
        >
          {item.answer}
        </Text>
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
        <TextInput
          placeholder="Search questions and answers..."
          value={searchQuery}
          onChange={handleSearchChange}
          mb="lg"
        />
        <Accordion defaultValue={questions[0]?.question}>{faqItems}</Accordion>
      </Paper>
    </Container>
  );
};

export default FAQPage;
