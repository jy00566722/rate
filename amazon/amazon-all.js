console.log('Amazon价格转换插件启动...');

//
let URL = document.URL
let country = '' //rate  
if(URL.includes('amazon.com/')){
    country = 'USD'
}else if(URL.includes('amazon.co.jp/')){
    country = 'JPY'
}else if(URL.includes('amazon.co.uk/')){
    country = 'GBP'
}else if(URL.includes('amazon.de/')|| URL.includes('amazon.fr/') || URL.includes('amazon.es/') || URL.includes('amazon.it/')){
    country = 'EUR'
}else if(URL.includes('amazon.com.br/')){
    country = 'BRL'
}else if(URL.includes('amazon.com.mx/')){
    country = 'MXN'
}else if(URL.includes('amazon.com.au/')){
    country = 'AUD'
}else if(URL.includes('amazon.ca/')){
    country = 'CAD'
}
console.log('确定的国家为:'+country)


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

let rate = 0
let node_all =[
    ['span','id','priceblock_ourprice'],//man price
    ['span','id','priceblock_saleprice'],//man price
    ['span','id','priceblock_dealprice'],//man price
    ['span','class','a-size-medium a-color-price'], //deail down a-size-medium a-color-price
    ['span','class','p13n-sc-price'], //deail down a-size-medium a-color-price
    ['span','class','a-color-price a-text-bold'], // 详情页中间 对比价
    ['p','class','a-spacing-none a-text-left a-size-mini twisterSwatchPrice'] //规格方框中的价格
 ] 
//总回调
const all=function(){
    //console.log('总回调启动');
    chrome.storage.local.get(["my_rate"],function(result){
        rate = result.my_rate[`rate_${country}`];

    //特别价格处理
    let e1 = document.querySelectorAll('span[class="a-offscreen"]')
        if(e1[0]){
            t1(e1)
        }

        foreach_nodes(node_all)
     
    })
}

let rg = /^\$(\d{1,3}\,){0,1}\d{1,3}\.\d{2}( \- \$(\d{1,3}\,){0,1}\d{1,3}\.\d{2}){0,1}$/

//计算人民币
const  getRmb = function(s){
        if(!s.includes('-')){
            return getRmb_of(s)
        }else{
            let [sa,sb] = s.split('-')
            let s1 = getRmb_of(sa)
            let s2 = getRmb_of(sb)
            if(s1 && s2){
                return s1 + ' - ￥'+ s2
            }else{
                return null
            }
            
        }
}

const getRmb_of = function(s){
    let r1 = /^[^0-9]*/i
    let r2 = /[^0-9]*$/i
    let r3 = /,/g
    let r4 = /\./g
    let r5 = / /g
    if(country === 'JPY'){ //japan
        let s1 = s.replace(r1,'').replace(r2,'')
        let s2 = s1.replace(r3,'')
        let b = parseFloat(s2)
        let rmb = b/rate
        if(rmb){
            return rmb.toFixed(2)
        }else{
            return 0
        }

    }else{ //orther
        let s1 = s.replace(r1,'').replace(r2,'')
        let s_ = s1.slice(-3,-2)
        if(s_==='.' || s_===','){
            s2 = s1.slice(0,-3)+ '|' +s1.slice(-3)
            s3 = s2.replace(r3,'').replace(r4,'').replace(r5,'').replace(/\|/g,'.')
            let b = parseFloat(s3)
            let rmb = b/rate
            if(rmb){
                return rmb.toFixed(2)
            }else{
                return 0
            }
        }else{
            return 0
        }
    }

}
//取出元素数组的元素处理
const foreach_nodes = function(node_all){
    for(let node of node_all){
        let a = document.querySelectorAll(`${node[0]}[${node[1]}="${node[2]}"]`)
            if(a[0]){
                changePriceOfTheOneNode(a)
          }
    }
}

const changePriceOfTheOneNode=function(nodes){
    nodes.forEach(e=>{
        let c=e.innerHTML.trim()
        if((!e.nextElementSibling) || (e.nextElementSibling && e.nextElementSibling.tagName != 'SUB')){
            let rmb = getRmb(c)
            if(rmb){
                let b = document.createElement('sub')
                    b.style.color = 'green'
                    b.innerText = '￥'+rmb
                    e.after(b)
            }
        }
    })
}

const t1=function(nodes){
    nodes.forEach(x=>{
        let s = x.innerHTML.trim();
        if(x.nextElementSibling&&x.nextElementSibling.lastElementChild){
           if(!x.nextElementSibling.lastElementChild.innerHTML.includes('￥')){
            let rmb = getRmb(s);
            let b = document.createElement('sub');
                b.style.color = "green";
                b.innerText = '￥'+rmb;
                x.nextElementSibling.appendChild(b);
           }
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