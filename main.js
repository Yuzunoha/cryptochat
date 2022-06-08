// global start
var message = document.getElementById('message');
if (typeof web3 === 'undefined') {
  // メタマスクがない
  message.innerHTML += '<font color="red">Please install metamask</font><br>';
} else {
  // メタマスクがある
  web3.eth.getAccounts((err, accs) => {
    if (0 === accs.length) {
      message.innerHTML += '<font color="red">Please login to your MetaMask!</font><br>';
    }
    if ('3' !== web3.currentProvider.publicConfigStore._state.networkVersion) {
      message.innerHTML += '<font color="red">Please connect the Ropsten Test Network.</font><br>';
    }
  });
}
// コントラクト
var contract = web3.eth.contract(JSON.parse(ABI)).at(CONTRACT_ADDR);
//イベント監視
contract.Write().watch(function (error, result) {
  // イベントキャッチのタイミングで自動更新
  update();
});

// global end
// 更新(F5)
new Promise((resolve) => {
  window.web3.eth.getAccounts((err, accounts) => {
    resolve(accounts);
  });
}).then((accounts) => {
  update();
});

function update() {
  var s = '';
  var promises = [];
  var len;
  new Promise((resolve) => {
    contract.getPostsLength((e, r) => {
      len = r.toNumber();
      resolve(len);
    });
  }).then((len) => {
    const getPromise = (i, attr) => {
      return new Promise((resolve) => {
        switch (attr) {
          case 'text':
            contract.getText(i, (e, r) => {
              var key = 'text' + i;
              var value = r;
              resolve({
                [key]: value,
              });
            });
            break;
          case 'addr':
            contract.getAddr(i, (e, r) => {
              var key = 'addr' + i;
              var value = r;
              resolve({
                [key]: value,
              });
            });
            break;
          case 'time':
            contract.getTime(i, (e, r) => {
              var key = 'time' + i;
              var value = r.toString();
              resolve({
                [key]: value,
              });
            });
            break;
        }
      });
    };
    for (var i = 0; i < len; i++) {
      promises.push(getPromise(i, 'text'));
      promises.push(getPromise(i, 'addr'));
      promises.push(getPromise(i, 'time'));
    }
    Promise.all(promises).then((results) => {
      var posts = [];
      for (var result of results) {
        for (var key of Object.keys(result)) {
          var value = result[key];
          posts[key] = value;
        }
      }
      for (var i = 0; i < len; i++) {
        s += '<tr>';
        s += '<td>';
        s += i;
        s += '</td>';
        s += '<td>';
        s += posts['text' + i];
        s += '</td>';
        s += '<td>';
        s += posts['addr' + i];
        s += '</td>';
        s += '<td>';
        s += unixTime2ymd(posts['time' + i]);
        s += '</td>';
        s += '<td>';
        s += posts['time' + i];
        s += '</td>';
        s += '</tr>';
      }
      var tbody = document.getElementById('tbody');
      tbody.innerHTML = s;
    });
  });
}

function set() {
  var value_set = document.getElementById('value_set').value;
  // ガード
  if (value_set === '') {
    alert('何か書いて');
    return;
  }
  // 書き込み
  contract.set(value_set, function (err, value) {
    // console.log();
  });
}

function unixTime2ymd(intTime) {
  // var d = new Date( intTime );
  var d = new Date(intTime * 1000);
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var hour = ('0' + d.getHours()).slice(-2);
  var min = ('0' + d.getMinutes()).slice(-2);
  var sec = ('0' + d.getSeconds()).slice(-2);

  return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
}
