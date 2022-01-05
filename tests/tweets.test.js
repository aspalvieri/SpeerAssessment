const chai = require("chai")
const chaiHttp = require("chai-http");
const expect = chai.expect;
const { app } = require("../app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const Tweet = mongoose.model("tweets");

chai.use(chaiHttp);

describe("/tweets", () => {
  let user1, token1;
  let user2, token2;
  let user1tweet1, user1tweet2;
  let user2tweet1;

  before((done) => {
    //Delete all messages
    Tweet.deleteMany({}, (err) => {
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
  describe("POST /post", () => {
    it("it should post a tweet for test@test.com", (done) => {
      let message = {
        message: "Hello."
      };
      chai.request(app).post("/api/tweets/post")
      .auth(token1, { type: "bearer" })
      .send(message)
      .end((err, res) => {
        user1tweet1 = res.body._id;
        expect(res.status).to.eq(200);
        done();
      });
    });
    it("it should post a tweet for test@test.com", (done) => {
      let message = {
        message: "Hello again."
      };
      chai.request(app).post("/api/tweets/post")
      .auth(token1, { type: "bearer" })
      .send(message)
      .end((err, res) => {
        user1tweet2 = res.body._id;
        expect(res.status).to.eq(200);
        done();
      });
    });
    it("it should post a tweet for test2@test.com", (done) => {
      let message = {
        message: "Hello again."
      };
      chai.request(app).post("/api/tweets/post")
      .auth(token2, { type: "bearer" })
      .send(message)
      .end((err, res) => {
        user2tweet1 = res.body._id;
        expect(res.status).to.eq(200);
        done();
      });
    });
    it("it should NOT post a tweet for test@test.com (message length greater than 120)", (done) => {
      let message = {
        message: "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901"
      };
      chai.request(app).post("/api/tweets/post")
      .auth(token2, { type: "bearer" })
      .send(message)
      .end((err, res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq("Message length greater than 120");
        done();
      });
    });
    it("it should NOT post a tweet for test@test.com (message is field required)", (done) => {
      let message = {
        message: ""
      };
      chai.request(app).post("/api/tweets/post")
      .auth(token2, { type: "bearer" })
      .send(message)
      .end((err, res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq("Message field is required");
        done();
      });
    });
  });
  describe("GET /", () => {
    it("it should get the tweets for the logged in user", (done) => {
      chai.request(app).get("/api/tweets")
      .auth(token1, { type: "bearer" })
      .send()
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.length).to.eq(2);
        done();
      });
    });
    it("it should get the tweets for test2@test.com", (done) => {
      chai.request(app).get("/api/tweets/test2@test.com")
      .send()
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.length).to.eq(1);
        done();
      });
    });
    it("it should NOT get the tweets for testA@test.com (user not found)", (done) => {
      chai.request(app).get("/api/tweets/testA@test.com")
      .send()
      .end((err, res) => {
        expect(res.status).to.eq(400);
        expect(res.body.email).to.eq("User not found!");
        done();
      });
    });
  });
  describe("POST /update", () => {
    it("it should update the second tweet test@test.com posted", (done) => {
      let newMessage = {
        message: "Updated Hello."
      };
      chai.request(app).post(`/api/tweets/update/${user1tweet2}`)
      .auth(token1, { type: "bearer" })
      .send(newMessage)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq("Updated Hello.");
        done();
      });
    });
    it("it should NOT update the selected tweet (message length greater than 120)", (done) => {
      let newMessage = {
        message: "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901 Hello."
      };
      chai.request(app).post(`/api/tweets/update/${user1tweet2}`)
      .auth(token1, { type: "bearer" })
      .send(newMessage)
      .end((err, res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq("Message length greater than 120");
        done();
      });
    });
  });
  describe("POST /delete", () => {
    it("it should NOT delete a tweet test@test.com posted (not the owner)", (done) => {
      chai.request(app).post(`/api/tweets/delete/${user1tweet2}`)
      .auth(token2, { type: "bearer" })
      .send()
      .end((err, res) => {
        //This will return success, even if it delete nothing
        expect(res.status).to.eq(200);
        //To ensure it didn't delete someone else's tweet, we'll get their tweets
        chai.request(app).get("/api/tweets/test@test.com")
        .send()
        .end((err, res) => {
          expect(res.body.length).to.eq(2);
          done();
        })
      });
    });
    it("it should delete the first tweet test@test.com posted", (done) => {
      chai.request(app).post(`/api/tweets/delete/${user1tweet1}`)
      .auth(token1, { type: "bearer" })
      .send()
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.length).to.eq(1);
        done();
      });
    });
  });
  describe("POST /like", () => {
    it("it should like the first tweet from test2@test.com (test@test.com)", (done) => {
      chai.request(app).post(`/api/tweets/like/${user2tweet1}`)
      .auth(token1, { type: "bearer" })
      .send()
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.likes.length).to.eq(1);
        done();
      });
    });
    it("it should like the first tweet from test2@test.com (test2@test.com)", (done) => {
      chai.request(app).post(`/api/tweets/like/${user2tweet1}`)
      .auth(token2, { type: "bearer" })
      .send()
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.likes.length).to.eq(2);
        done();
      });
    });
    it("it should UNlike the first tweet from test2@test.com (test@test.com)", (done) => {
      chai.request(app).post(`/api/tweets/like/${user2tweet1}`)
      .auth(token1, { type: "bearer" })
      .send()
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.likes.length).to.eq(1);
        done();
      });
    });
    it("it should NOT like/unlike the tweet (tweet not found)", (done) => {
      let obj = new mongoose.Types.ObjectId();
      chai.request(app).post(`/api/tweets/like/${obj}`)
      .auth(token1, { type: "bearer" })
      .send()
      .end((err, res) => {
        expect(res.status).to.eq(400);
        expect(res.body.error).to.eq("Tweet not found!");
        done();
      });
    });
  });
  describe("POST /retweet", () => {
    it("it should retweet test2@test.com's first tweet under test@test.com", (done) => {
      chai.request(app).post(`/api/tweets/retweet/${user2tweet1}`)
      .auth(token1, { type: "bearer" })
      .send()
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.origin_id).to.eq(user2.id);
        expect(res.body.user_id).to.eq(user1.id);
        chai.request(app).get("/api/tweets")
        .auth(token1, { type: "bearer" })
        .send()
        .end((err, res) => {
          expect(res.body.length).to.eq(2);
          done();
        })
      });
    });
    it("it should retweet test@test.com's second tweet under test2@test.com", (done) => {
      chai.request(app).post(`/api/tweets/retweet/${user1tweet2}`)
      .auth(token2, { type: "bearer" })
      .send()
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.origin_id).to.eq(user1.id);
        expect(res.body.user_id).to.eq(user2.id);
        chai.request(app).get("/api/tweets")
        .auth(token2, { type: "bearer" })
        .send()
        .end((err, res) => {
          expect(res.body.length).to.eq(2);
          done();
        })
      });
    });
    it("it should NOT retweet user's tweet (tweet not found)", (done) => {
      let obj = new mongoose.Types.ObjectId();
      chai.request(app).post(`/api/tweets/retweet/${obj}`)
      .auth(token1, { type: "bearer" })
      .send()
      .end((err, res) => {
        expect(res.status).to.eq(400);
        expect(res.body.error).to.eq("Tweet not found!");
        chai.request(app).get("/api/tweets")
        .auth(token1, { type: "bearer" })
        .send()
        .end((err, res) => {
          expect(res.body.length).to.eq(2);
          done();
        })
      });
    });
  });
  describe("POST /reply", () => {
    it("it should post a reply to test@test.com's second tweet", (done) => {
      let message = {
        message: "This is a reply."
      };
      chai.request(app).post(`/api/tweets/reply/${user1tweet2}`)
      .auth(token2, { type: "bearer" })
      .send(message)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
    });
    it("it should post a reply to test@test.com's second tweet", (done) => {
      let message = {
        message: "This is another reply."
      };
      chai.request(app).post(`/api/tweets/reply/${user1tweet2}`)
      .auth(token2, { type: "bearer" })
      .send(message)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
    });
    it("it should NOT post a reply to the tweet (tweet not found)", (done) => {
      let message = {
        message: "This is a reply."
      };
      let obj = mongoose.Types.ObjectId();
      chai.request(app).post(`/api/tweets/reply/${obj}`)
      .auth(token2, { type: "bearer" })
      .send(message)
      .end((err, res) => {
        expect(res.status).to.eq(400);
        expect(res.body.error).to.eq("Tweet not found!");
        done();
      });
    });
  });
});
