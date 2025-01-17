const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const bcrypt = require('bcrypt'); 

const User = sequelize.define( 
    'User',
    {
        name: {
            type: DataTypes.STRING, 
            allowNull: false, 
        }, 
        email: {
            type: DataTypes.STRING, 
            allowNull: false, 
            unique: true, 
            validate: {
                isEmail: true, 
            }
        }, 
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        admin: {
            type: DataTypes.BOOLEAN, 
            defaultValue: false
        }
    }
); 

User.addHook('beforeCreate', async (user) => user.password = await bcrypt.hash(user.password, 10)); 

User.addHook('beforeUpdate', async (user) => {
    if (user.changed('password')) user.password = await bcrypt.hash(user.password, 10); 
}); 

module.exports = User; 