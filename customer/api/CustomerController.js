const express = require('express');
const CustomerService = require('../application/CustomerService');
const Logger = require('../../shared/infrastructure/Logger');
const router = express.Router();
const customerService = new CustomerService();

router.post('/', async (req, res) => {
    const { name, email } = req.body;
    try {
        Logger.info(`Request received to create customer: ${name}`);
        const customer = await customerService.createCustomer(name, email);
        res.status(201).json(customer);
    } catch (error) {
        Logger.error(`Error creating customer: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        Logger.info(`Request received to get customer ID: ${id}`);
        const customer = await customerService.getCustomerById(id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        Logger.error(`Error retrieving customer: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id/email', async (req, res) => {
    const { id } = req.params;
    const { newEmail } = req.body;
    try {
        Logger.info(`Request received to update email for customer ID: ${id}`);
        const updatedCustomer = await customerService.updateCustomerEmail(id, newEmail);
        res.status(200).json(updatedCustomer);
    } catch (error) {
        Logger.error(`Error updating email: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        Logger.info(`Request received to delete customer ID: ${id}`);
        await customerService.deleteCustomer(id);
        res.status(204).end();
    } catch (error) {
        Logger.error(`Error deleting customer: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        Logger.info('Request received to list all customers');
        const customers = await customerService.listAllCustomers();
        res.status(200).json(customers);
    } catch (error) {
        Logger.error(`Error listing customers: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
