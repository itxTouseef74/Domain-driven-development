const DomainEvent = require('../../shared/domain/DomainEvent');

class CustomerCreatedEvent extends DomainEvent {
    constructor(customerId, occurredOn = new Date()) {
        super(occurredOn);
        this.customerId = customerId;
    }
}

module.exports = CustomerCreatedEvent;
