// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A generic onclick callback function.

//关闭右键
/*
function genericOnClick(info, tab) {
  //console.log("item " + info.menuItemId + " was clicked");
  //console.log("info: " + JSON.stringify(info));
  //console.log("tab: " + JSON.stringify(tab));
  //alert("点击了右键菜单");
  sendMessageToContentScript({cmd:'showDiv', value:'Yes'}, function(response)
{
    //console.log('来自content的回复：'+response);
});
}

// Create one test item for each context type.
var contexts = ["page","selection","link","editable","image","video",
                "audio"];
for (var i = 0; i < contexts.length; i++) {
  if (i!=0){
    //console.log(i);
    continue;
  }else{
    //console.log(i);
    
  };
  var context = contexts[i];
  var title =  "货币换算";//"Test '" + context + "' menu item";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                       "onclick": genericOnClick});
  //console.log("'" + context + "' item:" + id);
}
//
*/

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

//监听stroge的值变化
/*
chrome.storage.onChanged.addListener(function(changs,namespace){
 // console.log('storage变化了:');
 // console.log(changs);
 // console.log(namespace);

  //通知右键菜单
  sendMessageToContentScript({cmd:'get_value', value:'Yes'}, function(response)
  {
      console.log('来自content的回复：'+response);
  });
});
*/

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
    formData.append('tel', '1821567969');
    formData.append('psw', '111111');
    xhr.open('GET', ' http://q.deey.top:5306/custom-interface/call/Get_rate');
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


