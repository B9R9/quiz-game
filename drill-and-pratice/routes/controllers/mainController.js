import * as mainService from "../../services/mainService.js";
import { getCookies } from "../../utils/cookiesHandler.js";
import { sql } from "../../database/database.js";

let data = {
  ttTopics: 0,
  ttQuestions: 0,
  ttAnswers: 0,
};

// const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
// const sql = await initializeSQL(config);

const showMain = async ({ render, state }) => {
  const ttTopics = await mainService.getTotalTopics(sql);
  const ttQuestions = await mainService.getTotalQuestions(sql);
  const ttAnswers = await mainService.getTotalAnswers(sql);

  data = await getCookies(state);

  data.ttTopics = Number(ttTopics);
  data.ttQuestions = Number(ttQuestions);
  data.ttAnswers = Number(ttAnswers);

  render("main.eta", data);
};

export { showMain };
