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

let feedback_list_last_s = ''
let feedback_flag = 1 //上报反馈开关
let rate = 0
let amazon_nodes = []

//总回调
const all=function(){
    //console.log('总回调启动');
    chrome.storage.local.get(["my_rate",'amazon_nodes','feedback_flag'],function(result){
        rate = result.my_rate[`rate_${country}`];
        amazon_nodes = result.amazon_nodes
        feedback_flag = result.feedback_flag
        foreach_nodes(amazon_nodes)
    //特别价格处理
    let e1 = document.querySelectorAll('span[class="a-offscreen"]')
        if(e1[0]){
            t1(e1)
        }
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
    let r6 = /[^0-9\|]/g
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
            let s2 = s1.slice(0,-3)+ '|' +s1.slice(-2)
            //s3 = s2.replace(r3,'').replace(r4,'').replace(r5,'').replace(/\|/g,'.')
            let s3 = s2.replace(r6,'').replace(/\|/g,'.')
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
    let feedback_list = []
    for(let node of node_all){
        let a = document.querySelectorAll(`${node[0]}[${node[1]}="${node[2]}"]`)
        if(feedback_flag){
            let n = a.length
            feedback_list.push([`feedback-amazon-${node[0]}-${node[1]}-${node[2]}`,n])
        }
        if(a[0]){
            changePriceOfTheOneNode(a)
        }
    }
    if(feedback_flag){
        post_element_isok(feedback_list)
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
        if(s === 'price'){//非常特别的价格
            let a = x.nextElementSibling
            let b = a.innerText
            let c = b.replace(/[^0-9\,\.]/g,'')
            let d = c.replace(',','.')
            //console.log(d)
            if(x.nextElementSibling&&x.nextElementSibling.lastElementChild){
                if(!x.nextElementSibling.lastElementChild.innerHTML.includes('￥')){
                 let rmb = getRmb(d);
                 if(rmb){
                     let b = document.createElement('sub');
                     b.style.color = "green";
                     b.innerText = '￥'+rmb;
                     x.nextElementSibling.appendChild(b);
                 }
                
                }
             }



        }else{
            if(x.nextElementSibling&&x.nextElementSibling.lastElementChild){
                if(!x.nextElementSibling.lastElementChild.innerHTML.includes('￥')){
                 let rmb = getRmb(s);
                 if(rmb){
                     let b = document.createElement('sub');
                     b.style.color = "green";
                     b.innerText = '￥'+rmb;
                     x.nextElementSibling.appendChild(b);
                 }
                
                }
             }
        }

    })
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
        //console.log('出错了?')
    }
}