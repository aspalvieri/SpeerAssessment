# Speer Technologies Assessment
**Task 1: Twitter**

## Installation
1. Type "npm install" to install all dependencies (NOTE: I used Node version 16.13.1).
2. Create environment variables file ".env" in the root folder.
3. Setup .env file as below (NOTE: only need TEST database if just running tests):
```
DB_TEST_URL="connection string to MongoDB TEST database"
DB_DEV_URL="connection string to MongoDB DEV database"
secret="YourSecret"
```
4. Type "npm test" and ensure all tests passed (NOTE: test script is set for Windows).

## Overview
The backend application for a twitter clone. All of the API calls and descriptions are listed below. A section of code I was proud of is the authentication routes. I created a middleware named "authorize", and it will ensure that the request has a valid JWT token. It will then decode it and pass the data onto the next route. This allows me to ensure that the user is logged in, and allows me to easily access their ID and email fields. If the authorize fails, a 403 error is returned instead.\
An example of how this works is as follows:
```js
router.post("/post", auth, tweetsController.postTweet);
```
Then, from the tweetsController.postTweet, I can access the user's ID by the following:
```js
req.user.id;
```

## API Calls
If an API says "Requires authentication", that means you must send it a JWT token through either the x-access-token header or the authorization header. The sent object is what you need to pass in the body of the request. The returned object is what the API returns, assuming it was successful:

### /api/users
### POST: /api/users/register
Registers a new user to the website.
```
Sent object:
{
  email: String, email address,
  password: String, 6-36 characters,
  password2: String, must be equal to password
}

Returned object:
{
  email: String,
  password: String, hashed,
  messages: Array of message object IDs,
  tweets: Array of tweet object IDs
}
```

### POST: /api/users/login
Logs a user into the website. Returns a JWT token for the frontend to store for the future.
```
Sent object:
{
  email: String, email address,
  password: String, 6-36 characters,
}

Returned object:
{
  success: true,
  token: JWT bearer token
}
```

### /api/messages
### POST: /api/messages/send
**Requires authentication**\
Sends a message to the specified email.
```
Sent object:
{
  email: String, email receiving the message,
  message: String, 120 character limit
}

Returned object:
{
  success: true
}
```

### GET: /api/messages
**Requires authentication**\
Returns an array of all messages the user has received.
```
Returned object:
[
  {
    sender_email: String, email of the sender,
    message: String, the message
  }
]
```

### /api/tweets
### POST: /api/tweets/post
**Requires authentication**\
Posts a new tweet and returns the newly posted tweet.
```
Sent object:
{
  message: String, 120 character limit
}

Returned object:
{
  user_id: Object ID, owner of tweet,
  origin_id: Object ID, original poster of tweet,
  message: String, the tweet,
  likes: Array of user object IDs,
  replies: [
    {
      email: String, email of replier,
      message: String, reply message
    }
  ]
}
```

### GET: /api/tweets/:email
If email field is empty, it'll return the current logged in user's tweets instead.\
Returns an array of all the tweets the specified email has posted.
```
Returned object:
[
  {
    user_id: Object ID, owner of tweet,
    origin_id: Object ID, original poster of tweet,
    message: String, the tweet,
    likes: Array of user object IDs,
    replies: [
      {
        email: String, email of replier,
        message: String, reply message
      }
    ]
  }
]
```

### POST: /api/tweets/delete/:id
**Requires authentication**\
Deletes the specified tweet. Will only work if the user owns the tweet.
```
Returned object:
[
  {
    user_id: Object ID, owner of tweet,
    origin_id: Object ID, original poster of tweet,
    message: String, the tweet,
    likes: Array of user object IDs,
    replies: [
      {
        email: String, email of replier,
        message: String, reply message
      }
    ]
  }
]
```

### POST: /api/tweets/update/:id
**Requires authentication**\
Updates the specified tweet. Will only work if the user owns the tweet.
```
Sent object:
{
  message: String, 120 character limit
}

Returned object:
{
  user_id: Object ID, owner of tweet,
  origin_id: Object ID, original poster of tweet,
  message: String, the tweet,
  likes: Array of user object IDs,
  replies: [
    {
      email: String, email of replier,
      message: String, reply message
    }
  ]
}
```

### POST: /api/tweets/like/:id
**Requires authentication**\
Likes or unlikes the specified tweet. Returns the tweet object.
```
Returned object:
{
  user_id: Object ID, owner of tweet,
  origin_id: Object ID, original poster of tweet,
  message: String, the tweet,
  likes: Array of user object IDs,
  replies: [
    {
      email: String, email of replier,
      message: String, reply message
    }
  ]
}
```

### POST: /api/tweets/retweet/:id
**Requires authentication**\
Creates a new tweet based off the given one. Returns the reposted tweet.
```
Returned object:
{
  user_id: Object ID, owner of tweet,
  origin_id: Object ID, original poster of tweet,
  message: String, the tweet,
  likes: Array of user object IDs,
  replies: [
    {
      email: String, email of replier,
      message: String, reply message
    }
  ]
}
```

### POST: /api/tweets/reply/:id
**Requires authentication**\
Adds a reply to the specified tweet. Returns the replied tweet.
```
Sent object:
{
  message: String, 120 character limit
}

Returned object:
{
  user_id: Object ID, owner of tweet,
  origin_id: Object ID, original poster of tweet,
  message: String, the tweet,
  likes: Array of user object IDs,
  replies: [
    {
      email: String, email of replier,
      message: String, reply message
    }
  ]
}
```
