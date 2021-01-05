console.log('Amazon巴西价格转换插件启动...');
//====统一监听body的改变，触发总回调
let callback = function (records) {
    //console.log('回调启动...');
    chrome.storage.local.get(['amazon_tag'], function (s) {
        const { amazon_tag } = s
        if (amazon_tag) {
            all();
        } else {
            console.log('amazon开关关闭')
        }
    })
};
let throttle_callback = _.throttle(callback, 3500);

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

let rate = 0;
let country = 'BRL';
let S = new Set();

let node_all = [
    ['span', 'a-size-'],
    ['span', 'a-color-'],
    ['span', 'p13n-sc-price'],
    ['span','sc-EHOje eIzziE']
];
//总回调
const all = function () {
    console.log('总回调启动');
    chrome.storage.local.get(["my_rate"], function (result) {
        rate = result.my_rate[`rate_${country}`];
        S.clear();
        Sa9(node_all);
        //console.log(S);
        foo(S);

        //特别价格处理
        let e1 = document.querySelectorAll('span[class="a-offscreen"]');
        if (e1[0]) {
            t1(e1);
        }

    })
}
//R$67,28 - R$104,99 
let rg1 = /^R\$(\&nbsp\;){0,1}\d{1,}\,\d{1,}( - R\$(\&nbsp\;){0,1}\d{1,}\,\d{1,2}){0,1}$/

//从Set中取出元素，然后替换html
const foo = function (s) {
    s.forEach(x => {
        let a = x.innerHTML.trim();
        let rmb = getRmb(a);
        x.innerHTML = a + `<sub style="color:green"> ￥${rmb}</sub>`;
    })
}
//计算人民币
const getRmb = function (s) {
    let r1 = /^[^0-9]*/i;
    let r2 = /,/g;
    let r3 = /[^0-9]*$/;

    if (!s.includes('-')) {
        let la = s.indexOf('.');
        let lb = s.indexOf(',');
        if (la < lb) { s = s.replace('.', '').replace(',', '.'); }

        let a = s.trim().replace(r1, '').replace(r3, '').replace(r3, '');
        let b = parseFloat(a);
        let rmb = (b / rate).toFixed(2);
        return rmb;
    } else {
        let [s1, s2] = s.split('-');
        let la1 = s1.indexOf('.');
        let lb1 = s1.indexOf(',');
        if (la1 < lb1) { s1 = s1.replace('.', '').replace(',', '.'); }

        let la2 = s2.indexOf('.');
        let lb2 = s2.indexOf(',');
        if (la2 < lb2) { s2 = s2.replace('.', '').replace(',', '.'); }

        s1 = s1.trim().replace(r1, '').replace(r3, '').replace(r2, '');
        s2 = s2.trim().replace(r1, '').replace(r3, '').replace(r2, '');
        let b1 = parseFloat(s1);
        let b2 = parseFloat(s2);
        let rmb = (b1 / rate).toFixed(2) + ' - ￥' + (b2 / rate).toFixed(2);
        return rmb;
    }

}
//取出元素数组的元素处理
const Sa9 = function (node_all) {
    for (let node of node_all) {
        let a = document.querySelectorAll(`${node[0]}[class*="${node[1]}"]`);
        if (a[0]) {
            //console.log('当前元素为:'+JSON.stringify(node)+'总数量为:'+a.length);
            qs9(a);
        } else {
            //console.log('当前页面没有元素:'+JSON.stringify(node));
        }
    }
}
//处理所有匹配节点，放入Set去重
const qs9 = function (nodes) {
    nodes.forEach(x => {
        let b = x.innerHTML.trim();
        if (rg1.test(b)) {
            S.add(x);
        } else {
            //console.log('正则匹配不成功的元素内容为:');
            //console.log(b);
        }
    })

}

const t1 = function (nodes) {
    nodes.forEach(x => {
        let s = x.innerHTML.trim().replace('R$', '').replace('&nbsp;', '').replace('.', '').replace(',', '.');
        //console.log(s)
        if (x.nextElementSibling && x.nextElementSibling.lastElementChild && x.nextElementSibling.lastElementChild.innerHTML && !x.nextElementSibling.lastElementChild.innerHTML.includes('￥')) {
            let rmb = (parseFloat(s) / rate).toFixed(2);           
            let b = document.createElement('sub');
            b.style.color = "green";
            b.innerHTML = '￥' + rmb;
            x.nextElementSibling.appendChild(b);
            
        }
    })
}



