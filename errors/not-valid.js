class NotValidError extends Error {
  constructor(e) {
    super(
      typeof e === 'string'
        ? e
        : Object.values(e.errors)
          .map((err) => err.message)
          .join(', '),
    );
    this.statusCode = 400;
  }
}

module.exports = NotValidError;
