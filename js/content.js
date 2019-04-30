//创建主界面div 包括关闭按键  默认隐藏


let rate_arr = [];//汇率数组
let rate_CNY = 1;//人民币中间数字

function creatDiv() {
    var elem_p = document.createElement("div");
    elem_p.id = 'rate_s';
    elem_p.style.backgroundColor = 'green';
    elem_p.style.color = 'red';
    elem_p.style.position = 'absolute';
    elem_p.style.width = '200px';
    elem_p.style.height = '300px';
    elem_p.style.left = '20px';
    elem_p.style.top = '400px';
    elem_p.style.visibility = "hidden";
    //elem_p.innerHTML = '我是主界面div';

    console.log("Rate:主div创健完毕!!");
    var elem_bt = document.createElement("button");
    elem_bt.id = "rate_shutdown";
    elem_bt.innerText = "关闭";
    elem_p.appendChild(elem_bt);

    str = `<span>人民币:</span><input type="text"  name = "rate_u34q" id="Rate_CNY">
        <span>新加坡:</span><input type="text"  name = "rate_u34q" id="Rate_SGD">
        <span>菲律宾:</span><input type="text" name = "rate_u34q" id="Rate_PHP">
        <span>马来西亚:</span><input type="text" name = "rate_u34q" id="Rate_MYR">
        <span>印尼:</span><input type="text" name = "rate_u34q" id="Rate_IDR">
        <span>越南:</span><input type="text" name = "rate_u34q" id="Rate_VND">
        <span>泰国:</span><input type="text" name = "rate_u34q" id="Rate_THB">`;
    elem_input = document.createElement("div");
    elem_input.id = "rate_ss";
    elem_input.innerHTML = str;
    elem_p.appendChild(elem_input);
    document.body.appendChild(elem_p);
    //添加关闭事件
    document.getElementById("rate_shutdown").addEventListener('click', function () {
        var rate_s = document.getElementById("rate_s");
        //rate_s.style.display = "none";
        rate_s.style.visibility = "hidden";
        console.log("Rate:关闭主界面");
    }, false);
    //绑定数字变化事件
    let rate_u34q = document.getElementsByName("rate_u34q");
    for (let i = 0; i < rate_u34q.length; i++) {
        rate_u34q[i].addEventListener('blur', function () {
            let a = parseFloat(rate_u34q[i].value);
            let b = a / rate_arr[`rate_${rate_u34q[i].id.slice(-3)}`];
            if (isNaN(a)) {
                return;
            } else {
                chrome.storage.local.set({ "my_CNY": b }, function (s) {
                    console.log(`修改storage中my_CNY的值为${a}`);
                });
            }
            console.log("失去焦点了...");
            console.log(a);
        })
    }
}


//把主界面从隐藏中显示
function showDiv() {
    document.getElementById("rate_s").style.visibility = "visible";
    console.log("显示主Div");
}



//根据汇率与中间值，给7个input计算值
let get_value = function () {
    let s = ["CNY", "SGD", "PHP", "MYR", "IDR", "VND", "THB"];
    s.map(x => {
        document.getElementById(`Rate_${x}`).value = (rate_CNY * rate_arr[`rate_${x}`]).toFixed(2);
    });
};

//汇率转换初始化程序  主入口
function init(arr) {
    creatDiv();
    //初始化汇率与中间值
    chrome.storage.local.get(["my_rate", "my_CNY"], function (result) {
        //console.log("从storage中取出来的汇率数据为:");
        //console.log(result);
        rate_arr = result.my_rate;
        rate_CNY = result.my_CNY;
        // console.log(rate_CNY);
        // console.log(rate_arr);
        get_value();
    });

}
//监听右键事件
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
    if (request.cmd == 'showDiv') {
        showDiv();
    };
    if (request.cmd == 'get_value') {
        console.log('收到后台重新计算的通知.');
        chrome.storage.local.get(["my_rate", "my_CNY"], function (result) {
            //console.log("从storage中取出来的汇率数据为:");
            // console.log(result);
            rate_arr = result.my_rate;
            rate_CNY = result.my_CNY;
            // console.log(rate_CNY);
            // console.log(rate_arr);
            get_value();
        });
    };
    sendResponse(`信息收到${request.cmd}`);
});

init();
