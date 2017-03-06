const crypto = require("crypto");
const scmp = require("scmp");
const semver = require("semver");

const pbkdf2DigestSupport = semver.gte(process.version, "0.12.0");

const errors = {
  existingUserError: function(msg) {
    return new Error(msg || "this username is already taken");
  },
  missingFieldsError: function(fields = [], msg) {
    return new TypeError(msg || "localAuthPlugin() fields: [" + fields.join(" ") + "] are missing in options");
  }
};

const localAuthPlugin = function(schema, opt) {
  const options = {
    saltlen: opt.saltlen || 32,
    keylen: opt.keylen || 512,
    iterations: opt.iterations || 50000,
    digest: opt.digest || "sha512",
    encoding: opt.encoding || "hex"
  };

  const populateFields = Array.isArray(opt.populate) ? opt.populate.join(" ") :
  typeof opt.populate === "string" ? opt.populate : false;

  if(!opt.usernameField) {
    throw errors.missingFieldsError(["usernameField"]);
  }
  if(!opt.hashField) {
    throw errors.missingFieldsError(["hashField"]);
  }
  if(!opt.saltField) {
    throw errors.missingFieldsError(["saltField"]);
  }

  const usernameField = opt.usernameField;
  const hashField = opt.hashField;
  const saltField = opt.saltField;

  const pbkdf2 = function(password, salt, cb) {
    if(pbkdf2DigestSupport) {
      crypto.pbkdf2(password, salt, options.iterations, options.keylen, options.digest, cb);
    }
    else {
      crypto.pbkdf2(password, salt, options.iterations, options.keylen, cb);
    }
  };

  schema.methods.setPassword = function(password, cb) {
    crypto.randomBytes(options.saltlen, (err, saltbuffer) => {
      if(err) {
        return cb(err);
      }
      const salt = saltbuffer.toString(options.encoding);

      pbkdf2(password, salt, (err, hashbuffer) => {
        if(err) {
          return cb(err);
        }
        this.set(hashField, hashbuffer.toString(options.encoding));
        this.set(saltField, salt);

        cb(null, this);
      });
    });
  };

  schema.methods.validatePassword = function(passwordCmp, cb) {
    pbkdf2(passwordCmp, this.get(saltField), (err, hashbuffer) => {
      if(err) {
        return cb(err);
      }
      if(scmp(hashbuffer, new Buffer(this.get(hashField), options.encoding))) {
        return cb(null, this);
      }
      else {
        return cb(null, false);
      }
    });
  };

  schema.statics.authenticate = function() {
    const self = this;

    return function(username, password, cb) {
      self.findOne({ [usernameField]: username })
        .select("+" + hashField + " +" + saltField)
        .exec((err, user) => {
          if(err) {
            return cb(err);
          }
          if(user) {
            return user.validatePassword(password, cb);
          }
          return cb(null, false);
        });
    };
  };

  schema.statics.register = function(user, password, cb) {
    if(!(user instanceof this)) {
      user = new this(user);
    }

    this.findOne({ [usernameField]: user.get(usernameField) }, (err, existingUser) => {
      if(err) {
        return cb(err);
      }

      if(existingUser) {
        return cb(errors.existingUserError());
      }

      user.setPassword(password, (err, user) => {
        if(err) {
          return cb(err);
        }

        user.save((err) => {
          if(err) {
            return cb(err);
          }
          cb(null, user);
        });
      });
    });
  };

  schema.statics.serialize = function() {
    return function(user, cb) {
      cb(null, user._id);
    };
  };

  schema.statics.deserialize = function() {
    const self = this;

    return function(id, cb) {
      const query = self.findById(id);

      if(populateFields) {
        query.populate(populateFields)
          .exec(cb);
      }
      else {
        query.exec(cb);
      }
    };
  };
};

module.exports = localAuthPlugin;
