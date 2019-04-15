# rate

> 这是一个跨境平台前端价格转化为人民币的插件,目前支持的平台有：    
lazada    
shopee    
amazon    
……


### 下载

##### [chrome扩展](https://chrome.google.com/webstore/detail/%E6%B1%87%E7%8E%87%E8%BD%AC%E6%8D%A2/bcpgdpedphodjcjlminjbdeejccjbimp?hl=zh-CN)

##### [360安全浏览器](https://ext.se.360.cn/webstore/detail/bgfcdfgjkfbfbdhfplojpnbiggdkiiih)

注：由于插件审核需要时间，所以在插件市场上的，可能不是最新版本. 特别是360插件市场的审核非常慢。
##### 如果360市场不是最新的1.2.3.0版本，可以使用这个离线[crx文件](http://g.deey.top/rate-360-1.2.3.0.crx)安装. 注意这个crx文件只适用于360安全浏览器，不适用于chrome浏览器。
##### 原因是：1、这个crx是360安全浏览器打包的。2、最新版本的chrome已经禁止离线安装crx插件，都是要在线安装的。

### 源代码：
[Github](https://github.com/jy00566722/rate)

### 目前支持的平台:

lazada:

- 马来西亚：https://www.lazada.com.my/
- 菲 律 宾：https://www.lazada.com.ph/
- 新 加 坡：https://www.lazada.sg/
- 印    尼：https://www.lazada.co.id/
- 越    南：https://www.lazada.vn/
- 泰    国：https://www.lazada.co.th/

Shopee:
- 马来西亚：https://shopee.com.my/
- 菲律宾  ：https://shopee.ph/
- 新加坡  ：https://shopee.sg/
- 印  尼  ：https://shopee.co.id/
- 越  南  ：https://shopee.vn/
- 泰  国  ：https://shopee.co.th/
- 台  湾  ：https://shopee.tw/

Amazon:  (请注意切换为本地货币:如美国站，切换为美元货币。日本站切换为日元货币。如已经切换为人民币，可能造成价格不准确，后续版本会解决.)
- 美  国 ：https://www.amazon.com/
- 日  本 : https://www.amazon.co.jp/ 
- 英  国 ：https://www.amazon.co.uk/
- 德  国 ：https://www.amazon.de/

速卖通:
- https://www.aliexpress.com/    (使用时注意切换货币单位为美元，后续会支持更多货币)


### 介绍：

此插件为lzada/shopee/Amazon卖家设计，用于显示lazada/shopee各站点前台页面上商品价格对应的人民币价格(在原价格右下方显示一个绿色的人民币价格，部分带有深色底色的地方会采用红色字),也方便卖家观察竞争对手的价格。

PS:Lazada/Shopee买家也是可以用的，但使用场景感觉不多，海淘用户可以用。

对于跨境卖家，在网站前台查看商品时，印尼币、越南币动则十万百万的价格数字，不能直观的看出对应的人民币价格是多少，这个插件可以完美解决此问题。
同时也提供手动输入数字转换货币的功能，可以互转货币的国家为:中国，马来西亚，新加坡，菲律宾，印尼，越南，泰国,台湾。

### 关于汇率：
         汇率是每20分钟更新一次。

### 关于效率：
         插件不会持续操作页面造成卡顿，只有在页面内容有更新时才启动，放心使用。

### 关于安全：
       插件不会记录用户的任何数据，有google/360审查。

### 可能存在的问题：
        由于Lazada/Shopee/Amazon前端页面，可能会更新，网页结构会变化，造成不能正常显示对应的人民币价格，会定期针对更新。
        如果在使用中发现哪个页面没有显示人民币价格，欢迎邮件联系反馈，感谢。ideey88@gmail.com
        由于需要维护的站点较多，时常会有更新。在不能显示价格时，可以先看是否为最新版本。如果不是，可以删除后再安装新版本。（或是等Chrome自动插件更新）




### 更新记录

- 1.4.0.0    2019年4月13日 完全重写Lazada价格转换插件，更通用，更流畅,兼容性更强
- 1.3.0.0    2019年4月10日 增加速卖通美元货币支持(另外的货币价格，后续支持，所以使用时请切换为美元货币)
- 1.2.5.0    2019年4月10日 修复Shopee列表页价格显示
- 1.2.4.0    2019年4月10日 修复Amazon美国/日本/英国/德国 详情页主价显示，及德国搜索列表商品价格显示
- 1.2.3.1    2019年4月10日 修复美国Amazon详情页主价格显示
- 1.2.3.0    2019年1月9日 增加德国亚马逊站点支持
- 1.2.2.0    2019年1月8日 增加英国亚马逊站点支持
- 1.2.1.0    2019年1月5日 增加日本亚马逊站点支持
- 1.2.0.0:   2019年1月4日 增加美国亚马逊站点支持
- 1.1.0.0:   12月30日晚上9点更新 增加shopee平台的支持			
- 1.0.0.0:  Lazada平台适配成功
