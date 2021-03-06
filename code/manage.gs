function getFolder(){
  return DriveApp.getFolderById('1AVWGzwEFJTkup13-Dr9fBSdsgwdXH3q2');
}

function getFileList(folder) {
  var files = folder.getFiles();
  var fileids = [];
  while (files.hasNext()) {
    fileids.push(files.next().getId());
  }
  return fileids;
}

function getName(user) {
  var name = user.first_name;
  if (user.last_name) {
    name += " " + user.last_name;
  }
  return name;
}

function getMarkDownUserUrl(userName, userId) {
  return "[" + userName + "](tg://user?id=" + userId + ")";
}

function getMentionName(user) {
  var mentionName = "";
 
  var name = getName(user);
  if (!name) {
    name = "***";
  }
  mentionName = getMarkDownUserUrl(escapeMarkDown(name), user.id);

  return mentionName;
}

function splitFileContent(menu_string) {
  var menu = menu_string.split('\n'); menu.pop();
  var chat_id = menu.splice(0,1);
  return [chat_id, menu, menu.length];
}

function CallbackProcess(file, data, mensaje) {
  var settings = file.getSheetByName('settings');
  var lang = settings.getRange(lang_pos).getValue();
  var menu_sheet = file.getSheetByName('menu');
  var len = menu_sheet.getLastRow();
  if (data.indexOf("daliy") === 0) {
    var cell = settings.getRange(daliy_pos);
    if (cell.getValue().toString() != '0') {
      cell.setValue(0);
      if (lang == 'Zh') mensaje.text = "每日推荐已关闭🥚";
      else {
        mensaje.text = "Everyday recommendation is closed🥚";
      }
    }
    else {
      cell.setValue(1);
      if (lang == 'Zh') mensaje.text = "每日推荐开启成功🐣";
      else {
        mensaje.text = "Everyday recommendation is opened🐣";
      }
    }
    mensaje.reply_markup = JSON.stringify(getInlineKeyboardMarkup(settings, 'back'));
  }
  else if (data.indexOf("language") === 0) {
    var cell = settings.getRange(lang_pos);
    if (cell.getValue() == 'Zh') {
      cell.setValue('En');
      mensaje.text = "Customize Chickeat in this chat 🐣";
    }
    else {
      cell.setValue('Zh');
      mensaje.text = "设置当前会话的 Chickeat 🐣";
    }
    mensaje.reply_markup = JSON.stringify(getInlineKeyboardMarkup(settings, 'default'));
  }
  else if (data.indexOf("/settings") === 0) {
    mensaje = TextProcess(file, data, mensaje);
  }
  else if (data.indexOf("page") === 0) {
    var page = data.trim().split(' ')[1];
    var get_len = 10;
    var msg = '';
    if (page * 10 > len) get_len = len - (page - 1) * 10;
    var menu = menu_sheet.getRange((page - 1) * 10 + 1, 1, get_len).getValues();
    for (var i = 0; i < get_len; i++) {
      msg += menu[i][0] + '\n';
    }
    mensaje.text = msg;
    mensaje.reply_markup = JSON.stringify(getPageKeyboardMarkup(page, len));
  }
  else if (data.indexOf("custom_daliy") === 0) {
    if (lang == 'Zh') {
      mensaje.text = "需要设置哪一餐呢？ 🥣";
    }
    else {
      mensaje.text = "Which meal do you want to set? 🍽";
    }
    mensaje.reply_markup = JSON.stringify(getInlineKeyboardMarkup(settings, 'meal'));
  }
  else if (data.indexOf("breakfast") === 0 || data.indexOf("lunch") === 0 || data.indexOf("dinner") === 0) {
    if (lang == 'Zh') {
      mensaje.text = "需要设置随机菜品的种类还是数量呢？ 👀"
    }
    else {
      mensaje.text = "Choose to set random type(s) or the total number of dishes."
    }
    mensaje.reply_markup = JSON.stringify(getInlineKeyboardMarkup(settings, data));
  }
  else if (data.indexOf("type") === 0) {
    var types = menu_sheet.getRange(1, 2, len, menu_sheet.getLastColumn() - 1).getValues().flat();
    types = [...new Set(types)].sort().slice(1);
    if (lang == 'Zh') {
      mensaje.text = "可设置种类: ";
    }
    else {
      mensaje.text = "Available types: ";
    }
    mensaje.text += types.join(',');
    mensaje.reply_markup = JSON.stringify(getInlineKeyboardMarkup(settings, 'back'));
  }
  else if (data.indexOf("number") === 0) {
    var meal = data.trim().split(' ');
    var md = {'breakfast': '早餐', 'lunch': '午餐', 'dinner': '晚餐'};
    if (meal.length == 2) {
      if (lang == 'Zh') {
        mensaje.text = "设置" + md[meal[1]] + "随机菜品的数量 🎲";
      }
      else {
        mensaje.text = "Set the total number of dishes to random for " + meal + " 🎲";
      }
      mensaje.reply_markup = JSON.stringify(getInlineKeyboardMarkup(settings, data));
    }
    else {
      var cell = settings.getRange(eval(meal[1] + '_num_pos'));
      cell.setValue(meal[2]);
      if (lang == 'Zh') {
        mensaje.text = md[meal[1]] + "随机菜品数量已设置为 " + meal[2] + " 🎉";
      }
      else {
        mensaje.text = "The total number of dishes to random for " + meal[1] + " is successfully set to " + meal[2] + " 🎉";
      }
      mensaje.reply_markup = JSON.stringify(getInlineKeyboardMarkup(settings, 'back'));
    }
  }
  return mensaje;
}

function TextProcess(file, text, mensaje) {
  var menu_sheet = file.getSheetByName('menu');
  var settings = file.getSheetByName('settings');
  var lang = settings.getRange(lang_pos).getValue();
  var len = menu_sheet.getLastRow();
  var paras = text.trim().split(/\s+/);
  var msg = "";
  if (text.indexOf('/random') === 0) {
    var cnt = 1;
    var type = [];
    if (paras.length > 1)
    {
      if (paras.length == 3)
      {
        if (paras[1][0] == '?') {
          type = paras[1].slice(1).split(',');
          cnt = paras[2];
        }
        else {
          cnt = paras[1];
          type = paras[2].slice(1).split(',');
        }
      }
      else {
        if (paras[1][0] == '?') {
          type = paras[1].slice(1).split(',');
        }
        else cnt = paras[1];
      }
      var food_list = [], rows = [];
      if (type.length) {
        for (var i = 0; i < type.length; i++)
        {
          var res = menu_sheet.createTextFinder(type[i]).findAll();
          for (var j = 0; j < res.length; j++) {
            rows.push(res[j].getRow());
          }
        }
        rows = [...new Set(rows)].sort();
        for (var i = 0; i < rows.length; i ++) {
          food_list.push(menu_sheet.getRange(rows[i], 1).getValue());
        }
      }
      else {
        food_list = menu_sheet.getRange(1, 1, len).getValues();
      }
      var cur_len = food_list.length;
      if (cnt > cur_len) {
        if (lang == 'Zh') msg = "想什么啦！根本没那么多这些种类的菜！"
        else msg = "There aren't so many dishes with this type on the menu! :(";
      }
      else if (cnt == 1)
      {
        var random = randomInteger(0, cur_len - 1);
        if (lang == 'Zh') msg = "尝尝 " + food_list[random] + " 怎么样？";
        else msg = "How about " + food_list[random] + " ?";
      }
      else if (cnt <= 15) {
        var chosen = getUniqueRandoms(0, cur_len - 1, cnt);
        if (lang == 'Zh') var msg = "看看这些怎么样🐥：\n";
        else var msg = "How about these🐥: \n";
        for (var j = 0; j < chosen.length; j++) msg += food_list[chosen[j]] + '\n';
      }
      else {
        var chosen = getUniqueRandoms(0, cur_len - 1, 15);
        if (lang == 'Zh') var msg = "看看这些怎么样🐥：\n";
        else var msg = "How about these🐥: \n";
        for (var j = 0; j < chosen.length; j++) msg += food_list[chosen[j]] + '\n';
        if (lang == 'Zh') msg += "......\n你真的吃得完这么多么？👀"
        else msg += "......\nI don't believe you can eat all of these.👀"
      }
    }
    else{
      if (len == 0) {
        if (lang == 'Zh') msg = "什么都没有怎么随机啦！>_<";
        else msg = "There is nothing on the menu. >_<"
      }
      else
      {
        var random = randomInteger(1, len);
        if (lang == 'Zh') msg = "尝尝 " + menu_sheet.getRange(random, 1).getValue() + " 怎么样？\n\n还可以一次指定种类随机多个菜品嗷 => /random[@random_eat_bot] [随机数量，默认为1] [?<类型1[,类型2...]>，默认随机全部]";
        else msg = "How about " + menu_sheet.getRange(random, 1).getValue() + " ?\n\nYou can also random two or more specified dishes at one time => /random[@random_eat_bot] [number=1] [?type1[,type2]...]";
      }
    }
  }
  else if (text.indexOf('/list') === 0) {     
    if (len == 0) {
      if (lang == 'Zh') msg = "现在没有什么想法诶…(ŏωŏ)";
      else msg = "There is nothing on the menu :("
    }
    else if (len == 1) {
      if (lang == 'Zh') msg = "只能吃" + menu_sheet.getRange('A1').getValue() + "了 (╥ω╥)";
      else msg = "You can only eat " + menu_sheet.getRange('A1').getValue() + " (╥ω╥)";
    }
    else if (len <= 5) {
      var menu = menu_sheet.getRange(1, 1, len).getValues();
      if (lang == 'Zh') msg = "当前菜单较为简陋，只剩下" + menu[0][0];
      else msg = "There aren't so many dishes. Only " + menu[0][0];
      for (var i = 1; i < len - 1; i++) {
        if (lang == 'Zh') msg += "、" + menu[i][0];
        else msg += ", " + menu[i][0];
      }
      if (lang == 'Zh') msg += "和" + menu[len - 1][0] + "了 :(";
      else msg += "and " + menu[len - 1][0] + " :(";
    }
    else if (len <= 10) {
      var menu = menu_sheet.getRange(1, 1, len).getValues();
      if (lang == 'Zh') msg = "这就是全部的菜了(ΦˋωˊΦ)：\n" + menu[0][0];
      else msg = "This is all(ΦˋωˊΦ):\n" + menu[0][0];
      for (var i = 1; i < len; i++) {
        msg += '\n' + menu[i][0];
      }
    }
    else {
      var menu = menu_sheet.getRange(1, 1, 10).getValues();
      if (lang == 'Zh') msg = "还有好多吃的呢~！\\(ΦωΦ ≡ ΦωΦ)/ 你看你看：\n";
      else msg = "There are so many dishes!\\(ΦωΦ ≡ ΦωΦ)/ Have a look:\n";
      for (var i = 0; i < 10; i++) {
        msg += menu[i][0] + '\n';
      }
      mensaje.reply_markup = JSON.stringify(getPageKeyboardMarkup(1, len));
    }
  }
  else if (text.indexOf('/query') === 0) {
    if (paras[1]) {
      for (var i = 1; i < paras.length; i++) {
        var cur = menu_sheet.createTextFinder(paras[i]).findNext();
        if (cur) {
          var types = menu_sheet.getRange(cur.getRow(), 2, 1, menu_sheet.getLastColumn() - 1).getValues()[0].filter(function(val) {return val.length > 0;});
          if(types.length) msg += paras[i] + " " + types.join(',') + '\n';
          else msg += paras[i] + '\n';
        }
        else {
          if (lang == 'Zh') msg += "未查询到 " + paras[i] + " 🤧\n";
          else msg += paras[i] + " not found 🤧\n";
        }
      }
    }
    else {
      if (lang == 'Zh') msg = "需要查询啥咕？😳\n\n请用我能看懂的格式查询：/query[@random_eat_bot] <吃的1> [吃的2...]";
      else msg = "What do you want to search?\n\nI can only understand messages in this format: /query[@random_eat_bot] <eatable1> [eatable2...]";
    }
  }
  else if (text.indexOf('/update') === 0) {
    if (paras[1])
    {
      var cnt = 0;
      for (var i = 1; i < paras.length; i++) {
        eobj = paras[i].split(',');
        var cur = menu_sheet.createTextFinder(eobj[0]).findNext();
        if (cur) {
          menu_sheet.deleteRow(cur.getRow());
          menu_sheet.appendRow(eobj);
          if (lang == 'Zh') msg += eobj[0] + " 已更新~🐣\n"
          else msg += eobj[0] + " updated~🐣\n"
        }
        else {
          menu_sheet.appendRow(eobj);
          cnt += 1;
        }
      }
      if (cnt > 0) {
        if (lang == 'Zh') msg += "添加成功！菜单已更新咕！🥳";
        else msg += "Menu updated!🥳";
      }
    }
    else {
      if (lang == 'Zh') msg = "咕？所以要提议吃啥呀？🤨\n\n我能看懂的提议格式 ΦωΦ：/update[@random_eat_bot] <吃的1[,类型1[,类型2...]]> [<吃的2[,类型3[,类型4...]]>...]\n\n🌰：/update 香蕉,水果 烤鸡";
      else msg = "What do you want to recommend?\n\nI can only understand messages in this format: /update[@random_eat_bot] <eatable1[,type1[,type2...]]> [<eatable2[,type3[,type4...]]>...]\n\ne.g. /update banana,fruit roast-chicken";
    }
  }
  else if (text.indexOf('/delete') === 0) {
    if (paras[1])
    {
      var cnt = 0;
      for (var i = 1; i < paras.length; i++) {
        var cell = menu_sheet.createTextFinder(paras[i]).findNext();
        if (cell) {
          menu_sheet.deleteRow(cell.getRow());
          cnt += 1;
        }
        else {
          if (lang == 'Zh') msg += paras[i] + " 不在菜单中哦~🤪\n"
          else msg += paras[i] + " is not on the menu~🤪\n"
        }
      }
      if (cnt > 0) {
        if (lang == 'Zh') msg += "删除成功！不能吃的东西减少了~🥳";
        else msg += "Delete success!"
      }
    }
    else {
      if (lang == 'Zh') msg = "什么都没删掉( ´ΦДΦ｀)！\n\n我能看懂的删除方法 ΦωΦ：/delete[@random_eat_bot] <不能吃的1> [<不能吃的2>...]";
      else msg = "Delete failed( ´ΦДΦ｀)!\n\nI can only understand messages in this format: /delete[@random_eat_bot] <uneatable1> [<uneatable2>...]";
    }
  }
  else if (text.indexOf('/settings') === 0) {
    if (lang == 'Zh') msg = "设置当前会话的 Chickeat 🐣";
    else msg = "Customize Chickeat in this chat 🐣";
    mensaje.reply_markup = JSON.stringify(getInlineKeyboardMarkup(settings, 'default'));
  }
  else{
      msg = text;
  }
  mensaje.text = msg;
  return mensaje;
}
