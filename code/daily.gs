function breakfast() {
  var folder = getFolder();
  var fl = getFileList(folder);
  for (var i = 0; i < fl.length; i++)
  {
    var file = SpreadsheetApp.openById(fl[i]);
    var settings = file.getSheetByName('settings');
    if (settings.getRange('A2').getValue() == 0) continue;
    var chat_id = settings.getRange(1, 1).getValue().toString();
    var menu_sheet = file.getSheetByName('menu');
    var len = menu_sheet.getLastRow();
    var cnt = 3;
    if (len < 3) cnt = len;
    var chosen = getUniqueRandoms(1, len, cnt);
    var msg = "早上好！今日早餐推荐菜是：\n";
    for (var j = 0; j < chosen.length; j++) chosen[j] = 'A' + chosen[j];
    var ranges = menu_sheet.getRangeList(chosen).getRanges();
    for (var j = 0; j < chosen.length; j++) msg += ranges[j].getValue() + '\n';
    var mensaje = {
      "method": "sendMessage",
      "chat_id": chat_id,
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
    var file = SpreadsheetApp.openById(fl[i]);
    var settings = file.getSheetByName('settings');
    if (settings.getRange('A2').getValue() == 0) continue;
    var chat_id = settings.getRange(1, 1).getValue().toString();
    var menu_sheet = file.getSheetByName('menu');
    var len = menu_sheet.getLastRow();
    var cnt = 3;
    if (len < 3) cnt = len;
    var chosen = getUniqueRandoms(1, len, cnt);
    var msg = "中午好！今日午餐推荐菜是：\n";
    for (var j = 0; j < chosen.length; j++) chosen[j] = 'A' + chosen[j];
    var ranges = menu_sheet.getRangeList(chosen).getRanges();
    for (var j = 0; j < chosen.length; j++) msg += ranges[j].getValue() + '\n';
    var mensaje = {
      "method": "sendMessage",
      "chat_id": chat_id,
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
    var file = SpreadsheetApp.openById(fl[i]);
    var settings = file.getSheetByName('settings');
    if (settings.getRange('A2').getValue() == 0) continue;
    var chat_id = settings.getRange(1, 1).getValue().toString();
    var menu_sheet = file.getSheetByName('menu');
    var len = menu_sheet.getLastRow();
    var cnt = 3;
    if (len < 3) cnt = len;
    var chosen = getUniqueRandoms(1, len, cnt);
    var msg = "晚上好！今日晚餐推荐菜是：\n";
    for (var j = 0; j < chosen.length; j++) chosen[j] = 'A' + chosen[j];
    var ranges = menu_sheet.getRangeList(chosen).getRanges();
    for (var j = 0; j < chosen.length; j++) msg += ranges[j].getValue() + '\n';
    var mensaje = {
      "method": "sendMessage",
      "chat_id": chat_id,
      "text": msg,
    }
    send(mensaje);
  }
}