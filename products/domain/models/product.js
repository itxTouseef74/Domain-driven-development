const Money = require("../../../shared/domain/Money");
const Logger = require("../../../shared/infrastructure/Logger");

class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = new Money(price.amount, price.currency);
    Logger.info(
      `Product created: ${
        this.name
      } with price ${this.price.getAmount()} ${this.price.getCurrency()}`
    );
  }

  changePrice(newPrice) {
    Logger.info(
      `Changing price of product ${
        this.name
      } from ${this.price.getAmount()} ${this.price.getCurrency()} to ${
        newPrice.amount
      } ${newPrice.currency}`
    );
    this.price = new Money(newPrice.amount, newPrice.currency);
    Logger.info(
      `Price updated for product ${
        this.name
      } to ${this.price.getAmount()} ${this.price.getCurrency()}`
    );
  }

  getPrice() {
    return this.price;
  }
}

module.exports = Product;
