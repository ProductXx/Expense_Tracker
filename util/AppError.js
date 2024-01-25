class SourceError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
  getCode() {
    return 500;
  }
}

class BadRequest extends SourceError {
  constructor(message) {
    super(message);
    this.message = message;
  }
  getCode() {
    return 400;
  }
}

class NotFound extends SourceError {
  constructor(message) {
    super(message);
    this.message = message;
  }
  getCode() {
    return 404;
  }
}
class Unauthorized extends SourceError {
  constructor(message) {
    super(message);
  }
  getCode() {
    return 401;
  }
}
class Forbidden extends SourceError {
  constructor(message) {
    super(message);
  }
  getCode() {
    return 403;
  }
}

module.exports = { SourceError, BadRequest, NotFound, Unauthorized, Forbidden };
