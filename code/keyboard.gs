function getPageKeyboardMarkup(page, len) {
  page = parseInt(page);
  var total = Math.ceil(len / 10);
  if (page > 1) var prev = page - 1;
  else var prev = total;
  if (page * 10 < len) var nxt = page + 1;
  else var nxt = 1;
  var pk = {
    "inline_keyboard": [
      [
        {text: "<<", callback_data: "page " + prev.toString()},
        {text: page.toString() + ' / ' + total.toString(), callback_data: "page " + page.toString()},
        {text: ">>", callback_data: "page " + nxt.toString()}
      ]
    ]
  };
  return pk;
}

function getInlineKeyboardMarkup(settings, type) {
  var daliy = settings.getRange(daliy_pos).getValue();
  var lang = settings.getRange(lang_pos).getValue();
  if (type == 'meal') {
    if (lang == 'Zh') var meal = ['早餐', '午餐', '晚餐'];
    else var meal = ['Breakfast', 'Lunch', 'Dinner'];
    return {
      "inline_keyboard": [
        [
          {
            text: meal[0],
            callback_data: 'breakfast'
          },
          {
            text: meal[1],
            callback_data: 'lunch'
          },
          {
            text: meal[2],
            callback_data: 'dinner'
          }
        ]
      ]
    };
  }
  else if (type == 'breakfast' || type == 'lunch' || type == 'dinner') {
    if (lang == 'Zh') var keys = ['种类', '数量'];
    else var keys = ['type(s)', 'number'];
    return {
      "inline_keyboard": [
        [
          {
            text: keys[0],
            callback_data: 'type ' + type
          },
          {
            text: keys[1],
            callback_data: 'number ' + type
          }
        ]
      ]
    }
  }
  else if (type.indexOf('number') === 0) {
    var keys = [];
    for (var i = 1; i <= 10; i++) {
      keys.push({
        text: i.toString(),
        callback_data: type + ' ' + i.toString()
      });
    }
    return {
      "inline_keyboard": [keys.slice(0, 5), keys.slice(5, 10)]
    }
  }
  else if (type.indexOf('back') === 0) {
    var key = '<< Back to settings';
    if (lang == 'Zh') key = '<< 返回设置';
    return {
      "inline_keyboard": [
        [
          {
            text: key,
            callback_data: '/settings'
          }
        ]
      ]
    }
  }
  else {
    if (lang == 'Zh') {
      var key = "关闭每日推荐";
      lang = 'En';
      var set_daliy = "每日推荐自定义 >>";
    }
    else {
      var key = 'Close everyday recommendation';
      lang = '简体中文';
      var set_daliy = "Custom everyday recommendation >>";
    }
    if (daliy.toString() == '0') {
      if (lang == 'Zh') key = "开启每日推荐";
      else key = 'Open everyday recommendation';
    }
    return {
      "inline_keyboard": [
        [
          {
            text: key,
            callback_data: "daliy"
          },
          {
            text: lang,
            callback_data: "language"
          }
        ],
        [
          {
            text: set_daliy,
            callback_data: "custom_daliy"
          }
        ]
      ]
    };
  }
}