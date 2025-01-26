import { Sequelize } from 'sequelize';
import { DB_NAME } from '../constants.js';

const sequelize = new Sequelize(DB_NAME, process.env.MYSQL_USER || 'root', process.env.MYSQL_PASSWORD || '', {
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;