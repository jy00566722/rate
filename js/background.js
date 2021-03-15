//取得各国的汇率  放入storage
let google_2 = [{"name":"美元","abbreviation":"USD","symbol":"$","flagURL":"assets/countries/united-states.svg"},
  {"name":"欧元","abbreviation":"EUR","symbol":"€","flagURL":"assets/countries/european-union.svg"},
  {"name":"日圆","abbreviation":"JPY","symbol":"¥","flagURL":"assets/countries/japan.svg"},
  {"name":"英镑","abbreviation":"GBP","symbol":"£","flagURL":"assets/countries/united-kingdom.svg"},
  {"name":"澳大利亚元","abbreviation":"AUD","symbol":"$","flagURL":"assets/countries/australia.svg"},
  {"name":"加拿大元","abbreviation":"CAD","symbol":"$","flagURL":"assets/countries/canada.svg"},
  {"name":"瑞士法郎","abbreviation":"CHF","symbol":"₣","flagURL":"assets/countries/switzerland.svg"},
  {"name":"人民币","abbreviation":"CNY","symbol":"¥","flagURL":"assets/countries/china.svg"},
  {"name":"瑞典克朗","abbreviation":"SEK","symbol":"kr","flagURL":"assets/countries/sweden.svg"},
  {"name":"新西兰元","abbreviation":"NZD","symbol":"$","flagURL":"assets/countries/new-zealand.svg"},
  {"name":"墨西哥比索","abbreviation":"MXN","symbol":"$","flagURL":"assets/countries/mexico.svg"},
  {"name":"新加坡元","abbreviation":"SGD","symbol":"$","flagURL":"assets/countries/singapore.svg"},
  {"name":"港元","abbreviation":"HKD","symbol":"$","flagURL":"assets/countries/hong-kong.svg"},
  {"name":"挪威克朗","abbreviation":"NOK","symbol":"kr","flagURL":"assets/countries/norway.svg"},
  {"name":"韩元","abbreviation":"KRW","symbol":"₩","flagURL":"assets/countries/south-korea.svg"},
  {"name":"土耳其里拉","abbreviation":"TRY","symbol":"₺","flagURL":"assets/countries/turkey.svg"},
  {"name":"俄罗斯卢布","abbreviation":"RUB","symbol":"₽","flagURL":"assets/countries/russia.svg"},
  {"name":"印度卢比","abbreviation":"INR","symbol":"₹","flagURL":"assets/countries/india.svg"},
  {"name":"巴西雷亚尔","abbreviation":"BRL","symbol":"R$","flagURL":"assets/countries/brazil.svg"},
  {"name":"南非兰特","abbreviation":"ZAR","symbol":"R","flagURL":"assets/countries/south-africa.svg"},
  {"name":"菲律宾比索","abbreviation":"PHP","symbol":"₱","flagURL":"assets/countries/philippines.svg"},
  {"name":"捷克克朗","abbreviation":"CZK","symbol":"Kč","flagURL":"assets/countries/czech-republic.svg"},
  {"name":"印尼盾","abbreviation":"IDR","symbol":"Rp","flagURL":"assets/countries/indonesia.svg"},
  {"name":"马来西亚林吉特","abbreviation":"MYR","symbol":"RM","flagURL":"assets/countries/malaysia.svg"},
  {"name":"匈牙利福林","abbreviation":"HUF","symbol":"Ft","flagURL":"assets/countries/hungary.svg"},
  {"name":"冰岛克朗","abbreviation":"ISK","symbol":"kr","flagURL":"assets/countries/iceland.svg"},
  {"name":"克罗地亚库纳","abbreviation":"HRK","symbol":"kn","flagURL":"assets/countries/croatia.svg"},
  {"name":"保加利亚列弗","abbreviation":"BGN","symbol":"лв","flagURL":"assets/countries/bulgaria.svg"},
  {"name":"罗马尼亚列伊","abbreviation":"RON","symbol":"lei","flagURL":"assets/countries/romania.svg"},
  {"name":"丹麦克朗","abbreviation":"DKK","symbol":"kr","flagURL":"assets/countries/denmark.svg"},
  {"name":"泰铢","abbreviation":"THB","symbol":"฿","flagURL":"assets/countries/thailand.svg"},
  {"name":"波兰兹罗提","abbreviation":"PLN","symbol":"zł","flagURL":"assets/countries/poland.svg"},
  {"name":"以色列新谢克尔","abbreviation":"ILS","symbol":"₪","flagURL":"assets/countries/israel.svg"},
  {"name":"阿联酋迪拉姆","abbreviation":"AED","symbol":"د.إ,","flagURL":"assets/countries/united-arab-emirates.svg"},
  {"name":"阿根廷比索","abbreviation":"ARS","symbol":"$","flagURL":"assets/countries/argentina.svg"},
  {"name":"巴哈马元","abbreviation":"BSD","symbol":"$","flagURL":"assets/countries/bahamas.svg"},
  {"name":"智利比索","abbreviation":"CLP","symbol":"$","flagURL":"assets/countries/chile.svg"},
  {"name":"哥伦比亚比索","abbreviation":"COP","symbol":"$","flagURL":"assets/countries/colombia.svg"},
  {"name":"多米尼加比索","abbreviation":"DOP","symbol":"$","flagURL":"assets/countries/dominican-republic.svg"},
  {"name":"埃及镑","abbreviation":"EGP","symbol":"£","flagURL":"assets/countries/egypt.svg"},
  {"name":"斐济元","abbreviation":"FJD","symbol":"$","flagURL":"assets/countries/fiji.svg"},
  {"name":"危地马拉格查尔","abbreviation":"GTQ","symbol":"Q","flagURL":"assets/countries/guatemala.svg"},
  {"name":"哈萨克斯坦坚戈","abbreviation":"KZT","symbol":"₸","flagURL":"assets/countries/kazakhstan.svg"},
  {"name":"巴拿马巴波亚","abbreviation":"PAB","symbol":"B/.","flagURL":"assets/countries/panama.svg"},
  {"name":"秘鲁新索尔","abbreviation":"PEN","symbol":"S/.","flagURL":"assets/countries/peru.svg"},
  {"name":"巴基斯坦卢比","abbreviation":"PKR","symbol":"Rs","flagURL":"assets/countries/pakistan.svg"},
  {"name":"巴拉圭瓜拉尼","abbreviation":"PYG","symbol":"Gs","flagURL":"assets/countries/paraguay.svg"},
  {"name":"沙特里亚尔","abbreviation":"SAR","symbol":"﷼","flagURL":"assets/countries/saudi-arabia.svg"},
  {"name":"新台币","abbreviation":"TWD","symbol":"T$","flagURL":"assets/countries/taiwan.svg"},
  {"name":"乌克兰格里夫纳","abbreviation":"UAH","symbol":"₴","flagURL":"assets/countries/ukraine.svg"},
  {"name":"乌拉圭比索","abbreviation":"UYU","symbol":"$U","flagURL":"assets/countries/uruguay.svg"},
  {"name":"越南盾","abbreviation":"VND","symbol":"Đ","flagURL":"assets/countries/vietnam.svg"}]

async function get_rate() {
  console.log("执行获取汇率:");
  //const u = await getU();
  let url = `https://rate.lizudi.top/custom-interface/call/Get_rate_redis`;
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
    z.sort(function (item1, item2) {
      return item1['name'].localeCompare(item2['name'], 'zh-CN');
    })
    z.unshift({name:'人民币/CNY',value:'1',tcur:'CNY'});
    console.log('整理后的数据为:');
    console.log(z);
    //加入货币符号与图标，整理名称
    let zz = {};
    data.forEach(el=>{
      
      google_2.forEach(bl=>{
        if(bl.abbreviation === el.tcur){
          el.symbol = bl.symbol
          el.flagURL = bl.flagURL
          el.name = el.tcur + ' - ' +el.ratenm.slice(4)
          zz[String(el.tcur)] = el
        }else{
          el.name = el.tcur + ' - ' +el.ratenm.slice(4)
          zz[String(el.tcur)] = el
        }
      })
    })
    zz['CNY']={status:'ALREADY',rate:'1',scur:'CNY',tcur:'CNY',name:'CNY - 人民币',symbol:'￥',flagURL:'assets/countries/china.svg'}
    console.log('加入货币符号及图标后的数据:')
    console.log(zz)


    //初始化货币国家
    //let countries = ['CNY','USD','PHP','TWD','MYR','VND']
/*     chrome.storage.local.set({ "my_rate_zz_countries": countries }, function (s) {  
      console.log("货币列表国家加入货币符号及图标后已经保存在my_rate_zz_countries中...");
    }); */
    chrome.storage.local.set({ "my_rate_zz": zz }, function (s) {  
      console.log("加入货币符号及图标后已经保存在my_rate_zz中...");
    });
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

chrome.runtime.onInstalled.addListener(function(e){
     //初始化货币国家
    let countries = ['CNY','USD','PHP','TWD','MYR','VND']
      chrome.storage.local.set({ "my_rate_zz_countries": countries }, function (s) {  
      console.log("初始化::货币列表在my_rate_zz_countries中...");
    }); 
    //初始化各站点标记
    let lazada_tag = true
    let shopee_tag = true
    let amazon_tag = true
    let aliexpress_tag = true
    let info_tag = true //是否显示拖动提示
    let shopee_nodes = [] //shopee在线节点
    chrome.storage.local.set({lazada_tag},function(){console.log('lazada_tag设置成功')})
    chrome.storage.local.set({shopee_tag},function(){console.log('shopee_tag设置成功')})
    chrome.storage.local.set({amazon_tag},function(){console.log('amazon_tag设置成功')})
    chrome.storage.local.set({aliexpress_tag},function(){console.log('aliexpress_tag设置成功')})
    chrome.storage.local.set({info_tag},function(){console.log('info_tag设置成功')})
    chrome.storage.local.set({shopee_nodes},function(){console.log('shopee_nodes设置成功')})
})

async function get_shopee_nodes(){
  let url = 'https://rate.lizudi.top/v1/shopee_nodes'
  axios.get(url).then(data=>{
    if(data.status===200 && data.data&& data.data.code === 20000){
      chrome.storage.local.set({'shopee_nodes':data.data.nodes},function(){console.log('在线获取shopee_nodes并设置设置成功..')})
    }
  }).catch(e=>{
    console.log('获取shopee_nodes发生错误:',e)
  })
}



get_rate();//初始化汇率
init_CNY();//初始化人民币中间值
get_shopee_nodes()
//定时获取汇率，更新--每小时获取一次
let se = setInterval(get_rate, 300000);
let sa = setInterval(get_shopee_nodes, 290000);










