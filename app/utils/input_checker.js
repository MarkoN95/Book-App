function isEmail(str) {
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(str);
}

function isNonEmptyString(str) {
  return typeof str === "string" && str !== "";
}

function isOption(opt) {
  return isNonEmptyString(opt) && (opt === "all" || opt === "latest");
}

function checkLogin(body) {
  if(!isNonEmptyString(body.username)) {
    return "Please enter your username";
  }

  if(!isNonEmptyString(body.password)) {
    return "Plase enter your password";
  }

  return true;
}

function checkRegister(body) {
  if(!isNonEmptyString(body.username)) {
    return "Please enter a valid username";
  }

  if(!isEmail(body.email)) {
    return "Please enter a valid email address";
  }

  if(!isNonEmptyString(body.password)) {
    return "Please enter a password";
  }

  if(!isNonEmptyString(body.confirm_password)) {
    return "Please confirm your password";
  }

  if(body.password !== body.confirm_password) {
    return "Passwords don't match";
  }

  return true;
}

function checkSearch(query) {
  if(typeof query === "object" && !query.q) {
    return "Please enter a valid search string";
  }

  return true;
}

function checkBook(book) {
  if(!book.id || typeof book.hasImage !== "boolean") {
    return "You tried to add an invalid book";
  }
  return true;
}

function checkSettings(body) {
  if(!isNonEmptyString(body.new_pw)) {
    return "Please enter a new password";
  }

  if(!isNonEmptyString(body.confirm_new_pw)) {
    return "Plase confirm your password";
  }

  if(body.new_pw !== body.confirm_new_pw) {
    return "New passwords don't match";
  }

  return true;
}

function checkFind(q) {
  if(q.option) {
    return isOption(q.option) ? true : "Invalid optional search";
  }

  if(!isNonEmptyString(q.query)) {
    return "Please enter a valid search string";
  }

  return true;
}

module.exports = function check_input(type) {
  return function(req, res, next) {
    let isValid;
    switch(type) {
      case "login":
        isValid = checkLogin(req.body);
        break;

      case "register":
        isValid = checkRegister(req.body);
        break;

      case "search":
        isValid = checkSearch(req.query);
        break;

      case "find":
        isValid = checkFind(req.query);
        break;

      case "book":
        isValid = checkBook(req.body);
        break;

      case "settings":
        isValid = checkSettings(req.body);
        break;

      default:
        if(process.env.NODE_ENV !== "production") {
          console.log("Attention! check_input() default case triggerd!");
        }
        return next();
    }

    if(isValid === true) {
      return next();
    }

    res.status(400).send({
      error: {
        message: isValid
      }
    });
  };
};
