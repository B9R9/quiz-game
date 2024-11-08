import * as topicsService from "../../services/topicsService.js";
import * as questionService from "../../services/questionService.js";
import * as optionsService from "../../services/optionsService.js";
import { getCookies } from "../../utils/cookiesHandler.js";

let question = {
  questionId: 0,
  questionText: "",
  answersOptions: [],
};

export const showQuiz = async ({ response, state, render }) => {
  let data = {};
  const user = await getCookies(state);
  /*   if (!user.authenticated) {
    response.redirect("/auth/login");
    return;
  } */
  data = user;
  data.topics = await topicsService.getTopics();
  render("quiz.eta", data);
};

export const findQuiz = async ({ response, state, render, params }) => {
  const user = await getCookies(state);
  /*   if (!user.authenticated) {
    response.redirect("/auth/login");
    return;
  } */

  const topicId = Number(params.tid);
  const allQuestionsTopic = await questionService.getAllQuestions(topicId);

  const questionIndex = Math.floor(Math.random() * allQuestionsTopic.length);

  const options = await optionsService.getOptions(
    allQuestionsTopic[questionIndex].id
  );
  question = {
    topicID: topicId,
    questionId: allQuestionsTopic[questionIndex].id,
    questionText: allQuestionsTopic[questionIndex].question_text,
    answersOptions: options.map((option) => {
      return {
        optionId: option.id,
        optionText: option.option_text,
      };
    }),
  };
  console.log("QUESTION:", question);
  response.redirect(`/quiz/${params.tid}/questions/${question.questionId}`);
};

export const showQuestion = async ({ response, state, render, params }) => {
  const user = await getCookies(state);

  let data = user;
  data.question = question;

  render("question.eta", data);
};

export const checkAnswer = async ({ request, response, params }) => {
  console.log("PATH:", request.url.pathname);

  const answer = Number(params.oid);
  const tID = Number(params.tid);
  const qID = Number(params.qid);
  console.log("Check Answer:", question);

  const isCorrect = await optionsService.checkAnswer(answer, qID);

  if (isCorrect) {
    response.redirect(`/quiz/${params.tid}/questions/${params.qid}/correct`);
  } else {
    response.redirect(`/quiz/${params.tid}/questions/${params.qid}/incorrect`);
  }
};

export const showCorrect = async ({ render, state }) => {
  let data = await getCookies(state);
  data.result = true;
  data.topicID = question.topicID;
  render("result.eta", data);
};

export const showIncorrect = async ({ render, state }) => {
  let data = await getCookies(state);
  data.result = false;

  const correctanswer = await optionsService.getCorrectOption(
    question.questionId
  );
  console.log("CORRECT ANSWER:", correctanswer[0]);
  data.answer = correctanswer[0].option_text;
  data.topicID = question.topicID;
  console.log("RIGHT ANSWER:", data.rightAnswer);
  render("result.eta", data);
};

export const getRandomQuestion = async ({ response }) => {
  const allQuestions = await questionService.getAllQuestions();
  const questionIndex = Math.floor(Math.random() * allQuestions.length);
  const options = await optionsService.getOptions(
    allQuestions[questionIndex].id
  );
  const answersOptions = options.map((option) => {
    return {
      optionId: option.id,
      optionText: option.option_text,
    };
  });
  response.body = {
    questionId: allQuestions[questionIndex].id,
    questionText: allQuestions[questionIndex].question_text,
    answersOptions: answersOptions,
  };
};
