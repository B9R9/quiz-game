import * as questionService from "../../services/questionService.js";
import * as optionsService from "../../services/optionsService.js";
import * as topicService from "../../services/topicsService.js";

export const getRandomQuestion = async ({ response }) => {
  const question = await questionService.getRandomQuestion();
  const answers = await optionsService.getOptions(question[0].id);

  response.body = {
    questionId: question[0].id,
    questionText: question[0].question_text,
    answerOptions: answers.map((option) => {
      return {
        optionId: option.id,
        optionText: option.option_text,
      };
    }),
  };
};

export const addQuestion = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  const document = await body.value;
  const question = {
    topic:
      document.topic.trim().charAt(0).toUpperCase() +
      document.topic.slice(1).toLowerCase(),
    questionText: document.question,
    answer: document.answer.map((answer) => {
      return {
        optionText: answer.answerText,
        correct: answer.solution,
      };
    }),
  };

  const userId = Number(request.headers.get("userId"));
  console.log(userId);
  console.log(question);

  if (!(await topicService.getTopicByName(question.topic))) {
    console.log("Topic not found");
    await topicService.createTopic(question.topic, userId);
  }

  const topicId = await topicService.getTopicByName(question.topic);
  console.log("topicId", topicId[0].id);
  const DB_question = await questionService.getQuestionByQuestion_text(
    topicId[0].id,
    question.questionText
  );

  console.log(DB_question);

  if (!DB_question[0]) {
    console.log("Question not found");
    await questionService.addQuestion(
      question.questionText,
      topicId[0].id,
      userId
    );
  } else {
    const retOptions = await optionsService.getOptions(DB_question[0].id);
    if (retOptions[0]) {
      console.log("Options found");
      console.log(retOptions);
      response.body = { message: "Question already exists!" };
      return;
    }
  }

  const questionId = DB_question[0]
    ? DB_question[0].id
    : await questionService.getQuestionByQuestion_text(
        topicId[0].id,
        question.questionText
      );

  if (question.answer.length > 1) {
    for (let i = 0; i < question.answer.length; i++) {
      await optionsService.insertOption(
        question.answer[i].optionText,
        questionId,
        question.answer[i].correct
      );
    }
  } else {
    response.body = JSON.stringify({ message: "You need more options!" });
  }

  response.body = JSON.stringify({ message: "Success!" });
};
