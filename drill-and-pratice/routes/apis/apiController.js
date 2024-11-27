import * as questionService from "../../services/questionService.js";
import * as optionsService from "../../services/optionsService.js";
import * as topicService from "../../services/topicsService.js";
import { log } from "../../utils/logger.js";
import { getConfig, initializeSQL } from "../../database/database.js";

export const getRandomQuestion = async ({ response }) => {
  const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
  const sql = await initializeSQL(config);
  try {
    const question = await questionService.getRandomQuestion(sql);
    const answers = await optionsService.getOptions(sql, question[0].id);

    if (!question[0]) {
      response.body = {};
      return;
    }

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
  } finally {
    await sql.end();
  }
};

export const addQuestion = async ({ request, response }) => {
  const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
  const sql = await initializeSQL(config);
  try {
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
    log(`Adding question by ${userId}`, "info", "apiController.js");

    const isTopic = await topicService.getTopicByName(sql, question.topic);

    if (!isTopic[0]) {
      log("Creating topic", "info", "apiController.js");
      await topicService.createTopic(sql, question.topic, userId);
    }
    const topicId = await topicService.getTopicByName(sql, question.topic);
    const DB_question = await questionService.getQuestionByQuestion_text(
      sql,
      Number(topicId[0].id),
      question.questionText
    );

    if (!DB_question[0]) {
      log("Adding question", "info", "apiController.js");
      await questionService.addQuestion(
        sql,
        question.questionText,
        Number(topicId[0].id),
        userId
      );
    } else {
      const retOptions = await optionsService.getOptions(
        sql,
        Number(DB_question[0].id)
      );
      if (retOptions[0]) {
        response.body = { message: "Question already exists!" };
        return;
      }
    }

    const qID = await questionService.getQuestionByQuestion_text(
      sql,
      Number(topicId[0].id),
      question.questionText
    );

    if (!qID[0]) {
      response.body = { message: "Question not found!" };
      return;
    }

    if (question.answer.length > 1) {
      for (let i = 0; i < question.answer.length; i++) {
        log("Adding options", "info", "apiController.js");
        await optionsService.insertOption(
          sql,
          question.answer[i].optionText,
          Number(qID[0].id),
          question.answer[i].correct
        );
      }
    } else {
      log("Error when trying adding the question", "info", "apiController.js");
      response.body = JSON.stringify({ message: "You need more options!" });
    }
    log("Question added successfully", "info", "apiController.js");
    response.body = JSON.stringify({ message: "Success!" });
  } finally {
    await sql.end();
  }
};

export const answerQuestion = async ({ request, response }) => {
  const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
  const sql = await initializeSQL(config);
  try {
    const body = request.body({ type: "json" });
    const document = await body.value;
    const answer = {
      questionId: document.questionId,
      optionId: document.optionId,
    };

    const correct = await optionsService.getCorrectOption(
      sql,
      answer.questionId
    );
    const correctOption = correct[0].id;

    if (correctOption === answer.optionId) {
      response.body = { correct: true };
    } else {
      response.body = { message: false };
    }
  } finally {
    await sql.end();
  }
};
