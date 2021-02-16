console.log('shopee站页面价格转换插件启动中...');

//确定国家
let URL = document.URL;
//console.log(URL);
let country = '';

if(URL.includes('.my/') || URL.includes('my.xiapibuy.com')){
    country = 'MYR';
}else if(URL.includes('.ph/') ||URL.includes('ph.xiapibuy.com')){
    country = 'PHP';
}else if(URL.includes('.sg/') || URL.includes('sg.xiapibuy.com')){
    country = 'SGD';
}else if(URL.includes('.id/')|| URL.includes('id.xiapibuy.com')){
    country = 'IDR';
}else if(URL.includes('.tw/')){
    country = 'TWD';
}else if(URL.includes('.th/') || URL.includes('th.xiapibuy.com')){
    country = 'THB';
}else if(URL.includes('.vn/') || URL.includes('vn.xiapibuy.com')){
    country = 'VND';
}else if(URL.includes('xiapi.xiapibuy.com')|| URL.includes('xiapi.xiapibuy.cc')){
    country = 'TWD';
}

console.log(country);
let rate = 0;//当前国家的汇率
//====统一监听body的改变，触发总回调
let callback = function (records){
    //console.log('回调启动...');
    chrome.storage.local.get(['shopee_tag'],function(s){
        const {shopee_tag} = s
        if(shopee_tag){
            all();
        }else{
            console.log('shopee开关关闭')
        }
    })
};
let throttle_callback = _.throttle(callback,3000);

let mo = new MutationObserver(throttle_callback);

let option = {
  'childList': true,
  'subtree': true
};
let fs_node = document.getElementsByTagName("body")[0];
try{   
    mo.observe(fs_node, option);
}catch(e){

    console.log('监听器启动失败body."');
}

const all=function(){
    //console.log('总回调启动...');
    chrome.storage.local.get(["my_rate"],function(result){
        // rate = result.my_rate.rate_MYR;
         rate = result.my_rate[`rate_${country}`];
         //console.log(rate);
        //判断元素有无，及生成处理函数
        Sa9(node_all);
        //推荐页特别处理，单价在文本节点中 从首页中大类图标点进来的页面
        if(document.querySelectorAll('div[class="collection-card__price"]')[0]){
           //console.log('特别页处理')
            Gw();
        }
    })
}

//定义要监听的价格元素
let node_all = [
    ['span','item-price-number'], //首页秒杀 元素,calss name
    ['div','tyA3vN _3eZ5Vz _3RuPcU'],  
    ['div','_3n5NQx'],//详情页主价
    ['div','item-card-special__current-price item-card-special__current-price--special'],//详情页边上的价
    ['div','shopee-item-card__current-price shopee-item-card__current-price--free-shipping'],//详情页下面的价
    ['div','shopee-item-card__current-price'],//详情页下面的价
    ['div','_3r_Ddr'],
    ['span','_341bF0'],
    ['span','SlvYAy'],
    ['div','item-card-special__current-price item-card-special__current-price--special item-card-special__current-price--ofs'],
    ['span','_3g0idS _1OFcS5'],//iphone搜索页
    ['div','_2aoS3Y'],  //台湾首页团团转
    ['span','r3xOg7'] , //2019-12-25加
    ['span','_3HwhOc _341bF0'],
    ['span','djJP_7'], //2021-1-15
    ['span','_1xk7ak'], //2021-1-15
    ['span','_3zyVWg'], //2021-1-15
    ['div','AJyN7v'], //2021-2-16 详情页主价
    ['span','-pMUYd'] //2021-2-16 推荐页 topshop
];

const Gw = function(){
    let a = document.querySelectorAll('div[class="collection-card__price"]>span');
    for(i of a){
        if(!(i.parentNode.lastChild.tagName==='SUB')){
            let s=0;
            if(country==='VND' || country==='IDR'){
                s = parseFloat( i.nextSibling.data.replace(/^\D*/,'').replace(/\./g,''));
            }else{
                s = parseFloat( i.nextSibling.data.replace(/^\D*/,'').replace(/,/g,''));
            }
            let rmb = (s/rate).toFixed(2);
            //i.nextSibling.data = i.nextSibling.data+ `<sub style="color:green"> ￥${rmb}</sub>`;
            let me = document.createElement('sub');
                me.style.color = "green"; //overflow-x: hidden
                me.style.overflow = '',
                me.setAttribute("style","color:#18B4A3;overflow-x: visible");
                me.innerHTML = ` ￥${rmb}`;
                me.title = `￥${rmb}`;
                i.parentNode.appendChild(me);
        }else{
           // console.log(i.parentNode.lastChild.tagName);
        }
    }
}
//取出元素数组的元素处理
const Sa9 = function(node_all){
    for(let node of node_all){
            if(document.querySelectorAll(`${node[0]}[class="${node[1]}"]`)[0]){
                qs9(node);
          }
    }
}

//替换innerHTML函数
const qs9=function(node,classname){
    let a = document.querySelectorAll(`${node[0]}[class="${node[1]}"]`);
    let a_length = a.length;
    for(let i =0;i<a_length;i++){
        let s = a[i].innerHTML;
        if(s.includes('￥')){
            continue;
        }
        if(a[i].children.length>0){
            continue;
        }
        let rmb = priceRmb(s);
        a[i].innerHTML=s + `<sub style="color:green;" title="￥${rmb}"> ￥${rmb}</sub>`; //#18B4A3-青绿  #A71BB1-紫
    }
}

//计算人民币
const  priceRmb = function(s){
    let r1 = /^[^0-9]*/i;
    let r2= /,/g;
    let a = s.trim().replace(r1,'').replace(r2,'');
    if(country==='VND' || country ==='IDR'){
        a = a.replace(/\./g,'');
    }
    let b = parseFloat(a);
    let rmb  = (b/rate).toFixed(2);
    return rmb;
    
}
