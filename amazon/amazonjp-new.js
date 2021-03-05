console.log('Amazon日本站价格转换插件启动...');
//====统一监听body的改变，触发总回调
let callback = function (records){
    //console.log('回调启动...');
    chrome.storage.local.get(['amazon_tag'],function(s){
        const {amazon_tag} = s
        if(amazon_tag){
            all();
        }else{
            console.log('amazon开关关闭')
        }

    })
};
let throttle_callback = _.throttle(callback,3500);

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

let rate = 0;
let country = 'JPY';
let S = new Set();

let node_all =[
    ['span','a-size-',0],
    ['span','a-color-',0],
    ['span','p13n-sc-price',0],
    ['span','a-price-whole',0],  //0表示class*=
    ['div','a-row a-color-price product-price',1]   //1表示class=
];
//总回调
const all=function(){
    console.log('总回调启动');
    chrome.storage.local.get(["my_rate"],function(result){
        rate = result.my_rate[`rate_${country}`];
        S.clear();
        Sa9(node_all);
        //console.log(S);
        foo(S);
        if(document.querySelectorAll('span[class="price price--jumbo"]')[0]){
            S13();
        }
        //特别价格处理
/**      
        let e1 = document.querySelectorAll('span[class="a-offscreen"]');
        if(e1[0]){
            //t1(e1);
            console.log('发现a-offscreen');
        }  
        if(document.querySelectorAll('span[class="sx-price sx-price-large"]')[0]){
            S7();
        }

        if(document.querySelectorAll('span[class="price style__xlarge__1mW1P style__buyPrice__61xrU style__bold__3MCG6"]')[0]){
            S12();
        }
        if(document.querySelectorAll('span[class="price style__xlarge__1mW1P style__price__-bRnk"]')[0]){
            S12a();
        }
        **/
    })
}
//<span class="a-size-base a-color-price acs_product-price__buying">￥1,593 &nbsp;</span>
//let rg = /^\$(\d{1,3}\,){0,1}\d{1,3}\.\d{2}( \- \$(\d{1,3}\,){0,1}\d{1,3}\.\d{2}){0,1}$/;
let rg = /^(￥|JP￥|¥|JP¥){0,1} {0,1}(\d{1,3}\,){1,}\d{1,3}( \&nbsp\;){0,1}( \- (￥|JP￥|¥|JP¥){0,1} {0,1}(\d{1,3}\,){1,}\d{1,3}){0,1}$/;   //不匹配1000日元以下的，因为会匹配到纯数字
let rg1 = /^(￥|JP￥|¥|JP¥){0,1} {0,1}\d{3}( \&nbsp\;){0,1}$/;  //1000日元以下的，带货币符号
let rg2 = /^JPY(\d{1,3}\,){0,}\d{1,3}\.\d{2}$/; //带小数点的价，只有在店铺页发现  JPY102,707.00

//从Set中取出元素，然后替换html
const foo=function(s){
    s.forEach(x=>{
        let a = x.innerHTML.trim();
        let rmb = getRmb(a);
        x.innerHTML = a+`<sub style="color:green"> ${rmb}元</sub>`;
    })
}
//计算人民币  ￥  ¥
//日元状态: 1,999   ￥ 5,661    ￥8,746   79,800  ￥114,000    ￥999   999  ￥5,000     ￥ 15 - ￥ 500,000  ¥ 630
//中文状态下:¥ 1,760 - ¥ 4,620     JP¥1,999   ￥ 5,999 - ￥ 6,766  JP¥9,472   ￥ 2,880
const  getRmb = function(s){
    let r1 = /^[^0-9]*/i;
    let r2= /,/g;
    if(!s.includes('-')){
            let a = s.trim().replace(r1,'').replace(r2,'');
            let b = parseFloat(a);
            let rmb  = (b/rate).toFixed(2);
            return rmb;
    }else{
            let [s1,s2] = s.split('-');
            s1 = s1.trim().replace(r1,'').replace(r2,'');
            s2 = s2.trim().replace(r1,'').replace(r2,'');
            let rmb = (s1/rate).toFixed(2) + ' - ' +(s2/rate).toFixed(2);
            return rmb;
    }
    
}
//取出元素数组的元素处理
const Sa9 = function(node_all){
    for(let node of node_all){
        if(node[2]===0){
            let a = document.querySelectorAll(`${node[0]}[class*="${node[1]}"]`);
                if(a[0]){
                    
                    qs9(a);
            }else{
                //console.log('当前页面没有元素:'+JSON.stringify(node));
            }
        }else if(node[2]===1){
            let a = document.querySelectorAll(`${node[0]}[class="${node[1]}"]`);
            if(a[0]){
                
                qs9(a);
        }else{
            //console.log('当前页面没有元素:'+JSON.stringify(node));
            }
        }
    }
}
//处理所有匹配节点，放入Set去重
const qs9=function(nodes){
    nodes.forEach(x=>{
        let b=x.innerHTML.trim();
        if(rg.test(b)){
            S.add(x);
        }else if(rg1.test(b)){
            S.add(x);
        }else if(rg2.test(b)){
            S.add(x);
        }else{
            //console.log('正则匹配不成功的元素内容为:');
            //console.log(b);
        }
    })
}

const t1=function(nodes){
    nodes.forEach(x=>{
        let s = x.innerHTML.trim();
        if(x.nextElementSibling&&!x.nextElementSibling.lastElementChild.innerHTML.includes('￥')){
        let rmb = getRmb(s);
        let b = document.createElement('sub');
            b.style.color = "green";
            b.innerHTML = '￥'+rmb;
            x.nextElementSibling.appendChild(b);
        }
    })
}

const S13 = function(){
    let node_all = document.querySelectorAll('span[class="price price--jumbo"]');
    for(const a of node_all){
        if(a.childElementCount==4){
            console.log(a);
            let s =  a.children[1].innerHTML.trim();
            let rmb = getRmb(s);
            console.log(rmb);
            let c = document.createElement('sub');
            c.style.color = "green";
            c.innerHTML=rmb+'元';
            a.appendChild(c);

        }
    }
}
const S12a = function(){
    let node_all = document.querySelectorAll('span[class="price style__xlarge__1mW1P style__price__-bRnk"]');
    for(const a of node_all){
        if(!(a.lastElementChild.tagName=='SUB')){
        if(a.childElementCount==1){
            let b = a.children[0];
            let s = parseFloat( b.children[1].innerHTML.replace(/\,/g,'')) +parseFloat('.'+ b.children[3].innerHTML);
            let rmb = (s/rate).toFixed(2);
            let c = document.createElement('sub');
            c.style.color = "green";
            c.innerHTML='￥'+rmb;
            a.appendChild(c);
        }else if(a.childElementCount==2){
            let b = a.children[0];
            let s = parseFloat( b.children[1].innerHTML.replace(/\,/g,'')) +parseFloat('.'+ b.children[3].innerHTML);
            let rmb = (s/rate).toFixed(2);

            let b1 = a.children[1];
            let s1 = parseFloat( b1.children[2].innerHTML.replace(/\,/g,'')) +parseFloat('.'+ b1.children[4].innerHTML);
            let rmb1 = (s1/rate).toFixed(2);
            let c = document.createElement('sub');
            c.style.color = "green";
            c.innerHTML='￥'+rmb+' - ￥'+rmb1;
            a.appendChild(c);
            }
        }
    }
}
const S12 = function(){
    let node_all = document.querySelectorAll('span[class="price style__xlarge__1mW1P style__buyPrice__61xrU style__bold__3MCG6"]');
    for(const a of node_all){
        if(!(a.lastElementChild.tagName=='SUB')){
        if(a.childElementCount==1){
            let b = a.children[0];
            let s = parseFloat( b.children[1].innerHTML.replace(/\,/g,'')) +parseFloat('.'+ b.children[3].innerHTML);
            let rmb = (s/rate).toFixed(2);
            let c = document.createElement('sub');
            c.style.color = "green";
            c.innerHTML='￥'+rmb;
            a.appendChild(c);
        }else if(a.childElementCount==2){
            let b = a.children[0];
            let s = parseFloat( b.children[1].innerHTML.replace(/\,/g,'')) +parseFloat('.'+ b.children[3].innerHTML);
            let rmb = (s/rate).toFixed(2);

            let b1 = a.children[1];
            let s1 = parseFloat( b1.children[2].innerHTML.replace(/\,/g,'')) +parseFloat('.'+ b1.children[4].innerHTML);
            let rmb1 = (s1/rate).toFixed(2);
            let c = document.createElement('sub');
            c.style.color = "green";
            c.innerHTML='￥'+rmb+' - ￥'+rmb1;
            a.appendChild(c);
            }
        }
    }
}

const S7 = function(){
    let node_all = document.querySelectorAll('span[class="sx-price sx-price-large"]');
    let rg1 = /\,/g;
    for(const a of node_all){
        if(!(a.lastElementChild.style.color=='green')){
            if(a.childElementCount==7){
                let s1 = a.children[1].innerText;
                let s2 = a.children[2].innerText;
                let s3 = a.children[5].innerText;
                let s4 = a.children[6].innerText;
                let s = parseFloat( s1.replace(rg1,'')) + parseFloat('.'+ s2);
                let ss = parseFloat( s3.replace(rg1,'')) + parseFloat('.'+ 4);
                let s_ = (s/rate).toFixed(2);
                let _s = (ss/rate).toFixed(2);
                let rmb = `￥${s_} - ￥${_s}`;
                let b = document.createElement('sub');
                    b.style.color = "green";
                    b.innerHTML=rmb;
                    a.appendChild(b);
            }else if(a.childElementCount==3){
                let s1 = a.children[1].innerText;
                let s2 = a.children[2].innerText;
                let s = parseFloat( s1.replace(rg1,'')) + parseFloat('.'+ s2);
                let s_ = (s/rate).toFixed(2);
                let rmb = `￥${s_}`;
                let b = document.createElement('sub');
                    b.style.color = "green";
                    b.innerHTML=rmb;
                    a.appendChild(b);
            }
            
        }
    }
}
