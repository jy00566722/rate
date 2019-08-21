console.log('Amazon德国价格转换插件启动...');
//====统一监听body的改变，触发总回调
let callback = function (records){
    //console.log('回调启动...');
    all();
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
let country = 'EUR';
let S = new Set();
   
let node_all =[
    ['span','a-size-'],
    ['span','a-color-'],
    ['span','p13n-sc-price']
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

        //特别价格处理
        let e1 = document.querySelectorAll('span[class="a-offscreen"]');
        if(e1[0]){
            t1(e1);
        }
/**
        if(document.querySelectorAll('span[class="sx-price sx-price-large"]')[0]){
            S7();
        }
        if(document.querySelectorAll('span[class="price price--jumbo"]')[0]){
            S13();
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
//德语下:369,99 € - 2.099,99 € |EUR 32,40 - EUR 123,66 |EUR 25,19 - EUR 60,11 |EUR 35,48 |99,95&nbsp;€ |1.709,98&nbsp;€
//英语下:€1,709.98 |EUR 1,415.51|€9.79  |EUR 44.99|
//何兰下:€&nbsp;13,37    |EUR 48,39 - EUR 69,99|    
let rg  = /^(EUR )?(€)?(€\&nbsp\;)?(\d{1,3}(\.|\,))*\d{1,3}((\,|\.)\d{2})?( €)?(\&nbsp\;€)?$/;
let rg1 = /^(EUR )?(€)?(€\&nbsp\;)?(\d{1,3}(\.|\,))*\d{1,3}((\,|\.)\d{2})( €)?(\&nbsp\;€)?( \- (EUR )?(€)?(€\&nbsp\;)?(\d{1,3}(\.|\,))*\d{1,3}((\,|\.)\d{2})( €)?(\&nbsp\;€)?){0,1}$/;

//从Set中取出元素，然后替换html
const foo=function(s){
    s.forEach(x=>{
        let a = x.innerHTML.trim();
        let rmb = getRmb(a);
        x.innerHTML = a+`<sub style="color:green"> ￥${rmb}</sub>`;
    })
}
//计算人民币
const  getRmb = function(s){
    let r1 = /^[^0-9]*/i;
    let r2= /,/g;
    let r3 = /[^0-9]*$/;

    if(!s.includes('-')){
        let la=s.indexOf('.');
        let lb=s.indexOf(',');
        if(la<lb){ s = s.replace('.','').replace(',','.');}

            let a = s.trim().replace(r1,'').replace(r3,'').replace(r3,'');
            let b = parseFloat(a);
            let rmb  = (b/rate).toFixed(2);
            return rmb;
    }else{
            let [s1,s2] = s.split('-');
            let la1=s1.indexOf('.');
            let lb1=s1.indexOf(',');
            if(la1<lb1){ s1 = s1.replace('.','').replace(',','.');}

            let la2=s2.indexOf('.');
            let lb2=s2.indexOf(',');
            if(la2<lb2){ s2 = s2.replace('.','').replace(',','.');}

            s1 = s1.trim().replace(r1,'').replace(r3,'').replace(r2,'');
            s2 = s2.trim().replace(r1,'').replace(r3,'').replace(r2,'');
            let b1 = parseFloat(s1);
            let b2 = parseFloat(s2);
            let rmb = (b1/rate).toFixed(2) + ' - ￥' +(b2/rate).toFixed(2);
            return rmb;
    }
    
}
//取出元素数组的元素处理
const Sa9 = function(node_all){
    for(let node of node_all){
        let a = document.querySelectorAll(`${node[0]}[class*="${node[1]}"]`);
            if(a[0]){
                //console.log('当前元素为:'+JSON.stringify(node)+'总数量为:'+a.length);
                qs9(a);
          }else{
              //console.log('当前页面没有元素:'+JSON.stringify(node));
          }
    }
}
//处理所有匹配节点，放入Set去重
const qs9=function(nodes){
    nodes.forEach(x=>{
        let b=x.innerHTML.trim();
        if(rg1.test(b)){
            S.add(x);
        }else{
            //console.log('正则匹配不成功的元素内容为:');
            //console.log(b);
        }
    })
   
}
//<span class="a-offscreen">30,99&nbsp;€</span>                   | 1.709,98&nbsp;€   |€&nbsp;13,37 |30,99&nbsp;€
const t1=function(nodes){
    nodes.forEach(x=>{
        let s = x.innerHTML.trim().replace('€','').replace('&nbsp;','').replace('.','').replace(',','.');;
        if(x.nextElementSibling&&x.nextElementSibling.lastElementChild&&x.nextElementSibling.lastElementChild.innerHTML&&!x.nextElementSibling.lastElementChild.innerHTML.includes('￥')){
        let rmb = (parseFloat(s)/rate).toFixed(2);
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
            let s = parseFloat( a.children[1].innerHTML.replace(/\,/g,'')) +parseFloat('.'+ a.children[3].innerHTML);
            let rmb = (s/rate).toFixed(2);
            let c = document.createElement('sub');
            c.style.color = "green";
            c.innerHTML='￥'+rmb;
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
