module.exports = {
  HOST: "us-cdbr-east-02.cleardb.com",
  USER: "b91925cf00b629",
  PASSWORD: "22cdab60",
  DB: "heroku_838229f0b99f3e1",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
