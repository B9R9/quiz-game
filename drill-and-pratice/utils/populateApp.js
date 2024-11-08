Deno.readTextFile("../assets/content/cinema-questions.json").then(
  async (data) => {
    const dataObj = JSON.parse(data);
    for (const question of dataObj["questions"]) {
      console.log(question);
      await fetch("http://localhost:7777/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userId: "3",
        },
        body: JSON.stringify(question),
      });
    }
  }
);
