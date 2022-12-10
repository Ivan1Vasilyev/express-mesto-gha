// eslint-disable-next-line max-classes-per-file
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class NotValidError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class NotAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class SameEmailError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.export = { NotFoundError, NotValidError, NotAuthorizedError, SameEmailError };
