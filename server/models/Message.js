import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

// Модель для сообщений
const Message = sequelize.define('Message', {
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

// Синхронизация модели с базой данных (создаст таблицу, если она не существует)
Message.sync();

export default Message;
