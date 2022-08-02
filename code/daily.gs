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
  for (let i = 0; i < fl.length; i++)
  {
    let file = SpreadsheetApp.openById(fl[i]);
    let settings = file.getSheetByName('settings');
    let daliy_on = settings.getRange(daliy_pos).getValue().toString();
    if (daliy_on == '' || daliy_on == '0') continue;
    let lang = settings.getRange(lang_pos).getValue();
    let chat_id = settings.getRange(1, 1).getValue().toString();
    let menu_sheet = file.getSheetByName('menu');
    let cnt = settings.getRange(breakfast_num_pos).getValue();
    let types = settings.getRange(breakfast_type_pos).getValue();
    if (cnt) cnt = parseInt(cnt);
    else cnt = 3;
    let type = '', len;
    if (types === '' || types === 'all') {
      len = menu_sheet.getLastRow();
    }
    else {
      type = types.split(',');
      var food_list = [], rows = [];
      for (let j = 0; j < type.length; j++)
      {
        let res = menu_sheet.createTextFinder(type[j]).findAll();
        for (let k = 0; k < res.length; k++) {
          rows.push(res[k].getRow());
        }
      }
      rows = [...new Set(rows)].sort();
      for (let j = 0; j < rows.length; j ++) {
        food_list.push(menu_sheet.getRange(rows[j], 1).getValue());
      }
      len = food_list.length;
    }
    if (len == 0) continue;
    else if (len < 3) cnt = len;
    let chosen = getUniqueRandoms(1, len, cnt);
    if (lang == 'Zh') var msg = "早上好！今日早餐推荐菜是：\n";
    else var msg = "Good morning! Breakfast recommendation:\n";
    if (type.length) {
      for (let j = 0; j < chosen.length; j++) msg += food_list[chosen[j] - 1] + '\n';
    }
    else {
      for (let j = 0; j < chosen.length; j++) chosen[j] = 'A' + chosen[j];
      let ranges = menu_sheet.getRangeList(chosen).getRanges();
      for (let j = 0; j < chosen.length; j++) msg += ranges[j].getValue() + '\n';
    }
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
  for (let i = 0; i < fl.length; i++)
  {
    let file = SpreadsheetApp.openById(fl[i]);
    let settings = file.getSheetByName('settings');
    let daliy_on = settings.getRange(daliy_pos).getValue().toString();
    if (daliy_on == '' || daliy_on == '0') continue;
    let lang = settings.getRange(lang_pos).getValue();
    let chat_id = settings.getRange(1, 1).getValue().toString();
    let menu_sheet = file.getSheetByName('menu');
    let cnt = settings.getRange(lunch_num_pos).getValue();
    let types = settings.getRange(lunch_type_pos).getValue();
    if (cnt) cnt = parseInt(cnt);
    else cnt = 3;
    let type = '', len;
    if (types === '' || types === 'all') {
      len = menu_sheet.getLastRow();
    }
    else {
      type = types.split(',');
      var food_list = [], rows = [];
      for (let j = 0; j < type.length; j++)
      {
        let res = menu_sheet.createTextFinder(type[j]).findAll();
        for (let k = 0; k < res.length; k++) {
          rows.push(res[k].getRow());
        }
      }
      rows = [...new Set(rows)].sort();
      for (let j = 0; j < rows.length; j ++) {
        food_list.push(menu_sheet.getRange(rows[j], 1).getValue());
      }
      len = food_list.length;
    }
    if (len == 0) continue;
    else if (len < 3) cnt = len;
    let chosen = getUniqueRandoms(1, len, cnt);
    if (lang == 'Zh') var msg = "中午好！今日午餐推荐菜是：\n";
    else var msg = "Good afternoon! Lunch recommendation:\n";
    if (type.length) {
      for (let j = 0; j < chosen.length; j++) msg += food_list[chosen[j] - 1] + '\n';
    }
    else {
      for (let j = 0; j < chosen.length; j++) chosen[j] = 'A' + chosen[j];
      let ranges = menu_sheet.getRangeList(chosen).getRanges();
      for (let j = 0; j < chosen.length; j++) msg += ranges[j].getValue() + '\n';
    }
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
  for (let i = 0; i < fl.length; i++)
  {
    let file = SpreadsheetApp.openById(fl[i]);
    let settings = file.getSheetByName('settings');
    let daliy_on = settings.getRange(daliy_pos).getValue().toString();
    if (daliy_on == '' || daliy_on == '0') continue;
    let lang = settings.getRange(lang_pos).getValue();
    let chat_id = settings.getRange(1, 1).getValue().toString();
    let menu_sheet = file.getSheetByName('menu');
    let cnt = settings.getRange(dinner_num_pos).getValue();
    let types = settings.getRange(dinner_type_pos).getValue();
    if (cnt) cnt = parseInt(cnt);
    else cnt = 3;
    let type = '', len;
    if (types === '' || types === 'all') {
      len = menu_sheet.getLastRow();
    }
    else {
      type = types.split(',');
      var food_list = [], rows = [];
      for (let j = 0; j < type.length; j++)
      {
        let res = menu_sheet.createTextFinder(type[j]).findAll();
        for (let k = 0; k < res.length; k++) {
          rows.push(res[k].getRow());
        }
      }
      rows = [...new Set(rows)].sort();
      for (let j = 0; j < rows.length; j ++) {
        food_list.push(menu_sheet.getRange(rows[j], 1).getValue());
      }
      len = food_list.length;
    }
    if (len == 0) continue;
    else if (len < 3) cnt = len;
    let chosen = getUniqueRandoms(1, len, cnt);
    if (lang == 'Zh') var msg = "晚上好！今日晚餐推荐菜是：\n";
    else var msg = "Good evening! Dinner recommendation:\n";
    if (type.length) {
      for (let j = 0; j < chosen.length; j++) msg += food_list[chosen[j] - 1] + '\n';
    }
    else {
      for (let j = 0; j < chosen.length; j++) chosen[j] = 'A' + chosen[j];
      let ranges = menu_sheet.getRangeList(chosen).getRanges();
      for (let j = 0; j < chosen.length; j++) msg += ranges[j].getValue() + '\n';
    }
    var mensaje = {
      "method": "sendMessage",
      "chat_id": chat_id,
      "text": msg,
    }
    send(mensaje);
  }
}