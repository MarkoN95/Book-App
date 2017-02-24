const errors = {
  missingAuthFieldError: function(field, method, msg) {
    return new TypeError(msg || "socialAuth() is missing the authentication method or an unknown method was passed: " + method);
  },
  missingMethodsError: function(msg) {
    return new TypeError(msg || "socialAuhPlugin() options is missing an array of authentication methods");
  }
};

const socialAuhPlugin = function(schema, opt) {
  if(!Array.isArray(opt.methods)) {
    throw errors.missingMethodsError();
  }

  schema.statics.socialAuth = function(method) {

    if(!method || opt.methods.indexOf(method) === -1) {
      throw errors.missingAuthFieldError();
    }

    const self = this;

    return function(token, tokenSecret, profile, done) {
      self.findOneAndUpdate(
        { [method + ".id"]: profile.id },
        {
          $set: {
            [method + ".username"]: profile.displayName,
            [method + ".image_url"]: profile.photos[0].value.replace("_normal", "")
          }
        },
        { new: true },
        (err, user) => {
          if(err) {
            return done(err);
          }
          if(!user) {
            const newUser = new self({
              [method]: {
                id: profile.id,
                username: profile.displayName,
                image_url: profile.photos[0].value.replace("_normal", "")
              }
            });

            newUser.save((err) => {
              if(err) {
                return done(err);
              }
              done(null, newUser);
            });
          }
          else {
            done(null, user);
          }
        }
      );
    };
  };
};

module.exports = socialAuhPlugin;
