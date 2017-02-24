require("./trade");
const mongoose = require("mongoose");
const localAuthPlugin = require("./plugins/local_auth");
const socialAuthPlugin = require("./plugins/social_auth");

const User = mongoose.Schema({
  local: {
    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    image_url: { type: String, default: "/images/dummy_image.png" },
    hash: { type: String, select: false },
    salt: { type: String, select: false }
  },
  github: {
    id: String,
    username: String,
    image_url: { type: String, default: "/images/dummy_image.png" }
  },
  twitter: {
    id: String,
    username: String,
    image_url: { type: String, default: "/images/dummy_image.png" }
  },
  login_method: String,
  public: {
    full_name: String,
    city: String,
    state: String
  },
  library: [
    {
      title: String,
      author: String,
      ISBN: String,
      thumbnail_url: String,
      available: Boolean
    }
  ],
  trades: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trade"
    }
  ],
  message_cache: [
    {
      from: Date,
      text: String
    }
  ]
});

User.plugin(localAuthPlugin, {
  usernameField: "local.username",
  hashField: "local.hash",
  saltField: "local.salt"
});

User.plugin(socialAuthPlugin, {
  methods: ["github", "twitter"]
});

module.exports = mongoose.model("user", User);
