console.log('Lazada菲律宾页面价格转换插件启动中...');

//总回调
const all = function(){
    chrome.storage.local.get(['lazada_tag'],function(s){
        const {lazada_tag} = s
        if(lazada_tag){
            chrome.storage.local.get(["my_rate"],function(result){
                rate = result.my_rate['rate_PHP'];
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
  'subtree': true
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
    let rmb = getRmb(new_price)
    document.getElementById('knipfly_my').innerText = ' ￥' + rmb
}
let price_Observer = new MutationObserver(price_change)
let price_node = document.querySelector(`span[class=" pdp-price pdp-price_type_normal pdp-price_color_orange pdp-price_size_xl"]`)
try{
    price_Observer.observe(price_node,option1)
}catch(e){
    console.log('主价格监听器启动失败.',)
    console.log(e)
}


let rate=0;
let rg = /^(RM){0,1}( ){0,1}(\d{1,3}\,){0,1}\d{1,3}\.\d{2}$/;//总的价格形式匹配

let node_all=[
    ['span','price'],
    ['span','super-deals-item-sale-price-value'],
    ['span','global-brand-item-price-value'],
    ['span','best-seller-item-price-value'],
    ['div','sale-price'],
    ['div','store-product-price'],
   // ['span',' pdp-price pdp-price_type_normal pdp-price_color_orange pdp-price_size_xl'], 要特别处理
    ['p','product-price'],
    ['div','product-price'],
    ['span','c13VH6'],
    ['span','pswt-product-price'],
    ['div','pswt-product-price'],
    ['div','item-discount-price'],
    ['div','delivery-option-item__shipping-fee'],
    ['div','discount-price'],
    ['span','price-label price-label-prim'],  //详情页中的多买送促销信息
    ['div','p-slider-product-price']
];


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
        let s = a[i].innerHTML.trim();
        if(s.includes('￥')){
            //console.log('包括￥,不再计算');
            continue;
        }
        if(s==''||s=='Free'){
            continue;
        }
/*         if(!(rg.test(s))){
            console.log('价格形式匹配不成功');
            continue;
        } */
        let rmb = getRmb(s);
        a[i].innerHTML=s + `<sub style="color:green" title="￥${rmb}"> ￥${rmb}</sub>`;
 
    }
}

//计算人民币   //价格形式  29.00      499.75    2,160.00     ₱ 899.00   ₱98.00   ₱1,029.00    暂时没有发现价格范围的形式
const  getRmb = function(s){
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
        if(node.nextSibling.innerText.includes('￥')){
            return
        }else{
                let rmb = getRmb(s)
                let a = document.createElement('span')
                a.style.color = 'green'
                a.setAttribute('style','color:green;font-size:24px')
                a.id = 'knipfly_my'
                a.innerText = '  ￥' + rmb
                node.parentNode.insertBefore(a,node.nextSibling)
        }
  }
}


