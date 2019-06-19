const MyToken = "539519220:AAGXpj4X3JblDLCBpOplxqbNq9lh746W_rs";

// "git add . & git commit -m 'first commit' & git push -u origin master"; 


const TelegramBot = require('node-telegram-bot-api'),
  exec = require('child_process').exec,
  fs = require("fs"),
  Agent = require('socks5-https-client/lib/Agent'),
  mongoose = require('mongoose'),
  Schema = new mongoose.Schema({
    name: 'string',
    nameLower: 'string',
    cost: 'number',
    value: 'number',
    type: 'string',
    kd: 'string',
    exp: 'number',
    size: 'string',
    lvl: 'number'
  }), Schema1 = new mongoose.Schema({
    name: 'string',
    podxod: 'number',
    score: 'number',
    id: 'number'
  }),
  Schema2 = new mongoose.Schema({
    msg: "string",
    koll: "number"
  }),
  Schema3 = new mongoose.Schema({
    level: "number"
  });


var timer = {}, spam = {}, spamFlag = false, bot;

mongoose.connect("mongodb://localhost/builds");

var serv = mongoose.model('vikis', Schema), podxod = mongoose.model('shtabs', Schema1), message = mongoose.model('msgs', Schema2), options = mongoose.model('opts', Schema3);

var level;

options.find({}, (err, res) => level = res[0].level);

function connect(){
bot = new TelegramBot(MyToken, {
   polling: true,
   // polling: true,
   // request: {
    // proxy: "http://localhost:8080"
   // }
   request: {
      agentClass: Agent,
      agentOptions: {
        socksHost: 'socksy.seriyps.ru',
        socksPort: 7777,
        socksUsername: 'tg-r_ee_d20',
        socksPassword: 'Le1xPsCa'
       }
    } 
  });
}
connect();
bot.on("polling_error", function(err){
  console.log(err);
});

var check = "";

setInterval(() => {
  check = "";
  bot.getMe()
  .then(function(data){
    check = data.id;
    // console.log(check);
    if(check == ""){
      // connect();
      process.exit();
    }
  });
}, 2000);

async function tableCreate(id){
  var rs = "";
  await podxod.find().sort({"score": -1}).then(function(res){
    if(res.length > 0){
      for(var i =  0; i < res.length; i++){
        name = res[i].name+"";
        rs += name+" || "+res[i].podxod+" подход + "+res[i].score+" материала\n -------------------------------------------------------------- \n";
      }
    }
  });
  await bot.sendMessage(id, rs);
}

async function sendPhoto(){
  let rand = Math.ceil(Math.random() * 100), i = 0, intr;
  console.log(rand);
  // intr = setInterval(async () => {
    console.log(i);
    // if(i == rand){
      // clearInterval(intr);
      var name = "t_"+new Date().getTime()+".png";
      exec("scrot "+name);
      await bot.sendMessage('-1001187220601', "/screenshot 👀");
      await bot.sendPhoto('-1001187220601', "http://icqtwo.ddns.net/bot_teleg/"+name);
      await fs.unlink("./"+name);
    // }
    // i++;
  // }, 1000);
}
// sendPhoto();

bot.onText(/\/resetScore/, function(msg, match){
  bot.getChatMember(msg.chat.id, msg.from.id).then(async (res) => {
    if(res.status == 'administrator' || res.status == 'creator'){
      podxod.find({}, async function(err, res){
        if(res.length > 0){
          for(var i = 0; i < res.length; i++){
            await podxod.collection.update({id: res[i].id}, {$set: {podxod: 0, score: 0}});
          }
          tableCreate(msg.chat.id);
        }
      });
    } else{
      await bot.sendMessage(msg.chat.id, "Ты не админ!");
    }
  });
});
bot.onText(/\/screenshot/, async function(msg, match){
  var inter, name = "t_"+new Date().getTime()+".png";
  exec("scrot "+name);
  await bot.sendPhoto(msg.chat.id, "http://icqtwo.ddns.net/bot_teleg/"+name);
  await fs.unlink(name);
});
bot.onText(/\/privateScore/, function(msg, match){
  bot.getChatMember(msg.chat.id, msg.from.id).then(async (res) => {
    if(res.status == 'administrator' || res.status == 'creator'){
      var t = msg.text.match(/[0-9 ]/g).join("").split(" "), score, podx, obj = {};
      if(t.length == 3){
        score = Number(t[1]);
        podx = Number(t[2]);
        obj = {podxod: podx, score: score};
      } else{
        score = Number(t[1]);
        obj = {score: score};
      }
      obj["name"] = msg.from.first_name;
      
      podxod.find({id: msg.from.id}, async (err, res) => {
        if(res.length > 0){
          await podxod.collection.update({id: msg.from.id}, {$set: obj});
          await tableCreate(msg.chat.id);
        }
      });
    } else{
      await bot.sendMessage(msg.chat.id, "Ты не админ!");
    }
  });
});

var rs = "", name = "", pr = "", otstyp = 0, texProcent = 0, gifProcent = 0, stickProcentP = 0, stickProcentM = 0;

// var time = process.argv[2];
var messDel = [], messSend = [];

if(process.argv[2] != undefined){
  // console.log(process.argv[2]);
  messSend = process.argv[2].split("==").join(" ").split("++");
}

var iter;

var variant = ["", "Редиска 1 заход сделает когда огурец с помидором на горе свистнут", "Опять вместо  нормального овоща у нас эта противная редиска", "Без труда редиске дуло в танках не прочистят никогда", "Одна редиска хорошо, а без нее еще лучше 🌚"];


var clients = {
  404751290: ["редис", "андрей", "Андрей", "редиска"], 
  205827200: ["абрикос", "Илья", "илья", "илюха"], 
  191625379: ["помидор", "Миха", "миха", "Михаил", "михаил", "помидорчик", "помидорище", "помидоры", "томат", "черри"],
  280245508: ["огурец", "огурцы", "Дима", "дима", "димон", "огурчик", "димка", "огуречик", "зелёный", "зелень"]
};

async function setBd(file){
  await message.find({msg: file}, function(err, res){
    console.log(res.length, file);
    if(res.length == 0){
      message.collection.insert({msg: file, koll: level + 1});
   }
  });
}


bot.on("message", async (msg) => {
  var setScore = false, t = [], chatId = msg.chat.id, message_id = msg.message_id, file = "";
  console.log(msg);
  if(msg.chat.type == "private"){
    if(msg.sticker != undefined){
      bot.sendSticker(-1001187220601, msg.sticker.file_id);
      setBd("msgSticker "+msg.sticker.file_id);
    }
    if((msg.animation != undefined)){
      bot.sendSticker(-1001187220601, msg.animation.file_id);
      setBd("msgGifs "+msg.animation.file_id);
    }
    if(msg.document != undefined && msg.document.file_name.indexOf("gif") != -1){
      bot.sendSticker(-1001187220601, msg.document.file_id);
      setBd("msgGifs "+msg.document.file_id);
    }
  } else{
    if(msg.sticker != undefined){
      setBd("msgSticker "+msg.sticker.file_id);
    }
    if((msg.animation != undefined)){
      setBd("msgGifs "+msg.animation.file_id);
    }
    if(msg.document != undefined && msg.document.file_name.indexOf("gif") != -1){
      setBd("msgGifs "+msg.document.file_id);
    }
  }
  
  if(msg.text != undefined){
    if(msg.text.indexOf("твин") == -1){
      if(((msg.text.indexOf("заход") != -1 || msg.text.indexOf("подход") != -1) && (msg.text.match(/матер|михаил|томат|огур|черри/i) != null && msg.text.match(/\d{1,99}/g)[1] != ""))){
        setScore = true;
        t = msg.text.match(/\d{1,99}/g);
      }
      
      if(setScore == true){
        bot.getChatMember(msg.chat.id, msg.from.id).then(async (res) => {
          if(res.status == 'administrator' || res.status == 'creator'){
            if((t[1]+"").match(/[aZ-zA-аЯ-яА]/) == null){
              await podxod.find({id: msg.from.id}, async function(err, res){
                if(t[1] != 0){
                  var pd = 1 + Number(res[0].podxod);
                  if(res.length == 0){
                    await podxod.collection.insert({name: msg.from.first_name, podxod: pd, score: Number(t[1]), id: msg.from.id});
                  } else{
                    var score = Number(res[0].score) + Number(t[1]);
                    await podxod.collection.update({id: msg.from.id}, {$set: {podxod: pd, score: score, name: msg.from.first_name}});
                  }
                }
                await tableCreate(msg.chat.id);
              });
            } else{
              bot.sendMessage(msg.chat.id, "Недопустимые символы, должно быть только число, сколько материалов добыто");
            }
          }
        });
      }
    }
  }

  var v1 = Math.ceil(Math.random() * 100), file = "";
 if(msg.text != undefined){
    if((msg.text+"").match(/вэйт/g) != null){
      v1 = 0;
      if(msg.text.split("вэйт")[1].trim() != ""){
        messSend.push(msg.text.split("вэйт")[1].trim());
        console.log(messSend);
      }
    }
    if(msg.text != null && setScore == false && v1 != 0){
      var forw = "";
      if((msg.chat.id+"") != "-1001187220601"){
        forw = msg.text;
        bot.sendMessage(-1001187220601, forw);
      } else{
        forw = msg.text;
      }
      await message.find({msg: forw}, async function(err, res){
        if(res.length == 0 && forw.match(/[aZ-zA]/) == null && forw.length > 1){
          // console.log("добавлено");
          await message.collection.insert({msg: forw, koll: level + 1});
        }
      });
    }
  }

  texProcent = 0, gifProcent = 0, stickProcentP = 0, stickProcentM = 0;

  var bonusP = (msg.text != undefined)+" "+(msg.animation != undefined || msg.document != undefined)+" "+(msg.sticker != undefined);
  switch(bonusP){
    case "true false false": texProcent = 15; stickProcentM = 15; gifProcent = 2; stickProcentP = 2; break;
    case "false true false": gifProcent = -20; stickProcentP = -20; stickProcentM = -20; texProcent = -20; break;
    case "false false true": stickProcentP = 2; stickProcentM = -20; texProcent = -20; gifProcent = 2; break;
  }
  // console.log(texProcent, gifProcent, stickProcentP, stickProcentM);

  if(messSend.length == 0){
    if(v1 > 0){
      await message.find({}, async function(err, res){
        var len = res.length, smile = true, prov = [];
        if(res.length != 0 && res.length != 1){
          if(msg.text != undefined){
            var txt = msg.text.trim(), msgUser = msg.text.trim().replace("+", "").split(" ");
            if(msgUser.join(" ").match(/[aZ-zA-аЯ-яАё]+[.,+!@#$%^&*?(){}\[\]]{0}/g) != null){
              smile = false;
              msgUser = msgUser.join(" ").match(/[aZ-zA-аЯ-яАё]+[.,+!@#$%^&*?(){}\[\]]{0}/g);
              console.log(msgUser);
              for(var f = 0; f < msgUser.length; f++){
                if((msgUser[f]+"").length < 2){
                  msgUser = msgUser.filter((w) => {return w != msgUser[f]});
                  f = 0;
                }
              }
            }
            if(msgUser.join(" ").length > 1){
              msgUser = msgUser.join("|");
            } else{
              msgUser = msgUser.join("");
            }
            // console.log(regs);
            var msgOnce = new RegExp(msg.text.trim().match(/[aZ-zA-аЯ-яАё]+[.,+!@#$%^&*?(){}\[\]]{0}/g), "i");
            console.log(msgOnce, msgUser);
            var iskom = res.filter((w) => {return ((w.msg+"").match(new RegExp(msgUser, "i"))) != null});
            // console.log(iskom);
            if(smile == false){
              prov = iskom.filter((w) => {return ((w.msg+"").match(msgOnce) == null && (w.msg+"").length == txt.length)});
            } else{
              prov = iskom.filter((w) => {return (w.msg != txt)});
            }
            console.log(prov.length, iskom.length);
            if(prov.length != 0){
              prov = prov.filter((w) => {return w.msg.match(/msgSticker|msgGifs/g) == null});
              var rand = Math.ceil(Math.random() * prov.length);
              var type = Math.ceil(Math.random() * 100), typeSendMess = Math.ceil(Math.random() * 2);
              // type = 4;
              if(setScore == false){ 
                var coll = res[rand-1].koll + 1, sendM = false;
                // message.collection.update({msg: prov[rand-1].msg}, {$set: {koll: coll}});
                
                 if(type <= (80 + texProcent) && sendM == false){
                  sendM = true;
                  switch(typeSendMess){
                    case 1: await bot.sendMessage(chatId, prov[rand-1].msg); break;
                    case 2: await bot.sendMessage(chatId, prov[rand-1].msg, {"reply_to_message_id" : message_id, "selective" : true}); break;
                  }
                }
                if(type <= (95 + stickProcentP) && type > (80 + stickProcentM) && sendM == false){
                  sendM = true;
                  await message.find({msg: /msgSticker/g}, async (err, res) => {
                    rand = Math.ceil(Math.random() * res.length);
                    switch(typeSendMess){
                      case 1: await bot.sendSticker(chatId, res[rand-1].msg.split(" ")[1]); break;
                      case 2: await bot.sendSticker(chatId, res[rand-1].msg.split(" ")[1], {"reply_to_message_id" : message_id, "selective" : true}); break;
                    }
                  });
                }
                if(type <= 100 && type > (95 + gifProcent) && sendM == false){
                  sendM = true;
                  await message.find({msg: /msgGifs/g}, async (err, res) => {
                    rand = Math.ceil(Math.random() * res.length);
                    switch(typeSendMess){
                      case 1: await bot.sendSticker(chatId, res[rand-1].msg.split(" ")[1]); break;
                      case 2: await bot.sendSticker(chatId, res[rand-1].msg.split(" ")[1], {"reply_to_message_id" : message_id, "selective" : true});;
                    }
                  });
                }
              }
            } else{
              var randMes = Math.ceil(Math.random() * 100);
              var rand = Math.ceil(Math.random() * len);
              var type = Math.ceil(Math.random() * 100), typeSendMess = Math.ceil(Math.random() * 2);
              if(setScore == false && randMes <= 100){
                // var coll = res[rand-1].koll + 1;
               var coll = res[rand-1].koll + 1, sendM = false;
                
                if(type <= (80 + texProcent) && sendM == false){
                  sendM = true;
                  res = res.filter((w) => {return (w.msg.indexOf("msgSticker") == -1 && w.msg.indexOf("msgGifs") == -1)});
                  rand = Math.ceil(Math.random() * res.length);
                  switch(typeSendMess){
                    case 1: await bot.sendMessage(chatId, res[rand-1].msg); break;
                    case 2: await bot.sendMessage(chatId, res[rand-1].msg, {"reply_to_message_id" : message_id, "selective" : true}); break;
                  }
                }
                if(type <= (95 + stickProcentP) && type > (80 + stickProcentM) && sendM == false){
                  sendM = true;
                  await message.find({msg: /msgSticker/g}, async (err, res) => {
                    rand = Math.ceil(Math.random() * res.length);
                    switch(typeSendMess){
                      case 1: await bot.sendSticker(chatId, res[rand-1].msg.split(" ")[1]); break;
                      case 2: await bot.sendSticker(chatId, res[rand-1].msg.split(" ")[1], {"reply_to_message_id" : message_id, "selective" : true}); break;
                    }
                  });
                }
                if(type <= 100 && type > (95 + gifProcent) && sendM == false){
                  sendM = true;
                  await message.find({msg: /msgGifs/g}, async (err, res) => {
                    rand = Math.ceil(Math.random() * res.length);
                    switch(typeSendMess){
                      case 1: await bot.sendSticker(chatId, res[rand-1].msg.split(" ")[1]); break;
                      case 2: await bot.sendSticker(chatId, res[rand-1].msg.split(" ")[1], {"reply_to_message_id" : message_id, "selective" : true});;
                    }
                  });
                }
                console.log(type, rand, res[rand-1].msg);
                if(type == 1 || type == 2){
                  res = res.filter((w) => {return ((w.msg+"").match(/msgSticker|msgGifs/g) == null)});
                }
                // message.collection.update({msg: res[rand-1].msg}, {$set: {koll: coll}});
                
              }
            }
          }
          if(msg.text == undefined){     
            if(prov.length == 0){
              var randMes = Math.ceil(Math.random() * 100);
              var rand = Math.ceil(Math.random() * len);
              var type = Math.ceil(Math.random() * 100), typeSendMess = Math.ceil(Math.random() * 2);
              if(setScore == false && randMes <= 100){
                // var coll = res[rand-1].koll + 1;
               var coll = res[rand-1].koll + 1, sendM = false;
                
                if(type <= (80 + texProcent) && sendM == false){
                  sendM = true;
                  res = res.filter((w) => {return (w.msg.indexOf("msgSticker") == -1 && w.msg.indexOf("msgGifs") == -1)});
                  rand = Math.ceil(Math.random() * res.length);
                  switch(typeSendMess){
                    case 1: await bot.sendMessage(chatId, res[rand-1].msg); break;
                    case 2: await bot.sendMessage(chatId, res[rand-1].msg, {"reply_to_message_id" : message_id, "selective" : true}); break;
                  }
                }
                if(type <= (95 + stickProcentP) && type > (80 + stickProcentM) && sendM == false){
                  sendM = true;
                  await message.find({msg: /msgSticker/g}, async (err, res) => {
                    rand = Math.ceil(Math.random() * res.length);
                    switch(typeSendMess){
                      case 1: await bot.sendSticker(chatId, res[rand-1].msg.split(" ")[1]); break;
                      case 2: await bot.sendSticker(chatId, res[rand-1].msg.split(" ")[1], {"reply_to_message_id" : message_id, "selective" : true}); break;
                    }
                  });
                }
                if(type <= 100 && type > (95 + gifProcent) && sendM == false){
                  sendM = true;
                  await message.find({msg: /msgGifs/g}, async (err, res) => {
                    rand = Math.ceil(Math.random() * res.length);
                    switch(typeSendMess){
                      case 1: await bot.sendSticker(chatId, res[rand-1].msg.split(" ")[1]); break;
                      case 2: await bot.sendSticker(chatId, res[rand-1].msg.split(" ")[1], {"reply_to_message_id" : message_id, "selective" : true});;
                    }
                  });
                }
              }
            }
          }
        } else{
          if(res.length != 1){
            level = level + 1;
            // options.collection.update({level: (level-1)}, {$set: {level: level}});
            message.find({koll: level}, (err, res) => {
              bot.sendMessage(msg.chat.id, "Ебать копать, вы добили все мои фразы, начинается новый этап, я вас прикончу 😈😈😈😈"+" \n В моём арсенале теперь "+ res.length+" сообщений \n Тебе: @randomize_one, @R_ee_D20, @The_negative_one, @XJIe6yLLIek пизда, я вас в порошок сотрю, все фрукты и овощи затрахаю 🤗🤗");
            });
          } else{
            if(res.length == 1){
              message.collection.update({koll: level}, {$set: {koll: (level+1)}});
            }
          }
        }
      });
    } else if(v1 == -1){
      if((msg.chat.id+"") == "-1001187220601"){
        var send = false, msges = [];
        if(clients[msg.from.id] != undefined){
          var search = "";
          for(u = 0; u < clients[msg.from.id].length; u++){
            if(u + 1 < clients[msg.from.id].length){
              search += clients[msg.from.id][u]+"|";
            } else{
              search += clients[msg.from.id][u];
            }
          }
            var y = new RegExp(search, "g");
            await message.find({msg: y, koll: level}, async function(err, res){
              if(res.length != 0){
                res.forEach(async(v, k) => {
                  msges.push(v.msg);
                  if(res.length-1 == k){
                      if(msges.length > 0 && send == false){
                        var rand = Math.ceil(Math.random()*msges.length);
                        var type = Math.ceil(Math.random() * 2);
                        var coll = res[rand-1].koll + 1;
                        message.collection.update({msg: msges[rand-1]}, {$set: {koll: coll}});
                        switch(type){
                          case 1: await bot.sendMessage(msg.chat.id, msges[rand-1]); break;
                          case 2: await bot.sendMessage(msg.chat.id, msges[rand-1], {"reply_to_message_id" : msg.message_id, "selective" : true}); break;
                        }
                        send = true;
                      }
                  }
                });
              } else{
                options.collection.update({level: level}, {$set: {level: level+1}});
              }
            });
          // )
        }
      }
    }
  } else{
    if((msg.chat.id+"") == "-1001187220601"){
      var type = Math.ceil(Math.random() * 2);
      if(messSend[0].indexOf("@") != -1){
        type = 1;
      }
      setTimeout(() => {
         switch(type){
          case 1: bot.sendMessage(msg.chat.id, messSend[0]); break;
          case 2: bot.sendMessage(msg.chat.id, messSend[0], {"reply_to_message_id" : msg.message_id, "selective" : true}); break;
        }
        messSend.shift();
      }, 1500);
    }
  }
});

bot.onText(/\/help/, (msg, match) => {
  var text = msg.text.split("/help")[1].trim();
  switch(text){
    case 'newBuild': bot.sendMessage(msg.chat.id, '/newBuild название_стоимость_сколько даёт жителей или ндс_кулдаун_опыт_размер_тип (жилое или ндс)'); break;
  }
});

bot.onText(/\/newBuild/, (msg, match) => {
  var data = msg.text.split("/newBuild")[1];
  var name = data.split("_")[0].trim();
  console.log(msg);
  serv.find({nameLower: name.toLowerCase()}, (err, res) => {
    if(res.length == 0){
      bot.getChatMember(msg.chat.id, msg.from.id).then((res) => {
        if(res.status == 'administrator' || res.status == 'creator'){
          var cost = Number(data.split("_")[1]);
          var value = Number(data.split("_")[2]);
          var kd = data.split("_")[3];
          var exp = Number(data.split("_")[4]);
          var size = data.split("_")[5];
          var type = data.split("_")[6];
          var lvl = Number(data.split("_")[7]);
          serv.collection.insert({name: name, nameLower: name.toLowerCase(), cost: cost, value: value, type: type, kd: kd, exp: exp, size: size, lvl: lvl});
          bot.sendMessage(msg.chat.id, "Новое здание добавлено в список");
        }
      });
    } else{
      bot.sendMessage(msg.chat.id, "Здание с таким названием уже есть");
    }
  });
}); 

setTimeout(async function(){
  var t = "";
  if(messSend.length > 0){
    t = messSend.join("++");
  }
  console.log("=="+t);
  await process.exit();
}, 90000);


