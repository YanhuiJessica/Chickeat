function annoncement() {
  var folder = getFolder();
  var fl = getFileList(folder);
  var enmsg = "<annoncement>";
  var zhmsg = "<annoncement>";
  for (var i = 0; i < fl.length; i++)
  {
    var file = SpreadsheetApp.openById(fl[i]);
    var settings = file.getSheetByName('settings');
    var lang = settings.getRange(lang_pos).getValue();
    var chat_id = settings.getRange(1, 1).getValue().toString();
    if (lang == 'Zh') var msg = zhmsg;
    else var msg = enmsg;
    var mensaje = {
      "method": "sendMessage",
      "chat_id": chat_id,
      "text": msg,
    }
    send(mensaje);
  }
}

function breakfast() {
  var folder = getFolder();
  var fl = getFileList(folder);
  for (var i = 0; i < fl.length; i++)
  {
    var file = SpreadsheetApp.openById(fl[i]);
    var settings = file.getSheetByName('settings');
    if (settings.getRange(daliy_pos).getValue().toString() == '0') continue;
    var lang = settings.getRange(lang_pos).getValue();
    var chat_id = settings.getRange(1, 1).getValue().toString();
    var menu_sheet = file.getSheetByName('menu');
    var len = menu_sheet.getLastRow();
    var cnt = 3;
    if (len == 0) continue;
    else if (len < 3) cnt = len;
    var chosen = getUniqueRandoms(1, len, cnt);
    if (lang == 'Zh') var msg = "早上好！今日早餐推荐菜是：\n";
    else var msg = "Good morning! Breakfast recommendation:\n";
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
    if (settings.getRange(daliy_pos).getValue().toString() == '0') continue;
    var lang = settings.getRange(lang_pos).getValue();
    var chat_id = settings.getRange(1, 1).getValue().toString();
    var menu_sheet = file.getSheetByName('menu');
    var len = menu_sheet.getLastRow();
    var cnt = 3;
    if (len == 0) continue;
    else if (len < 3) cnt = len;
    var chosen = getUniqueRandoms(1, len, cnt);
    if (lang == 'Zh') var msg = "中午好！今日午餐推荐菜是：\n";
    else var msg = "Good afternoon! Lunch recommendation:\n";
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
    if (settings.getRange(daliy_pos).getValue().toString() == '0') continue;
    var lang = settings.getRange(lang_pos).getValue();
    var chat_id = settings.getRange(1, 1).getValue().toString();
    var menu_sheet = file.getSheetByName('menu');
    var len = menu_sheet.getLastRow();
    var cnt = 3;
    if (len == 0) continue;
    else if (len < 3) cnt = len;
    var chosen = getUniqueRandoms(1, len, cnt);
    if (lang == 'Zh') var msg = "晚上好！今日晚餐推荐菜是：\n";
    else var msg = "Good evening! Dinner recommendation:\n";
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