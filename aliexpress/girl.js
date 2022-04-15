console.log('速卖通价格转换插件启动');

const getRate = async()=>{
    let a = await cookieStore.get('aep_usuc_f')
    let b = a.value.split('&')
    let c = '' 
    let d = ''
    b.map(e=>{
        const [a1 ,a2] = e.split('=')
        if(a1 === 'c_tp'){
            c = a2
        }
        if(a1 === 'site'){
            d = a2
        }

    })
    return [c,d]
}

let currency = ''
let rate = 0
let site = ''
let aliexpress_nodes = []
let aliexpress_element = []
let aliexpress_special_price = []
let feedback_list_last_s = ''
let feedback_flag = 1 //上报反馈开关
//====统一监听body的改变，触发总回调
let callback = function (records) {
    chrome.storage.local.get(['aliexpress_tag'],function(s){
        const {aliexpress_tag} = s
        if(aliexpress_tag){
            all();
        }else{
            console.log('aliexpress开关关闭')
        }

    })
};
let throttle_callback = _.throttle(callback, 3200);
let mo = new MutationObserver(throttle_callback);
let option = {
    'childList': true,
    'subtree': true
};
let fs_node = document.getElementsByTagName("body")[0];
try {
    mo.observe(fs_node, option);
} catch (e) {
    console.log('监听器启动失败body."');
}
async function  all() {
    //console.log('总回调启动.');
    if(currency === ''){
        [currency,site] = await getRate()
        console.log(currency,site)
    }
    //console.log('currency:',currency)
    chrome.storage.local.get(["my_rate",'aliexpress_nodes','aliexpress_element','aliexpress_special_price','feedback_flag'], function (result) {
        rate = result.my_rate[`rate_${currency}`];
        aliexpress_nodes = result.aliexpress_nodes
        aliexpress_element = result.aliexpress_element
        aliexpress_special_price = result.aliexpress_special_price
        feedback_flag = result.feedback_flag
        //console.log(aliexpress_nodes,aliexpress_element)
        if(aliexpress_element.length>0){ //不让人民币价格被隐藏
            setElementStyle(aliexpress_element)
        }
        if(aliexpress_special_price.length>0){
            special_price_do(aliexpress_special_price)
        }
        
        find_node(aliexpress_nodes);

    })
}

//找出元素
function find_node(node_all) {
    let feedback_list = []
    for (let node of node_all) {
        let a = document.querySelectorAll(`${node[0]}[${node[1]}="${node[2]}"]`)
        if(feedback_flag){
            let n = a.length
            feedback_list.push([`feedback-aliexpress-${node[0]}-${node[1]}-${node[2]}`,n])
        }
        if (a[0]) {
            insetHtml(a);
        }
    }
    if(feedback_flag){
        post_element_isok(feedback_list)
    }

}

//替换html
const insetHtml = function (nodes) {
    nodes.forEach(e => {
        let s = e.innerHTML
        //console.log(s)
/*         if((!e.nextElementSibling) || (e.nextElementSibling && e.nextElementSibling.tagName != 'SUB')){
            let rmb = getRmb(e.innerHTML)
            if(rmb){
                let b = document.createElement('sub')
                    b.style.color = 'green'
                    b.innerText = '￥'+rmb
                    e.after(b)
            }
        } */
        if(s.includes('%')){return}
        if(s.includes('Order')){return}
        if(s.includes('-')){return}

        if(currency === 'JPY'){
            let a = s.match(/￥/g)
            if(a && a.length===1){
                let rmb = getRmb(s)
                if(rmb){
                    e.innerHTML = e.innerHTML+ `<sub title="￥${rmb}" style="color:green"> ￥${rmb}</sub>`
                }
            }
        }else{
            if(!s.includes('￥')){
                let rmb = getRmb(s)
                if(rmb){
                    e.innerHTML = e.innerHTML+ `<sub title="￥${rmb}" style="color:green"> ￥${rmb}</sub>`
                }
            }
        }

    })

}

const getRmb = function (s) {
    //console.log('====')
    //console.log(s)
    let r1 = /^[^0-9]*/i
    let r2 = /[^0-9]*$/i
    let r3 = /,/g
    let r4 = /\./g
    let r5 = / /g
    let r6 = /^[0-9\,]{1,}$/
    let r7 = /руб\./
    let r8 = /\&nbsp\;/g
    let s1 = s.replace(r1,'').replace(r2,'')
    //console.log(s1)
    if(s1.includes('-')){
        return 0
    }
    //7&nbsp;511,24    руб.53,636.52 
    if(currency === 'RUB'){ 
        let s2 = s1.replace(r7,'').replace(r8,'')
        let s3 = s2.slice(0,-3)+ '|' +s2.slice(-3)
        let s4 = s3.replace(r3,'').replace(r4,'').replace(r5,'').replace(r8,'').replace(/\|/g,'.')
        let b = parseFloat(s4)
        let rmb = b/rate
        if(rmb){
            return rmb.toFixed(2)
        }else{
            return 0
        }
    }

    //  25,256.32  214.235,98   
    let s1_ = s1.slice(-3,-2)
    if(s1_ === '.' || s1_ === ','){
        let s2 = s1.slice(0,-3)+ '|' +s1.slice(-3)
        let s3 = s2.replace(r3,'').replace(r4,'').replace(r5,'').replace(r8,'').replace(/\|/g,'.')
        let b = parseFloat(s3)
        let rmb = b/rate
        if(rmb){
            return rmb.toFixed(2)
        }else{
            return 0
        }
    }

    //all Number  256 256,215,125
    if(r6.test(s1)){
        let s1_ = s1.replace(r3,'')
        let b = parseFloat(s1_)
        let rmb = b/rate
        if(rmb){
            return rmb.toFixed(2)
        }else{
            return 0
        }
    }
}

//document.querySelectorAll('.U9mS2 ._2FkhA')[0].setAttribute('style','overflow:visible;')
//这里是为了不让人民币价格被隐藏
const setElementStyle = function(list){
    list.map(el=>{
        let a = document.querySelectorAll(el[0])
        if(a[0]){
            a.forEach(e=>{
                e.setAttribute(el[1],el[2])
            })
        }
    })
}

const special_price_do = function(node_list){
    node_list.map(el=>{
        let a = document.querySelectorAll(el)
        if(a[0]){
            a.forEach(e=>{
                let b = e.innerText
                if(!b.includes('￥')){
                    //let c = b.replace(/[^0-9\,\.]/g,'')
                    //let d = c.replace(',','.')
                    let rmb = getRmb(b)
                    if(rmb){
                        let element_my = document.createElement('sub')
                        element_my.style.color = 'green'
                        element_my.innerText = '￥' + rmb
                        e.appendChild(element_my)
                    }
                }                
            })
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
        console.log('出错了?')
    }
}