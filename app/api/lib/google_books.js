const request = require("request");

function query(obj) {
  return "?" + Object.keys(obj).map(key => key + "=" + obj[key]).join("&");
}

const googleBooks = function googleBooks(config, cb) {
  const url = "https://www.googleapis.com/books/v1/volumes";

  const options = {
    q: config.q || "",
    fields: config.fields || "items(id,volumeInfo/title,volumeInfo/authors,volumeInfo/imageLinks/thumbnail)"
  };

  if(typeof cb !== "function") {
    //returns a stream
    return request(url + query(options));
  }
  else {
    return request(url + query(options), cb);
  }
};

module.exports = googleBooks;
