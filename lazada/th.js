console.log('泰国页面价格转换插件启动中...');

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

//总回调
const all = function(){
    //首页price
    if(document.getElementsByClassName('price')[0]){
        getHomePriceNode();
    }

    //详情页
    //主价
    if(document.querySelectorAll('span[class*="price_color_orange"]')[0]){
        getDetailsNode();
    }
    //详情页其它商品价格
    if(document.getElementsByClassName("product-price")[0]){
        getDetailsOtherNode();
    }
    //搜索列表页
    if(document.getElementsByClassName('c13VH6')[0]){
        list_price();
    }
    //lazMall页面上方的灰色价格
    if(document.getElementsByClassName("store-product-price")[0]){
        lazMall();
    }

    //Global Collection页面
    if(document.getElementsByClassName("global-brand-item-price-value")[0]){
        global_s();
    }
    if(document.getElementsByClassName("super-deals-item-sale-price-value")[0]){
        global_su();
    }
    if(document.getElementsByClassName("best-seller-item-price-value")[0]){
        global_bs();
    }
    if(document.getElementsByClassName("sale-price")[0]){
        global_sp();
    }

    //Top Up& eStore
    if(document.getElementsByClassName("p-slider-product-price")[0]){
        topup();
    }
    //店铺Homepage
    if(document.querySelectorAll('div[style*="rgb(245, 114, 36); letter-spacing"]')[0]){
        shopHomepage();
    }

    //Voucher
    if(document.getElementsByClassName("item-discount-price")[0]){
        voucher();

    }


}
/////////以下为具体处理程序/////
const voucher = function(){
    let a = document.getElementsByClassName("item-discount-price");
    let a_length = a.length;
    chrome.storage.local.get(["my_rate"],function(result){
        let rate = result.my_rate.rate_THB;
        for(let i =0;i<a_length;i++){
            if(!a[i].innerHTML.includes('￥')){
                let s = parseFloat( a[i].innerHTML.trim().substring(1).replace(/,/g,''));
                let rmb = (s/rate).toFixed(2);
                a[i].innerHTML = a[i].innerHTML+`<br><sub style="color:green"> ￥${rmb}</sub>`;
            }
        }
    })
}


const shopHomepage = function(){
    let a = document.querySelectorAll('div[style*="rgb(245, 114, 36); letter-spacing"]');
    let a_length = a.length;
    chrome.storage.local.get(["my_rate"],function(result){
        let rate = result.my_rate.rate_THB;
        for(let i =0;i<a_length;i++){
            if(!a[i].innerHTML.includes('￥')){
                let s = parseFloat( a[i].innerHTML.trim().substring(1).replace(/,/g,''));
                let rmb = (s/rate).toFixed(2);
                a[i].innerHTML = a[i].innerHTML+`<sub style="color:green"> ￥${rmb}</sub>`;
            }
        }
    })
}


const topup = function(){
    let a = document.getElementsByClassName("p-slider-product-price");
    let a_length = a.length;
    chrome.storage.local.get(["my_rate"],function(result){
        let rate = result.my_rate.rate_THB;
        for(let i =0;i<a_length;i++){
            if(!a[i].innerHTML.includes('￥')){
                let s = parseFloat( a[i].innerHTML.trim().substring(1).replace(/,/g,''));
                let rmb = (s/rate).toFixed(2);
                a[i].innerHTML = a[i].innerHTML+`<sub style="color:green"> ￥${rmb}</sub>`;
            }
        }
    })
}

const lazMall = function(){
    let a = document.getElementsByClassName("store-product-price");
    let a_length = a.length;
    chrome.storage.local.get(["my_rate"],function(result){
        let rate = result.my_rate.rate_THB;
        for(let i =0;i<a_length;i++){
            if(!a[i].innerHTML.includes('￥')){
                let s = parseFloat( a[i].innerHTML.trim().substring(1).replace(/,/g,''));
                let rmb = (s/rate).toFixed(2);
                a[i].innerHTML = a[i].innerHTML+`<sub style="color:green"> ￥${rmb}</sub>`;
            }
        }
    })
}

const global_s = function(){
    let a= document.getElementsByClassName("global-brand-item-price-value");
    let a_length=a.length;
    chrome.storage.local.get(["my_rate"],function(result){
        let rate = result.my_rate.rate_THB;
        for(let i = 0;i<a_length;i++){
            if(!a[i].innerHTML.includes(' ')){
                let s =parseFloat( a[i].innerHTML.replace(/,/g,''));
                let rmb = (s/rate).toFixed(2);
                a[i].innerHTML = a[i].innerHTML+`<sub style="color:green"> ￥${rmb}</sub>`;

            }
        }
    })
}
const global_su = function(){
    let a= document.getElementsByClassName("super-deals-item-sale-price-value");
    let a_length=a.length;
    chrome.storage.local.get(["my_rate"],function(result){
        let rate = result.my_rate.rate_THB;
        for(let i = 0;i<a_length;i++){
            if(!a[i].innerHTML.includes(' ')){
                let s =parseFloat( a[i].innerHTML.replace(/,/g,''));
                let rmb = (s/rate).toFixed(2);
                a[i].innerHTML = a[i].innerHTML+`<sub style="color:red"> ￥${rmb}</sub>`;

            }
        }
    })
}
const global_bs = function(){
    let a= document.getElementsByClassName("best-seller-item-price-value");
    let a_length=a.length;
    chrome.storage.local.get(["my_rate"],function(result){
        let rate = result.my_rate.rate_THB;
        for(let i = 0;i<a_length;i++){
            if(!a[i].innerHTML.includes(' ')){
                let s =parseFloat( a[i].innerHTML.replace(/,/g,''));
                let rmb = (s/rate).toFixed(2);
                a[i].innerHTML = a[i].innerHTML+`<sub style="color:green"> ￥${rmb}</sub>`;

            }
        }
    })
}

const global_sp = function(){
    let a = document.getElementsByClassName("sale-price");
    let a_length = a.length;
    chrome.storage.local.get(["my_rate"],function(result){
        let rate = result.my_rate.rate_THB;
        for(let i =0;i<a_length;i++){
            if(!a[i].innerHTML.includes('￥')){
                let s = parseFloat( a[i].innerHTML.trim().substring(1).replace(/,/g,''));
                let rmb = (s/rate).toFixed(2);
                a[i].innerHTML = a[i].innerHTML+`<sub style="color:green"> ￥${rmb}</sub>`;
            }
        }
    })
}


const  getHomePriceNode=function(){
    let a = document.getElementsByClassName('price');
    let b=[];
    let a_length = a.length;
    chrome.storage.local.get(["my_rate"],function(result){
            let rate = result.my_rate.rate_THB;
            for(let i = 0;i<a_length;i++){
                if(a[i].parentNode.tagName==="DIV"){
                    //b.push(a[i]);
                    if(!a[i].innerHTML.includes(' ')){
                        let s = a[i].innerHTML;
                        let rg = new RegExp(/,/g);
                        let s1=parseFloat(s.replace(rg,''));
                        let r1 = parseFloat(rate);
                        let rmb= (s1/r1).toFixed(2);
                        a[i].innerHTML=s +`<sub style="color:green"> ￥${rmb}</sub>`;
                    }
                }
            }

    })
}

const getDetailsNode =function(){
    //console.log('详情页主价格修改启动..');
    let Price = document.querySelectorAll('span[class*="price_color_orange"]')[0];
        if(Price.innerHTML.includes(' ')){
           // console.log('主价格已经附加人民币,不用再转换.');
            return;
        }
        let my_pri = parseFloat(  Price.innerHTML.substring(1).replace(/,/g,''));
        //console.log(my_pri);
    
    chrome.storage.local.get(["my_rate"],function(result){
        let my_rate =parseFloat( result.my_rate.rate_THB);
        Price.innerHTML=Price.innerHTML+`<sub style="color:green"> ￥${(my_pri/my_rate).toFixed(2)}</sub>`;
                   
        });
}

const  getDetailsOtherNode = function(){
    //console.log('详情页其它价格修改启动..');
    let a = document.getElementsByClassName("product-price");
    let a_length=a.length;       
    chrome.storage.local.get(["my_rate"],function(result){
        let my_rate =parseFloat( result.my_rate.rate_THB);
        for(let i=0;i<a_length;i++){
            if(!a[i].innerHTML.includes(' ')){
            let my_pri = parseFloat(  a[i].innerHTML.substring(1).replace(/,/g,''));
            a[i].innerHTML=a[i].innerHTML+`<sub style="color:green"> ￥${(my_pri/my_rate).toFixed(2)}</sub>`;
            }
        
            }

    });
}

const list_price= function(){
    let c13vh6 = document.getElementsByClassName('c13VH6');
    let c13vh6_length = c13vh6.length;
    chrome.storage.local.get(["my_rate"],function(result){
            let my_rate =parseFloat( result.my_rate.rate_THB);
            for(let i=0;i<c13vh6_length;i++){
                if(c13vh6[i].tagName==='SPAN' && !c13vh6[i].innerHTML.includes(' ')){
                    let my_pri = parseFloat(  c13vh6[i].innerHTML.substring(1).replace(/,/g,''));
                    c13vh6[i].innerHTML=c13vh6[i].innerHTML+`<sub style="color:green"> ￥${(my_pri/my_rate).toFixed(2)}</sub>`;
                }
            
    }
    //console.timeEnd('s');
    })
}





































