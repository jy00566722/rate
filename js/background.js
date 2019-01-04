
//取得各国的汇率  放入storage
function get_rate(){
  console.log("执行获取汇率:");
  let url = 'http://q.deey.top:5306/custom-interface/call/Get_rate_redis';
  axios.get(url).then(function(result){
    console.log("从汇率接口返回的数据为:");
    console.log(result.data);
    let data = result.data.map(x=>JSON.parse(x));
    let d = {};
    data.map(x=>{
      d[`rate_${x.tcur}`] = x.rate;
    })
    d['rate_CNY']='1';  //添加人民币汇率
    //d['rate_USD']='0.1455'; //暂时临时添加美元固定汇率 后续改为实时获取
    chrome.storage.local.set({"my_rate":d},function(s){
      console.log("从接口获取的汇率数组已经保存在my_rate中,可以使用了.");
    });
  }).catch(function(err){
    console.log(err);
  });
}

//初始化人币币中间值
function init_CNY(){
  chrome.storage.local.set({"my_CNY":100},function(s){
      console.log("初始化人民币中间值为100.");
  });
}

//向激活的窗口，发送消息，弹出主界面
function sendMessageToContentScript(message, callback)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response)
        {
            if(callback) callback(response);
        });
    });
}

get_rate();//初始化汇率
init_CNY();//初始化人民币中间值
//定时获取汇率，更新--每小时获取一次
let se = setInterval(get_rate,300000);


//测试原生ajax
function testAjax(){
  console.log("Ajax test");
    var xhr = new XMLHttpRequest();
    xhr.timeout = 3000;
    xhr.ontimeout = function (event) {
        console.log("请求超时！");
    }
    var formData = new FormData();
    formData.append('tel', '187969');
    formData.append('psw', '111111');
    xhr.open('GET', 'http:/');
    xhr.send(formData);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr);
        }
        else {
            console.log(xhr.statusText);
        }
    }
}


