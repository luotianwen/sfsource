angular.module('ionic.services', [])

    // 加载或弹窗图标服务
    .factory('IconsUtil', function () {
        return {
            android: '<ion-spinner icon="android"></ion-spinner>',
            ios: '<ion-spinner icon="ios"></ion-spinner>',
            iosSmall: '<ion-spinner icon="ios-small"></ion-spinner>',
            bubbles: '<ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>',
            circles: '<ion-spinner icon="circles" class="spinner-energized"></ion-spinner>',
            crescent: '<ion-spinner icon="crescent" class="spinner-royal"></ion-spinner>',
            dots: '<ion-spinner icon="dots" class="spinner-dark"></ion-spinner>',
            lines: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner>',
            ripple: '<ion-spinner icon="ripple" class="spinner-assertive"></ion-spinner>',
            spiral: '<ion-spinner icon="spiral"></ion-spinner>'
        };
    })

    // 弹窗工具服务
    .factory('LayerUtil', ['$ionicLoading', 'IconsUtil', function ($ionicLoading, IconsUtil) {
        return {
            load: {
                /**
                 * 加载中弹窗+遮罩（默认不会自动隐藏，需要调用.hide()方法）
                 */
                loading: function (time) {
                    layer.open({
                        type:2,
                        shadeClose:false,
                        time:time?time:60
                    })
                },
                hide: function () {
                    layer.closeAll();
                }
            },
            // 跳转消息提示（提示弹层，一定时间后自动消失）
            stateGo: function (_e) {
                var _d = {
                    content:'跳转目标页面',
                    time:1.5,
                    shadeClose:false,
                    success: function (elem) {}
                }
                var _bean = angular.extend(_d,_e);
                layer.open({
                    content:_bean.content,
                    shadeClose:_bean.shadeClose,
                    time:_bean.time || 1.5,
                    success: function (elem) {
                        _bean.success(elem);
                    }
                })
            },
            // 警告（提示弹层，点击遮罩或一定时间后自动消失）
            warning: function (_e) {
                var _d = {
                    content:'错误警告',
                    time:1.5,
                    shade:true,
                    shadeClose:true,
                    success: function (elem) {}
                }
                var _bean = angular.extend(_d,_e);
                layer.open({
                    content:_bean.content,
                    time:_bean.time,
                    shade:_bean.shade,
                    shadeClose:_bean.shadeClose,
                    success: function (elem) {
                        _bean.success(elem);
                    }
                })
            },
            // 异常类消息提示(需要用户点击按钮)
            error: function (_e) {
                var _d = {
                    content:'加载异常!',
                    btn:'好',
                    yes:null
                }
                var _bean = angular.extend(_d,_e),
                	error_layer_index = layer.open({
                    content: _bean.content,
                    shadeClose:false,
                    btn:[_bean.btn],
                    yes:function(){
                    	// 点击的回调
                    	if(_d.yes){
                    		_d.yes();
                    	}
                    	layer.close(error_layer_index);
                    }
                });
            }
        }
    }])

     // url工具服务
    .factory("UrlUtil", function () {
        var currentTime = new Date().getDate();

        return {
            http: 'https://open.sfhwsc.com/api/',// 商城接口地址 https://open.sfhwsc.com/api/  http://192.168.1.106:8015/api/
            solrUrl:'https://appsearch.sfhwsc.com/',// 搜索服务地址    http://appsearch.sfhwsc.com/      http://192.168.1.177:8080/mall-app-search/   http://192.168.1.200/mall-app-search/
            
            oss:'https://seebong-hangzhou.oss-cn-hangzhou.aliyuncs.com/',// 阿里云oss图片库地址
            //imgHttpUrl:'http://img.seebong.com/',// 商城服务器图片地址
            //ossCategoryUrl:'http://oss-cn-hangzhou.aliyuncs.com/',// 阿里oss图片库地址（分类）
            //guideImgPrefix:'http://img1.seebong.com/',
            
            bigData:'https://open.wanrma.com/', //'http://192.168.1.134:8090/compass-interface/',// 数据统计接口 http://open.wanrma.com/
            kuaidi:'https://www.kuaidi100.com/',// 快递查询接口
            zfbNotify:'http://open.sfhwsc.com/pay/notify_url',// 支付宝回调
            appDownPath:'http://www.seebong.com/redirect/index?ly=androidapp',// app下载路径(Android)
            appCheckCodeImgUrl:'https://passport.seebong.com/Code/GetCodeImage_App'// 请求验证码  http://passport.seebong.com/Code/GetCodeImage_App
        }
    })
    
    // 快递类型
    .factory('ExpressType',function(){
    	var kuaidi={0:{Val:'顺丰速递',Letter:'shunfeng'},1:{Val:'申通速运',Letter:'shentong'},2:{Val:'圆通速递',Letter:'yuantong'},3:{Val:'中通速递',Letter:'zhongtong'},4:{Val:'百世汇通',Letter:'huitongkuaidi'},5:{Val:'德邦物流',Letter:'debangwuliu'},6:{Val:'全峰快递',Letter:'quanfengkuaidi'},7:{Val:'如风达快递',Letter:'rufengda'},8:{Val:'天天快递',Letter:'tiantian'},9:{Val:'韵达快运',Letter:'yunda'},10:{Val:'宅急送',Letter:'zhaijisong'},11:{Val:'EMS',Letter:'ems'}};
    	
    	return {
    		// 快递名称，用做展示
    		getKuaidi:function(code){
    			return kuaidi[code];
    		}
    	}
    })

    // 获得当前格式化日期
    .factory("FormatDate", function () {
        var day=null,Year=0,Month=0,Day=0,Hour=0,Minute=0,Second=0,ymd=0,ymdhm=0,ymdhms=0,y_m_d_h_m_s=0,
        	init = function(){day=new Date();Year=day.getFullYear();Month=day.getMonth()+1;Day=day.getDate();Hour=day.getHours();Minute=day.getMinutes();Second=day.getSeconds();ymd=Year+"";ymdhm=Year+"";ymdhms=Year+"";y_m_d_h_m_s=Year+"";if(Month>=10){ymd+=Month;ymdhm+=Month;ymdhms+=Month;y_m_d_h_m_s+="-"+Month}else{ymd+="0"+Month;ymdhm+="0"+Month;ymdhms+="0"+Month;y_m_d_h_m_s+="-0"+Month}if(Day>=10){ymd+=Day;ymdhm+=Day;ymdhms+=Day;y_m_d_h_m_s+="-"+Day}else{ymd+="0"+Day;ymdhm+="0"+Day;ymdhms+="0"+Day;y_m_d_h_m_s+="-0"+Day}if(Hour>=10){ymdhm+=Hour;ymdhms+=Hour;y_m_d_h_m_s+=" "+Hour}else{ymdhm+="0"+Hour;ymdhms+="0"+Hour;y_m_d_h_m_s+=" 0"+Hour}if(Minute>=10){ymdhm+=Minute;ymdhms+=Minute;y_m_d_h_m_s+=":"+Minute}else{ymdhm+="0"+Minute;ymdhms+="0"+Minute;y_m_d_h_m_s+=":0"+Minute}if(Second>=10){ymdhms+=Second;y_m_d_h_m_s+=":"+Second}else{ymdhms+="0"+Second;y_m_d_h_m_s+=":0"+Second}};
        return {
            getYmd: function () {
                init();
                return ymd;
            },
            getYmdhm: function () {
                init();
                return ymdhm;
            },
            getTmdhms: function () {
                init();
                return ymdhms;
            },
            getY_m_d_h_m_s:function(){
            	init();
            	return y_m_d_h_m_s;
            }
        };
    })

    // 请求参数基本配置信息
    .factory("BaseConfig", function () {
        return {
            "pspre":'1c7f08b1ba36da27f8fa6a321b09adf9',
            "app_key":'028116',// 028116 测试key 645498
            "md5":function(s){function L(k,d){return(k<<d)|(k>>>(32-d));}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H);}if(I|d){if(x&1073741824){return(x^3221225472^F^H);}else{return(x^1073741824^F^H);}}else{return(x^F^H);}}function r(d,F,k){return(d&F)|((~d)&k);}function q(d,F,k){return(d&k)|(F&(~k));}function p(d,F,k){return(d^F^k);}function n(d,F,k){return(F^(d|(~k)));}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F);}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F);}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F);}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F);}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]|(G.charCodeAt(H)<<d));H++;}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa;}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2);}return k;}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x);}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128);}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128);}}}return d;}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g);}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase();}
        }
    })

    // MD5加密
    .factory("MD5", ['BaseConfig', function (BaseConfig) {
        return {
            getMD5Val: function (val) {
                return BaseConfig.md5(val);
            }
        }
    }])

    // 请求服务系统参数
    .factory("SystemParam", ['FormatDate' ,'MD5', 'BaseConfig', 'Version',
    function (FormatDate, MD5 ,BaseConfig,Version) {
        var pspre=BaseConfig.pspre;
        return {
        	get:function(){
        		var ymdhm = FormatDate.getYmdhm();
				return '&timestamp='+ymdhm+'&sign='+MD5.getMD5Val(pspre+ymdhm).toUpperCase()+'&app_key='+BaseConfig.app_key+'&v='+Version.getVersion();        		
        	}
        }
    }])

    // 正则表达式
    .factory("CustomReg", function () {
        var phoneReg = /^(((13[0-9]{1})|(147)|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
            emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            passwordReg = /^[0-9a-zA-Z]*$/;
        return {
            phone: function (phone) {
                return phoneReg.test(phone);
            },
            email: function (email) {
                return emailReg.test(email);
            },
            password:function(pass){
            	return passwordReg.test(pass);
            },
            getPhoneReg:function(){
            	return phoneReg;
            }
        }

    })
  
    // 分类数据
    .factory("Categorys",['$http', 'SystemParam', 'LayerUtil', 'UrlUtil','Const','Version',
        function ($http, SystemParam, LayerUtil, UrlUtil, Const, Version) {
        
        var categorys=JSON.parse(localStorage.getItem(Const.CATEGORYS));
        
        // 更新分类数据
        var update= function () {
            var params = 'method=get_category_all'+SystemParam.get();
            
            console.log('获取分类信息:'+UrlUtil.http + "Category/get_category_all?" + params)
            $http.get(UrlUtil.http + "Category/get_category_all?" + params)
            .success(function (res) {
                if (res.code == 200) {
                	// 一级分类
                	var array = [];
                	angular.forEach(res.data,function(item){
                		if(item.TypeId == 1){
                			
                			// 寻找该一级分类的子级
                			var array2 = [];
                			angular.forEach(res.data,function(item2){
                				if(item2.TypeId == 2 && item2.ParentId == item.Id){
                					
                					// 寻找该二级分类的子级
                					var array3 = [];
                					angular.forEach(res.data,function(item3){
                						if(item3.TypeId == 3 && item3.ParentId == item2.Id){
                							array3.push({
				                				id:item3.Id,
				                				Descript:item3.Descript,
				                				Image:item3.Image
                							})
                						}
                					})
                					
                					array2.push({
		                				id:item2.Id,
		                				Descript:item2.Descript,
		                				Childrens:array3
		                			})
                				}
                			})
                			// 封装分类信息
                			array.push({
                				id:item.Id,
                				Descript:item.Descript,
                				Childrens:array2,
                				background:array.length == 0?true:false,
                				Image:item.Image
                			})
                		}
                	})
                	
                	
                    categorys = {
                        time : new Date().getTime(),
                        data : array
                    };
                    localStorage.setItem(Const.CATEGORYS,JSON.stringify(categorys));
                } else {
                    LayerUtil.msg({
                        text: res.data,
                        time: 1.5
                    })
                }
            }).error(function () {
                LayerUtil.msg({
                    text:"分类加载异常!",
                    time:2,
                    isBack:false
                })
            })
        }

        // 初始化分类数据
        var check= function () {
            if(categorys){
            	console.log('----------------------检查缓存数据过期时间----------------------')
                var currentTime = new Date().getTime(),
                    category_get_time = categorys.time,
                    day_time = 7*24*60*60*1000;// 默认缓存数据一周更新一次
                if((currentTime - category_get_time) > day_time){
                    update();
                }
            }
        }

        // 初始化分类数据
        check();
        
        return{
            setCategorys: function (data) {
                categorys = data;
            },
            getCategorys: function () {
            	// 0.1.3版本之前缓存  数据结构不一致
            	var nowVersionNum = parseInt(Version.getVersion().replace(new RegExp(/(\.)/g), '0'));
            	if(nowVersionNum < 103 && !localStorage.getItem(Const.TEMP_CHECK_CATEGORY)){
            		localStorage.setItem(Const.TEMP_CHECK_CATEGORY,"1");
            		return null;
            	}
            	return categorys;
            }
        }
    }])
	
	//品牌街数据
	.factory("streetBrand",['$http', 'SystemParam', 'LayerUtil', 'UrlUtil','Const',
        function ($http, SystemParam, LayerUtil, UrlUtil, Const) {
			 var streetBrand=JSON.parse(localStorage.getItem(Const.STREETBRAND)),
			 	 array = null;
			// 更新分类数据
		        var update= function () {
		            var params ='&brandName='+'&method=Brand/get_barnd_all' + SystemParam.get();
		            $http.get(UrlUtil.http + "Brand/get_barnd_all?" + params)
		                .success(function (res) {
		                    if (res.code == 200) {
		                        streetBrand = {
		                            time : new Date().getTime(),
		                            data : res.data
		                        };
		                        localStorage.setItem(Const.STREETBRAND,JSON.stringify(streetBrand));
		                    } else {
		                        LayerUtil.msg({
		                            text: res.data,
		                            time: 1.5
		                        })
		                    }
		                }).error(function () {
		                    LayerUtil.msg({
		                        text:"分类加载异常!",
		                        time:2,
		                        isBack:false
		                    })
		                })
		        }
			// 初始化分类数据
        var check= function () {
            if(streetBrand){
                var currentTime = new Date().getTime(),
                    category_get_time = streetBrand.time,
                    day_time = 7*24*60*60*1000;// 默认缓存数据一周更新一次
                if((currentTime - category_get_time) > day_time){
                    update();
                }
            }
        }

        // 初始化分类数据
        check();

        return{
            setCategorys: function (data) {
                streetBrand = data;
            },
            getFirsts: function () {
            	if(!array && streetBrand){
            		array = [];
                    angular.forEach(streetBrand.data, function (item) {
                        array.splice(array.length,0,item);
                        
                    })
                }
                return array;
            }
           /* getChildrens: function (id,typeId) {
                var array=[];
                angular.forEach(streetBrand.data, function (item) {
                    if(item.TypeId == typeId && item.ParentId == id){
                        array.splice(array.length,0,item);
                    }
                })
                return array;
            }
        }*/
       }
		}])
	
    // 定量类
    .factory("Const", function () {
        return{
            USER_INFO:"USER_INFO",// 用户信息
            USER_ACCOUNT:"USER_ACCOUNT",// 用户昵称
            CATEGORYS:"CATEGORYS",// 分类集合
            STREETBRAND:"STREETBRAND",//品牌街分类信息TEMP_CHECK_CATEGORY
            HISTORY_SEARCH:"HISTORY_SEARCH",// 最近搜索
            SHOP_CART_CACHE:"SHOP_CART_CACHE",// 购物车缓存中存放的商品
            HOME_CACHE_DATA:"HOME_CACHE_DATA",// 首页缓存
            TEMP_CHECK_CATEGORY:"TEMP_CHECK_CATEGORY", // 临时判断分类是否最新缓存（存在旧版和新版的冲突）
			COOKIE_ID:"COOKIE_ID",// cookie ID
			GUIDE_ID:"IS_LOAD_GUIDE"// 标识是否加载了闪画
        }
    })
    
    // cookidID
    .factory("Guid",function(){
    	return {
    		getGuid:function(){
    			var guid = "";
                for (var i = 1; i <= 32; i++) {
                    var n = Math.floor(Math.random() * 16.0).toString(16);
                    guid += n;
                }
                return guid;
    		}
    	}
    })

    // 版本信息
    .factory("Version", function () {
    	var v = '0.0.1';
        return{
            getVersion:function(){
            	return v;
            },
            setVersion:function(version){
            	v = version;
            	return true;
            }
        }
    })
    
    // 消息提示
    .factory('CustomerMessage',function(){
    	return {
    		logout:'退出后不会删除任何历史数据，下次登录依然可以使用本账号。',
    		clearCache:'将清除所有个人记录,商城分类数据。',
    		feedback:'信息反馈成功，我们会参考您的意见进行改善，请您耐心等待，'
    	}
    })
    
    // 通用添加到购物车
    .factory('ShopCartHandle',['Const','$rootScope','FormatDate','BaseConfig','$http','UrlUtil','MD5','LayerUtil','$state','IsLogin',
    	function(Const,$rootScope,FormatDate,BaseConfig,$http,UrlUtil,MD5,LayerUtil,$state,IsLogin){
    	return {
    		add:function(_e){
    			var _default_para = {
    				sku:null,// 加入购物车的skuID
    				fn:null,// 回调函数
    				count:1,// 加入购物车数量
    				isMessage:true,// 是否提示加入购物车成功
    				buy:0,// {0:加入购车,1:立即购买}
    				productid:"",
    				shopid:""
    			}
    			
    			var para = angular.extend(_default_para,_e);
    			
    			if(!para.count){
    				para.count = 1;
    			}
    			
    			// 添加到购物车
				var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
					
				// 如果没有登录则加入缓存
				if(!IsLogin.isGoLogin()){
					return;
					
					// 判断是否存在缓存
					/*var shopCache = localStorage.getItem(Const.SHOP_CART_CACHE);
					if(shopCache == null){
						var shopCacheBean={
							num:para.count,// 总量
							skus:[
								{
									Sku: para.sku,
									Count : para.count
								}
							]
						}
						// 修改tab购物车数量
						$rootScope.tab.shopCartNum = para.count;

						// 向购物车缓存中添加数据
						localStorage.setItem(Const.SHOP_CART_CACHE,JSON.stringify(shopCacheBean));
					}else{
						var shopCacheBean = JSON.parse(shopCache),
							num = 0,
							isExist = false;

						// 判断是否已经添加了该商品
						angular.forEach(shopCacheBean.skus, function (item,index) {
							if(item.Sku == para.sku){
								isExist = true;
								item.Count = item.Count + para.count;
							}
							// 购物车总数量
							num += item.Count;
						})
						// 如果不存在那么push新数据，更改数量
						if(!isExist){
							shopCacheBean.skus.push({
								Sku: para.sku,
								Count : para.count
							})
							num += para.count;
						}


						// 统计购物全部数量
						shopCacheBean.num = num;
						// 更新显示的购物车数量
						$rootScope.tab.shopCartNum = num;
						// 更新缓存
						localStorage.setItem(Const.SHOP_CART_CACHE,JSON.stringify(shopCacheBean));
					}
					
					if(para.isMessage){
						LayerUtil.warning({
							content:'加入购物车成功',
							shade:false
						})
					}
				
					// 自定义回调
					if(para.fn){
						para.fn();
					}*/
				}else{
					// 请求服务基本参数
					var ymdhm = FormatDate.getYmdhm(),
						pspre = BaseConfig.pspre;
	
					// 加载遮罩
					//LayerUtil.load.loading();
					$http({
						method: 'POST',
						url: UrlUtil.http + "Cart/post_join_cart",
						data: {
							Sku: para.sku,
							Count: para.count,
							UserId: userInfo.id,
							buy : para.buy,
							"ip": returnCitySN["cip"],
							"productid": para.productid,
							"shopid": para.shopid,
							"source": "",
							"type": 2,
							
							
							
							method: 'post_join_cart',
							timestamp: ymdhm,
							sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
							app_key: BaseConfig.app_key
						},
						transformRequest: function (data) {
							console.log(UrlUtil.http + "Cart/post_join_cart?"+$.param(data))
							return $.param(data);
						},
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
						}
					}).success(function (res) {
						if (res.code == 200) {
							
							if(para.isMessage){
								LayerUtil.warning({
									content:'加入购物车成功',
									shade:false
								})
							}
	
							$rootScope.tab.shopCartNum = $rootScope.tab.shopCartNum*1+para.count;
							
							// 自定义回调
							if(para.fn){
								para.fn(res.data);
							}
						} else {
							LayerUtil.error({
								content:res.data
							})
						}
					})
				}
				
    		},
    		// 根据sku删除缓存数据
    		removeForSku:function(sku){
    			var shopCacheBean = JSON.parse(localStorage.getItem(Const.SHOP_CART_CACHE));
    			var del_num = 0;
    			
    			angular.forEach(shopCacheBean.skus, function (item,index) {
					if(item.Sku == sku){
						del_num = item.Count;
						shopCacheBean.skus.splice(index,1);
					}
				})
    			shopCacheBean.num = shopCacheBean.num - del_num;
    			
				// 更新缓存
				localStorage.setItem(Const.SHOP_CART_CACHE,JSON.stringify(shopCacheBean));
    			
    		},
    		// 批量删除
    		removeForSkus:function(skus){
    			var shopCacheBean = JSON.parse(localStorage.getItem(Const.SHOP_CART_CACHE));
    			var del_num = 0;
    			
    			angular.forEach(skus,function(id){
	    			angular.forEach(shopCacheBean.skus, function (item,index) {
						if(item.Sku == id){
							del_num += item.Count;
							shopCacheBean.skus.splice(index,1);
						}
					})
    			})
    			shopCacheBean.num = shopCacheBean.num - del_num;
    			
				// 更新缓存
				localStorage.setItem(Const.SHOP_CART_CACHE,JSON.stringify(shopCacheBean));
    		},
    		getNum:function(){
    			var shopCache = JSON.parse(localStorage.getItem(Const.SHOP_CART_CACHE));
    			if(shopCache){
    				return shopCache.num;
    			}else{
    				return 0;
    			}
    			
    		}
    	}
    }])

	// 判断是否登录
	.factory('IsLogin',['Const','LayerUtil','$state',
	function(Const,LayerUtil,$state){
		return {
			// 判断是否登录
			flag:function(){
				var userInfo = localStorage.getItem(Const.USER_INFO);
				if(userInfo){
					return true;	
				}
				return false;
			},
			// 带登录跳转的check
			isGoLogin:function(msg){
				var userInfo = localStorage.getItem(Const.USER_INFO);
				if(userInfo){
					return true;	
				}
				
                LayerUtil.stateGo({
                    content:'请先登录!',
                    shadeClose:true,
                    success: function () {
                        $state.go('tab.login',{
                        	params:JSON.stringify({
                        		alertInfo:msg
                        	})
                        });
                    }
                })
				return false;
				
			}
		}
	}])

	// 错误日志，抛到服务端进行检测
	.factory('Log',function(){
		return{
			error:function(err){
				
			},
			warning:function(err){
				
			},
			debug:function(err){
				
			},
			fatal:function(err){
				
			}
		}
	})
	
	// 地址服务类
	.factory('AddressServer',function(){
		return {
			// 获取所有省份
			getProvince:function(){
				var provinces = [];
				angular.forEach(LAreaData,function(province){
					provinces.push({
						id:province.id,
						name:province.name
					})
				})
				return provinces;
			},
			// 根据省份ID获取城市集合
			getCitysForProvinceId:function(provinceId){
				var citys = [];
				angular.forEach(LAreaData,function(province){
					if(province.id == provinceId){
						angular.forEach(province.child,function(city){
							citys.push({
								id:city.id,
								name:city.name
							})
						})
					}
				})
				return citys;
			},
			// 根据省份ID、城市ID获取区县集合
			getCountyForCityId:function(provinceId,cityId){
				var countys = [];
				angular.forEach(LAreaData,function(province){
					if(province.id == provinceId){
						angular.forEach(province.child,function(city){
							if(city.id == cityId){
								countys = city.child;
							}
						})
					}
				})
				
				return countys;
			},
			// 根据省份、城市、区县ID获取对应的名称
			getProvincesCityCountyName:function(provinceId,cityId,countyId){
				var proName = null,
					cityName = null,
					countyName = null;
				angular.forEach(LAreaData,function(province){
					if(province.id == provinceId){
						proName = province.name;
						angular.forEach(province.child,function(city){
							if(city.id == cityId){
								cityName = city.name;
								angular.forEach(city.child,function(county){
									if(county.id == countyId){
										countyName = county.name;
									}
								})
							}
						})
					}
				})
				
				return {
					proName:proName,
					cityName:cityName,
					countyName:countyName
				}
			}
		}
	})
	
	// 支付方式
	.factory('PayType',function(){
		return {
			getAll:function(){
				var payType = [{
			        	img:"wechat.png",
			        	name:"微信",
			        	selected:true,// 默认是否选择
			        	payment:0,// 支付类型
			        	disabled:false// 是否采用
			        },{
			        	img:"zhifubao.png",
			        	name:"支付宝",
			        	selected:false,
			        	payment:1,
			        	disabled:false
			        },{
			        	img:"QQ.png",
			        	name:"QQ",
			        	selected:false,
			        	payment:2,
			        	disabled:true
			        },{
			        	img:"yinhangka.png",
			        	name:"银联",
			        	selected:false,
			        	payment:3,
			        	disabled:true
			        }];
			    return payType;
			}
		}
	})
	
	// 取消订单提示
	.factory('CancelOrderInfo',function(){
		return {
			getAll:function(){
				return [
					{
						content:'我不想买了',
						choose:false
					},
					{
						content:'信息填写错误，重新拍',
						choose:false
					},
					{
						content:'卖家缺货',
						choose:false
					},
					{
						content:'同城见面交易',
						choose:false
					},
					{
						content:'付款遇到问题（如金额不足、不知道怎么付款等）',
						choose:false
					},
					{
						content:'拍错了',
						choose:false
					},
					{
						content:'其他原因',
						choose:false
					}
				];
				
			}
		}
	})
	 .factory('Statictis',['$http', 'UrlUtil',
	 	function ($http,UrlUtil) {
        return {
            SearchStatictis: function (keyword, userid,time) {
                console.log("推广统计：搜索" + keyword);
                $http({
                    method: 'POST',
                    url: UrlUtil.bigData+"search/s",
                    data: {
                        userid: userid,
                        ip: returnCitySN["cip"],
                        statistics_time: time,
                        type: 2,
                        shopId: 0,
                        keyword: keyword
                    },
                    transformRequest: function (data) {

                        console.log(data);
                        return $.param(data);
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    }
                }).success(function (res) {
                    console.log(res);

                }).error(function () {
                });
                //----------------------------------推广统计代码
            },
            getTime: function () {
                var date = new Date();
                var seperator1 = "-";
                var seperator2 = ":";
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                        + " " + date.getHours() + seperator2 + date.getMinutes()
                        + seperator2 + date.getSeconds();
                return currentdate;
            }
        }
    }])
	// 搜索历史util服务类
	.factory('SearchHistory',['Const',function(Const){
		var isHave = null;
		return {
			get:function(){
				return localStorage.getItem(Const.HISTORY_SEARCH);
			},
			set:function(val){
				if(val.trim() == ''){
					return;
				}
				val = val.trim();
				var history = localStorage.getItem(Const.HISTORY_SEARCH);
				if(history){
					history = JSON.parse(history);
					isHave = false;
					angular.forEach(history,function(item){
						if(item == val){
							isHave = true;
						}
					})
					if(!isHave){
						history.push(val);
						localStorage.setItem(Const.HISTORY_SEARCH,JSON.stringify(history));
					}
				}else{
					history = [val];
					localStorage.setItem(Const.HISTORY_SEARCH,JSON.stringify(history));
				}
			},
			clear:function(){
				localStorage.removeItem(Const.HISTORY_SEARCH);
				return null;
			}
		}
	}])
	// UUID
	.factory('UUID',function(){
		
		// 使用var myuuid=new UUID();
		// On creation of a UUID object, set it's initial value
		function UUID(){
		    this.id = this.createUUID();
		}
		 
		// When asked what this Object is, lie and return it's value
		UUID.prototype.valueOf = function(){ return this.id; };
		UUID.prototype.toString = function(){ return this.id; };
		 
		//
		// INSTANCE SPECIFIC METHODS
		//
		UUID.prototype.createUUID = function(){
		    //
		    // Loose interpretation of the specification DCE 1.1: Remote Procedure Call
		    // since JavaScript doesn't allow access to internal systems, the last 48 bits
		    // of the node section is made up using a series of random numbers (6 octets long).
		    // 
		    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
		    var dc = new Date();
		    var t = dc.getTime() - dg.getTime();
		    var tl = UUID.getIntegerBits(t,0,31);
		    var tm = UUID.getIntegerBits(t,32,47);
		    var thv = UUID.getIntegerBits(t,48,59) + '1'; // version 1, security version is 2
		    var csar = UUID.getIntegerBits(UUID.rand(4095),0,7);
		    var csl = UUID.getIntegerBits(UUID.rand(4095),0,7);
		    // since detection of anything about the machine/browser is far to buggy,
		    // include some more random numbers here
		    // if NIC or an IP can be obtained reliably, that should be put in
		    // here instead.
		    var n = UUID.getIntegerBits(UUID.rand(8191),0,7) +
		            UUID.getIntegerBits(UUID.rand(8191),8,15) +
		            UUID.getIntegerBits(UUID.rand(8191),0,7) +
		            UUID.getIntegerBits(UUID.rand(8191),8,15) +
		            UUID.getIntegerBits(UUID.rand(8191),0,15); // this last number is two octets long
		    return tl + tm  + thv  + csar + csl + n;
		};
		 
		//Pull out only certain bits from a very large integer, used to get the time
		//code information for the first part of a UUID. Will return zero's if there
		//aren't enough bits to shift where it needs to.
		UUID.getIntegerBits = function(val,start,end){
		 var base16 = UUID.returnBase(val,16);
		 var quadArray = new Array();
		 var quadString = '';
		 var i = 0;
		 for(i=0;i<base16.length;i++){
		     quadArray.push(base16.substring(i,i+1));   
		 }
		 for(i=Math.floor(start/4);i<=Math.floor(end/4);i++){
		     if(!quadArray[i] || quadArray[i] == '') quadString += '0';
		     else quadString += quadArray[i];
		 }
		 return quadString;
		};
		 
		//Replaced from the original function to leverage the built in methods in
		//JavaScript. Thanks to Robert Kieffer for pointing this one out
		UUID.returnBase = function(number, base){
		 return (number).toString(base).toUpperCase();
		};
		 
		//pick a random number within a range of numbers
		//int b rand(int a); where 0 <= b <= a
		UUID.rand = function(max){
		 return Math.floor(Math.random() * (max + 1));
		};
		
		return {
			getUuid:function(){
		    	return new UUID().valueOf();
			}
		}
	})
	// APP VERSION
	.factory('UploadAppVersion', ['$timeout', '$rootScope', 
	'$cordovaNetwork','$cordovaAppVersion', '$ionicPopup','$ionicLoading', 
	'$cordovaFileTransfer','$cordovaFileOpener2','UrlUtil','SystemParam','LayerUtil','$http','Version',
		function ($timeout, $rootScope, $cordovaNetwork,$cordovaAppVersion,
		$ionicPopup, $ionicLoading, $cordovaFileTransfer, $cordovaFileOpener2,UrlUtil,SystemParam,LayerUtil,$http,Version){
			
			    function UpdateForAndroid() {
			      $ionicLoading.show({
			        template: "已经下载：0%"
			      });
			      var url = UrlUtil.appDownPath; // 下载地址
			      var targetPath = "/storage/emulated/0/sdcard/世峰户外商城.apk";
			      var trustHosts = true;
			      var options = {};
			      $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(
			      	function (result) {
			      		// 打开下载下来的APP
				        $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive').then(
				        	function () {
					        	LayerUtil.error({
				                    content:'更新完毕',
				                    btn:'好',
				                    yes:null
					        	})
				          // 成功
					        }, 
					        function (err) {
					          	LayerUtil.error({
				                    content:'更新失败',
				                    btn:'好',
				                    yes:null
					        	})
					        }
					    );
				        $ionicLoading.hide();
			      }, 
			      function (err) {
			        $ionicLoading.show({
			          template: "下载失败"
			        });
			        $ionicLoading.hide();
			      }, 
			      function (progress) {
			          var downloadProgress = (progress.loaded / progress.total) * 100;
			          $ionicLoading.show({
			            template: "已经下载：" + Math.floor(downloadProgress) + "%"
			          });
			          if (downloadProgress > 99) {
			            $ionicLoading.hide();
			          }
			      });
			    }
			
		return {
			compare:function(uploadType){
		        if(uploadType){
		        	LayerUtil.load.loading();
		        }
		        
		        var params = 'isTime=1&method=get_version_number'+SystemParam.get();
		        console.log('获取服务器版本更新信息:'+UrlUtil.http + "OAuth/get_version_number?" + params);
	            $http.get(UrlUtil.http + "OAuth/get_version_number?" + params)
	            .success(function (res) {
	            	if(uploadType){
		        		layer.closeAll();
		        	}
	            	
	                if (res.code == 200) {
	                	var data = res.data[0];
	                	if(data){
					      	// 获取当前手机网络状态
					        var type = $cordovaNetwork.getNetwork();
					
					        // 1.0.0 => 10000
					        var AppVersionCode = data.VersionNumber;  // 获取的服务器版本
					
					        //获取本地APP版本
					        $cordovaAppVersion.getVersionNumber().then(function (version) {
					        
					          // 更新本地版本号
					          Version.setVersion(version);
					        	
					          // 0.0.1 => 00001 => 1
					          var nowVersionNum = parseInt(version.toString().replace(new RegExp(/(\.)/g), '0'));
					          // 0.0.2 => 00002 => 2
					          var newVersionNum = parseInt(AppVersionCode.toString().replace(new RegExp(/(\.)/g), '0'));
					
					          if (newVersionNum > nowVersionNum) {
					            if (type === 'wifi') {
						        	var layer_index = layer.open({
									  	title:'检测到新版本',
									    content: data.UpdateContent,
									    btn: ['更新', '暂不更新'],
									    yes: function(index){
									      	layer.close(layer_index);
									      	UpdateForAndroid();
									    },
									    success:function(){
									    	$("div.layermchild").css('min-width','200px')
									    }
									});
					            } else {
					            	//询问框
									var layer_index = layer.open({
									  	title:'建议您在WIFI条件下进行升级<br>是否确认升级？',
									    content: data.UpdateContent,
									    btn: ['更新', '不要'],
									    yes: function(index){
									      	layer.close(layer_index);
					                  		UpdateForAndroid();
									    }
									});
					            }
					          }else{
					          	if(uploadType && uploadType == 'handle'){
						          	LayerUtil.error({
					                    content:'已经是最新版',
					                    time:1.5,
					                    shade:true,
					                    shadeClose:true
					                })	
					          	}	
					          }
					        });
	                	}
	                } else {
	                    /*LayerUtil.msg({
	                        text: res.data,
	                        time: 1.5
	                    })*/
	                }
	            })
		        // 无网络时
		        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
		
		          $ionicLoading.show({
		            template: '网络异常，不能连接到服务器！'
		          });
		
		          $timeout(function () {
		            $ionicLoading.hide()
		          }, 2000);
		        })
		        
	        }
		}
	}])
	
	// 数组去重
	.factory('ArrayRepet',function(){
		return {
			repeat:function(arr){
				 var res = [];
				 var json = {};
				 for(var i = 0; i < arr.length; i++){
				  if(!json[arr[i]]){
				   res.push(arr[i]);
				   json[arr[i]] = 1;
				  }
				 }
				 return res;
			}
		}
	})
	
	// 项目类型
	.factory('ProjectType',function(){
		return {
			type:'android'
		}
	})
