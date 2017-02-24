const LocalStrategy = require("passport-local").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;

const configureAuth = function(passport, user) {
  passport.use(new LocalStrategy(user.authenticate()));
  passport.use(
    new GithubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    },
    user.socialAuth("github"))
  );
  passport.use(
    new TwitterStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET
    },
    user.socialAuth("twitter"))
  );

  passport.serializeUser(user.serialize());
  passport.deserializeUser(user.deserialize());
};

module.exports = configureAuth;
