# Speer Technologies Assessment

## Installation
1. Type "npm init" to install all dependancies.
2. Create environment variables file ".env" in the root folder.
3. Setup .env file as below:
```
DB_TEST_URL="connection string to MongoDB TEST database"
DB_DEV_URL="connection string to MongoDB DEV database"
secret="YourSecret"
```
4. Type "npm test" and ensure all tests passed (NOTE: test script is set for Windows.)