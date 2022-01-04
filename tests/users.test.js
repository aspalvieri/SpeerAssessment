const chai = require("chai")
const chaiHttp = require("chai-http");
const expect = chai.expect;
const { app } = require("../app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("users");

chai.use(chaiHttp);

describe("/users", () => {
  before((done) => {
    //Delete all users in test database
    User.deleteMany({}, (err) => {
      done(); 
    });
  });
  describe("POST /register", () => {
    it("it should create a new user (test@test.com)", (done) => {
      let user = {
        email: "test@test.com",
        password: "123456",
        password2: "123456"
      };
      chai.request(app).post("/api/users/register")
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
    });
    it("it should create a new user (test2@test.com)", (done) => {
      let user = {
        email: "test2@test.com",
        password: "123456",
        password2: "123456"
      };
      chai.request(app).post("/api/users/register")
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
    });
    it("it should NOT create a new user (email already exists)", (done) => {
      let user = {
        email: "test@test.com",
        password: "123456",
        password2: "123456"
      };
      chai.request(app).post("/api/users/register")
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eq(400);
        expect(res.body.email).to.eq("User already exists!");
        done();
      });
    });
    it("it should NOT create a new user (password too short)", (done) => {
      let user = {
        email: "test3@test.com",
        password: "12345",
        password2: "12345"
      };
      chai.request(app).post("/api/users/register")
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eq(400);
        expect(res.body.password).to.eq("Password must be between 6 and 32 characters");
        done();
      });
    });
    it("it should NOT create a new user (invalid email)", (done) => {
      let user = {
        email: "test3",
        password: "123456",
        password2: "123456"
      };
      chai.request(app).post("/api/users/register")
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eq(400);
        expect(res.body.email).to.eq("Email is invalid");
        done();
      });
    });
  });
  describe("POST /login", () => {
    it("it should NOT login user (password incorrect)", (done) => {
      let user = {
        email: "test@test.com",
        password: "abcdef"
      };
      chai.request(app).post("/api/users/login")
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eq(400);
        expect(res.body.passwordincorrect).to.eq("Password incorrect");
        done();
      });
    });
    it("it should NOT login user (user not found)", (done) => {
      let user = {
        email: "notfound@test.com",
        password: "123456"
      };
      chai.request(app).post("/api/users/login")
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eq(404);
        expect(res.body.usernotfound).to.eq("User not found");
        done();
      });
    });
    it("it should login user (test@test.com)", (done) => {
      let user = {
        email: "test@test.com",
        password: "123456"
      };
      chai.request(app).post("/api/users/login")
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.token.startsWith("Bearer ")).to.be.true;
        const user = jwt.verify(res.body.token.split(" ")[1], process.env.secret);
        expect(user.email).to.eq("test@test.com");
        done();
      });
    });
  });
});
