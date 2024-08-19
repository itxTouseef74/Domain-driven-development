const DomainEvent = require('../../shared/domain/DomainEvent');

class ProductAddedToCartEvent extends DomainEvent {
    constructor(cartId, productId, occurredOn = new Date()) {
        super(occurredOn);
        this.cartId = cartId;
        this.productId = productId;
    }
}

module.exports = ProductAddedToCartEvent;
