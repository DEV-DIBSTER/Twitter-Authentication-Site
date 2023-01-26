function AsyncWrapOrError(Callback) {
    return (Request, Response, Next) => {
      return Promise
        .resolve(Callback(Request, Response, Next))
        .catch(Error => Error ? Next(Error) : Next(new Error('Unknown error.')));
    };
};

module.exports = { AsyncWrapOrError };