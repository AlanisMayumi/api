const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

const users = [
  {
    id: "1",
    userName: "KimNamJoon",
    password: "knj2022",
    isAdmin: true,
  },
  {
    id: "2",
    userName: "MinYoonGi",
    password: "myg2022",
    isAdmin: false,
  },
  {
    id: "3",
    userName: "KimSeokJin",
    password: "ksj2022",
    isAdmin: false,
  },
];

let refreshTokens = [];

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "mySecretKey", {
    expiresIn: "10m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    "myRefreshSecretKey",
    {
      expiresIn: "10m",
    }
  );
};

const verify = (request, response, next) => {
  const authHeader = request.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, "mySecretKey", (err, user) => {
      if (err) {
        return response.status(403).json("Token is not valid!");
      }

      request.user = user;
      next();
    });
  } else {
    response.status(401).json("You are not authenticated!");
  }
};

app.delete("/api/users/:userId", verify, (req, res) => {
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    res.status(200).json("User has been deleted.");
  } else {
    res.status(403).json("You are not allowed to delete this user! ");
  }
});

app.post("/api/refresh", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(401).json("You are not authenticated!");
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid!");
  }
  jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
    err && console.error(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    refreshTokens.push(newRefreshToken);
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
});

app.post("/api/login", (req, res) => {
  const { userName, password } = req.body;

  const user = users.find(
    (x) => x.userName === userName && x.password === password
  );
  if (user) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.push(refreshToken);

    res.json({
      username: user.userName,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).json("User or password incorrect");
  }
});

app.post("api/logout", verify, (req, res) => {
  const refreshToken = req.body.token;

  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json("You logged out successfully!");
});

app.listen(5000, () => console.log("Backend server is running"));
