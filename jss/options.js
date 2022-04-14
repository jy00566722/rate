console.log('optionsJs is GO!!!')

/* window.addEventListener('message', function(event) {
    console.log('收到信息:',event)
  }); */

  //  document.getElementById('theFrame').contentWindow.postMessage(message, '*');


/*   document.getElementById('startOzon').addEventListener('click', function(event) {
    console.log('start ozon...ing')
     chrome.permissions.request({
        permissions: ['scripting'],
        origins:['https://www.ozon.ru/*']
      }, (granted) => {
        if (granted) {
            chrome.scripting.registerContentScripts([
                {
                    id:'ozon',
                    matches:['https://www.ozon.ru/*'],
                    js:["jss/Underscore.js",'ozon/ozon.js'],
                    runAt:'document_end'
                }
            ],()=>{
                console.log('注册成功')
            });
        }
      }); 
  }); */