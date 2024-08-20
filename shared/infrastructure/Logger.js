class Logger {
  static log(message) {
    console.log(`[LOG]: ${message}`);
  }

  static error(message) {
    console.error(`[ERROR]: ${message}`);
  }

  static info(message) {
    console.info(`[INFO]: ${message}`);
  }
  static warn(message) {
    console.warn(`[WARN]: ${message}`);
  }
  static event(message) {
    console.warn(`[EVENT]: ${message}`);
  }
}

module.exports = Logger;
