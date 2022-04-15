console.log('Lazada页面价格转换插件启动中V2021-11-25 00:43...');

//确定国家
let URL = document.URL;
//console.log(URL);
let country = '';

if(URL.includes('com.my/') ){
    country = 'MYR';
}else if(URL.includes('com.ph/') ){
    country = 'PHP';
}else if(URL.includes('.sg/')){
    country = 'SGD';
}else if(URL.includes('co.id/')){
    country = 'IDR';
}else if(URL.includes('co.th/') ){
    country = 'THB';
}else if(URL.includes('.vn/') ){
    country = 'VND';
}
console.log('确定的国家为:'+country)
//总回调

let lazada_nodes = []
let lazada_main_price_nodes = []
let feedback_list_last_s = ''
let feedback_flag = 1 //上报反馈开关
const all = async function(){
    //console.log('总回调启动..')
    chrome.storage.local.get(['lazada_tag'],function(s){
        const {lazada_tag} = s
        if(lazada_tag){
            chrome.storage.local.get(["my_rate",'feedback_flag','lazada_nodes','lazada_main_price_nodes'],async function(result){
                rate = result.my_rate[`rate_${country}`]; //按国家获取汇率
                feedback_flag = result.feedback_flag
                lazada_nodes = result.lazada_nodes
                lazada_main_price_nodes = result.lazada_main_price_nodes

                find_node(lazada_nodes);
                //特别处理详情页价格
                DoMainPrice(lazada_main_price_nodes)
                observer_price(lazada_main_price_nodes)
            })
        }else{
            console.log('lazada开关关闭')
        }
    })
}
//====统一监听body的改变，触发总回调
let callback = function (records){
    all();
};
let throttle_callback = _.throttle(callback,3000,false);
let mo = new MutationObserver(throttle_callback);
let option = {
  'childList': true,
  'subtree': true,
  'characterData':true
};

let fs_node = document.getElementsByTagName("body")[0];
try{   
    mo.observe(fs_node, option);
}catch(e){
    console.log('监听器启动失败body."');
}

//单独为详情页设置主价格改变的回调
const observer_price = (nodes)=>{
    let option1 = {
        'childList': true,
        'subtree': true,
         'characterData':true
      };
    let price_change = function(r){
        //console.error('%c主价格变动..','color:red;font-size:20px')
        let new_price = r[0].target.nodeValue
        if(!new_price){
            return 
        }
        //console.error(new_price)
        let rmb = getRmb_All(new_price)
        document.getElementById('knipfly_my').innerText = ' ￥' + rmb
    }
    let price_Observer = new MutationObserver(price_change)
    let price_node = document.querySelector(nodes[0])
    try{
        price_Observer.observe(price_node,option1)
    }catch(e){
        console.log('主价格监听器启动失败.',)
       
    }
}






//找出元素
function find_node(node_all) {
    let feedback_list = []
    for (let node of node_all) {
        let a = document.querySelectorAll(`${node[0]}[class="${node[1]}"]`)
        if(feedback_flag){
            let n = a.length
            feedback_list.push([`feedback-lazada-${node[0]}-${node[1]}`,n])
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
    let rg = /^[^0-9]$/
    let rg1 = /\(\d{1,}\)/
    for(let i =0;i<a_length;i++){
        let s = a[i].innerHTML.trim();
        if(s.includes('￥')){
            continue;
        }
        if(s==''||s=='Free'){
            continue;
        }
        if(rg.test(s)){
            continue
        }
        if(rg1.test(s)){
            continue
        }
        if(s.includes('%')){
            continue
        }
        let rmb = getRmb_All(s);
        
        if(rmb != 'NaN'){
            a[i].innerHTML=s + `<sub style="color:green" title="￥${rmb}"> ￥${rmb}</sub>`;

/*             if((!a[i].nextElementSibling) || (a[i].nextElementSibling && a[i].nextElementSibling.tagName != 'SUB')){
               
                if(rmb){
                    let b = document.createElement('sub')
                        b.style.color = 'green'
                        b.innerText = '￥'+rmb
                        a[i].after(b)
                }
            } */
        }
 
    }
}

//总的计算人民币价,根据国家返回对应函数并计算
const getRmb_All = function(s,country_=country){
   // let f = new Function(`return getRmb_${country_}`)()
   // return f(s)

    const fun_obj = {
        getRmb_IDR,getRmb_MYR,getRmb_MYR,getRmb_PHP,getRmb_SGD,getRmb_THB,getRmb_VND
    }
    return fun_obj['getRmb_'+country_](s)

}

//计算人民币   //价格形式  29.00      499.75    2,160.00     ₱ 899.00   ₱98.00   ₱1,029.00    暂时没有发现价格范围的形式
const  getRmb_PHP = function(s){
    if(!s){
        return ''
    }
    let r1 = /^[^0-9]*/i;
    let r2= /,/g;
    let a = s.trim().replace(r1,'').replace(r2,'');
    let b = parseFloat(a);
    let rmb  = (b/rate).toFixed(2);
    return rmb;
}
//计算人民币   //价格形式  13.300  16.999     Rp 149.900     1.999.000    Rp 243.000   Rp245.000       Rp 239.000    Rp4.399.000
const  getRmb_IDR = function(s){
    let r1 = /^[^0-9]*/i;
    let r3 = /[^0-9]*$/i;
    let r2= /\,|\./g;
    let a = s.trim().replace(r1,'').replace(r3,'').replace(r2,'');
    let b = parseFloat(a);
    let rmb  = (b/rate).toFixed(2);
    return rmb;
}

//计算人民币   各种价格数字形式: 5.99         RM 23.40         RM149.99       RM4,999.00         RM 111.00    暂时没有发现价格范围的形式
const  getRmb_MYR = function(s){
    let r1 = /^[^0-9]*/i;
    let r2= /,/g;
    let a = s.trim().replace(r1,'').replace(r2,'');
    let b = parseFloat(a);
    let rmb  = (b/rate).toFixed(2);
    return rmb;
}
//计算人民币   //价格形式  29.00      499.75    2,160.00     ₱ 899.00   ₱98.00   ₱1,029.00    暂时没有发现价格范围的形式
const  getRmb_SGD = function(s){
    let r1 = /^[^0-9]*/i;
    let r2= /,/g;
    let a = s.trim().replace(r1,'').replace(r2,'');
    let b = parseFloat(a);
    let rmb  = (b/rate).toFixed(2);
    return rmb;
}

//计算人民币   //价格形式 399.00 1,235.00    1,120.00  ฿12,990.00 ฿40,990.00      ฿ 6,900.00   ฿ 629.00      ฿ 43,900.00   
const  getRmb_THB = function(s){
    let r1 = /^[^0-9]*/i;
    let r3 = /[^0-9]*$/i;
    let r2= /\,/g;
    let a = s.trim().replace(r1,'').replace(r3,'').replace(r2,'');
    let b = parseFloat(a);
    let rmb  = (b/rate).toFixed(2);
    return rmb;
}
//计算人民币   //价格形式  21,000    ₫88,200    ₫27,999,000  ₫3,000,000    //切换为越南语后   27.999.000 ₫          2.790.000 ₫       21.000 ₫    104.000 ₫     146.000   39.000
const  getRmb_VND = function(s){
    let r1 = /^[^0-9]*/i;
    let r3 = /[^0-9]*$/i;
    let r2= /\,|\./g;
    let a = s.trim().replace(r1,'').replace(r3,'').replace(r2,'');
    let b = parseFloat(a);
    let rmb  = (b/rate).toFixed(2);
    return rmb;
}

//处理详情页价格 把人民币价格换到这个节点的后一个节点，不要直接插入，会让之前的价格不再更新
const DoMainPrice = function(nodes){
  
    let node = document.querySelector(nodes[0])
    if(node){
       //console.log('有详情页主价格节点...')
        let s = node.innerHTML
        if(s==''||s=='Free'){
            return
        }
        if(node.nextSibling&&node.nextSibling.innerText.includes('￥')){
            return
        }else{
                let rmb = getRmb_All(s)
                let a = document.createElement('span')
                a.style.color = 'green'
                a.setAttribute('style','color:green;font-size:24px')
                a.id = 'knipfly_my'
                a.innerText = '  ￥' + rmb
                node.parentNode.insertBefore(a,node.nextSibling)
        }
  }
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


