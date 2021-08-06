function send(payload) {
  if (payload) {
    var data = {
      "method": "post",
      "payload": payload,
      "muteHttpExceptions": true
    }
    response = UrlFetchApp.fetch("https://api.telegram.org/bot<bot-token>/", data);
    Logger.log(response.getContentText());
  }
}

function doPost(e){
  var estringa = JSON.parse(e.postData.contents);
  var payload = identificar(estringa);
  send(payload);
}

function identificar(e){
  var folder = getFolder();
  if (e.message)
    var chat_id = e.message.chat.id.toString();
  else if (e.edited_message)
    var chat_id = e.edited_message.chat.id.toString();
  else
    var chat_id = e.callback_query.message.chat.id.toString();
  var filename = GetMD5Hash(chat_id);
  var file = folder.getFilesByName(filename);
  if (!file.hasNext()) {
    var file_id = SpreadsheetApp.create(filename).getId();
    DriveApp.getFileById(file_id).moveTo(folder);
    file = SpreadsheetApp.openById(file_id);
    var settings = file.getSheets()[0];
    settings.setName('settings');
    settings.appendRow([chat_id]);
    file.insertSheet('menu');
  }
  else {
    file = SpreadsheetApp.openById(file.next().getId());
  }
  if (e.message) {
    if (e.message.text){
      var mensaje = {
        "method": "sendMessage",
        "chat_id": chat_id
      }
      mensaje = TextProcess(file, e.message.text, mensaje);
    }
    else if (e.message.sticker){
      var mensaje = {
        "method": "sendSticker",
        "chat_id": chat_id,
        "sticker": e.message.sticker.file_id
      }
    }
    else if (e.message.photo){
      var array = e.message.photo;
      var text = array[1];
      var mensaje = {
        "method": "sendPhoto",
        "chat_id": chat_id,
        "photo": text.file_id
      }
    }
    else if (e.message.new_chat_member){
      if (settings.getRange(lang_pos).getValue() == 'Zh') var msg = "欢迎 " + getMentionName(e.message.new_chat_member) + " 加入本群~！使用 /list 来看看有什么好吃的呀~🤗";
      else var msg = "Hi " + getMentionName(e.message.new_chat_member) + "! Welcome to our group! Use /list to take a look at the menu~🤗";
      var mensaje = {
        "method": "sendMessage",
        "chat_id": chat_id,
        "text": msg,
        "parse_mode": "Markdown",
        "disable_web_page_preview": true,
      }
    }
  }
  else if (e.edited_message){
    var mensaje = {
      "method": "editMessageText",
      "chat_id": chat_id,
      "message_id": (e.edited_message.message_id + 1).toString()
    }
    mensaje = TextProcess(file, e.edited_message.text, mensaje);
  }
  else if (e.callback_query) {
    var mensaje = {
      "method": "editMessageText",
      "chat_id": chat_id,
      "message_id": e.callback_query.message.message_id.toString()
    }
    mensaje = CallbackProcess(file, e.callback_query.data, mensaje);
  }
  return mensaje
}