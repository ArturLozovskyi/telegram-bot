

const TelegramBot = require('node-telegram-bot-api');
const token = require('./token');
const bot = new TelegramBot(token.url, { polling: true });
const db = require('./db');



bot.onText(/\/help/, msg=> {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, 'Я умею показывать расписание, чтобы посмотреть его введи сообщение, которое содержит "расписание", а также отвечаю на некоторые сообщения) ')
})

bot.on('message', msg=>{
  

  const chatId = msg.chat.id
  var message = msg.text.toLowerCase();

  if(message == 'закрыть'){
    bot.sendMessage(chatId, 'Закрываю', {
      reply_markup:{
        remove_keyboard: true
      }
    })
  }

  else if(message.indexOf('расписание') != -1){
    bot.sendMessage(chatId, 'Выбери день ', {
      reply_markup:{
        keyboard: [
          ['Понедельник','Вторник'],
          ['Среда','Четверг'],
          ['Пятница', 'Закрыть']
        ]
      }
    })
  }

  if(message.indexOf('спасибо') != -1){
    bot.sendMessage(chatId, 'Не за что)')
  }
  if(message.indexOf('привет') != -1){
    bot.sendMessage(chatId, 'Привет, ' +  msg.from. first_name)
  }


  switch(msg.text)
  {
    case 'Понедельник':
    db.days[0].lessons.forEach(element => {
    bot.sendMessage(msg.chat.id, element.id + "." +element.name)
    })
    break
    case 'Вторник':
    db.days[1].lessons.forEach(element => {
    bot.sendMessage(msg.chat.id, element.id + "." +element.name)
    })
    break
    case 'Среда':
    bot.sendMessage(msg.chat.id, 'Отработки')
    break
    case 'Четверг':
    db.days[3].lessons.forEach(element => {
    bot.sendMessage(msg.chat.id, element.id + "." +element.name)
    })
    break
    case 'Пятница':
    db.days[4].lessons.forEach(element => {
    bot.sendMessage(msg.chat.id, element.id + "." +element.name)
    })
    break
  }
});





