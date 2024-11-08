import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicsController from "./controllers/topicsController.js";
import * as questionController from "./controllers/questionController.js";
import * as optionsController from "./controllers/optionsController.js";
import * as authController from "./controllers/authController.js";
import * as quizController from "./controllers/quizController.js";
import * as apiController from "./controllers/apiController.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics", topicsController.showTopics);
router.post("/topics", topicsController.addTopic);

router.get("/topics/:id", topicsController.showTopic);
router.post("/topics/:id/delete", topicsController.deleteTopic);

router.get("/topics/:tid/questions/:qid", optionsController.showOptions);
router.post("/topics/:id/questions", questionController.addQuestion);
router.post(
  "/topics/:tid/questions/:qid/delete",
  questionController.deleteQuestion
);

router.post(
  "/topics/:tid/questions/:qid/options",
  optionsController.addOptions
);
router.post(
  "/topics/:tid/questions/:qid/options/:oid/delete",
  optionsController.deleteOptions
);

router.get("/auth/register", authController.showRegistrationForm);
router.post("/auth/register", authController.register);

router.get("/auth/login", authController.showLoginForm);
router.post("/auth/login", authController.login);

router.post("/auth/logout", authController.logout);

router.get("/quiz", quizController.showQuiz);
router.get("/quiz/:tid", quizController.findQuiz);
router.get("/quiz/:tid/questions/:qid", quizController.showQuestion);
router.post(
  "/quiz/:tid/questions/:qid/options/:oid",
  quizController.checkAnswer
);
router.get("/quiz/:tid/questions/:qid/correct", quizController.showCorrect);
router.get("/quiz/:tid/questions/:qid/incorrect", quizController.showIncorrect);

router.get("/api/questions/random", apiController.getRandomQuestion);
router.post("/api/questions", apiController.addQuestion);

export { router };
