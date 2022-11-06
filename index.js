const express = require("express");

const app = express();

const users = [
  {
    id: 1,
    userName: "Kim Nam Joon",
    password: "knj2022",
    isAdmin: true,
  },
  {
    id: 2,
    userName: "Min Yoon Gi",
    password: "myg2022",
    isAdmin: false,
  },
];

app.post("/api/login", (req, res) => {
  const { userName, password } = req.body;
});

app.listen(5000, () => console.log("Backend server is running"));
