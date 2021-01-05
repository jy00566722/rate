console.log('Amazon价格转换插件启动...');
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
let country = 'USD';
let S = new Set();
/** 
<span class="price style__xlarge__1mW1P style__price__-bRnk" aria-label="$199.00" data-reactid="12">
    <span data-reactid="13">
        <span class="style__currency__3EvPb" data-reactid="14">$</span>
        <span class="style__whole__3EZEk" data-reactid="15">199</span>
        <span class="style__decimalSeparator__3QFvC" data-reactid="16">.</span>
        <span class="style__fractional__iPo3s" data-reactid="17">00</span>
    </span>
</span>
**/
   
let node_all =[
    ['span','a-size-'],
    ['span','a-color-'],
    ['span','p13n-sc-price'],
    ['span','gb-font-size-medium inlineBlock unitLineHeight dealPriceText']
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
            //t1(e1);
            S2();
        }

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
    })
}

let rg = /^\$(\d{1,3}\,){0,1}\d{1,3}\.\d{2}( \- \$(\d{1,3}\,){0,1}\d{1,3}\.\d{2}){0,1}$/;

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
    if(!s.includes('-')){
            let a = s.trim().replace(r1,'').replace(r2,'');
            let b = parseFloat(a);
            let rmb  = (b/rate).toFixed(2);
            return rmb;
    }else{
            let [s1,s2] = s.split('-');
            s1 = s1.trim().replace(r1,'').replace(r2,'');
            s2 = s2.trim().replace(r1,'').replace(r2,'');
            let rmb = (s1/rate).toFixed(2) + ' - ￥' +(s2/rate).toFixed(2);
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
        if(rg.test(b)){
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
const S2 = function(){
    let node_all = document.querySelectorAll('span[class="a-price-whole"]');
    let rg1 = /\,/g;
    let rg2= /\<\!\-\-.+?\>/mg;
    for(const a of node_all){
        if(!(a.parentElement.lastElementChild.tagName=='SUB')){
        //let s1 = parseInt( a.firstChild.data.replace(rg1,'')); 
        let s1 = parseInt( a.innerText.replace(rg1,'')); 

        let s2 = parseFloat('.' + a.nextElementSibling.innerText)
        let s12 = s1+s2;
        let rmb = (s12/rate).toFixed(2);
        let b = document.createElement('sub');
            b.style.color = "green";
            b.innerHTML='￥'+rmb;
            a.parentElement.appendChild(b);

        }
    }
}