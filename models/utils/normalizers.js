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
      //don't forget to add the stageing areas etc.
    };
  });

  return { trades: trades };
}

function normalizePublic(user, opt = {}) {
  const method = user.login_method;

  const publicUser = {
    username: user[method].username,
    image_url: user[method].image_url,
    public: user.public
  };

  if(opt.id === true) {
    publicUser.id = user._id;
  }

  return publicUser;
}

function normalizeOwnLibrary(user) {
  return {
    library: user.library.map(book_normalizers.ownLibrary)
  };
}

const user_normalizers = {
  ownProfile: function(user) {
    return Object.assign({},
       normalizePublic(user),
       normalizeOwnLibrary(user),
       normalizeTrades(user),
      {
        message_cache: user.message_cache
      }
     );
  },
  profile: function(user) {
    return normalizePublic(user);
  },
  trade: function(user) {
    return Object.assign({},
      normalizePublic(user, { id: true }),
      normalizeOwnLibrary(user)
    );
  }
};

const book_normalizers = {
  "default": function(book) {
    const norm = Object.assign({}, book.toObject(), {
      owner: normalizePublic(book.owner, { id: true }),
      id: book._id
    });

    delete norm._id;
    delete norm.__v;

    return norm;
  },
  ownLibrary: function(book) {
    const norm = Object.assign({}, book.toObject(), {
      id: book._id
    });

    delete norm._id;
    delete norm.__v;

    return norm;
  }
};

module.exports = {
  user: user_normalizers,
  book: book_normalizers
};
