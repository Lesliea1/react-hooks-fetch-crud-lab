import React, { useState, useEffect } from "react";
import QuestionItem from "./QuestionItem";
function QuestionList() {
  const [questions, setQuestions] = useState([]);

  const handleDelete = async (questionId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/questions/${questionId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((question) => question.id !== questionId)
        );
      } else {
        console.error(`Failed to delete question with ID ${questionId}`);
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleCorrectAnswerChange = async (questionId, newCorrectIndex) => {
    try {
      const response = await fetch(
        `http://localhost:4000/questions/${questionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correctIndex: newCorrectIndex,
          }),
        }
      );
      if (response.ok) {
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) => {
            if (question.id === questionId) {
              return { ...question, correctIndex: newCorrectIndex };
            }
            return question;
          })
        );
      } else {
        console.error(
          `Failed to update correct answer for question with ID ${questionId}`
        );
      }
    } catch (error) {
      console.error("Error updating correct answer:", error);
    }
  };

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("http://localhost:4000/questions");
        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
        } else {
          console.error("Failed to fetch questions");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }

    fetchQuestions();
  }, []);

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            onDelete={handleDelete}
            onUpdateCorrectAnswer={handleCorrectAnswerChange}
          />
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
