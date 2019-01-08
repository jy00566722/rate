let rate_arr=[];//汇率数组
let rate_CNY = 1;//人民币中间数字

//给7个input绑定事件，改变中间值
let rate_u34q = document.getElementsByName("rate_u34q");
for(let i =0;i<rate_u34q.length;i++){
    rate_u34q[i].addEventListener('blur',function(){   //blur
        let a = parseFloat( rate_u34q[i].value);
        let b = a/rate_arr[`rate_${rate_u34q[i].id.slice(-3)}`];
        if(isNaN(a)){
            return;
        }else{
            chrome.storage.local.set({"my_CNY":b},function(s){
                console.log(`修改storage中my_CNY的值为${a}`);
            });
        }
        console.log("失去焦点了...");
        console.log(a);
    })
}

//获得焦点时清空
for(let i =0;i<rate_u34q.length;i++){
    rate_u34q[i].addEventListener('focus',function(){   
        // rate_u34q[i].value = '';

    })
}

//按回车时计算值
for(let i =0;i<rate_u34q.length;i++){
    rate_u34q[i].addEventListener('keyup',function(){  
        if(event.keyCode==13){
            rate_u34q[i].blur();
        } 
    })
}

//根据汇率与中间值，给7个input计算值
let get_value = function(){
    let s = ["CNY","SGD","PHP","MYR","IDR","VND","THB","TWD","USD","JPY","GBP","EUR"];
    s.map(x=>{
        document.getElementById(`Rate_${x}`).value=(rate_CNY*rate_arr[`rate_${x}`]).toFixed(2);
    });
};

//汇率转换初始化程序  主入口
function init(arr){
    //初始化汇率与中间值
    chrome.storage.local.get(["my_rate","my_CNY"],function(result){
        console.log("从storage中取出来的汇率数据为:");
        console.log(result);
        rate_arr=result.my_rate;
        rate_CNY = result.my_CNY;
       // console.log(rate_CNY);
       // console.log(rate_arr);
        get_value();
    });
}

//监听stroge的值变化
chrome.storage.onChanged.addListener(function(changs,namespace){
    console.log('storage变化了:');
    console.log(changs);
    console.log(namespace);
    init();
  });
init();