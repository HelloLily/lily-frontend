const fs = require('fs');
const dotenv = require('dotenv');

const result = dotenv.config();
// If no .env file is found use the given environment variables.
const env = result.error ? process.env : result.parsed;

const content = `@fortawesome:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=${env.FONT_AWESOME_TOKEN}`;

fs.writeFile('.npmrc', content, function(err) {
  if (err) {
    return console.error(err);
  }

  return console.info('Env variables set.');
});
