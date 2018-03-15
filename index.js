const TelegramBot = require('node-telegram-bot-api');
const token = require('./token');
const bot = new TelegramBot(token.url, { polling: true });
const db = require('./db');


const gameName = process.env.TELEGRAM_GAMENAME || 'onemoreclick';
let url = process.env.URL || 'http://telegram-bot.zzz.com.ua'






bot.onText(/\/help/, msg=> {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, 'Я умею показывать расписание, чтобы посмотреть его введи сообщение, которое содержит "расписание", а также отвечаю на некоторые сообщения) ')
});

///////////////////////////////////////////////////////////////////////

var tasks = [];

bot.onText(/\/tasks/, msg=> {
  const chatId = msg.from.id;

  bot.sendMessage(chatId, 'Что нужно сделать?', {
    reply_markup:{
      keyboard: [
        ['Просмотреть'],
        ['Напомнить','Удалить'],
        ['Закрыть']
      ]
    }
  })
});
  
  bot.onText(/^Напомнить$/, msg=> {
    const chatId = msg.from.id;
    bot.sendMessage(chatId, 'Напиши что нужно добавить в таком виде : "Напомни ... "', {
      reply_markup:{
        remove_keyboard: true
      }
    })
  });


  bot.onText(/^Напомни (.+)$/, function (msg, match) {
    const chatId = msg.from.id;
    var userId = msg.from.id;
    var text = match[1];
    tasks.push( { 'uid':userId, 'text':text } );
    bot.sendMessage(chatId, 'Хорошо)');
  });

  
  bot.onText(/^Просмотреть$/, msg=> {  
    var i = 0;
    const chatId = msg.from.id;
    tasks.forEach(task=>{
      if(chatId === task.uid){
        bot.sendMessage(task.uid, 'Напоминаю, что вы должны: '+ task.text), {
          reply_markup:{
            remove_keyboard: true
          }
        };
        i++;
      }
    })
    if(i==0){
    bot.sendMessage(chatId, 'Ничего не запланировано', {
      reply_markup:{
        remove_keyboard: true
      }
    });
    }
  });


  bot.onText(/^Удалить$/, msg=> {
    var i = 0;
    const chatId = msg.from.id;
    var k = 0;

    bot.sendMessage(chatId, 'Напиши что нужно удалить в таком виде : "Удали ... (номер)"');

    tasks.forEach(task=>{
      if(chatId === task.uid){
        k++;
        bot.sendMessage(task.uid, k+'. '+ task.text), {
          reply_markup:{
            remove_keyboard: true
          }
        };
        i++;
      }
    })
    if(i==0){
    bot.sendMessage(chatId, 'Ничего не запланировано', {
      reply_markup:{
        remove_keyboard: true
      }
    });
    }
});


  bot.onText(/^Удали (.+)$/, function (msg, match) {
    const chatId = msg.from.id;
    var number = match[1];
    tasks.splice(number-1,1);
    bot.sendMessage(chatId, 'Удалила)');
  });




///////////////////////////////////////////////////////////////////////

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

  else if(message.indexOf('расписание') != -1 || message == "/schedule"){
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




// Matches /start
bot.onText(/\/play/, function onPhotoText(msg) {
  bot.sendGame(msg.chat.id, gameName);
});

// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  bot.answerCallbackQuery(callbackQuery.id, { url });
});



