function doPost(e){
  var estringa = JSON.parse(e.postData.contents);
  var payload = identificar(estringa);
  var data = {
    "method": "post",
    "payload": payload
  }
  UrlFetchApp.fetch("https://api.telegram.org/bot1892326964:AAHp8OK-8WWbF_XrcuW_865V10BtVbiXRV8/", data);
}

function identificar(e){
  var folder = DriveApp.getFolderById('1AVWGzwEFJTkup13-Dr9fBSdsgwdXH3q2');
  var filename = GetMD5Hash(e.message.chat.id.toString());
  var file = folder.getFilesByName(filename);
  var menu_string = "";
  if (!file.hasNext()) {
    file = folder.createFile(filename,"");
    menu_string = file.getBlob().getDataAsString();
  }
  else {
    file = file.next();
    menu_string = file.getBlob().getDataAsString();
  }
  if (e.message.text){
    var mensaje = {
      "method": "sendMessage",
      "chat_id": e.message.chat.id.toString(),
      "text": TextProcess(file, menu_string, e.message.text),
    }
  }
  else if (e.message.sticker){
    var mensaje = {
      "method": "sendSticker",
      "chat_id": e.message.chat.id.toString(),
      "sticker": e.message.sticker.file_id
    }
   }
  else if (e.message.photo){
    var array = e.message.photo;
    var text = array[1];
    var mensaje = {
      "method": "sendPhoto",
      "chat_id": e.message.chat.id.toString(),
      "photo": text.file_id
    }
   }
  else {
    var mensaje = {
      "method": "sendMessage",
      "chat_id": e.message.chat.id.toString(),
      "text": "要吃点什么呢？🐤"
    }
   }
  return mensaje
}
