import React, { useState } from "react";
import {
  Container,
  Text,
  Paper,
  Accordion,
  TextInput,
  SimpleGrid,
  Anchor,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { questions } from "../data/faqData";
import { hackathonInfo } from "../data/hackathonInfo";

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");

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
        <Text style={{ fontWeight: 600 }}>{item.question}</Text>
      </Accordion.Control>
      <Accordion.Panel>
        <Text style={{ paddingLeft: 20 }}>{item.answer}</Text>
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
        {isMobile ? (
          <Accordion>{faqItems}</Accordion>
        ) : (
          <SimpleGrid cols={2} spacing="lg" mb="lg">
            <Accordion>
              {faqItems.slice(0, Math.ceil(faqItems.length / 2))}
            </Accordion>
            <Accordion>
              {faqItems.slice(Math.ceil(faqItems.length / 2))}
            </Accordion>
          </SimpleGrid>
        )}
        <Text align="center" mt="lg" style={{ fontSize: "1rem" }}>
          Can't find the answer you're looking for? Ask us on{" "}
          <Anchor href={hackathonInfo.discord} target="_blank">
            Discord!
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
};

export default FAQPage;
