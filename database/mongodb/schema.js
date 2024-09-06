const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    pronoun: String,
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default: null
    },
    demo_requested: {
        type: Boolean,
        default: false
    },
    demo_access_granted_date: {
        type: Date,
        default: null
    }
});

const companySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    company_manager: {
        type: String,
        required: true
    },
    bank_name: String,
    kcp_location: String,
    account_number: String,
    account_holder: String,
    province: String,
    city: String,
    district: String,
    subdistrict: String,
    postal_code: String,
    address: String,
    address_notes: {
        type: String,
        default: null
    },
    company_logo: {
        type: String,
        validate: {
            validator: function(v) {
                return /\.(jpeg|jpg|png)$/.test(v);
            },
            message: 'Company logo must be in jpeg, jpg, or png format.'
        },
        default: null
    },
    npwp: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\.(jpeg|jpg|png)$/.test(v);
            },
            message: 'NPWP must be in jpeg, jpg, or png format.'
        }
    },
    siup_nib: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\.(jpeg|jpg|png)$/.test(v);
            },
            message: 'SIUP/NIB must be in jpeg, jpg, or png format.'
        }
    },
    nid_tdp: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\.(jpeg|jpg|png)$/.test(v);
            },
            message: 'NID/TDP must be in jpeg, jpg, or png format.'
        }
    },
    president_id: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\.(jpeg|jpg|png)$/.test(v);
            },
            message: 'President ID must be in jpeg, jpg, or png format.'
        }
    },
    deed_of_incorporation: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\.(jpeg|jpg|png|pdf)$/.test(v);
            },
            message: 'Deed of Incorporation must be in jpeg, jpg, png, or pdf format.'
        }
    },
    approval_from_minister: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\.(jpeg|jpg|png|pdf)$/.test(v);
            },
            message: 'Approval from Minister must be in jpeg, jpg, png, or pdf format.'
        }
    },
    supporting_document: {
        type: String,
        validate: {
            validator: function(v) {
                return /\.(jpeg|jpg|png|pdf)$/.test(v);
            },
            message: 'Supporting document must be in jpeg, jpg, png, or pdf format.'
        },
        default: null
    }    
});

module.exports = {
    userSchema,
    companySchema
}