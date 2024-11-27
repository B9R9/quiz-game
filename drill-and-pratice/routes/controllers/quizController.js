import * as topicsService from "../../services/topicsService.js";
import * as questionService from "../../services/questionService.js";
import * as optionsService from "../../services/optionsService.js";
import * as statsService from "../../services/statsService.js";
import { getCookies } from "../../utils/cookiesHandler.js";
import { getConfig, initializeSQL } from "../../database/database.js";

let question = {
  questionId: 0,
  questionText: "",
  answersOptions: [],
};

// const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
// const sql = await initializeSQL(config);

export const showQuiz = async ({ response, state, render }) => {
  const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
  const sql = await initializeSQL(config);
  try {
    let data = {};
    const user = await getCookies(state);
    if (!user.authenticated) {
      response.redirect("/auth/login");
      return;
    }
    data = user;
    data.topics = await topicsService.getTopics(sql);
    render("quiz.eta", data);
  } finally {
    await sql.end();
  }
};

export const findQuiz = async ({ response, state, render, params }) => {
  const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
  const sql = await initializeSQL(config);
  try {
    const user = await getCookies(state);
    if (!user.authenticated) {
      response.redirect("/auth/login");
      return;
    }

    const topicId = Number(params.tid);
    const allQuestionsTopic = await questionService.getAllQuestions(
      sql,
      topicId
    );
    if (allQuestionsTopic.length === 0) {
      response.redirect("/quiz");
      await sql.end();
      return;
    }

    const questionIndex = Math.floor(Math.random() * allQuestionsTopic.length);

    const options = await optionsService.getOptions(
      sql,
      allQuestionsTopic[questionIndex].id
    );

    if (options.length < 2) {
      response.redirect(`/quiz/${params.tid}`);
      await sql.end();
      return;
    }
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
  } finally {
    await sql.end();
  }
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
  const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
  const sql = await initializeSQL(config);
  try {
    const user = await getCookies(state);
    if (!user.authenticated) {
      response.redirect("/auth/login");
      return;
    }
    const answer = Number(params.oid);
    const tID = Number(params.tid);
    const qID = Number(params.qid);

    const isCorrect = await optionsService.checkAnswer(sql, answer, qID);

    await statsService.addStat(sql, user.user.id, qID, answer);

    if (isCorrect) {
      response.redirect(`/quiz/${params.tid}/questions/${params.qid}/correct`);
    } else {
      response.redirect(
        `/quiz/${params.tid}/questions/${params.qid}/incorrect`
      );
    }
  } finally {
    await sql.end();
  }
};

export const showCorrect = async ({ render, state }) => {
  let data = await getCookies(state);
  data.result = true;
  data.topicID = question.topicID;
  render("result.eta", data);
};

export const showIncorrect = async ({ render, state }) => {
  const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
  const sql = await initializeSQL(config);
  try {
    let data = await getCookies(state);
    data.result = false;

    const correctanswer = await optionsService.getCorrectOption(
      sql,
      question.questionId
    );
    data.answer = correctanswer[0].option_text;
    data.topicID = question.topicID;
    render("result.eta", data);
  } finally {
    await sql.end();
  }
};
