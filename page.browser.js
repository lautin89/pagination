
(function (W) {
    /**
     * @constructor
     * @param {object} usrConf 用户配置参数 设置分页基本信息
     */
    function Pagination(usrConf) {

        // 初始化用户参数
        this.init(usrConf);

        // 声明的公有属性
        this.callback;
        this.maxpage;

    }

    Pagination.prototype = {

        constructor: Pagination,

        init: function (usrConf) {
            //初始化默认配置
            var conf = {
                total: [],
                length: 10,
                theme: '${header} ${first} ${prev} ${pages} ${next} ${last}',
                pageid: 1,
                size: '',
            };
            Object.assign(this, conf, usrConf);
        },

        data: function () {

            //计算当前页的起始偏移位置和结束位置
            var start = (this.pageid - 1) * this.length,
                end = start + this.length;
            return this.total.slice(start, end);

        },

        pager: function () {

            this.maxpage = Math.ceil(this.total.length / this.length);

            //设置页码栏各组成部分的值
            var settings = {
                "header": `<li>
                                <span style="color : #333; border: none">
                                Total ${this.total.length} records, ${this.maxpage} pages
                            </span><li>`,
                "first": this.linked("first"),
                "prev": this.linked("prev"),
                "pages": this.plist(),
                "next": this.linked("next"),
                "last": this.linked("last"),
            };

            //替换模板中的占位符 返回组装好的页码列表
            var result = this.theme.replace(/\$\{(\w+)\}/g, function (match, cite) {
                //将${first}替换成 <a href='javascript:display(1)'>首页</a>
                return settings[cite];
            });

            return `<nav aria-label="Page navigation">
                        <ul class="pagination ${this.size}"> ${result} </ul>
                    </nav>`;
        },

        linked: function (item) {
            var link, label, outer;
            switch (item) {
                case "first":
                    link = 1;
                    label = "First";
                    outer = "First";
                    break;
                case "prev":
                    link = this.pageid - 1;
                    if (link < 1) link = 1;
                    label = "Previous";
                    outer = "&laquo;";
                    break;
                case "next":
                    link = this.pageid + 1;
                    if (link > this.maxpage) link = this.maxpage;
                    label = "Next";
                    outer = "&raquo";
                    break;
                case "last":
                    link = this.maxpage;
                    label = "Last";
                    outer = "Last";
                    break;
            }

            //将this存入全局
            window._this = this;
            return `<li>
                        <a href='javascript:_this.start(${link});' aria-label="${label}">
                            <span aria-hidden="true">${outer}</span>
                        </a>
                    </li>`;
        },

        plist: function () {
            var links = "";
            if (this.maxpage > 10) {
                //通常情况下 显示当前的前4后5 共10页
                var start = this.pageid - 4,
                    end = this.pageid + 5;
                if (start < 1) start = 1;
                if (end > this.maxpage) end = this.maxpage;

                if (end < 10) end = 10;
                else if (end - start < 9) start = end - 9;

            } else {
                //10页以内 正常显示
                var start = 1,
                    end = this.maxpage;
            }
            //显示从第一页到最大页的 页号，放入一个span中
            for (var i = start; i <= end; i++) {
                if (i == this.pageid) {
                    links += `<li class="active">
                                <span>${this.pageid} <span class="sr-only">${this.pageid}
                                </span></span>
                            </li>`
                } else {
                    links += `<li class="plist"><a href="javascript:void 0">${i}</a></li>`;
                }

            }
            return links;
        },

        bindEvents: function () {
            //给页码栏中页码列表区域绑定点击事件
            var spans = Array.from(document.querySelectorAll("ul.pagination li.plist a"));
            spans.forEach(function (item) {
                //使用箭头函数获得平行的this值
                item.onclick = () => {
                    this.start(Number(item.innerHTML));
                };
            }, this);
        },

        /**
         * 执行分页程序的方法
         * @param {function} callback 接收返回的数据和页码栏的回调函数
         */
        start: function (arg) {
            switch (typeof arg) {
                case "function":
                    //初始化执行时 传入的回调函数
                    this.callback = arg;
                    break;
                case "number":
                    //页码按钮点击时 传入页码值
                    this.pageid = arg;
                    break;
                default:
                    //没有参数传入时 不执行动作
                    break;
            }

            this.callback(this.data(), this.render.bind(this));

            // 给页码栏绑定点击事件
            this.bindEvents();

        },

        // 核心模块帮助渲染
        render(node) {
            const container = node.nodeType ? node : document.querySelector(node);
            container.innerHTML = this.pager();
            // 给页码栏绑定点击事件，如何确保DOM加载完毕执行？
            // 避免在MVVM结构中，动态渲染时 无法查找DOM
            this.bindEvents();
        }

    };



    //添加静态调用实用程序
    Pagination.work = function (usrConf) {
        try {
            var ins = new Pagination(usrConf);
            ins.start(usrConf.callback);
        } catch (e) {
            console.dir(e);
            alert(e.message);
        }
    }

    //添加全局的引用
    W.Page = W.Pagination = Pagination.work;

})(window)