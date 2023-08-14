/* eslint-disable */
class NOT_FOUND_ERROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
class UNAUTHORIZED_ERROR  extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
class BAD_REQUEST_ERROR  extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}


module.exports = {NOT_FOUND_ERROR, UNAUTHORIZED_ERROR, BAD_REQUEST_ERROR};