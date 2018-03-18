const TelegramBot = require('node-telegram-bot-api');
const token = require('./token');
const bot = new TelegramBot(token.url, { polling: true });
const db = require('./db');
var MongoClient = require('mongodb').MongoClient;
var urlDB = 'mongodb://lozovartur77:45balo45__@ds245238.mlab.com:45238/telegrambot';






const gameName = process.env.TELEGRAM_GAMENAME || 'onemoreclick';
let url = process.env.URL || 'http://telegram-bot.zzz.com.ua'



bot.onText(/\/help/, msg=> {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, 'Я умею показывать расписание, чтобы посмотреть его введи сообщение, которое содержит "расписание", а также отвечаю на некоторые сообщения) ')
});

///////////////////////////////////////////////////////////////////////

var tasks = [];
MongoClient.connect(urlDB, (err,database)=>{
  if(err){
    throw err;
    console.log(err);
  }
  else{
    console.log('Connected!');
    database.collection('tasks').find().toArray(function(err, results){
      tasks = results;
      database.close();
    });
  }   
});



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
    var text = match[1];
    MongoClient.connect(urlDB, (err,database)=>{
      if(err){
        throw err;
        console.log(err);
      }
      else{
        console.log('Connected!');
        var collection = database.collection('tasks');
        var task = {
          id: chatId,
          text: text
        };
        collection.insertOne(task,(err,result)=>{
          if(err){
            throw err;
            console.log(err);
          }
          console.log(result.ops);

          database.collection('tasks').find().toArray(function(err, results){
            tasks = results;
            console.log(tasks)
            database.close();
          });
        });
      }
    });
    bot.sendMessage(chatId, 'Хорошо)');
  });

  
  bot.onText(/^Просмотреть$/, msg=> {  
    var i = 0;
    const chatId = msg.from.id;
    tasks.forEach(task=>{
      if(chatId === task.id){
        bot.sendMessage(task.id, 'Напоминаю, что вы должны: '+ task.text), {
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
    bot.sendMessage(chatId, 'Напиши что нужно удалить в таком виде : "Удали ... (номер)"',{
      reply_markup:{
        remove_keyboard: true
      }
    });

    tasks.forEach(task=>{
      if(chatId === task.id){
        k++;
        bot.sendMessage(task.id, k+'. '+ task.text), {
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
    var number = match[1]-1;
    var newTask = [];
    tasks.forEach(task=>{
      if(task.id = chatId){
        newTask.push(task);
      }
    });
    if(number=>0&&number<newTask.length){
      MongoClient.connect(urlDB, (err,database)=>{
        if(err){
          throw err;
          console.log(err);
        }  
        database.collection('tasks').deleteOne({id: newTask[number].id,text:newTask[number].text}, function(err, result){       
          if(err){
            throw err;
          }
      });
      database.collection('tasks').find().toArray(function(err, results){
        if(err){
          throw err;
        }
        tasks = results;
      });
    });
      bot.sendMessage(chatId, 'Удалила)');
}
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



