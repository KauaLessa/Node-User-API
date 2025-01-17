const { checkSchema } = require('express-validator');
const User = require('../models/User'); 

const UserSchema = checkSchema({
    name: {
        in: ['body'], 
        errorMessage: 'Name must have at least 3 characters', 
        trim: true,
        escape: true,
        isLength: {min: 3, max: 255},
    }, 
    email: {
        in: ['body'], 
        isEmail: true, 
        emailNotInUse: {
            custom: async value => {
                const user = await User.findOne({where: {email: value}}); 
                if (user) throw new Error('Email alredy in use'); 
            }
        }
    }, 
    password: {
        in: ['body'], 
        isLength: {
            min: 8,
            max: 255, 
            errorMessage: "Password must have between 8 and 255 characters"
        }, 
        confirmPassword: {
            custom: (value, {req}) => {
                if (value !== req.body.confirmPassword) {
                    return Promise.reject('Passwords not matching'); 
                }
                return Promise.resolve(); 
            }
        }
    }
});

module.exports = UserSchema; 