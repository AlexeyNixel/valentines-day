import { Sequelize } from 'sequelize';

// Настроим соединение с SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data/messages.sqlite', // Путь к файлу базы данных
});

export default sequelize;
