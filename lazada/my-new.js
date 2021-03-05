console.log('马来西亚页面价格转换插件启动中...');

//====统一监听body的改变，触发总回调
let callback = function (records){
    //console.log('回调启动...');
    all();
};
let throttle_callback = _.throttle(callback,4000,false);

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
let rate=0;
let rg = /^(RM){0,1}( ){0,1}(\d{1,3}\,){0,1}\d{1,3}\.\d{2}$/;//总的价格形式匹配

let node_all=[
    ['span','price'],
    ['span','super-deals-item-sale-price-value'],
    ['span','global-brand-item-price-value'],
    ['span','best-seller-item-price-value'],
    ['div','sale-price'],
    ['div','store-product-price'],
    ['span',' pdp-price pdp-price_type_normal pdp-price_color_orange pdp-price_size_xl'],
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
    //console.log('本次要处理的元素数量为:'+a_length);
    //let tmp = 0;
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
       // tmp++;
        
    }
    //console.log('本次处理的元素为:'+JSON.stringify(node)+'处理数量为:'+tmp);
}

//计算人民币   各种价格数字形式: 5.99         RM 23.40         RM149.99       RM4,999.00         RM 111.00    暂时没有发现价格范围的形式
const  getRmb = function(s){
    let r1 = /^[^0-9]*/i;
    let r2= /,/g;
    let a = s.trim().replace(r1,'').replace(r2,'');
    let b = parseFloat(a);
    let rmb  = (b/rate).toFixed(2);
    return rmb;
}

//总回调
const all = function(){
    chrome.storage.local.get(['lazada_tag'],function(s){
        const {lazada_tag} = s
        if(lazada_tag){
            chrome.storage.local.get(["my_rate"],function(result){
                rate = result.my_rate['rate_MYR'];
                Sa9(node_all);
            })
        }else{
            console.log('lazada开关关闭')
        }

    })
}

