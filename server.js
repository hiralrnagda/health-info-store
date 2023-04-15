const express = require("express");
const port_no = 3001;
const app = express();
/* parsing incoming JSON request */
const bodyParser = require("body-parser"); // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); // parse application/json
app.use(express.json());
app.use(bodyParser.json()); //express middleware
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use("/plans", require("./routes/planRoutes"));
app.use("/auth", require("./routes/authRoutes"));

const elastic = require("./services/elasticsearchService");

app.get("/", async (req, res) => {
  await elastic.deleteNested("12xvxc345ssdsds-508", "plan");
  res.send("Application works!");
});

app.listen(port_no, () => {
  console.log("Application starting on port ", port_no);
});
