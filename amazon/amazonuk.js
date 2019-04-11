console.log('Amazon价格转换插件启动...');
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
let country = 'GBP';

//监控元函数调用
// const function_time = function(function_){
//     chrome.runtime.sendMessage({op:"add",cu:"uk",s:function_}, function(response) {
//        // console.log('收到来自后台的回复：' + response);
//     });
// }

//总回调
const all=function(){
    console.log('总回调启动');
    chrome.storage.local.get(["my_rate"],function(result){
         rate = result.my_rate[`rate_${country}`];
       // Sa9(node_all);
       if(document.querySelectorAll('span[class="a-size-medium"]')[0]){
           S1(document.querySelectorAll('span[class="a-size-medium"]'));
           //function_time('s1');
       };
       if(document.querySelectorAll('span[class="a-price-whole"]')[0]){
            S2();
            //function_time('s2');
       };
       if(document.querySelectorAll('span[class="p13n-sc-price"]')[0]){
             S3();
             //function_time('s3');
        };
        if(document.querySelectorAll('span[class="a-color-price"]')[0]){
            S4();
            //function_time('s4');
       };
       if(document.querySelectorAll('span[class="a-size-medium a-color-price"]')[0]){
            S5();
            //function_time('s5');
         };
        if(document.querySelectorAll('span[class="a-size-mini twisterSwatchPrice"]')[0]){
            S6();
            //function_time('s6');
        };
        if(document.querySelectorAll('span[class="sx-price sx-price-large"]')[0]){
            S7();
            //function_time('s7');
        };
        if(document.querySelectorAll('span[class="a-size-base a-color-base"]')[0]){
            S8();
            //function_time('s8');   
        };
        if(document.querySelectorAll('span[class="a-size-medium a-color-base inlineBlock unitLineHeight"]')[0]){
            S9();
            //function_time('s9');
        };
        if(document.querySelectorAll('span[class="a-size-base a-color-price acs_product-price__buying"]')[0]){
            S10();
            //function_time('s10');
        };
        if(document.querySelectorAll('span[class="a-size-small"]')[0]){
            S11();
            //function_time('s11');
        };
        if(document.querySelectorAll('span[class="price style__xlarge__1mW1P style__buyPrice__61xrU style__bold__3MCG6"]')[0]){
            S12();  //很特别的价格   
            //function_time('s12');              
        };
        if(document.querySelectorAll('span[class="price price--jumbo"]')[0]){
            S13();  //很特别的价格     
            //function_time('s13');            
        };
        if(document.querySelectorAll('span[class="a-size-large a-color-price olpOfferPrice a-text-bold"]')[0]){
            S14();
            //function_time('s14');
        };
        //上面是之前定义的
        if(document.querySelectorAll('span[class="a-size-base a-color-price s-price a-text-bold"]')[0]){   //S15
            S1(document.querySelectorAll('span[class="a-size-base a-color-price s-price a-text-bold"]'));
            //function_time('s15');
        }
        if(document.querySelectorAll('span[class="a-color-price a-text-bold"]')[0]){       //S16
            S1(document.querySelectorAll('span[class="a-color-price a-text-bold"]'));
            //function_time('s16');
        }
        if(document.querySelectorAll('span[class="a-size-base a-color-price a-text-bold"]')[0]){   //S17
            S1(document.querySelectorAll('span[class="a-size-base a-color-price a-text-bold"]'));
            //function_time('s17');
        }
        if(document.querySelectorAll('span[class="olpShippingPrice"]')[0]){   //S18
            S1(document.querySelectorAll('span[class="olpShippingPrice"]'));
            //function_time('s18');
        }
        if(document.querySelectorAll('span[class="price-display"]')[0]){   //S18
            S1(document.querySelectorAll('span[class="price-display"]'));
            //function_time('s18');
        }
        //详情页变动处理20190410
        if(document.querySelectorAll('span[class="a-size-medium a-color-price priceBlockDealPriceString"]')[0]){   //S18
            S1(document.querySelectorAll('span[class="a-size-medium a-color-price priceBlockDealPriceString"]'));
            //function_time('s18');
        }
        if(document.querySelectorAll('span[class="a-size-medium a-color-price priceBlockBuyingPriceString"]')[0]){   //S18
            S1(document.querySelectorAll('span[class="a-size-medium a-color-price priceBlockBuyingPriceString"]'));
            //function_time('s18');
        }

        //https://www.amazon.co.uk/Bargain-Finds/bbp/bb/ref=bbp_bb_757550_tr_w_9ea285?category=%2Fwomens   这个url的价要处理，产生了错误
    })
}


//具体处理函数
const S14 = function(){
    let node_all = document.querySelectorAll('span[class="a-size-large a-color-price olpOfferPrice a-text-bold"]');
    let rg1 = /^[^0-9]{0,}/;
    let rg2 = /\,/g
    for(const a of node_all){
        if(!a.innerHTML.includes('￥')){
            let s2 = a.innerHTML.trim();
            let s = parseFloat( s2.replace(rg1,'').replace(rg2,''));
            let rmb = (s/rate).toFixed(2);
            a.innerHTML = s2+`<sub style="color:green"> ￥${rmb}</sub>`;
        }
    }
}


const S13 = function(){
    let node_all = document.querySelectorAll('span[class="price price--jumbo"]');
    for(const a of node_all){
        if(a.childElementCount==4){
            let s = parseFloat( a.children[1].innerHTML.replace(/\,/g,'')) +parseFloat('.'+ a.children[3].innerHTML);
            let rmb = (s/rate).toFixed(2);
            let c = document.createElement('sub');
            c.style.color = "green";
            c.innerHTML=' ￥'+rmb;
            a.appendChild(c);

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
            c.innerHTML=' ￥'+rmb;
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
            c.innerHTML=' ￥'+rmb+' - ￥'+rmb1;
            a.appendChild(c);
            }
        }
    }
}

const S11 = function(){
    let node_all = document.querySelectorAll('span[class="a-size-small"]');
    for(const a of node_all){
        if(!(a.parentElement.lastElementChild.tagName=='SUB')){
            let s = a.innerHTML.trim();
            let Rg = /^\D(\d{1,3}\,){0,}\d{1,3}\.\d{2}( \- \D(\d{1,3}\,){0,}\d{1,3}\.\d{2}){0,1}/;
            if(Rg.test(s)){
            let rmb = getRmb(s);
            let b = document.createElement('sub');
                b.style.color = "green";
                b.innerHTML=rmb;
                a.parentElement.appendChild(b);
            }
        }
    }
}

const S10 = function(){
    let node_all = document.querySelectorAll('span[class="a-size-base a-color-price acs_product-price__buying"]');
    let rg1 = /^[^0-9]{0,}/;
    let rg2 = /\,/g
    for(const a of node_all){
        if(!a.innerHTML.includes('￥')){
            let s2 = a.innerHTML;
            let s = parseFloat( s2.replace(rg1,'').replace(rg2,''));
            let rmb = (s/rate).toFixed(2);
            a.innerHTML = s2+`<sub style="color:green"> ￥${rmb}</sub>`;
        }
    }
}


const S9 = function(){
    let node_all = document.querySelectorAll('span[class="a-size-medium a-color-base inlineBlock unitLineHeight"]');
    for(const a of node_all){
        if(!(a.parentElement.lastElementChild.tagName=='SUB')){
            let s = a.innerHTML.trim();
                s= s.replace(/\(.{1,}?\)/,'').trim();
            let Rg = /^\D(\d{1,3}\,){0,}\d{1,3}\.\d{2}( \- \D(\d{1,3}\,){0,}\d{1,3}\.\d{2}){0,1}/;
            if(Rg.test(s)){
            let rmb = getRmb(s);
            let b = document.createElement('sub');
                b.style.color = "green";
                b.innerHTML=rmb;
                a.parentElement.appendChild(b);
            }
        }
    }
}

const S8 = function(){
    let node_all = document.querySelectorAll('span[class="a-size-base a-color-base"]');
    for(const a of node_all){
        if(!(a.parentElement.lastElementChild.tagName=='SUB')){
            let s = a.innerHTML.trim();
            let Rg = /^\D(\d{1,3}\,){0,}\d{1,3}\.\d{2}( \- \D(\d{1,3}\,){0,}\d{1,3}\.\d{2}){0,1}/;
            if(Rg.test(s)){
            let rmb = getRmb(s);
            let b = document.createElement('sub');
                b.style.color = "green";
                b.innerHTML=rmb;
                a.parentElement.appendChild(b);
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
                let rmb = ` ￥${s_} - ￥${_s}`;
                let b = document.createElement('sub');
                    b.style.color = "green";
                    b.innerHTML=rmb;
                    a.appendChild(b);
            }else if(a.childElementCount==3){
                let s1 = a.children[1].innerText;
                let s2 = a.children[2].innerText;
                let s = parseFloat( s1.replace(rg1,'')) + parseFloat('.'+ s2);
                let s_ = (s/rate).toFixed(2);
                let rmb = ` ￥${s_}`;
                let b = document.createElement('sub');
                    b.style.color = "green";
                    b.innerHTML=rmb;
                    a.appendChild(b);
            }
            
        }
    }
}

const S6 = function(){
    let node_all = document.querySelectorAll('span[class="a-size-mini twisterSwatchPrice"]');
    let rg1 = /^[^0-9]{0,}/;
    let rg2 = /\,/g;
    let rg3 = /[a-zA-Z]/mg;
    for(const a of node_all){
        let s2 = a.innerHTML;
        if(!s2.includes('￥')  && !(rg3.test(s2)) ){
            
            let s = parseFloat( s2.replace(rg1,'').replace(rg2,''));
            let rmb = (s/rate).toFixed(2);
            a.innerHTML = s2+`<sub style="color:green"> ￥${rmb}</sub>`;
        }
    }
}

const S5a = function(){
    let node_all = document.querySelectorAll('span[class="a-size-medium a-color-price"]');
    //console.log('span[class="a-size-medium"]选择器启动..');
    //let node_all_length = node_all.length;
    //console.log(node_all_length);
    for(const a of node_all){
        if(!(a.parentElement.lastElementChild.tagName=='SUB')){
            let s = a.innerHTML.trim();
            let Rg = /^\D(\d{1,3}\,){0,}\d{1,3}\.\d{2}( \- \D(\d{1,3}\,){0,}\d{1,3}\.\d{2}){0,1}/;
            if(Rg.test(s)){
            let rmb = getRmb(s);
            let b = document.createElement('sub');
                b.style.color = "green";
                b.innerHTML=rmb;
                a.parentElement.appendChild(b);
            }
        }
    }
}


const S5 = function(){
    let node_all = document.querySelectorAll('span[class="a-size-medium a-color-price"]');
    let rg1 = /^[^0-9]{0,}/;
    let rg2 = /\,/g;
    let rg3 = /[a-zA-Z]/mg;
    for(const a of node_all){
        let s2 = a.innerHTML;
        if(!s2.includes('￥')  && !(rg3.test(s2)) ){
            
            let s = parseFloat( s2.replace(rg1,'').replace(rg2,''));
            let rmb = (s/rate).toFixed(2);
            a.innerHTML = s2+`<sub style="color:green"> ￥${rmb}</sub>`;
        }
    }
}

const S4 = function(){
    let node_all = document.querySelectorAll('span[class="a-color-price"]');
    let rg1 = /^[^0-9]{0,}/;
    let rg2 = /\,/g
    for(const a of node_all){
        if(!a.innerHTML.includes('￥')){
            let s2 = a.innerHTML;
            let s = parseFloat( s2.replace(rg1,'').replace(rg2,''));
            let rmb = (s/rate).toFixed(2);
            a.innerHTML = s2+`<sub style="color:green"> ￥${rmb}</sub>`;
        }
    }
}
const S3 = function(){
    let node_all = document.querySelectorAll('span[class="p13n-sc-price"]');
    let rg1 = /^[^0-9]{0,}/;
    let rg2 = /\,/g
    for(const a of node_all){
        if(!a.innerHTML.includes('￥')){
            let s2 = a.innerHTML;
            let s = parseFloat( s2.replace(rg1,'').replace(rg2,''));
            let rmb = (s/rate).toFixed(2);
            a.innerHTML = s2+`<sub style="color:green"> ￥${rmb}</sub>`;
        }
    }
}

const S2 = function(){
    let node_all = document.querySelectorAll('span[class="a-price-whole"]');
    let rg1 = /\,/g;
    for(const a of node_all){
        if(!(a.parentElement.lastElementChild.tagName=='SUB')){
        let s1 = parseInt( a.firstChild.data.replace(rg1,''));
        let s2 = parseFloat('.' + a.nextElementSibling.innerText)
        let s12 = s1+s2;
        let rmb = (s12/rate).toFixed(2);
        let b = document.createElement('sub');
            b.style.color = "green";
            b.innerHTML=' ￥'+rmb;
            a.parentElement.appendChild(b);

        }
    }
}

const S1 = function(node_all){
    // let node_all = document.querySelectorAll('span[class="a-size-medium"]');
    for(const a of node_all){
        if(!(a.parentElement.lastElementChild.tagName=='SUB')){
            let s = a.innerHTML.trim();
            // let Rg = /^\D(\d{1,3}\,){0,}\d{1,3}\.\d{2}( \- \D(\d{1,3}\,){0,}\d{1,3}\.\d{2}){0,1}/;
            let Rg = /^\D(\d{1,3}\,){0,}\d{1,3}\.\d{2}( \- \D(\d{1,3}\,){0,}\d{1,3}\.\d{2}){0,1}/;
            if(Rg.test(s)){
            let rmb = getRmb(s);
            let b = document.createElement('sub');
                b.style.color = "green";
                b.innerHTML=rmb;
                a.parentElement.appendChild(b);
            }
        }
    }
}

const getRmb = function(s){
    if(s.includes('-')){
        let [s1,s2] = s.split('-'); 
        let rg1 = /^[^0-9]{0,}/;
        let rg2 = /\,/g;
        let s11 =  s1.trim().replace(rg1,'').replace(rg2,'');
        let s22 =  s2.trim().replace(rg1,'').replace(rg2,'');
        let s111 = (s11/rate).toFixed(2);
        let s222 = (s22/rate).toFixed(2);
        return ` ￥${s111} - ￥${s222}`;
    }else{
        let rg1 = /[^0-9]{0,}/;
        let rg2 = /\,/g;
        let s1 = s.trim().replace(rg1,'').replace(rg2,'');
        let s11 = (s1/rate).toFixed(2);
        return ` ￥${s11}`;
    }
}