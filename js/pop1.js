//除法
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
    try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return (r1 / r2) * pow(10, t2 - t1);
    }
}
//乘法
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        rate: [],
        rate1: 1,
        rate2: 1,
        je_cny: 1,
        je1:1,
        je2:1
    },
    created: function () {
        let self = this;
        chrome.storage.local.get(["my_rate_z"], function (result) {
            console.log("从storage中取出来的汇率数据为:");
            console.log(result);
            self.rate = result.my_rate_z
        });
    },
    methods:{
        go:function(){
            return this.je2 = (Number(this.je1) / Number(this.rate1))*Number(this.rate2);
        }
    },
    computed: {
/*         je1: {
            get: function () {
                //return (Number(this.je_cny) * Number(this.rate1))//.toFixed(4);

                return accMul(Number(this.je_cny),Number(this.rate1));
            },
            set: function (val) {
               // this.je_cny = (Number(val) / Number(this.rate1))//.toFixed(4); 
               this.je_cny = accDiv(Number(val),Number(this.rate1));
                
            }
        },
        je2: {
            get: function () {
               // return (Number(this.je_cny) * Number(this.rate2))//.toFixed(4);
               return accMul(Number(this.je_cny),Number(this.rate2));
            },
            set: function (val) {
                //this.je_cny = (Number(val) / Number(this.rate2))//.toFixed(4); 
                this.je_cny = accDiv(Number(val),Number(this.rate2));
               
            }
        }, */
    },
    /*     watch:{
            rate1:function(val){
                this.je_cny = (Number(this.je1)/Number(val))
            },
            rate2:function(val){
                this.je_cny = (Number(this.je2)/Number(val))
            }
        } */
})