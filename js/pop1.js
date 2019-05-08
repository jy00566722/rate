var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        rate: [],
        rate1:1,
        rate2:1,
        je_cny:1
        //je1:1,
        //je2:1
    },
    created:function(){
        let self =this;
        chrome.storage.local.get(["my_rate_z"],function(result){
            console.log("从storage中取出来的汇率数据为:");
            console.log(result);
           self.rate=result.my_rate_z
            
        });
    },
    computed:{
        je1:{
            get:function(){
                return (Number(this.je_cny)*Number(this.rate1))//.toFixed(4);
            },
            set:function(val){
                this.je_cny = (Number(val)/Number(this.rate1))//.toFixed(4); 
                console.log(this.je_cny);
            }
        },
        je2:{
            get:function(){
                return (Number(this.je_cny)*Number(this.rate2))//.toFixed(4);
            },
            set:function(val){
                this.je_cny = (Number(val)/Number(this.rate2))//.toFixed(4); 
                console.log(this.je_cny);
            }
        },
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