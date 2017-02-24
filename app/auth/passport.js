const LocalStrategy = require("passport-local").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;

const createConfig = function(method) {
  switch(method) {
    case "github":
      return {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
      };

    case "twitter":
      return {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET
      };
  }

  throw new TypeError("passport createConfig() invalid method: " + method);
};

const configureAuth = function(passport, user) {
  passport.use(
    new LocalStrategy(),
    user.authenticate()
  );
  passport.use(
    new GithubStrategy(createConfig("github")),
    user.socialAuth("github")
  );
  passport.use(
    new TwitterStrategy(createConfig("twitter")),
    user.socialAuth("twitter")
  );

  passport.serializeUser(user.serialize());
  passport.deserializeUser(user.deserialize());
};

module.exports = configureAuth;
