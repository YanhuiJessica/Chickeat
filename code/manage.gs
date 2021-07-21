function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getUniqueRandoms(min, max, cnt) {
  var res = [];
  if (max - min + 1 == cnt) {
    res = Array.apply(null, Array(cnt)).map(function(_, i) {return i});
  }
  else if ((max - min + 1)/2 >= cnt) {
    while(res.length < cnt) {
      var random = randomInteger(min, max);
      if (!res.includes(random)) res.push(random);
    }
  }
  else {
    var tmp = [];
    while(tmp.length < max - min + 1 - cnt) {
      var random = randomInteger(min, max);
      if (!tmp.includes(random)) tmp.push(random);
    }
    for (var i = 0; i <= max; i++)
      if (!tmp.includes(i)) res.push(i);
  }
  return res;
}

function GetMD5Hash(input) {
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, input);
  var txtHash = '';

  for (j = 0; j <rawHash.length; j++) {
    var hashVal = rawHash[j];
    if (hashVal < 0)
      hashVal += 256; 
    if (hashVal.toString(16).length == 1)
      txtHash += "0";
    txtHash += hashVal.toString(16);
  }
  return txtHash;
}

function getFolder(){
  return DriveApp.getFolderById('1AVWGzwEFJTkup13-Dr9fBSdsgwdXH3q2');
}

function getFileList(folder) {
  var files = folder.getFiles();
  var filenames = [];
  while (files.hasNext()) {
    filenames.push(files.next().getName());
  }
  return filenames;
}

function getName(user) {
  var name = user.first_name;
  if (user.last_name) {
    name += " " + user.last_name;
  }
  return name;
}

function escapeMarkDown(toEscapeMsg) {
  var escapedMsg = toEscapeMsg
  .replace(/_/g, "\\_")
  .replace(/\*/g, "\\*")
  .replace(/\[/g, "\\[")
  .replace(/`/g, "\\`");
  
  return escapedMsg;
}

function getMarkDownUserUrl(userName, userId) {
  return "[" + userName + "](tg://user?id=" + userId + ")";
}

function getMentionName(user) {
  var mentionName = "";
 
  var name = getName(user);
  if (!name) {
    name = "叫不出名字的咕咕鸡";
  }
  mentionName = getMarkDownUserUrl(escapeMarkDown(name), user.id);

  return mentionName;
}

function splitFileContent(menu_string) {
  var menu = menu_string.split('\n'); menu.pop();
  var chat_id = menu.splice(0,1);
  return [chat_id, menu, menu.length];
}

function TextProcess(file, menu_string, text) {
  var contents = splitFileContent(menu_string);
  var menu = contents[1];
  var len = contents[2];
  var paras = text.trim().split(' ');
  var msg = "";
  if (text.indexOf('/random') === 0) {
    if (paras[1])
    {
      if (paras[1] == 1)
        msg = "尝尝 " + menu[randomInteger(0, len - 1)] + " 怎么样？";
      else if (paras[1] <= len && paras[1] <= 15) {
        var chosen = getUniqueRandoms(0, len - 1, paras[1]);
        var msg = "看看这些怎么样🐥：\n";
        for (var j = 0; j < chosen.length; j++) msg += menu[chosen[j]] + '\n';
      }
      else if (paras[1] <= len) {
        var chosen = getUniqueRandoms(0, len - 1, 15);
        var msg = "看看这些怎么样🐥：\n";
        for (var j = 0; j < chosen.length; j++) msg += menu[chosen[j]] + '\n';
        msg += "......\n你真的吃得完这么多么？👀"
      }
      else {
        msg = "想什么啦！😡菜单里根本没那么多菜！"
      }
    }
    else
      msg = "尝尝 " + menu[randomInteger(0, len - 1)] + " 怎么样？\n\n还可以一次随机多个菜品嗷 => /random[@random_eat_bot] [number=1]";
  }
  else if (text.indexOf('/list') === 0) {     
    if (len == 0) {
      msg = "现在没有什么想法诶…(ŏωŏ)";
    }
    else if (len == 1) {
      msg = "只能吃" + menu[0] + "了 (╥ω╥)";
    }
    else if (len <= 5) {
      msg = "当前菜单较为简陋，只剩下" + menu[0];
      for (var i = 1; i < len - 1; i++) {
        msg += "、" + menu[i];
      }
      msg += "和" + menu[len - 1] + "了 :(";
    }
    else if (len <= 10) {
      msg = "这就是全部的菜了(ΦˋωˊΦ)：\n" + menu[0];
      for (var i = 1; i < len; i++) {
        msg += '\n' + menu[i];
      }
    }
    else {
      msg = "还有好多吃的呢~！\\(ΦωΦ ≡ ΦωΦ)/ 你看你看：\n";
      for (var i = 0; i < 10; i++) {
        msg += menu[i] + '\n';
      }
      msg += '...';
    }
  }
  else if (text.indexOf('/add') === 0) {
    if (paras[1])
    {
      var cnt = 0;
      for (var i = 1; i < paras.length; i++) {
        if (menu.indexOf(paras[i]) != -1) {
          msg += paras[i] + " 已经在菜单中啦~🐣\n"
        }
        else {
          menu_string += paras[i] + '\n';
          cnt += 1;
        }
      }
      if (cnt > 0) {
        file.setContent(menu_string);
        msg += "添加成功！菜单已更新咕！🥳";
      }
    }
    else {
      msg = "咕？所以要提议吃啥呀？🤨\n\n我能看懂的提议格式 ΦωΦ：/add[@random_eat_bot] <eatable1> [<eatable2>...]";
    }
  }
  else if (text.indexOf('/delete') === 0) {
    if (paras[1])
    {
      var cnt = 0;
      for (var i = 1; i < paras.length; i++) {
        if (menu.indexOf(paras[i]) == -1) {
          msg += paras[i] + " 不在菜单中哦~🤪\n"
        }
        else {
          menu.splice(menu.indexOf(paras[i]), 1);
          cnt += 1;
        }
      }
      if (cnt > 0) {
        menu_string = menu.join('\n') + '\n';
        file.setContent(menu_string);
        msg += "删除成功！不能吃的东西减少了~🥳";
      }
    }
    else {
      msg = "什么都没删掉( ´ΦДΦ｀)！\n\n我能看懂的删除方法 ΦωΦ：/delete[@random_eat_bot] <uneatable1> [<uneatable2>...]";
    }
  }
  else{
      msg = text;
  }

  return msg;
}