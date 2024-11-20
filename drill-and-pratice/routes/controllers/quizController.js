import * as topicsService from "../../services/topicsService.js";
import * as questionService from "../../services/questionService.js";
import * as optionsService from "../../services/optionsService.js";
import * as statsService from "../../services/statsService.js";
import { getCookies } from "../../utils/cookiesHandler.js";
import { sql } from "../../database/database.js";

let question = {
  questionId: 0,
  questionText: "",
  answersOptions: [],
};

// const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
// const sql = await initializeSQL(config);

export const showQuiz = async ({ response, state, render }) => {
  let data = {};
  const user = await getCookies(state);
  if (!user.authenticated) {
    response.redirect("/auth/login");
    return;
  }
  data = user;
  data.topics = await topicsService.getTopics(sql);
  render("quiz.eta", data);
};

export const findQuiz = async ({ response, state, render, params }) => {
  const user = await getCookies(state);
  if (!user.authenticated) {
    response.redirect("/auth/login");
    return;
  }

  const topicId = Number(params.tid);
  const allQuestionsTopic = await questionService.getAllQuestions(sql, topicId);

  const questionIndex = Math.floor(Math.random() * allQuestionsTopic.length);

  const options = await optionsService.getOptions(
    sql,
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
  question.answersOptions.sort(() => Math.random() - 0.5);

  response.redirect(`/quiz/${params.tid}/questions/${question.questionId}`);
};

export const showQuestion = async ({ response, state, render, params }) => {
  const user = await getCookies(state);
  if (!user.authenticated) {
    response.redirect("/auth/login");
    return;
  }

  let data = user;
  data.question = question;

  render("question.eta", data);
};

export const checkAnswer = async ({ request, response, params, state }) => {
  const user = await getCookies(state);
  const answer = Number(params.oid);
  const tID = Number(params.tid);
  const qID = Number(params.qid);

  const isCorrect = await optionsService.checkAnswer(sql, answer, qID);

  await statsService.addStat(sql, user.user.id, qID, answer);

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
    sql,
    question.questionId
  );
  data.answer = correctanswer[0].option_text;
  data.topicID = question.topicID;
  render("result.eta", data);
};

export const getRandomQuestion = async ({ response }) => {
  const allQuestions = await questionService.getAllQuestions(sql);
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
