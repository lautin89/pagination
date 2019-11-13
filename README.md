# 简介

lautin-pagination是一款基于bootstrap3样式设计的分页插件，它使用简便、灵活，满足用户在客户端程序开发中的多数需求  特别适用于**百条级别**的数据分页。如果数据容量达到1000+，则必须使用ajax按页从服务端抓取；

使用npm安装该包时，它所依赖的boostrap、jquery都会同步下载，默认的安装目录包括以下内容：

```text
|--Pagination.js 核心类库
|--public 开放资源 用于测试使用
|----bootstrap
|----jquery
|--test 测试案例地址
|----data.js 测试数据文件
|----index.html 演示文稿 用于查看效果，需要以http地址运行以支持模块化
|--package.json 包说明文件
```




# 下载

+  `npm install lautin-pagination` 最新版，兼容环境（推荐）
+  `npm install lautin-pagination@2.0` 安装2.0，以模块方式加载
+  `npm install lautin-pagination@1.x` 安装1.0，以`<script>`引入



# 使用

## V2.1

兼容es6模块与es5 Web两种环境，用户可以自由选择：

+ `<script src="./node_modules/lautin-pagination/Pagination-web.js"></script>`
+ `import Pagination from Pagination.js`



## V2.0

v2.0版本经过重构，采用`es6+模块化`，支持以`import`方式导入类库。功能上主要是在callback函数中增加了render方法，将页码栏的渲染交由核心方法来实现，这样避免动态渲染时分页器无法正常绑定事件，该修改主要针对MVVM模型中响应式DOM中无法实现事件绑定的完善。

```html
<link rel="stylesheet" href="../public/bootstrap/dist/css/bootstrap.min.css">

<div id="cont">
    <!-- 数据显示区域 -->
</div>

<div id="pgbr">
    <!-- 页码栏位置 -->
</div>
```

```html
<script src="../public/jquery/dist/jquery.js"></script>
<script type="module">
	//加载核心类文件
    import Pagination from '../Pagination.js';

    $.ajax({
        type : "get",
        url : "./data.json",
        success (result) {
            show(result);
        }
    });

    function show(resource) {
        //对数据进行分页显示
        Pagination({
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
                //遍历截取出来的数据 然后组装到table的tr中
                data.forEach(function (item, index, arr) {
                    table += `<tr>
                            <td>${item.gid}</td>
                            <td>${item.gname.padEnd(20, "...")}</td>
                            <td>${item.gdesc.padEnd(30, "...")}</td>
                         </tr>`;
                });
                table += `</tbody></table>`;
                
                //将表格数据放入页面指定区域
                cont.innerHTML = table;
                
                //页面中渲染页码栏
                render("#pgbr");
            },
        });
    }
</script>
```

## V1.0

V1.0版本主要适配浏览器环境，使用IIFE封装环境，并在全局导出`Pagination`

+ 在页面中 引入Pagination类文件：

```javascript
<script src="./node_modules/lautin-pagination/libs/Pagination.js"></script>
```

+ 加载boostrap3样式文件，注意版本：

```javascript
<link rel="stylesheet" href="./node_modules//bootstrap/dist/css/bootstrap.min.css">
```



+ 设置存放数据和页码栏的容器：

```html
<div class="container">
    <!--存放分页数据的容器-->
</div>

<div class="pgbr">
    <!--显示页码栏的位置-->
</div>
```

+ 在业务流中 调用Pagination()方法：

```javascript
$.ajax({
    type : 
    url : 
    data : 
    dataType : 
    success (result) {
    	//result为请求到的接口数据 需要进行分页
    	//接下来调用Pagination方法进行数据分页
    	Pagination({
            total : result,	//分页总数据
            length : 10,	//每页显示长度
            callback (data, pager) {
                //data为分页后的数据，对象集合数据的形式
                //pager为组装好的页码栏，一个完整的字符串
                //数据需要根据用户需求渲染之后放入container中
                //页码栏直接放入pgbr中即可
                
                //todo here
                
            }
            
        })
    
	},
});
```

# 配置

## 必要参数

+ total ：要分页的总数据，百条左右即可，不宜过大，必须是对象集合数组形式，形如：

  `[{gid : 1, gname : '鼠标'}, {gid : 2, gname : '电视机'}, {gid :3, gname : '连衣裙'}]`

+ callback ： 接收分页数据和页码栏的回调函数，该方法需要接收两个参数：data和pager

  ```javascript
  Pagination({
      total : [],
      callback (data, pager) {
          
      }
  })
  ```
  

## 可选参数

+ length ：每页显示的数据长度，默认为10

+ theme：分页栏主题样式，它的默认值为：

  `'${header} ${first} ${prev} ${pages} ${next} ${last}'`，表示显示全部分页信息。可以指定部分，例如 只显示 [上一页，页码栏，下一页] 这三个部分，则设置该选项的值为：

  `${prev} ${pages} ${next}`

+ size ： 页码栏弹性伸缩，默认为常规大小，可以配置`pagination-lg`（放大）和`pagination-sm`（缩小）