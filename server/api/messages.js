import Message from '../models/Message';

export default defineEventHandler(async (event) => {
    // Получаем все сообщения из базы данных (GET-запрос)
    if (event.req.method === 'GET') {
        try {
            const messages = await Message.findAll();
            return messages;  // Вернём все сообщения
        } catch (error) {
            return { error: 'Ошибка при получении сообщений', details: error.message };
        }
    }

    // Добавляем новое сообщение в базу данных (POST-запрос)
    if (event.req.method === 'POST') {
        try {
            // Используем стандартный способ парсинга тела запроса
            const body = await new Promise((resolve, reject) => {
                let data = '';
                event.req.on('data', chunk => {
                    data += chunk;
                });

                event.req.on('end', () => {
                    try {
                        resolve(JSON.parse(data));  // Парсим тело запроса как JSON
                    } catch (err) {
                        reject('Ошибка при парсинге данных');
                    }
                });
            });

            const newMessage = await Message.create({
                text: body.text,  // Добавляем новое сообщение
            });
            return { message: 'Сообщение успешно добавлено', newMessage };
        } catch (error) {
            return { error: 'Ошибка при добавлении сообщения', details: error.message };
        }
    }
});
