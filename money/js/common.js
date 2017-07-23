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


}(window));