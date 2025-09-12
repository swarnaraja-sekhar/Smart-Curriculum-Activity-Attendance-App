const Task = require("../models/Task");
const mongoose = require("mongoose");

const seedTasks = async () => {
  await Task.deleteMany({});
  const tasks = [
    { title: "Math Challenge", description: "Solve 10 advanced math problems." },
    { title: "Science Quiz", description: "Complete weekly quiz." },
    { title: "Coding Practice", description: "Build a small React project." },
  ];
  await Task.insertMany(tasks);
  console.log("Tasks seeded ✅");
  process.exit();
};

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => seedTasks());
