function breakfast() {
  var folder = getFolder();
  var fl = getFileList(folder);
  for (var i = 0; i < fl.length; i++)
  {
    var file = folder.getFilesByName(fl[i]).next();
    var contents = splitFileContent(file.getBlob().getDataAsString());
    var menu = contents[1];
    var len = contents[2];
    var cnt = 3;
    if (len < 3) cnt = len;
    var chosen = getUniqueRandoms(0, len - 1, cnt);
    var msg = "早上好！今日早餐推荐菜是：\n";
    for (var j = 0; j < chosen.length; j++) msg += menu[chosen[j]] + '\n';
    var mensaje = {
      "method": "sendMessage",
      "chat_id": contents[0].toString(),
      "text": msg,
    }
    send(mensaje);
  }
}

function lunch() {
  var folder = getFolder();
  var fl = getFileList(folder);
  for (var i = 0; i < fl.length; i++)
  {
    var file = folder.getFilesByName(fl[i]).next();
    var contents = splitFileContent(file.getBlob().getDataAsString());
    var menu = contents[1];
    var len = contents[2];
    var cnt = 3;
    if (len < 3) cnt = len;
    var chosen = getUniqueRandoms(0, len - 1, cnt);
    var msg = "中午好！今日午餐推荐菜是：\n";
    for (var j = 0; j < chosen.length; j++) msg += menu[chosen[j]] + '\n';
    var mensaje = {
      "method": "sendMessage",
      "chat_id": contents[0].toString(),
      "text": msg,
    }
    send(mensaje);
  }
}

function dinner() {
  var folder = getFolder();
  var fl = getFileList(folder);
  for (var i = 0; i < fl.length; i++)
  {
    var file = folder.getFilesByName(fl[i]).next();
    var contents = splitFileContent(file.getBlob().getDataAsString());
    var menu = contents[1];
    var len = contents[2];
    var cnt = 3;
    if (len < 3) cnt = len;
    var chosen = getUniqueRandoms(0, len - 1, cnt);
    var msg = "晚上好！今日晚餐推荐菜是：\n";
    for (var j = 0; j < chosen.length; j++) msg += menu[chosen[j]] + '\n';
    var mensaje = {
      "method": "sendMessage",
      "chat_id": contents[0].toString(),
      "text": msg,
    }
    send(mensaje);
  }
}