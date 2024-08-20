const CustomerModel = require("../infrastructure/UserModel.js");
const Customer = require("../domain/User.js");
const Logger = require("../../shared/infrastructure/Logger");
const CustomerCreatedEvent = require("../../shared/domain/CustomerCreatedEvent");

class CustomerService {
  async createCustomer(name, email) {
    Logger.info(`Creating customer: ${name} with email ${email}`);

    const customer = new Customer(null, name, email);
    const customerDoc = new CustomerModel({
      name: customer.name,
      email: customer.email,
    });
    await customerDoc.save();

    Logger.info(`Customer created with ID: ${customerDoc._id}`);
    const customerCreatedEvent = new CustomerCreatedEvent(customerDoc._id);
    
    return new Customer(customerDoc._id, customerDoc.name, customerDoc.email);
  }

  async updateCustomerEmail(customerId, newEmail) {
    Logger.info(`Updating email for customer ID: ${customerId} to ${newEmail}`);

    const customerDoc = await CustomerModel.findById(customerId);
    if (!customerDoc) {
      throw new Error("Customer not found");
    }

    const customer = new Customer(
      customerDoc._id,
      customerDoc.name,
      customerDoc.email
    );
    customer.updateEmail(newEmail);

    customerDoc.email = customer.email;
    await customerDoc.save();

    Logger.info(`Email updated for customer ID: ${customerId}`);
    return customer;
  }

  async getCustomerById(id) {
    const customerDoc = await CustomerModel.findById(id);
    if (!customerDoc) {
      return null;
    }
    return new Customer(customerDoc._id, customerDoc.name, customerDoc.email);
  }

  async deleteCustomer(id) {
    const result = await CustomerModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new Error("Customer not found");
    }
  }

  async listAllCustomers() {
    const customerDocs = await CustomerModel.find();
    return customerDocs.map(
      (doc) => new Customer(doc._id, doc.name, doc.email)
    );
  }
}

module.exports = CustomerService;
