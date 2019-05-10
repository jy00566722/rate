//取得各国的汇率  放入storage
function get_rate() {
  console.log("执行获取汇率:");
  let url = 'http://q.deey.top:5306/custom-interface/call/Get_rate_redis?a=chrome&v=1.8.0.0';
  axios.get(url).then(function (result) {
    //console.log("从汇率接口返回的数据为:");
    //console.log(result.data);
    let data = result.data.map(x => JSON.parse(x));
    let d = {};
    data.map(x => {
      d[`rate_${x.tcur}`] = x.rate;
    })
    d['rate_CNY'] = '1';  //添加人民币汇率
    chrome.storage.local.set({ "my_rate": d }, function (s) {
      console.log("从接口获取的汇率数组已经保存在my_rate中,可以使用了.");
    });

    //加入57国汇率，整理好后给自由换算用
    console.log('解析后的数据为:');
    console.log(data);
    let z=[];
    data.map(x=>{
      let a = {};
      a.name = x.ratenm.slice(4)+'/'+x.tcur;
      a.value = x.rate;
      z.push(a);
    });
    z.unshift({name:'人民币/CNY',value:1});
    console.log('整理后的数据为:');
    console.log(z);
    chrome.storage.local.set({ "my_rate_z": z }, function (s) {
      console.log("从接口获取的汇率数组已经保存在my_rate_z中,可以使用了.");
    });


  }).catch(function (err) {
    console.log(err);
  });
}

//初始化人币币中间值
function init_CNY() {
  chrome.storage.local.set({ "my_CNY": 100 }, function (s) {
    console.log("初始化人民币中间值为100.");
  });
}

//向激活的窗口，发送消息，弹出主界面
function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response);
    });
  });
}

get_rate();//初始化汇率
init_CNY();//初始化人民币中间值
//定时获取汇率，更新--每小时获取一次
let se = setInterval(get_rate, 300000);










