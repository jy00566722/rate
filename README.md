##原起：
    在做跨境电商平台时，特别是东南亚平台，有些国家的货币数字太大，不能方便的看出来是
    多少人民币，比如100万越南盾约为￥296人民币，100万啊。
    于是制作了此插件，可以在页面上显示商品价格对应的人民币数字。多说无益，直接上图:

    

######亚马逊英国站:
![亚马逊英国站](https://i.loli.net/2019/05/20/5ce2a0c77134317620.png)

######Lazada印尼站:
![Lazada印尼站](https://i.loli.net/2019/05/20/5ce2a139de10c84000.png)

######Aliexpress速卖通:
![未命名1558356422.png](https://i.loli.net/2019/05/20/5ce2a1d457ae453174.png)

######163国货币自由转换:
![photo6061983770506012867.jpg](https://i.loli.net/2019/12/25/KIWSOdlAHZqnDcF.jpg)


    此插件海淘用户可以使用，特别是喜欢在美亚，日亚上淘宝的朋友。

## Rate

> 这是一个跨境平台前端价格转化为人民币的插件,目前支持的平台有：    
Lazada    
Shopee    
Amazon   
Aliexpress 
Wish(暂停支持)



### 下载

##### [chrome扩展](https://chrome.google.com/webstore/detail/%E6%B1%87%E7%8E%87%E8%BD%AC%E6%8D%A2/bcpgdpedphodjcjlminjbdeejccjbimp?hl=zh-CN)

##### [360安全浏览器](https://ext.se.360.cn/webstore/detail/hijccaodmbcgjodgoalekjnnnbpkpfch)

>不提供crx安装方式，因为最新版本的Chrome已经禁止离线安装。
从Chrome商店安装需要梯子，安装之后使用时不用梯子。

### 源代码：

>开源发布于github上。以址如下:

[Github](https://github.com/jy00566722/rate)

##### 目前支持的平台连接:

lazada:

- 马来西亚：https://www.lazada.com.my/
- 菲 律 宾：https://www.lazada.com.ph/
- 新 加 坡：https://www.lazada.sg/
- 印    尼：https://www.lazada.co.id/
- 越    南：https://www.lazada.vn/
- 泰    国：https://www.lazada.co.th/

Shopee:  (特别注意要用新网址，不要用以前的带xiapi的网址)
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
- 巴  西 : https://www.amazon.com.br/
- 墨西哥 : https://www.amazon.com.mx/
- 澳大利亚: https://www.amazon.com.au/

速卖通:
- https://www.aliexpress.com/    (使用时注意切换货币单位为美元，后续会支持更多货币)

Wish:
- https://www.wish.com/  (Wish暂停支持，前台国家切换方式变换，暂时没有找到好的方法解决)


### 介绍：

>此插件为lzada/shopee/Amazon/Wish/Aliexpress卖家设计，用于显示各站点前台页面上商品价格对应的人民币价格(在原价格右下方显示一个绿色的人民币价格，部分带有深色底色的地方会采用红色字),也方便卖家观察竞争对手的价格。

>PS:Lazada/Shopee买家也是可以用的，但使用场景感觉不多，海淘用户可以用。

>对于跨境卖家，在网站前台查看商品时，印尼币、越南币动则十万百万的价格数字，不能直观的看出对应的人民币价格是多少，这个插件可以完美解决此问题。
同时也提供手动输入数字转换货币的功能，可以互转货币共有152种。

### 关于汇率：
         汇率是每40分钟更新一次。

### 关于效率：
         插件不会持续操作页面造成卡顿，只有在页面内容有更新时才启动，放心使用。

### 关于安全：
       插件不会记录用户的任何数据，有google/360审查。

### 可能存在的问题：
        由于Lazada/Shopee/Amazon前端页面，可能会更新，网页结构会变化，造成不能正常显示对应的人民币价格，会定期针对更新。
        如果在使用中发现哪个页面没有显示人民币价格，欢迎邮件联系反馈，感谢。ideey88@gmail.com
        由于需要维护的站点较多，时常会有更新。在不能显示价格时，可以先看是否为最新版本。如果不是，可以删除后再安装新版本。（或是等Chrome自动插件更新）



### 更新记录

```
- 2.8.4.0    2021年3月16日  修复shopee页面规则。改为在线获取，以后页面改变，不必发布新版本，直接后台更新。GoodBOy
- 2.8.3.0    2021年3月5日   修复lazada详情页面sku变动后价格不变的问题(redMart页面价格转换未成功,下版修复)
- 2.8.2.0    2021年2月16日  更新shopee站点规则
- 2.8.1.0    2021年1月15日  更新shopee站点规则,适配最新页面
- 2.8.0.0    2021年1月6日   更新手动转换面板,可以拖动国旗图标调整序列,增加亚马逊:巴西/墨西哥/澳大利亚 站。
- 2.7.0.0    2019年12月26日 增加设置:可以选择哪些站点的页面价格转换为人民币，默认全开，在设置中可以关闭
- 2.6.0.0    2019年12月24日 全新的货币转换弹出页面,支持自自己定义固定的国家货币，没有数量限制。美化ui。
             针对lazada/shopee等显示地方比较小，人民币价格被隐藏的情况，增加鼠标放上去会有小提示显示人民币价格
- 2.5.0.0    2019年8月23日 增加shopee6个国家的镜像站支持，my.xiapibuy.com   th.xiapibuy.com等。
- 2.4.5.0    2019年8月21日 修复Amazon德国搜索中的显示问题
- 2.4.0.0    2019年8月21日 修复shopee镜像站显示问题，增加新的台湾镜像站支持 https://xiapi.xiapibuy.cc
- 2.3.0.0    2019年8月02日 虾皮台湾站增加国内可访问的镜像站支持: https://xiapi.xiapibuy.com
- 2.2.0.0    2019年7月20日 修复Amazon英国站搜索页面价格显示为NaN的问题
- 2.1.0.0    2019年7月20日 货币自由转换部分，按国家的拼音排序  目前增加到了164个货币
- 2.0.0.0    2019年7月10日 暂停wish /修改说明，去掉关键字(例如shopee/lazada/amazon等)(chrome说我滥用关键词-因为这个原因被下架了一次)
- 1.9.0.0    2019年5月20日 修复Aliexpress详情页价格显示
- 1.8.0.0    2019年5月09日 按钮页面增加57国汇率自由转换
- 1.7.0.0    2019年4月30日 修复Wish价格问题(页面元素变化)
- 1.6.0.0    2019年4月19日 支持Wish平台57种货币汇率的转换。
- 1.5.0.0    2019年4月16日 完全重写Amazon美国/日本/英国/德国站的价格转换，兼容性更强
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
- 1.0.0.0:   Lazada平台适配成功
```

