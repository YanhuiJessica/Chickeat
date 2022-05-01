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

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getUniqueRandoms(min, max, cnt) {
  var res = [];
  if (max - min + 1 == cnt) {
    for (var i = min; i <= max; i++) res.push(i);
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
    for (var i = min; i <= max; i++)
      if (!tmp.includes(i)) res.push(i);
  }
  return res;
}

function escapeMarkDown(toEscapeMsg) {
  var escapedMsg = toEscapeMsg
  .replace(/_/g, "\\_")
  .replace(/\*/g, "\\*")
  .replace(/\[/g, "\\[")
  .replace(/`/g, "\\`");
  
  return escapedMsg;
}