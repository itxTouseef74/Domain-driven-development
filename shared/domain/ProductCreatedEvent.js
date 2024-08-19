const DomainEvent = require('./DomainEvent');

class ProductCreatedEvent extends DomainEvent {
    constructor(productId, occurredOn = new Date()) {
        super(occurredOn);
        this.productId = productId;
    }
}

module.exports = ProductCreatedEvent;
