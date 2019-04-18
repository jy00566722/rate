console.log('Wish价格转换插件启动..');

let cu = 0;//货币
function injectCustomJs(jsPath)
{
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function()
    {
        // 放在页面不好看，执行完后移除掉
        this.parentNode.removeChild(this);
    };
    console.log('向页面插入js元素..');
    document.head.appendChild(temp);
}
injectCustomJs();
//监听来自页面的货币
window.addEventListener("message", function(e)
{
    if(e.data.wish_me){
        console.log('收到来自页面的货币信息'+e.data.wish_me);
        cu = e.data.wish_me;
    }
   
}, false);

//<div class="PurchaseContainer__ActualPrice-sc-1qlezk8-5 kShVbX">د.إ.‏89AED</div>
//<div class="PurchaseContainer__ActualPrice-sc-1qlezk8-5 kShVbX">$27USD</div>
//<div class="FeedItemV2__ActualPrice-vf3155-8 eLVouZ">$2</div>
//<div class="FeedItemV2__ActualPrice-vf3155-8 eLVouZ">₽782<span class="FeedItemV2__Subscript-vf3155-9 ldSwdr">RUB</span></div>
let node_all=[
    ['div','FeedItemV2__ActualPrice-vf3155-8 eLVouZ'],
    ['div','PurchaseContainer__ActualPrice-sc-1qlezk8-5 kShVbX']
];
//====统一监听body的改变，触发总回调
let callback = function (records){
    if(cu ===0){
        console.log('货币未设置好，不启动总回调');
        return;
    }else{
        all();
    }
    
};
let throttle_callback = _.throttle(callback,4000);
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
function all(){
    console.log('总回调启动.');
    chrome.storage.local.get(["my_rate"],function(result){

        rate = result.my_rate[`rate_${cu}`];
        console.log('汇率为:');
        console.log(rate);
        find_node(node_all);

    })
}
//<div class="PurchaseContainer__ActualPrice-sc-1qlezk8-5 kShVbX">د.إ.‏89AED</div>
//<div class="PurchaseContainer__ActualPrice-sc-1qlezk8-5 kShVbX">$27USD</div>
//<div class="FeedItemV2__ActualPrice-vf3155-8 eLVouZ">$2</div>
//<div class="FeedItemV2__ActualPrice-vf3155-8 eLVouZ">₽782<span class="FeedItemV2__Subscript-vf3155-9 ldSwdr">RUB</span></div>


let rg2 =/^(US \$){0,1}\d{1,}(\.\d{2}){0,1}( \- \d{1,}\.\d{2}){0,1}/;

function find_node(node_all){
        for(let node of node_all){
            if(document.querySelectorAll(`${node[0]}[class="${node[1]}"]`)[0]){
                    qs9(node);
                
        }
    }
}

//替换html
const qs9=function(node,classname){
    let a = document.querySelectorAll(`${node[0]}[class="${node[1]}"]`);
    let a_length = a.length;
    for(let i =0;i<a_length;i++){
        let s = a[i].innerHTML.trim();
        if(!rg2.test(s)){
            continue;
        }
        if(s.includes('￥')){
            continue;
        }
        let rmb = priceRmb(s);
        a[i].innerHTML=s + `<sub style="color:green"> ￥${rmb}</sub>`;
    }
}

const priceRmb = function(s){
    if(s.includes('-')){
        let ar=s.split('-');
        let p1 =((parseFloat(ar[0].trim().replace('US $','')))/rate).toFixed(2);
        let p2 =(parseFloat(ar[1].trim())/rate).toFixed(2);
        return p1+' - '+p2+'元';

    }else{
    let p = parseFloat( s.replace('US $',''));
    let price = (p/rate).toFixed(2);
    return price;
    }
}