function normalizeTrades(user) {
  const trades =  user.trades.map((trade) => {
    const ilm = trade.initiand.login_method;
    const alm = trade.acceptand.login_method;
    return {
      initiand: {
        id: trade.initiand._id,
        username: trade.initiand[ilm].username,
        image_url: trade.initiated[ilm].image_url
      },
      acceptand: {
        id: trade.acceptand._id,
        username: trade.acceptand[alm].username,
        image_url: trade.acceptand[alm].image_url
      }
    };
  });

  return { trades: trades };
}

function normalizePublic(user) {
  const method = user.login_method;
  return {
    username: user[method].username,
    image_url: user[method].image_url,
    public: user.public
  };
}

function normalizeLibrary(user) {
  return {
    library: user.library
  };
}

module.exports = {
  user: {
    ownProfile: function(user) {
      return Object.assign({},
         normalizePublic(user),
         normalizeLibrary(user),
         normalizeTrades(user)
       );
    },
    profile: function(user) {
      return normalizePublic(user);
    }
  },
  book: {
    "default": function(book) {
      return Object.assign({}, book, {
        owner: normalizePublic(book.owner)
      });
    },
    ownLibrary: function(book) {
      return {
        id: book._id,
        title: book.title,
        author: book.author,
        thumbnail_url: book.thumbnail_url,
        available: book.available,
        createdAt: book.createdAt
      };
    }
  }
};
