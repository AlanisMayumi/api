const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

const users = [
  {
    id: 1,
    userName: "KimNamJoon",
    password: "knj2022",
    isAdmin: true,
  },
  {
    id: 2,
    userName: "MinYoonGi",
    password: "myg2022",
    isAdmin: false,
  },
  {
    id: 3,
    userName: "KimSeokJin",
    password: "ksj2022",
    isAdmin: false,
  },
];

app.post("/api/login", (req, res) => {
  const { userName, password } = req.body;

  const user = users.find(
    (x) => x.userName === userName && x.password === password
  );
  if (user) {
    res.json(user);
  } else {
    res.status(400).json("User or password incorrect");
  }
});

app.listen(5000, () => console.log("Backend server is running"));
