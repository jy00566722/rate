console.log('Lazada页面价格转换插件启动中...');

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
const all = function(){
    console.log('总回调启动..')
    chrome.storage.local.get(['lazada_tag'],function(s){
        const {lazada_tag} = s
        if(lazada_tag){
            chrome.storage.local.get(["my_rate"],function(result){
                rate = result.my_rate[`rate_${country}`]; //按国家获取汇率
                Sa9(node_all);
                //特别处理详情页价格
                DoMainPrice()
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
let price_node = document.querySelector(`span[class=" pdp-price pdp-price_type_normal pdp-price_color_orange pdp-price_size_xl"]`)
try{
    price_Observer.observe(price_node,option1)
}catch(e){
    console.log('主价格监听器启动失败.',)
    //console.log(e)
}

let node_all=[
    ['span','price'],
    ['span','super-deals-item-sale-price-value'],
    ['span','global-brand-item-price-value'],
    ['span','best-seller-item-price-value'],
    ['div','sale-price'],
    ['div','store-product-price'],
   // ['span',' pdp-price pdp-price_type_normal pdp-price_color_orange pdp-price_size_xl'], 详情上主价格要特别处理
    ['p','product-price'],
    ['div','product-price'],
    ['span','c13VH6'],
    ['span','pswt-product-price'],
    ['div','pswt-product-price'],
    ['div','item-discount-price'],
    ['div','delivery-option-item__shipping-fee'],
    ['div','discount-price'],
    ['span','price-label price-label-prim'],  //详情页中的多买送促销信息
    ['div','p-slider-product-price'],
    ['span','hotdeal-product3-item-price-discount'],//lazglobal页面
    ['span','text'],
    ['div','voucher-tile-discount-value-text']
];


//取出元素数组的元素处理
const Sa9 = function(node_all){
    for(let node of node_all){
            if(document.querySelectorAll(`${node[0]}[class="${node[1]}"]`)[0]){
                //console.log(node)
                qs9(node);
          }else{
              //console.log('没有发现node..')
              //console.log(node)
              //console.log(document.querySelectorAll(`${node[0]}[class="${node[1]}"]`))
          }
    }
}

//替换innerHTML函数
const qs9=function(node,classname){
    let a = document.querySelectorAll(`${node[0]}[class="${node[1]}"]`);
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
        }
 
    }
}

//总的计算人民币价,根据国家返回对应函数并计算
const getRmb_All = function(s,country_=country){
    let f = new Function(`return getRmb_${country_}`)()
    return f(s)
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
const DoMainPrice = function(){
    //let node = ['span',' pdp-price pdp-price_type_normal pdp-price_color_orange pdp-price_size_xl']
    let node = document.querySelector(`span[class=" pdp-price pdp-price_type_normal pdp-price_color_orange pdp-price_size_xl"]`)
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


