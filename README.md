# 简介

`lautin2-page`是一款基于`bootstrap3`样式设计的分页插件，它使用简便、灵活，满足用户在客户端程序开发中的多数需求  特别适用于**百条级别**的数据分页。如果数据容量达到1000+，则必须使用ajax按页从服务端抓取；

使用npm安装该包时，它所依赖的`boostrap`、`jquery`都会同步下载，默认的安装目录包括以下内容：

```text
|--page.esm.js 核心类库，支持es6模块
|--page.browser.js 核心类库，浏览器版本
|--public 开放资源 用于测试使用
|----bootstrap
|----jquery
|--test 测试案例地址
|----data.js 测试数据文件
|----index.html 演示文稿 用于查看效果，需要以http地址运行以支持模块化
|--package.json 包说明文件
```



# 安装

+  `npm install lautin2-page -S` 最新版，兼容环境（推荐）





# 使用



## 准备工作

+ 使用前需引入`bootstrap3`，确保分页样式能够正常加载；如果项目没有基于`bootstrap`，则需要审查元素**自行添加样式**；

```html
<link rel="stylesheet" href="～/node_modules/bootstrap/dist/bootstrap.min.css">
```

+ 在脚本位置引入核心文件，兼容es6模块与es5 Web两种环境，用户可以自由选择：

 ```html
 <script src="～/node_modules/lautin2-page/page.browser.js"></script>
 ```

```javascript
import Page from '～/node_modules/lautin2-page/page.esm.js'
```

+ 设置存放数据和页码栏的容器

```html
<div class="container">
    <!--存放分页数据的容器-->
</div>

<div class="pgbar">
    <!--显示页码栏的位置-->
</div>
```





## 开始业务

注意，在浏览器环境采用模块化加载时，需要**指定script的type类型为module**：

+ 准备数据，`lautin2-page`采用前端分页技术，需要先通过`ajax`一次性取所有数据：

  ```html
  <script type="module">
  
  	// 加载核心类文件，
      import P from './node_modules/lautin2-page/page.esm.js'
  
      $.ajax({
          type : "get",
          url : "./data.json",
          success (result) {
              // result为总的数据
              show(result);
          }
      });
  
  </script>
  ```

  

+ 使用核心函数进行分页，如果是以script方式加载，则文件一旦引入会拥有全局方法：`Page()`和`Pagination()`

  ```html
  <script type="module">
  
  	// 加载核心类文件，
      import P from './node_modules/lautin2-page/page.esm.js'
  
      $.ajax({
          type : "get",
          url : "./data.json",
          success (result) {
              show(result);
          }
      });
  
      function show(resource) {
          //对数据进行分页显示
          P({
              total: resource,
              length : 5,
              theme : "${header} ${first} ${prev} ${pages} ${next} ${last}",
              callback: function (data, render) {
                  var table = `<table class='table table-striped .table-hover'>   
                          <thead>
                          <tr>
                          	<th>#</th><th>name</th><th>description</th>
                          </tr>
                      </thead><tbody>`;
  
                  // 遍历截取出来的数据 然后组装到table的tr中
                  data.forEach(function (item, index, arr) {
                      table += `<tr>
                              <td>${item.gid}</td>
                              <td>${item.gname.padEnd(20, "...")}</td>
                              <td>${item.gdesc.padEnd(30, "...")}</td>
                           </tr>`;
                  });
                  table += `</tbody></table>`;
                  
                  // 将表格数据放入页面指定区域
                  document.qeuerySelector(".container").innerHTML = table;
                  
                  //页面中渲染页码栏
                  render(".pgbar");
              },
          });
      }
  </script>
  ```

  



# 配置



## 必要参数

+ total ：要分页的总数据，百条左右即可，不宜过大，必须是对象集合数组形式，形如：

  `[{gid : 1, gname : '鼠标'}, {gid : 2, gname : '电视机'}, {gid :3, gname : '连衣裙'}]`

+ callback ： 接收分页数据和页码栏的回调函数，该方法需要接收两个参数：data和pager

  ```javascript
  Page({
      total : [],
      callback (data, render) {
          
      }
  })
  ```



## 可选参数

+ length ：每页显示的数据长度，默认为10

+ theme：分页栏主题样式，它的默认值为：

  `'${header} ${first} ${prev} ${pages} ${next} ${last}'`，表示显示全部分页信息。可以指定部分，例如 只显示 [上一页，页码栏，下一页] 这三个部分，则设置该选项的值为：

  `${prev} ${pages} ${next}`

+ size ： 页码栏弹性伸缩，默认为常规大小，可以配置`pagination-lg`（放大）和`pagination-sm`（缩小）