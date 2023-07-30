const cors = require('cors');
const express = require("express");
const app = express();
const port = 8000;
const gameNightsRouter = require("./routes/gameNights");
const gameInstancesRouter = require("./routes/gameInstances");
const usersRouter = require("./routes/users");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
  cors()
);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/game-nights", gameNightsRouter);
app.use("/game-instances", gameInstancesRouter);
app.use("/users", usersRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});