import * as mainService from "../../services/mainService.js";
import { getCookies } from "../../utils/cookiesHandler.js";

let data = {
  ttTopics: 0,
  ttQuestions: 0,
  ttAnswers: 0,
};
const showMain = async ({ render, state }) => {
  const ttTopics = await mainService.getTotalTopics();
  const ttQuestions = await mainService.getTotalQuestions();
  const ttAnswers = await mainService.getTotalAnswers();

  data = await getCookies(state);

  data.ttTopics = Number(ttTopics);
  data.ttQuestions = Number(ttQuestions);
  data.ttAnswers = Number(ttAnswers);

  render("main.eta", data);
};

export { showMain };
