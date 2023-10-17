const express = require('express');
const {
    getContacts,
    postContacts,
    getContact,
    updateContact,
    deleteContact
} = require('../controllers/contactController');
const validateToken = require('../middleware/validateTokenHandler');

const router = express.Router();

router.use(validateToken);
router.route('/').get(getContacts).post(postContacts);
router.route('/:id').get(getContact).patch(updateContact).delete(deleteContact);

module.exports = router;