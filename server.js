const express = require("express");
const port_no = 3535;
const app = express();

const elastic = require("./elastic");
/* parsing incoming JSON request */
const bodyParser = require("body-parser"); // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); // parse application/json
app.use(express.json());
app.use(bodyParser.json()); //express middleware
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use("/plans", require("./routes/planRoutes"));
app.use("/auth", require("./routes/authRoutes"));

app.listen(port_no, async () => {
  await elastic.deleteNested("12xvxc345ssdsds-508", "plan");
  console.log("Application starting on port ", port_no);
  res.send("Application Works!");
});

app.get("/_health", (req, res) => {
  res.send("Application works! Health check done");
});
