const Logger = require('../../shared/infrastructure/Logger');

class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
        Logger.info(`User created: ${this.name} with email ${this.email}`);
    }

    updateEmail(newEmail) {
        Logger.info(`Updating email for user ${this.name} from ${this.email} to ${newEmail}`);
        this.email = newEmail;
        Logger.info(`Email updated for user ${this.name} to ${this.email}`);
    }
}

module.exports = User;
