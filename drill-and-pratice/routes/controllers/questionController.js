import * as questionService from "../../services/questionService.js";
import * as optionsService from "../../services/optionsService.js";
import { getCookies } from "../../utils/cookiesHandler.js";

let data = {
  question: {},
  topicId: 0,
  questionId: 0,
  errors: [],
};

export const addQuestion = async ({ request, response, params, state }) => {
  const user = await getCookies(state);
  if (!user.authenticated) {
    response.redirect("/auth/login");
    return;
  }

  const body = request.body();
  const paramsBody = await body.value;
  const question = paramsBody.get("question_text");
  const topicId = params.id;

  await questionService.addQuestion(question, topicId, user.user.id);

  response.redirect(`/topics/${topicId}`);
};

export const showQuestions = async ({ render, params, state, response }) => {
  const user = await getCookies(state);
  // if (!user.authenticated) {
  //   response.redirect("/auth/login");
  //   return;
  // }

  const topicId = Number(params.tid);
  const questionId = Number(params.qid);

  const questions = await questionService.getQuestion(topicId, questionId);
  if (questions.length === 0 || questions[0].user_id !== user.user.id) {
    response.redirect(`/topics/${topicId}`);
    return;
  }

  const options = await optionsService.getOptions(questionId);

  data = user;
  data.question = questions[0];
  data.topicId = topicId;
  data.questionId = questionId;
  data.options = options;

  render("options.eta", data);
};

export const deleteQuestion = async ({ response, params }) => {
  const topicId = Number(params.tid);
  const questionId = Number(params.qid);

  await questionService.deleteQuestion(questionId);

  response.redirect(`/topics/${topicId}`);
};
