import * as optionsService from "../../services/optionsService.js";
import * as questionService from "../../services/questionService.js";
import { getCookies } from "../../utils/cookiesHandler.js";

let data = {
  options: [],
  topicId: 0,
  questionId: 0,
  errors: [],
  question: {},
};

/* tu ne peux interagir qu'avec tes propres options */

export const addOptions = async ({ request, response, params }) => {
  const body = request.body();
  const paramsBody = await body.value;
  const optionTexts = paramsBody.getAll("option_text[]");
  const questionId = Number(params.qid);
  const topicId = Number(params.tid);

  const isCorrects = optionTexts.map((_, index) => {
    return paramsBody.has(`is_correct[${index}]`);
  });

  await optionsService.addOptions(optionTexts, isCorrects, questionId);

  response.redirect(`/topics/${topicId}/questions/${questionId}`);
};

export const showOptions = async ({ render, params, response, state }) => {
  const user = await getCookies(state);
  if (!user.authenticated) {
    response.redirect("/auth/login");
    return;
  }

  const topicId = Number(params.tid);
  const questionId = Number(params.qid);
  const questions = await questionService.getQuestion(topicId, questionId);
  if (
    !questions[0] ||
    (questions[0] && questions[0].user_id !== user.user.id)
  ) {
    response.redirect(`/topics/${topicId}`);
    return;
  }

  const options = await optionsService.getOptions(questionId);
  data = user;
  data.question = questions[0];
  data.options = options;
  data.topicId = topicId;
  data.questionId = questionId;

  console.log("DATA:", data);
  render("options.eta", data);
};

export const deleteOptions = async ({ response, params }) => {
  const topicId = Number(params.tid);
  const questionId = Number(params.qid);
  const optionId = Number(params.oid);

  await optionsService.deleteOptions(optionId);

  response.redirect(`/topics/${topicId}/questions/${questionId}`);
};
