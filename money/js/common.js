// JavaScript Document
(function (self) {
    var doc = document,
        keysName = 'keys';

    self.Js = {
        cache: {},
        ajaxLoad: $("#ajax-overlay"),
        PUBLIC_KEY: "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCg3vW2PAJbU5tRobB9PUxFvwkhpdq2zWyhyT3PDMdSrz2ajSq3r5zwguI6H/tPlu9AyHFuiupYPTgWVPHbAG7SSl9TxEJY16sSSqZrffUISOzWsJq68fvtG16BrxTG/fYW65uRX0l8nuq+Nxd0Pee5Unqt3Kis01vwggNgJRaJfwIDAQAB",
        APPVARS: {
            mslide: {},
            user: {},
            config:{}
        },
        CommentSwitch:true,//评论开关
        invFriendShare:"views/event/2017/4/aprilInvitedFriends/index",//邀请好友地址
        Router: {
            curPage: "",//当前页面
            //back历史记录
            history: {
                data: [],
                addData: function (url, param, b) {//第三个参数为是否保存参数
                    var path = undefined;
                    if (typeof param === 'undefined' ||  (typeof b !== 'undefined' && !b)) {
                        path = url;
                    } else {
                        path = [url, param];
                    }
                    if (path != this.getLastData())
                        this.data.push(path);
                },
                getLastData: function () {
                    return this.data.length && this.data[this.data.length - 1];
                },
                back: function () {
                    if (!this.data.length) return undefined;
                    var url = this.data.pop();
                    //由物理返回键造成相同的path多次添加到历史记录中，如果path相同则继续往前查找
                    if ($.isArray(url)) {
                        if (location.hash.indexOf(encodeURIComponent(url[0]) + "/?" + url[1]) != -1) {
                            return this.back();
                        }
                    } else {
                        //if (location.hash.indexOf(encodeURIComponent(url)) != -1) {
                        if(location.hash.split("/?")[0].replace(/^#path=/g,'') == encodeURIComponent(url)){
                            return this.back();
                        }
                    }
                    return url;
                },
                getBackUrl: function (index, removeIndexItem) {
                    var url;
                    if (this.data.length > 0) {
                        if (index !== 0) {
                            index = index || -1;
                        };
                        if (index > -1) {
                            url = this.data.slice(index, index + 1)[0];
                            if (removeIndexItem) {
                                this.data = this.data.slice(index + 1);
                            };
                        } else {
                            url = this.data.slice(index, this.data.length + index + 1)[0];
                            if (removeIndexItem) {
                                this.data = this.data.slice(0, this.data.length + index);
                            };
                        };
                    };
                    return url || "";
                }
            },
            user: {}
        },
        unsupportLocalString: "隐私浏览下可能无法正常使用相关功能！",
        /**
         * 是否有对应key值的本地数据
         * @memberOf tool
         * @name hasLocalData
         * @param key{string} localStorage的key值
         * @return boolean
         */
        hasLocalData: function (key) {
            try {
                if (localStorage.getItem(key) == null || localStorage.getItem(key) == '{}') {
                    return false;
                }
                return true;
            } catch (e) {
                return false;
            };
        },
        hasSessionData: function (key) {
            try {
                if (!key || sessionStorage.getItem(key) == null || sessionStorage.getItem(key) == '{}') {
                    return false;
                }
                return true;
            } catch (e) {
                return false;
            };
        },

        /**
        获取本地数据
        * @param {String} key 数据键
        * @return {String}
        */
        getData: function (key) {
            return self.localStorage && JSON.parse(localStorage.getItem(key));
        },
        getSessionData: function (key) {
            return self.sessionStorage && JSON.parse(sessionStorage.getItem(key));
        },

        /**
        保存为本地数据
        * @param {String} key 数据键
        * @param {String} value 值
        */
        setData: function (key, value) {
            var localStorage = self.localStorage;
            if (localStorage) {
                if (key != keysName) {
                    if (!Js.hasStorage()) {
                        $.alert(this.unsupportLocalString);
                        return false;
                    }
                    var keys = localStorage.getItem(keysName);
                    try {
                        localStorage.setItem(key, JSON.stringify(value));
                        keys = keys ? new RegExp('(,|^)' + key + '(,|$)').test(keys) ? keys : keys + ',' + key : key;
                        localStorage.setItem(keysName, keys);
                    }
                    catch (e_) {
                        if (!keys)
                            throw Js.Error(e_.message);
                        else {
                            Js.removeData(0);
                            Js.setData(key, value);
                        }
                    }
                }
                else
                    throw Js.Error(key + '{0} key conflict');
            }
        },
        setSessionData: function (key, value) {
            try {
                var sessionStorage = self.sessionStorage;
                if (sessionStorage) {
                    if (key != keysName) {
                        if (!Js.hasSessionStorage()) {
                            $.alert(this.unsupportLocalString);
                            return false;
                        }
                        var keys = sessionStorage.getItem(keysName);
                        try {
                            sessionStorage.setItem(key, JSON.stringify(value));
                            keys = keys ? new RegExp('(,|^)' + key + '(,|$)').test(keys) ? keys : keys + ',' + key : key;
                            sessionStorage.setItem(keysName, keys);
                        }
                        catch (e_) {
                            if (!keys)
                                throw Js.Error(e_.message);
                            else {
                                Js.removeData(0);
                                Js.setData(key, value);
                            }
                        }
                    }
                    else
                        throw Js.Error(key + '{0} key conflict');
                };
            } catch (e) {
                return false;
            };
        },

        /**
        删除本地数据
        * @param {String} key 数据键
        */
        removeData: function (key) {
            var localStorage = self.localStorage;
            if (localStorage) {
                var keys = localStorage.getItem(keysName);
                if (keys) {
                    keys = keys.split(',');
                    typeof key == 'number' && (key = keys[key]);
                    if (key) {
                        for (var i = 0, len = keys.length; i < len; i++) {
                            if (keys[i] == key) {
                                keys.splice(i, 1);
                                break;
                            }
                        }
                        localStorage.setItem(keysName, keys.join(','));
                        localStorage.removeItem(key);
                    }
                }
            }
        },
        removeSessionData: function (key) {
            var sessionStorage = self.sessionStorage;
            if (sessionStorage) {
                var keys = sessionStorage.getItem(keysName);
                if (keys) {
                    keys = keys.split(',');
                    typeof key == 'number' && (key = keys[key]);
                    if (key) {
                        for (var i = 0, len = keys.length; i < len; i++) {
                            if (keys[i] == key) {
                                keys.splice(i, 1);
                                break;
                            }
                        }
                        sessionStorage.setItem(keysName, keys.join(','));
                        sessionStorage.removeItem(key);
                    }
                }
            }
        },
        hasStorage: function () {
            try {
                var mod = new Date
                self.localStorage.setItem(mod, mod.toString());
                result = localStorage.getItem(mod) == mod.toString()
                localStorage.removeItem(mod)
                return result
            } catch (e_) {
                return false;
            }
        },
        hasSessionStorage: function () {
            try {
                var mod = new Date
                self.sessionStorage.setItem(mod, mod.toString());
                result = self.sessionStorage.getItem(mod) == mod.toString()
                self.sessionStorage.removeItem(mod)
                return result
            } catch (e_) {
                return false;
            }
        },
        /**删除所有本地数据*/
        removeAll: function () {
            var localStorage = self.localStorage;
            if (localStorage) {
                var keys = localStorage.getItem(keysName);
                if (keys) {
                    keys = keys.split(',');
                    for (var i = 0, len = keys.length; i < len; i++)
                        localStorage.removeItem(keys[i]);
                    localStorage.setItem(keysName, '');
                }
            }
        },
        removeSessionAll: function () {
            var sessionStorage = self.sessionStorage;
            if (sessionStorage) {
                var keys = sessionStorage.getItem(keysName);
                if (keys) {
                    keys = keys.split(',');
                    for (var i = 0, len = keys.length; i < len; i++)
                        sessionStorage.removeItem(keys[i]);
                    sessionStorage.setItem(keysName, '');
                }
            }
        },
        checkLogin: function () {
            return this.APPVARS.user && this.APPVARS.user.userId;
        },
        ajaxGet: function (params) {
            params = $.extend({
                'global': false,
                'isOverlay': false,
                'data': null,
                'isDefault': true,
                'success': undefined,
                'error': undefined,
                'showload': false
            }, params);
            if (params.showload) {
                Js.ajaxLoad.show();
                //$.showIndicator();
            }
            var url = "";
            if (params.param) {
                url = params.url + "?" + params.param + "&r=" + Math.random();
            } else {
                url = params.url + "?r=" + Math.random();
            }
            $.ajax({
                "type": "GET",
                "url": url,
                "timeout" : 60000, //超时时间设置
                "dataType": "json",
                "beforeSend": function(request) {
                    request.setRequestHeader("platform", "m");
                },
                "contentType": "application/x-www-form-urlencoded; charset=utf-8",
                "data": params.data,
                "success": function (obj) {
                    Js.comAjaxCallBack(obj, params);
                },
                error: function (obj) {
                    console.log(params.url);
                    //行为类型、失败类型、链接标识、请求参数、HTTP状态码
                    _jrt && _jrt.push(["api","2","1",params.url,params.param,obj.status]);
                    if (params.showload) {
                        //$.hideIndicator();
                        Js.ajaxLoad.hide();
                    }
                    $.alert('<p>网络错误，请重新链接。</p>');
                    return false;
                }
            });
        },

        ajaxPost: function (params) {
            params = $.extend({
                'global': false,
                'isOverlay': false,
                'data': null,
                'isDefault': true,
                'success': undefined,
                'error': undefined,
                'showload': false
            }, params);
            if (params.showload) {
                //$.showIndicator();
                Js.ajaxLoad.show();
            }
            var url = "";
            if (params.param) {
                url = params.url + "?" + params.param + "&r=" + Math.random();
            } else {
                url = params.url + "?r=" + Math.random();
            }
            $.ajax({
                "type": "POST",
                "url": url,
                "timeout" : 60000, //超时时间设置
                "dataType": "json",
                "beforeSend": function(request) {
                    request.setRequestHeader("platform", "m");
                },
                "data": params.data,
                "success": function (obj) {
                    Js.comAjaxCallBack(obj, params);
                },
                error: function (obj) {
                    console.log(params.url);
                    //行为类型、失败类型、链接标识、请求参数、HTTP状态码
                    _jrt && _jrt.push(["api","2","1",params.url,JSON.stringify(params.data),obj.status]);
                    if (params.showload) {
                        //$.hideIndicator();
                        Js.ajaxLoad.hide();
                    }
                    $.alert('<p>网络错误，请重新链接。</p>');
                    return false;
                }
            });
        },

        comAjaxCallBack: function (obj, params) {
            if (params.showload) {
                //$.hideIndicator();
                Js.ajaxLoad.hide();
            }
            if (typeof (obj) != 'object') {
                return false;
            }

            if (params.isDefault && obj.resultCode) {
                //行为类型、失败类型、链接标识、请求参数、错误码
                _jrt && _jrt.push(["api","2","0",params.url,params.param || JSON.stringify(params.data),obj.resultCode,obj.resultMsg]);
                if (typeof (params.fail) == 'function') {
                    params.fail(obj);
                } else {
                    //未登录去登录页面且清空user
                    if (obj.resultCode == 888 || obj.resultCode == 400) {
                        $.alert(obj.resultMsg, function () {
                                Js.APPVARS.user = {};
                                _jrt && _jrt.push(["userId"]);
                                if($.os.jrdapp){
                                    location.href = 'jrdscheme://'+encodeURIComponent('{"action":"loginH5ToApp", "actionArgs":{"needShare":"0"}}');
                                }else{
                                    Js.APPVARS.mslide.jump("views/login", "forward");
                                }
                            }
                        )
                    }
                    else {
                        console.log(obj.resultCode + ":" + obj.resultMsg);
                        $.alert(obj.resultMsg);
                    }
                }
            } else {
                //行为类型、失败类型、链接标识、请求参数、错误码, 第三个参数等于2表示非失败api请求 
                _jrt && _jrt.push(["api","2","2",params.url,params.param || JSON.stringify(params.data),obj.resultCode,obj.resultMsg]);
                if (typeof (params.success) == 'function') {
                    params.success(obj);
                }
            }
        },

        /**
        把相对Url转换为完整URL
        * @param {String} url url地址
        * @return {String} 返回新Url
        * @static
        */
        toIntactUrl: function (url) {
            var rootDir = location.href.match(/http:\/\/[^\/]*|file:\/\//) + '/';
            var m = url.match(/^(\/)|(https?:\/\/)/);
            var reg = /\/([^\/\.]+\/)?\.\.\//;
            url = m ? m[1] ? rootDir + url.substr(1) : url : Js.appDir + url;
            while (m = url.match(reg)) {
                var index = m.index;
                url = url.substring(0, index + 1) + url.substr(index + m[0].length);
            }
            return url;
        },

        /**
            设置URL参数
        * @param {String} name 获取url参数名称
         * @param {String} value(Optional) 要替换的参数值
        * @param {String} url (Optional) 要操作的URL
        * @return {String} 返回参数值
        */
        setParam: function (name, value, url) {
            url = Js.toIntactUrl(url || location.href);
            url = decodeURIComponent(url);
            var r = new RegExp('(\\?|#|&)' + name + '=([^&#]*)(&|#|$)');
            var m = url.match(r);
            return m ? m[2] : null;
        },

        /**
            获取URL参数
        * @param {String} name 获取url参数名称
        * @param {String} url (Optional) 要操作的URL
        * @return {String} 返回参数值
        */
        getParam: function (name, url) {
            url = Js.toIntactUrl(url || location.href);
            //url = decodeURIComponent(url);
            var r = new RegExp('(\\?|#|&)' + name + '=([^&#]*)(&|#|$)');
            var m = url.match(r);
            return m ? decodeURIComponent(m[2]) : null;
        },
        hasParam: function (name, url) {
            url = Js.toIntactUrl(url || location.href);
            var r = new RegExp('(\\?|#|&)' + name + '=?([^&#]*)(&|#|$)');
            var m = url.match(r);
            return m && m.length > 0;
        },

        //javascript模板解析
        //在模板里不能用arr做变量
        applyTemplate: function (template_id, data) {
            var fn = this.cache[template_id];
            if (!fn) {
                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                var template = document.getElementById(template_id).innerHTML;
                fn = new Function("data", "var arr=[]; with(data){arr.push('" +
                    // Convert the template into pure JavaScript
                    template
                       //remove chars \r, \t and \n from template
                       .replace(/[\r\t\n]/g, " ")
                       //replace ' in javascript code (those between <# and #>) with \t
                       .replace(/'(?=[^#]*#>)/g, "\t")
                       //replace ' in html code (those outside <# and #>) with \'
                       //' in javascript code was replaced in previous step
                       .split("'").join("\\'")
                       //recovery ' in  javascript code
                       .split("\t").join("'")
                       //...<#= data[i].name #>... => p.push('...',data[i].name,'...');
                       .replace(/<#=(.+?)#>/g, "',$1,'")
                       .split("<#").join("');")
                       .split("#>").join("arr.push('")
                       + "');}return arr.join('');");
                this.cache[template_id] = fn;
            }
            return fn(data);
        },

        cloneObj: function (obj) {
            var s = {};
            for (var i in obj) {
                if (typeof obj[i] === "object") {
                    s[i] = Js.cloneObj(obj[i]);
                } else {
                    s[i] = obj[i];
                }
            }
            return s;
        },

        rsaEncrypt: function(paramStr){
            setMaxDigits(130);
            //第一个参数为加密指数、第二个参数为解密参数、第三个参数为加密系数
            var key = new RSAKeyPair("3","",Js.PUBLIC_KEY); 
            return encryptedString(key, encodeURIComponent(paramStr));
        },

        resetTitle: function (str) {
            try {
                $("title").html(str || "君融贷【P2P专业理财_安全稳健互联网金融平台】");
                $('meta[name=keywords]').attr('content', '君融贷,理财,互联网金融,P2P,投资,活期');
            } catch (e) {
                console.log("title error");
            }
        },

        setAppAgreement : function (obj) {
            var ifr = document.createElement('iframe');
            if(obj.args){
                ifr.src = 'jrdscheme://'+encodeURIComponent('{"action": "'+obj.action+'","actionArgs":'+obj.args+'}');//给协议加上参数
            }else{
                ifr.src = 'jrdscheme://'+encodeURIComponent('{"action": "'+obj.action+'"}');
            }
            ifr.style.display = 'none';
            document.body.appendChild(ifr);
            setTimeout(function(){
                document.body.removeChild(ifr);
            },1000);
        },

        //获取窗口高度
        getWindowHeight: function () {
            var h = $(window).height();
            return h;
        },
        /**
        根据名字取Cookie值
        * @param {String} name cookie的名称
        * @return {String} 返回cookie值
        * @static
        */
        getCookie: function (name) {
            var i = document.cookie.match('{0}=([^;]+)(;|$)'.format(name));
            return i && decodeURI(i[1]);
        },
        /**
        设置cookie值
        * @param {String} name 名称
        * @param {String} value 值
        * @param {Date} expires (Optional) cookie过期时间
        * @static
        */
        setCookie: function (name, value, expires) {
            ///<summary>设置cookie,名字,值,过期时间<summary/>
            document.cookie = name + "=" + encodeURI(value) + ";expires=" + (expires ? expires.toGMTString() : "") + ";domain=.junrongdai.com;path=/";
        },
        /**
        删除一个cookie
        * @param {String} name 名称
        * @static
        */
        removeCookie: function (name) {
            ///<summary>删除一个cookie<summary/>
            Js.getCookie(name) && Js.setCookie(name, "NULL", new Date(0, 1, 1));
        },
        supportStyle: function () {
            var div = document.createElement('div'),
                   vendors = 'Khtml Ms O Moz Webkit'.split(' '),
                   len = vendors.length;

            return function (prop) {
                if (prop in div.style) return true;

                prop = prop.replace(/^[a-z]/, function (val) {
                    return val.toUpperCase();
                });

                while (len--) {
                    if (vendors[len] + prop in div.style) {
                        // browser supports box-shadow. Do what you need.
                        // Or use a bang (!) to test if the browser doesn't.
                        return true;
                    }
                }
                return false;
            };
        }()
    };

    self.Js = self.Js;
    self.Class = Js.Class;
    self.classApp = null;

    //360度统计
    var jrt = document.createElement("script");
    jrt.src = "/js/lib/jrt.js";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(jrt, s);

}(window));

(function (self) {
    // 扩展os对象
    $.extend($.os, {
        mozilla: navigator.userAgent.indexOf('Mozilla/') > -1, //mozilla内核
        uc: navigator.userAgent.indexOf('UCBrowser/') > -1, //uc浏览器
        qq: navigator.userAgent.indexOf('QQBrowser/') > -1, //qq浏览器
        wx : navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger", //微信浏览器
        wb: navigator.userAgent.indexOf('Weibo') > -1,
        htc: navigator.userAgent.indexOf('HTC') > -1, //htc
        xiaomi: navigator.userAgent.indexOf('XiaoMi') > -1, //小米
        br360: navigator.userAgent.indexOf('360browser') > -1, //360
        gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1, //PC火狐内核
        trident: navigator.userAgent.indexOf('Trident/') > -1, //IE内核
        presto: navigator.userAgent.indexOf('Presto/') > -1, //opera内核
        webKit: navigator.userAgent.indexOf('AppleWebKit/') > -1, //苹果、谷歌内核
        mobile: !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1, //android终端
        iPhone: navigator.userAgent.indexOf('iPhone') > -1, //是否为iPhone
        iPad: navigator.userAgent.indexOf('iPad') > -1, //是否iPad
        chrome: navigator.userAgent.indexOf('Chrome/') > -1, //是否android原生浏览器
        opera: navigator.userAgent.indexOf('Opera Mobi/') > -1, //是否android原生浏览器
        webApp: navigator.userAgent.indexOf('Safari/') == -1, //是否web应该程序，没有头部与底部,
        browser: navigator.userAgent.indexOf('Browser/') == -1, //是否为默认浏览器
        baiduapp: navigator.userAgent.indexOf('baiduboxapp/') > -1, //是否为百度APP
        jrdapp: navigator.userAgent.indexOf('com.junrongdai') > -1 || navigator.userAgent.indexOf('com.jrd') > -1 || navigator.userAgent.indexOf('junrongdai') > -1, //是否为君融贷APP
        baidubrowser: navigator.userAgent.indexOf('baidubrowser/') > -1, //是否为百度APP浏览器
        pc:!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),//是否是pc
        ios7: !!navigator.userAgent.match(/(iPod touch|iPad|iPhone);.*CPU.*OS 7_\d/i), //是否为ios7
        ios8: !!navigator.userAgent.match(/(iPod touch|iPad|iPhone);.*CPU.*OS 8_\d/i) //是否为ios8
    });
    //微信下加载jssdk
    if($.os.wx){
        var wxsdk = document.createElement("script");
        wxsdk.src = "https://res.wx.qq.com/open/js/jweixin-1.0.0.js";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(wxsdk, s);
    }
})(window);
function StringBuffer(str) {
    this._strings = new Array();
    this.append(str);
};
StringBuffer.prototype.append = function (str) {
    this._strings.push(str);
    return this;
};
StringBuffer.prototype.toString = function () {
    var str = (arguments.length == 0) ? '' : arguments[0];
    return this._strings.join(str);
};
/**
 * 为String添加补全方法
 */
String.prototype.leftpad = function (len, c) {
    if (arguments.length == 1) {
        c = '0';
    }
    var s = new StringBuffer();
    for (var i = 0, max = len - this.length; i < max; i++) {
        s.append(c);
    }
    s.append(this);
    return s.toString();
};
/**
 * 为String添加替换*号方法
 *替换方向0前，1后
 *替换长度
 */
String.prototype.replaceName = function (dir, l) {
    var s = new StringBuffer(), len=this.length;
    
    if(dir){
        s.append("**********************".substr(0, len-l));
        s.append(this.substr(len-l));
    }else{
        s.append(this.substr(0,l));
        s.append("**********************".substr(0, len-l));
    }
    return s.toString();
};
/**
 * 格式化字符串
 * @param args
 * @returns {String}
 */
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}
/**
 * 倒计时器
 */
function CountdownTimer(params) {
    var _settings = {
        startTime: new Date(),
        endTime: new Date(),
        callback: undefined,
        endCallback: undefined
    };
    this.settings = $.extend(_settings, params);
    this.startTime = this.settings.startTime;
    this.endTime = this.settings.endTime;
    this.callback = this.settings.callback;
    this.endCallback = this.settings.endCallback;
    this.running = false;
    this.intervalTimer = undefined;

};
CountdownTimer.prototype.run = function (ct, tt) {
    this.running = true;
    var tt = tt || this.endTime.getTime();
    var ct = ct || this.startTime.getTime();
    var cb = this.callback;
    //开始执行计时的客户端时间，用来校准
    var startAt = new Date();
    // 如果截止时间在开始时间之前，直接触发倒计时截止事件
    if (tt <= ct) {
        this.stop();
        if (cb) {
            cb({ d: 0, h: 0, m: 0, s: 0 });
        }
        return { d: 0, h: 0, m: 0, s: 0 };
    }
    var selfobj = this;
    var timeToGo = tt - ct;
    this.intervalTimer = setInterval(function () {
        var diffTime = tt - ct;
        ct += 1000;
        var timePassed = new Date().valueOf() - startAt.valueOf() - 1000;//客户端实际走过的时间
        var timeCounted = timeToGo - diffTime;//interval计算出的时间差
        //当timePassed和timeCounted不相同时，说明interval已经有偏差。偏差大于1000ms时，需要进行校准，以timePassed为准。前提是用户没有手动修改客户端时间
        //todo:加上用户手动修改客户端时间的判断
        if (Math.abs(timePassed - timeCounted) > 1000) {
            diffTime = timeToGo - timePassed;
        }
        if (diffTime <= 0) {
            selfobj.stop.apply(selfobj);
            /*
            if (cb) {
                cb({ d: 0, h: 0, m: 0, s: 0 });
            }
            */
            return { d: 0, h: 0, m: 0, s: 0 };
        }

        var d = parseInt(diffTime / 86400000, 10);
        var h = parseInt(diffTime % 86400000 / 3600000, 10);
        var m = parseInt(diffTime % 86400000 % 3600000 / 60000, 10);
        var s = parseInt(diffTime % 86400000 % 3600000 % 60000 / 1000, 10);
        if (cb) {
            cb({ d: d, h: h, m: m, s: s });
        }
        /*
        if(selfobj.delegateTime && selfobj.delegateTime.h == h && selfobj.delegateTime.m == m && selfobj.delegateTime.s == s){
            selfobj.delegateHandler();
        }
        */
    }, 1000);
};
/**
 * 清除倒计时器
 */
CountdownTimer.prototype.clear = function () {
    if (this.intervalTimer) {
        clearInterval(this.intervalTimer);
        this.intervalTimer = undefined;
    }
    this.running = false;
};
CountdownTimer.prototype.stop = function () {
    this.clear();
    if (this.endCallback) {
        this.endCallback();
    }
};
CountdownTimer.prototype.delegate = function (time, handler) {
    //time = 0:5:0小时：分钟：秒
    var t = time.split(":");
    this.delegateTime = { h: t[0], m: t[1], s: t[2] };
    this.delegateHandler = handler;
}
function parseDate(str) {
    if (typeof str == 'string') {
        var results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);
        if (results && results.length > 3) {
            return new Date(parseInt(results[1], 10), parseInt(results[2], 10) - 1, parseInt(results[3], 10));
        }
        results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
        if (results && results.length > 6) {
            return new Date(parseInt(results[1], 10), parseInt(results[2], 10) - 1, parseInt(results[3], 10), parseInt(results[4], 10), parseInt(results[5], 10), parseInt(results[6], 10));
        }
        results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);
        if (results && results.length > 7) {
            return new Date(parseInt(results[1], 10), parseInt(results[2], 10) - 1, parseInt(results[3], 10), parseInt(results[4], 10), parseInt(results[5], 10), parseInt(results[6], 10), parseInt(results[7], 10));
        }
    }
    return null;
}
/** 
 * 串联加载指定的脚本
 * 串联加载[异步]逐个加载，每个加载完成后加载下一个
 * 全部加载完成后执行回调
 * @param array|string 指定的脚本们
 * @param function 成功后回调的函数
 * @return array 所有生成的脚本元素对象数组
 */

function seriesLoadScripts(scripts,callback) {
   if(typeof(scripts) != "object") var scripts = [scripts];
   var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement;
   var s = new Array(), last = scripts.length - 1, reg = /<script.*?src=['|"](.*?)['|"]/, recursiveLoad = function(i) {  //递归
       s[i] = document.createElement("script");
       s[i].setAttribute("type","text/javascript");
       s[i].onload = s[i].onreadystatechange = function() { //Attach handlers for all browsers
           if(!/*@cc_on!@*/0 || this.readyState == "loaded" || this.readyState == "complete") {
               this.onload = this.onreadystatechange = null; this.parentNode.removeChild(this); 
               if(i != last) recursiveLoad(i + 1); else if(typeof(callback) == "function") callback();
           }
       }
       s[i].setAttribute("src",reg.exec(scripts[i])[1]);
       HEAD.appendChild(s[i]);
   };
   recursiveLoad(0);
}
/**
 * 创建屏幕方向改变的代理函数
 */
var createOrientationChangeProxy = function (fn) {
    return function () {
        var args = [].slice.call(arguments, 0);
        clearTimeout(fn.orientationChangedTimeout);
        fn.orientationChangedTimeout = setTimeout(function () {
            var ori = window.orientation;
            if (ori != fn.lastOrientation) {
                fn.apply(fn, args);
                fn.lastOrientation = ori;
            };
        }, navigator.userAgent.indexOf("Android") > -1 ? 300 : 0);
    };
};
function onlineCustomer() {
    NTKF_PARAM = {
        siteid : 'kf_9173', //企业ID
        settingid : 'kf_9173_1456479735839', //缺省客服配置ID
        uid : Js.APPVARS.user.userId, //用户ID,未登录可以为空
        uname : Js.APPVARS.user.userName, //用户名，未登录可以为空
        isvip : "0", //是否为vip用户
        userlevel : "0" //网站自定义会员级别
    };
    //小能
    var hm = document.createElement("script"), scripts = document.getElementsByTagName("script");
    hm.src = "//dl.ntalker.com/js/xn6/ntkfstat.js?siteid=kf_9173";
    var s = scripts[scripts.length-1];
    s.parentNode.appendChild(hm, s);
};
window.MESSAGE = function () {
    var PROFILE = function () {
        var ERROR = {
            "USERNAME_EMPTY": "请输入用户名",
            "USERNAME_FORMAT": "用户名只能使用字母、数字、汉字与下划线",
            "USERNAME_EXISTS": "该用户名已存在",
            "USERNAME_INVALID": "该用户名不存在",
            "USERNAME_FORMAT_LENGTH": "用户名长度为4~20位字符",
            "USERNAME_FORMAT_LENGTH_LITTLE": "用户名不能少于4位字符",
            "NICKNAME_EMPTY": "请输入姓名",
            "NICKNAME_FORMAT": "姓名只能使用字母、数字、汉字与下划线",
            "NICKNAME_EXISTS": "姓名已存在",
            "NICKNAME_INVALID": "姓名不存在",
            "NICKNAME_FORMAT_LENGTH": "姓名长度为4~16位字符",
            "NICKNAME_FORMAT_LENGTH_LITTLE": "姓名不能少于4位字符",
            "PASSWORD_EMPTY": "请输入密码",
            "PASSWORD_WRONG": "密码不正确",
            "PASSWORD_FORMAT_LENGTH": "密码不能少于6位字符",
            "REPASSWORD_EMPTY": "请再次输入密码",
            "REPASSWORD_WRONG": "请输入正确的密码",
            "REPASSWORD_FORMAT_LENGTH": "确认密码不能少于6位字符",
            "REPASSWORD_AND_PASSWORD_DONOT_MATCH": "两次输入的新密码不一致，请重新输入",
            "PAYPASSWORD_EMPTY": "请输入支付密码",
            "PAYPASSWORD_WRONG": "请输入正确的支付密码",
            "PAYPASSWORD_FORMAT": "支付密码需同时包含数字与字母",
            "PAYPASSWORD_FORMAT_LENGTH": "支付密码为6~16位字符",
            "PAYPASSWORD_AND_PASSWORD_MATCH": "支付密码与登录密码不能相同",
            "REPAYPASSWORD_EMPTY": "请再次输入支付密码",
            "NEWREPAYPASSWORD_EMPTY": "请再次输入新支付密码",
            "REPAYPASSWORD_AND_PAYPASSWORD_DONOT_MATCH": "两次支付密码输入不一致",
            "NEWPAYPASSWORD_EMPTY": "请输入新支付密码",
            "NEWPAYPASSWORD_FORMAT": "支付密码需同时包含数字与字母",
            "NEWPAYPASSWORD_FORMAT_LENGTH": "支付密码为6~16位字符",
            "ORIGINALPAYPASSWORD_EMPTY": "请输入原支付密码",
            "ORIGINALPAYPASSWORD_WRONG": "请输入正确的原支付密码",
            "REALNAME_EMPTY": "请输入真实姓名",
            "REALNAME_FORMAT": "姓名只能为汉字",
            "REALNAME_FORMAT_LENGTH": "真实姓名不能少于两位汉字",
            "MOBILE_EMPTY": "请输入手机号码",
            "MOBILE_FORMAT": "请输入正确的手机号码",
            "MOBILE_FORMAT_LENGTH": "手机号码不能少于11位字符",
            "IDENTITY_EMPTY": "请输入身份证号",
            "IDENTITY_FORMAT": "请输入正确的身份证号",
            "IDENTITY_FORMAT_LENGTH": "身份证号长度为18位字符",
            "PAYPASSWORD_TIME_MAX": "有效时间范围为1~120分钟",
            "PAYPASSWORD_TIME_EMPTY": "请输入有效时间",
            "PHONECAPTCHA_EMPTY": "请输入验证码",
            "PHONECAPTCHA_FORMAT_LENGTH": "验证码应为6位数字",
            "CAPTCHA_WRONG": "验证码不正确",
            "CAPTCHA_EMPTY": "请输入验证码",
            "CAPTCHA_CHECKING": "验证中...",
            "CAPTCHA_REQUIRED": "请输入验证码",
            "CAPTCHA_FORMAT_LENGTH": "验证码应为4位数字",
            "PHONECHECKCODE_WRONG": "验证码输入错误",
            "PHONECHECKCODE_CHECKING": "验证中...",
            "PHONECHECKCODE_SEND_FAILURE": "发送频率太快，请稍后再试",
            "PHONECHECKCODE_FORMAT_LENGTH": "验证码不能少于6位字符",
            "PHONECHECKCODE_SEND_RESTRICTED": "今日验证码获取次数已用尽",
            "AGREEMENT_DONOT_AGREE": "若要继续请同意协议",
            "AMOUNT_FORMAT": "充值金额不合法，请输入数字",
            "USERNAME_AND_PASSWORD_DONOT_MATCH": "密码与用户名不匹配。"
        };
        return {
            "ERROR": ERROR
        };
    }();
    var SURVEY = function () {
        var ERROR = {
            "MOBILEEMAIL_EMPTY": "请输入联系方式",
            "MOBILEEMAIL_FORMAT": "请输入正确的联系方式",
            "SURVEYCONTENT_EMPTY": "请输入反馈意见"
        };
        return {
            "ERROR": ERROR
        };
    }();
    var ASSETS = function () {
        var ERROR = {
            "BANK_EMPTY": "请选择开户银行",
            "PROVINCE_EMPTY": "请选择开户省份",
            "PROVINCE_CHECK_WRONG": "省份信息填写错误",
            "BANKBRANCH_EMPTY": "请选择银行网点",
            "BANKACCOUNT_EMPTY": "请输入银行卡号",
            "BANKACCOUNT_FORMAT": "请输入正确的银行卡号",
            "BANKACCOUNT_CHECK_WRONG": "请输入正确的银行卡号",
            "BANKACCOUNT_RECHARGE_NOT_SUPPORT": "暂不支持该银行卡充值",
            "MOBILEPHONE_EMPTY": "请输入手机号",
            "MOBILEPHONE_FORMAT": "请输入有效的手机号",
            "BANKBIND_EMPTY": "需要先绑定银行卡才能进行提款",
            "RECHARGEAMOUNT_EMPTY": "请输入充值金额",
            "WITHDRAWLAMOUNT_EMPTY": "请输入提款金额",
            "WITHDRAWLAMOUNT_AMOUNT_LITTLE": "最小提款金额为10元",
            "ACCOUNT_BALANCE_EMPTY": "账户余额不足",
            "ACCOUNT_BALANCE_INSUFFICIENT": "现金账户可用余额不足",
            "EXCHANGE_CARD_NUMBER_EMPTY": "请输入彩金卡卡号",
            "EXCHANGE_CARD_NUMBER_FORMAT": "彩金卡卡号为19位数字",
            "EXCHANGE_CARD_NUMBER_CHECK_WRONG": "请输入正确的彩金卡卡号",
            "EXCHANGE_CARD_NUMBER_CHECK_INVALID": "该彩金卡已失效",
            "EXCHANGE_CARD_PASSWORD_EMPTY": "请输入彩金卡密码",
            "EXCHANGE_CARD_PASSWORD_FORMAT": "彩金卡密码为10位字符",
            "EXCHANGE_CARD_PASSWORD_CHECK_WRONG": "请输入正确的彩金卡密码"
        };
        return {
            "ERROR": ERROR
        };
    }();
    var UNITY = function () {
        var ERROR = {
            "PARTICIPATE_UNITY_MONEY_EMPTY": "金额不能为0",
            "PARTICIPATE_UNITY_MONEY_QUOTA": "金额必须100整数倍",
            "PARTICIPATE_UNITY_MONEY_MIN": "金额必须满100才能投资"
        };
        return {
            "ERROR": ERROR
        };
    }();
    return {
        "UNITY": UNITY,
        "SURVEY": SURVEY,
        "ASSETS": ASSETS,
        "PROFILE": PROFILE
    };
}();

function getAppUserId(data){
  token += "plat=app&userId="+Js.getParam("userId");
  Js.ajaxGet({
    isDefault: false,
    url: "/appapi/userIsLogin",
    param : token,
    success: function (data) {
        Js.APPVARS.user = data;
        _jrt && _jrt.push(["userId", data.userId]);
    }
  })
}