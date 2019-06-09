
var telegram = require('telegram-bot-api');
var request = require('request')    
var mongojs = require('mongojs')   
var db = mongojs('mongodb://pi:abc123321@cluster0-shard-00-00-ccqn3.mongodb.net:27017/Pi?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin', ['TelegramData'])


var api = new telegram({
    token: '872363712:AAG_QyQauhEmIo6Q2N50YrSCtuExT11y9JA',
    updates: {
                enabled: true
             }
});
api.on('message', function(message)
{console.log("======All msg Details=====")
    console.log(message)
    var chat_id = message.chat.id;
    if (message.text=="hi"){
        api.sendPhoto({
            chat_id:message.chat.id ,
             caption: "Welcome to Pi News \nType > news < to see the options",
            photo: '/home/pranesh/Github/Codinza/Day\ 4/download.png'
           })
        console.log("pic sendPhoto")
    }
if(message.text=="news"){
 
var inlineKeyboard = {
        inline_keyboard: [
            [
                {
                    text: 'TechCrunch',
                    callback_data: '1-1'
                },
                {
                    text: 'WallStreet',
                    callback_data: '1-2'
                }
            ],
            [
                {
                    text: 'Desi news',
                    callback_data: '2'
                }
            ]
        ]
    };

/*
| 1-1 | 1-2 |
|     2     |
*/

api.sendMessage({
        chat_id:message.chat.id,
        text: 'Click on buttons below',
        reply_markup: JSON.stringify(inlineKeyboard)
    })
  

//When user click on button, 'CallbackQuery' Object will be catch by code below
api.on('inline.callback.query', function(msg) {

    var data = msg.data;
     //Value from 'callback_data' field of clicked button
     if (data=="1-1"){ 
        var newstype="TechCrunch News";
         api.sendMessage({
            chat_id:message.chat.id,
        text: 'TechCrunch News'
        })
                 request('https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=910b63b94d064f158a405ed50f851775', function (error, response, body) {
                
                var min=0; 
                
           var obj=JSON.parse(body).articles
                     console.log(Object.keys(obj).length);
             var max=Object.keys(obj).length;
                var random =Math.floor(Math.random() * (+max - +min)) + +min; 
                 api.sendPhoto({
            chat_id:message.chat.id ,
             caption: JSON.parse(body).articles[random].title +"\n Source: "+
                        JSON.parse(body).articles[random].source.name+"\n Read More at: "+
                         JSON.parse(body).articles[random].url,
            photo: JSON.parse(body).articles[random].urlToImage
           
           })
               })
     }
     if (data=="1-2"){
        var newstype="WallStreet News";
        api.sendMessage({
            chat_id:message.chat.id,
        text: 'WallStreet News'

        })
                request('https://newsapi.org/v2/everything?domains=wsj.com&apiKey=910b63b94d064f158a405ed50f851775', function (error, response, body) {
                
                var min=0; 
                
           var obj=JSON.parse(body).articles
                     console.log(Object.keys(obj).length);
             var max=Object.keys(obj).length;
                var random =Math.floor(Math.random() * (+max - +min)) + +min; 
                 api.sendPhoto({
            chat_id:message.chat.id ,
             caption: JSON.parse(body).articles[random].title +"\n Source: "+
                        JSON.parse(body).articles[random].source.name+"\n Read More at: "+
                         JSON.parse(body).articles[random].url,
            photo: JSON.parse(body).articles[random].urlToImage
           
           })
               })
     }
     if (data=="2"){
        var newstype="Indian News";
        api.sendMessage({
                    chat_id:message.chat.id,
                text: 'Indian News'       
        })
        request('https://newsapi.org/v2/top-headlines?country=in&apiKey=910b63b94d064f158a405ed50f851775', function (error, response, body) {
                
                var min=0; 
                
           var obj=JSON.parse(body).articles
                     console.log(Object.keys(obj).length);
             var max=Object.keys(obj).length;
                var random =Math.floor(Math.random() * (+max - +min)) + +min; 
                 api.sendPhoto({
            chat_id:message.chat.id ,
             caption: JSON.parse(body).articles[random].title +"\n Source: "+
                        JSON.parse(body).articles[random].source.name+"\n Read More at: "+
                         JSON.parse(body).articles[random].url,
            photo: JSON.parse(body).articles[random].urlToImage
           
           })
               })
       
     }
     else {
        api.sendMessage({
            chat_id:message.chat.id,
        text: '  searching  '
        })
     }

    console.log("news on the roll");

var chatdetails={
    from: message.from.username,
    to:message.chat.username,
    requested_for: newstype,
    chat_id:message.chat.id,
}
db.TelegramData.insert(chatdetails, function(err,data ){
if (err){
console.log(err)}
else{
console.log(data +" is inserted" )
}})


})
}

});