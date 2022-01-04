const chai = require("chai")
const chaiHttp = require("chai-http");
const expect = chai.expect;
const { app } = require("../app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const Message = mongoose.model("messages");

chai.use(chaiHttp);

describe("/messages", () => {
  let user1, token1, user2, token2;
  before((done) => {
    //Delete all messages
    Message.deleteMany({}, (err) => {
      //Login using previously created users
      chai.request(app).post("/api/users/login")
        .send({ email: "test@test.com", password: "123456" })
        .end((err, res) => {
          token1 = res.body.token.split(" ")[1];
          user1 = jwt.verify(token1, process.env.secret);
          chai.request(app).post("/api/users/login")
            .send({ email: "test2@test.com", password: "123456" })
            .end((err, res) => {
              token2 = res.body.token.split(" ")[1];
              user2 = jwt.verify(token2, process.env.secret);
              done();
            });
        });
    });
  });
  describe("POST /send", () => {
    it("it should send a message to test2@test.com from test@test.com", (done) => {
      let message = {
        email: "test2@test.com",
        message: "Hello."
      };
      chai.request(app).post("/api/messages/send")
      .auth(token1, { type: "bearer" })
      .send(message)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
    });
    it("it should NOT send a message to test@test.com (cannot message yourself)", (done) => {
      let message = {
        email: "test@test.com",
        message: "Hello."
      };
      chai.request(app).post("/api/messages/send")
      .auth(token1, { type: "bearer" })
      .send(message)
      .end((err, res) => {
        expect(res.status).to.eq(400);
        expect(res.body.email).to.eq("Cannot message yourself");
        done();
      });
    });
    it("it should NOT send a message to test2@test.com (message field is required)", (done) => {
      let message = {
        email: "test2@test.com",
        message: ""
      };
      chai.request(app).post("/api/messages/send")
      .auth(token1, { type: "bearer" })
      .send(message)
      .end((err, res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq("Message field is required");
        done();
      });
    });
    it("it should NOT send a message to testA@test.com (user not found)", (done) => {
      let message = {
        email: "testA@test.com",
        message: "Hello."
      };
      chai.request(app).post("/api/messages/send")
      .auth(token1, { type: "bearer" })
      .send(message)
      .end((err, res) => {
        expect(res.status).to.eq(400);
        expect(res.body.email).to.eq("User not found!");
        done();
      });
    });
  });
  describe("GET /", () => {
    it("it should get all messages for test@test.com", (done) => {
      chai.request(app).get("/api/messages")
      .auth(token1, { type: "bearer" })
      .send()
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.length).to.eq(0);
        done();
      });
    });
    it("it should get all messages for test2@test.com", (done) => {
      chai.request(app).get("/api/messages")
      .auth(token2, { type: "bearer" })
      .send()
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.length).to.eq(1);
        done();
      });
    });
    it("it should NOT get all messages for unknown user (invalid token)", (done) => {
      chai.request(app).get("/api/messages")
      .auth("broken.token", { type: "bearer" })
      .send()
      .end((err, res) => {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq("Invalid Token");
        done();
      });
    });
  });
});
