const data = [
  "javascript-questions.json",
  "cinema-questions.json",
  "geography-questions.json",
  "history-questions.json",
  "politics-questions.json",
  "climat-questions.json",
  "capital-cities-quiz.json",
  "cooking-quiz.json",
  "french-culture-questions.json",
  "fun-facts-questions.json",
  "nature-quiz.json",
  "society-questions.json",
  "typescript-quiz.json",
  "video-game-quiz.json",
];

for (const file of data) {
  Deno.readTextFile(`./assets/content/${file}`)
    .then(async (data) => {
      try {
        const dataObj = JSON.parse(data);
        for (const question of dataObj["questions"]) {
          console.log(question);
          await fetch("http://localhost:7777/api/questions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              userId: "4",
            },
            body: JSON.stringify(question),
          });
        }
      } catch (error) {
        console.error(`Error parsing JSON from file ${file}:`, error);
      }
    })
    .catch((error) => {
      console.error(`Error reading file ${file}:`, error);
    });
}
