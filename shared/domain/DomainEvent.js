class DomainEvent {
    constructor(occurredOn = new Date()) {
        this.occurredOn = occurredOn;
    }
}

module.exports = DomainEvent;
