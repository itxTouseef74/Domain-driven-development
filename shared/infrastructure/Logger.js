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
}

module.exports = Logger;
