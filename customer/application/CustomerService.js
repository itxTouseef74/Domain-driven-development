const CustomerRepository = require("../infrastructure/repository/CustomerRepository");
const User = require("../domain/models/User");
const Logger = require("../../shared/infrastructure/Logger");

class CustomerService {
  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  async createCustomer(name, email) {
    Logger.info(`Creating customer: ${name} with email ${email}`);

    const customer = new User(null, name, email);
    const customerDoc = await this.customerRepository.create(customer);

    Logger.info(`Customer created with ID: ${customerDoc._id}`);
    return new User(customerDoc._id, customerDoc.name, customerDoc.email);
  }

  async updateCustomerEmail(customerId, newEmail) {
    Logger.info(`Updating email for customer ID: ${customerId} to ${newEmail}`);

    const updatedCustomerDoc = await this.customerRepository.updateEmail(customerId, newEmail);
    if (!updatedCustomerDoc) {
      throw new Error("Customer not found");
    }

    return new User(updatedCustomerDoc._id, updatedCustomerDoc.name, updatedCustomerDoc.email);
  }

  async getCustomerById(id) {
    const customerDoc = await this.customerRepository.findById(id);
    if (!customerDoc) {
      return null;
    }
    return new User(customerDoc._id, customerDoc.name, customerDoc.email);
  }

  async deleteCustomer(id) {
    const result = await this.customerRepository.delete(id);
    if (result.deletedCount === 0) {
      throw new Error("Customer not found");
    }
  }

  async listAllCustomers() {
    const customerDocs = await this.customerRepository.listAll();
    return customerDocs.map(doc => new User(doc._id, doc.name, doc.email));
  }
}

module.exports = CustomerService;
