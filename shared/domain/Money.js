const ValueObject = require('./ValueObject');

class Money extends ValueObject {
    constructor(amount, currency) {
        super({ amount, currency });
    }

    getAmount() {
        return this.props.amount;
    }

    getCurrency() {
        return this.props.currency;
    }
}

module.exports = Money;
