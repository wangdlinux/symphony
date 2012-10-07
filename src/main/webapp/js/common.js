/*
 * Copyright (c) 2012, B3log Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview util and every page should be used.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.0.7, Oct 7, 2012
 */

/**
 * @description Util
 * @static
 */
var Util = {
    _validateData: [{
        "id": "nameOrEmail",
        "type": 256,
        "msg": "nameOrEmail"
    }, {
        "id": "loginPassword",
        "type": 16,
        "msg": "密码不能为空"
    }],
    /**
     * @description 回到顶部
     */
    goTop: function () {
        var acceleration = acceleration || 0.1;

        var y = $(window).scrollTop();
        var speed = 1 + acceleration;
        window.scrollTo(0, Math.floor(y / speed));

        if (y > 0) {
            var invokeFunction = "Util.goTop(" + acceleration + ")";
            window.setTimeout(invokeFunction, 16);
        }
    },
    
    /**
     * @description 回到底部
     */
    goBottom: function (bottom) {
        if (!bottom) {
            bottom = 0;
        }
        window.scrollTo(0, $("body").height() - $(window).height() - bottom);
    },
    
    /**
     * @description 页面初始化执行的函数 
     */
    showLogin: function () {
        $(".nav .form").slideToggle();
    },
    
    /**
     * @description 跳转到注册页面
     */
    goRegister: function () {
        window.location = "/register?goto=" + encodeURIComponent(location.href); 
    },
   
    /**
    * @description 初识化前台页面
    */
    init: function () {
        // 导航
        this._initNav();
        
        // 登录密码输入框回车事件
        $("#loginPassword").keyup(function (event) {
            if (event.keyCode === 13) {
                Util.login();
            }
        });
        
        // init login validate
        Validate.initValidate(this._validateData);
        
        // search input
        $(".nav input.search").focus(function () {
            $(".nav .tags").hide();
        }).blur(function () {
            $(".nav .tags").show();
        });
    },
   
    /**
    * @description 设置导航状态
    */
    _initNav: function () {
        var pathname = location.pathname;
        $(".nav .user-nav > a").each(function () {
            if (pathname === $(this).attr("href")) {
                $(this).addClass("current");
            } 
        });
    },
    
    /**
     * @description 登录
     */
    login: function () {
        if (Validate.goValidate(this._validateData)) {
            var requestJSONObject = {
                nameOrEmail: $("#nameOrEmail").val().replace(/(^\s*)|(\s*$)/g,""),
                userPassword: $("#loginPassword").val()
            };
            
            $.ajax({
                url: "/login",
                type: "POST",
                cache: false,
                data: JSON.stringify(requestJSONObject),
                success: function(result, textStatus){
                    if (result.sc) {
                        window.location.reload();
                    } else {
                        $("#loginTip").text(result.msg);
                    }
                },
                complete: function (jqXHR, textStatus){
                }
            });
        }
    }
};

/**
 * @description 数据验证
 * @static
 */
var Validate = {
    /**
     * @description 提交时对数据进行统一验证。
     * @param {array} data 验证数据
     * @returns 验证通过返回 true，否则为 false。 
     */
    goValidate: function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#" + data[i].id).blur();
        }
        
        for (var j = 0; j < data.length; j++) {
            if ($("#" + data[j].id).next().text() !== "") {
                return false;
            }
        }
        return true;
    },
    
    /**
     * @description 数据验证。
     * @param {string} type 验证类型
     * @param {string} val 待验证数据 
     * @returns 验证通过返回 true，否则为 false。 
     */
    validate: function (type, val) {
        var isValidate = true;
        switch (type) {
            case "email":
                if (!/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(val)) {
                    isValidate = false; 
                }
                break;
            case "password":
                if (val.length === 0 || val.length > 16) {
                    isValidate = false; 
                } 
                break;
            case "confirmPassword":
                if (val !== $("#userPassword").val()) {
                    isValidate = false; 
                }
                break;
            case "securityCode":
                if (val === "") {
                    isValidate = false; 
                }
                break;
            case "tags":
                var tagList = val.split(",");
                if (val.replace(/(^\s*)|(\s*$)/g, "") === "" || tagList.length > 7) {
                    isValidate = false; 
                }
                
                for (var i = 0; i < tagList.length; i++) {
                    if (tagList[i].replace(/(^\s*)|(\s*$)/g, "") == "" || tagList[i].replace(/(^\s*)|(\s*$)/g, "").length > 50) {
                        isValidate = false;
                        break;
                    }
                }    
                break;
            default:
                val = val.replace(/(^\s*)|(\s*$)/g,"");
                if (val.length === 0 || val.length > type) {
                    isValidate = false; 
                } 
                break;
        }
        return isValidate;
    },
    
    /**
     * @description 数据验证初始化。
     * @param {array} data 验证数据
     */
    initValidate: function (data) {
        for (var j = 0; j < data.length; j++) {
            $("#" + data[j].id).blur(function () {
                var $it = $(this);
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id === $it.attr("id")) {
                        data[i].val = $it.val();
                        if (Validate.validate(data[i].type, data[i].val)) {
                            $it.next().removeClass("tip-error").text("");
                        } else { 
                            $it.next().addClass("tip-error").text(data[i].msg);
                        }
                        break;
                    }
                }  
            });
        }
    }
};

/**
 * @description 全局变量
 */
var Label = {};

if (!Cookie) {
    /**
     * @description Cookie 相关操作
     * @static
     */
    var Cookie = {
        /**
         * @description 读取 cookie
         * @param {String} name cookie key
         * @returns {String} 对应 key 的值，如 key 不存在则返回 ""
         */
        readCookie: function (name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return "";
        },
        
        /**
         * @description 清除 Cookie
         * @param {String} name 清除 key 为 name 的该条 Cookie
         */
        eraseCookie: function (name) {
            this.createCookie(name,"",-1);
        },

        /**
         * @description 创建 Cookie
         * @param {String} name 每条 Cookie 唯一的 key
         * @param {String} value 每条 Cookie 对应的值
         * @param {Int} days Cookie 保存时间
         */
        createCookie: function (name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                expires = "; expires="+date.toGMTString();
            }
            document.cookie = name+"="+value+expires+"; path=/";
        }
    };
}