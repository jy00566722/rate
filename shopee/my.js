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
}else if(URL.includes('br.xiapibuy.com') || URL.includes('shopee.com.br')){
    country = 'BRL' //巴西
}else if(URL.includes('mx.xiapibuy.com') || URL.includes('shopee.com.mx')){
    country = 'MXN' //墨西哥
}else if(URL.includes('co.xiapibuy.com') || URL.includes('shopee.com.co')){
    country = 'COP' //哥伦比亚
}else if(URL.includes('cl.xiapibuy.com') || URL.includes('shopee.cl')){
    country = 'CLP' //智利
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

function get_shopee_nodes(){
    return new Promise((resolve, reject)=>{
        chrome.storage.local.get(['shopee_nodes'],result=>{
            resolve(result.shopee_nodes)
        })
    })
}
let shopee_nodes = []
let feedback_list_last_s = ''
let feedback_flag = 1 //上报反馈开关
const all= async function(){
    //console.log('总回调启动...');
    chrome.storage.local.get(["my_rate",'shopee_nodes','feedback_flag'],async function(result){
         rate = result.my_rate[`rate_${country}`];
         shopee_nodes = result.shopee_nodes
         find_node(shopee_nodes);

        //推荐页特别处理，单价在文本节点中 从首页中大类图标点进来的页面
        if(document.querySelectorAll('div[class="collection-card__price"]')[0]){
            Gw();
        }
    })
}


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

//找出元素
function find_node(node_all) {
    let feedback_list = []
    for (let node of node_all) {
        let a = document.querySelectorAll(`${node[0]}[class="${node[1]}"]`)
        if(feedback_flag){
            let n = a.length
            feedback_list.push([`feedback-shopee-${node[0]}-${node[1]}`,n])
        }
        if (a[0]) {
            insetHtml(a);
        }
    }
    if(feedback_flag){
        post_element_isok(feedback_list)
    }

}

//替换innerHTML函数
const insetHtml=function(a){
    //let a = document.querySelectorAll(`${node[0]}[class="${node[1]}"]`);
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
    if(country === 'CLP'|| country === 'COP'){
        let r1 = /^[^0-9]*/i;
        let r2= /,/g;
        let r3 = /\./g
        let s1 = s.replace(r1,'')
        let s2 = s1.replace(r3,'')
        let b = parseFloat(s2)
        let rmb = (b/rate).toFixed(1)
        return rmb
    }else if(country === 'BRL'){
        let r1 = /^[^0-9]*/i;
        let r2= /,/g;
        let r3 = /\./g
        let s1 = s.replace(r1,'')
        let s2 = s1.replace(r3,'')
        let s3 = s2.replace(r2,'.')
        let b = parseFloat(s3)
        let rmb = (b/rate).toFixed(1)
        return rmb
    }else{
        let r1 = /^[^0-9]*/i;
        let r2= /,/g;
        let a = s.trim().replace(r1,'').replace(r2,'');
        if(country==='VND' || country ==='IDR'){
            a = a.replace(/\./g,'');
        }
        let b = parseFloat(a);
        let rmb  = (b/rate).toFixed(1);
        return rmb;
    }
}

//详情下面的价格换行
warpFlex = function (className) {
    var sStyle = [
        `.${className} {display:grid;}`
    ].join('');
    var eStyle = document.createElement('style');
    eStyle.id = 'tipsStyle';
    eStyle.innerHTML = sStyle;
    document.getElementsByTagName('head')[0].appendChild(eStyle);

}
//上报元素节点是否有用
const post_element_isok = async function(list){
    let s = list.reduce((a,b)=>{
        let l = String(a[1]) + '-' +String(b[1])
        return [0,l]
    })    
    if(s[1]  === feedback_list_last_s){
        return
    }
    let url = 'https://rate.lizudi.top/v1/element_feedback'
    const a = await fetch(url,{
        method:'POST',
        mode: 'cors',
        headers: {
        　　　　'Content-Type': 'application/json'
        　　},
        body:JSON.stringify({list})
    })
    const b = await a.text()
    if(b === 'ok'){
      
        feedback_list_last_s = s[1]
      
    }else{
        console.log('出错了?')
    }
}
