const getErrorMessages = (e) => Object.values(e.errors)
  .map((err) => err.message)
  .join(', ');

module.exports = { getErrorMessages };
