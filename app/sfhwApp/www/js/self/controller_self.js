angular.module("self.controller", [])
    // 个人中心
    .controller('CenterCtrl', ['$scope','$http','UrlUtil','LayerUtil','SystemParam','Const','$rootScope','FormatDate',
    'BaseConfig','MD5','IsLogin','$state',
        function ($scope,$http,UrlUtil,LayerUtil,SystemParam,Const,$rootScope,FormatDate,BaseConfig,MD5,IsLogin,$state) {

        	$scope.testWechat = function(){
        		LayerUtil.load.loading(2);
        	}

        	// 我的订单
        	$scope.goOrder = function(state){
        		if(IsLogin.isGoLogin(null)){
        			$state.go('tab.orders',{
        				status:state
        			});
        		}
        	}

            //localStorage.clear();
            /*var shopCacheBean={
             num:3,// 总量
             skus:[
             {
             Sku: 11602,
             Count : 3
             }
             ]
             }
             $rootScope.tab.shopCartNum = 3;
             // 向购物车缓存中添加数据
             localStorage.setItem(Const.SHOP_CART_CACHE,JSON.stringify(shopCacheBean));*/
            // 当前登录用户
            var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
            $scope.noLogin = !userInfo;

            $scope.user = {};
            // 重置购物车数量
            $rootScope.tab.shopCartNum = '';
            // 判断登录状态
            if (userInfo) {
                // 查询用户数据
                var params = 'userId=' + userInfo.id + '&method=get_user_center' + SystemParam.get();

                console.log("查询用户数据:"+UrlUtil.http + "User/get_user_center?" + params)
                $http.get(UrlUtil.http + "User/get_user_center?" + params)
                    .success(function (res) {
                        if (res.code == 200) {
                            $scope.user = angular.extend($scope.user, res.data);

                            // 购物车数量
                            var shopCart = res.data.shopCart;
                            if (shopCart != 0) {
                                $rootScope.tab.shopCartNum = $rootScope.tab.shopCartNum * 1 + shopCart * 1;
                            }

                            // 判断头像
                        	$scope.user.UPortrait = 'img/app/center/user_logo.png';

                            //localStorage.setItem(Const.USER_INFO,JSON.stringify(angular.extend(userInfo,res.data)));
                        } else {
                            LayerUtil.error({
                                content: res.data
                            });
                        }
                    }).error(function(){
                    	LayerUtil.error({
                    		content:'加载异常'
                    	})
                    })

                // 查询购物车缓存中是否有待持久化的数据
	            /*var shopCache = localStorage.getItem(Const.SHOP_CART_CACHE);
                if (shopCache) {
                    var shopsObj = JSON.parse(shopCache);
                    // 请求服务基本参数
                    var ymdhm = FormatDate.getYmdhm(),
                        pspre = BaseConfig.pspre;
                    $http({
                        method: 'POST',
                        url: UrlUtil.http + "Cart/post_batch_join_cart",
                        data: {
                            UserId: userInfo.id,
                            jsonStr: JSON.stringify(shopsObj.skus),
                            method: 'post_batch_join_cart',
                            timestamp: ymdhm,
                            sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                            app_key: BaseConfig.app_key
                        },
                        transformRequest: function (data) {
                            return $.param(data);
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                        }
                    }).success(function (res) {
                        if (res.code == 200) {
                            $rootScope.tab.shopCartNum = $rootScope.tab.shopCartNum * 1 + shopsObj.num * 1;
                            // 清除缓存
                            localStorage.removeItem(Const.SHOP_CART_CACHE);
                        } else {
                            LayerUtil.error({
                                content: res.data
                            });
                        }
                    })
                }*/
            } else {
                // 购物车数量
                /*var shopCache = localStorage.getItem(Const.SHOP_CART_CACHE);
                if (shopCache) {
                    $rootScope.tab.shopCartNum = JSON.parse(shopCache).num;
                }*/
            }
        }])
    // login
    .controller("LoginCtrl", ['$scope','LayerUtil','UrlUtil','$http','SystemParam','$state','$timeout','Const','$stateParams',
    'FormatDate','BaseConfig','MD5','$rootScope',
        function ($scope,LayerUtil,UrlUtil,$http,SystemParam,$state,$timeout,Const,$stateParams,FormatDate,BaseConfig,MD5,$rootScope) {
        	// 参数
        	var stateParams = $stateParams.params?JSON.parse($stateParams.params):null;
        	if(stateParams && stateParams.alertInfo){
        		layer.open({
                    content: stateParams.alertInfo,
                    shadeClose:false,
                    btn:['好']
                });
        	}

            // 密码框默认为密文
            $scope.passwordType = "password";
            $scope.see = true;

            // 密码【明文/密文】切换
            $scope.togglePassword = function () {
                $scope.passwordType = $scope.see == true ? "text" : "password";
                $scope.see = !$scope.see;
            }

            // 用户对象
            $scope.user = {
                account: "",
                password: ""
            };

            // 用户如果登录过，即使退出系统，下次也可保存账号
            var userAccount = localStorage.getItem(Const.USER_ACCOUNT);
            if(userAccount){
	            $scope.user.account = userAccount;
            }

            // 登录按钮监听
            $scope.checkLoginInfo = function () {
                if ($scope.user.account != "" && $scope.user.password != "" && $scope.user.password.length >= 6) {
                    return false;
                }
                return true;
            };

            // 登录验证
            $scope.submit = function () {

                LayerUtil.load.loading();
                var params = "account=" + $scope.user.account + "&password=" + MD5.getMD5Val($scope.user.password.trim()) + '&ip=' +returnCitySN["cip"]+ '&source=&type=2&method=get_user_login' + SystemParam.get();
                $http.get(UrlUtil.http + "User/get_user_login?" + params)
                    .success(function (res) {
                        layer.closeAll();
                        if (res.code == 200) {
                            var data = res.data,
                                userInfo = {
                                    id: data.UId,
                                    account: $scope.user.account,
                                    password: $scope.user.password
                                };

                            // 缓存用户信息
                            localStorage.setItem(Const.USER_INFO, JSON.stringify(userInfo));

                            // 缓存用户账号
                            localStorage.setItem(Const.USER_ACCOUNT,$scope.user.account);

                            // 跳转............
                            LayerUtil.warning({
			                    content:'登录成功',
			                    time:1.5,
			                    shadeClose:false
			                })

	                    	setTimeout(function(){



	                    		if(stateParams && stateParams.url){
	                    			window.location.href=stateParams.url;
	                    		}else{
	                    			$rootScope.rootBack();
	                    			//$state.go('tab.center');
	                    		}

	                    	},1000)

                        } else {
                            LayerUtil.error({
                                content: res.data
                            })
                        }
                    })
            }
        }])
    // register
    .controller("RegisterCtrl", ['$scope','LayerUtil','UrlUtil','$http','FormatDate','$state','$interval','BaseConfig',
    'MD5','CustomReg','Const','UUID',
    	function ($scope,LayerUtil,UrlUtil,$http,FormatDate,$state,$interval,BaseConfig,MD5,CustomReg,Const,UUID) {

            // 生成唯一ID post后台，替换session
            var uuId = UUID.getUuid();
            // 获取验证码
            $scope.checkCodeImg = UrlUtil.appCheckCodeImgUrl + '?key=' + uuId;

            // 生成最新的验证码
            $scope.updateCheckCode = function(){
            	uuId = UUID.getUuid();
	            // 获取验证码
	            $scope.checkCodeImg = UrlUtil.appCheckCodeImgUrl + '?key=' + uuId;
            }

            // 密码框默认为密文
            $scope.passwordType = "password";
            $scope.see = true;

            // 密码【明文/密文】切换
            $scope.togglePassword = function () {
                $scope.passwordType = $scope.see == true ? "text" : "password";
                $scope.see = !$scope.see;
            }

            // 用户对象
            $scope.user = {
                phone: "",
                phoneYzm: "",
                password: "",
                rePassword: "",
                checkCode:""
            };

            // 对于input type=number的数据进行输入字段长度监听(手机号最长11位)
        	$scope.$watch('user.phone', function (newVal, oldVal) {
                if(newVal > 99999999999){
                	$scope.user.phone = oldVal;
                }
            })

            // 对于input type=number的数据进行输入字段长度监听(验证码最长6位数字)
        	$scope.$watch('user.phoneYzm', function (newVal, oldVal) {
                if(newVal > 999999){
                	$scope.user.phoneYzm = oldVal;
                }
            })

            // 注册按钮监听
            $scope.checkRegisterInfo = function () {
                if ($scope.user.phone != "" && $scope.user.phoneYzm != "" && $scope.user.password != "" && $scope.user.password.length >= 6 && $scope.user.rePassword != "") {
                    return false;
                }
                return true;
            }

            // 注册手机格式监听
            var disabled = true;
            $scope.checkPhone = function () {
            	disabled = true;
            	if(CustomReg.phone($scope.user.phone) && $scope.user.checkCode.trim() != ''){
            		disabled = false
            	}
                return disabled;
            }

            // 注册
            $scope.register = function () {
                // 密码比对
                if ($scope.user.password != $scope.user.rePassword) {
                    LayerUtil.warning({
                        content: "两次输入的密码不一致!"
                    });
                    return;
                } else if(!CustomReg.password($scope.user.password.trim()) || $scope.user.password.trim().length<6 || $scope.user.password.trim().length>16){
    				LayerUtil.warning({
                        content: "密码必须由6-16位数字字母组成"
                    });
                    return;
        		}
                else {
                    // 请求服务基本参数
                    var ymdhm = FormatDate.getYmdhm(),
                        pspre = BaseConfig.pspre;

                    // 加载遮罩
                    LayerUtil.load.loading();



                    var statistic = JSON.parse(localStorage.getItem("statistic_storage"));
                    var channelid = "", channelurlid = "", activeid = "";
                    if (statistic) {
                        channelid = statistic.channelid;
                        channelurlid = statistic.channelurlid;
                        activeid = statistic.activeid;
                    }

                    $http({
                        method: 'POST',
                        url: UrlUtil.http + "User/post_user_register",
                        data: {
                        	channelid: channelid,
                            channelurlid: channelurlid,
                            activeid: activeid,
                            type:2,
                            ip: returnCitySN["cip"],
                            phone: $scope.user.phone,
                            password: $scope.user.password.trim(),
                            confirmpassword: $scope.user.rePassword.trim(),
                            smsCode: $scope.user.phoneYzm,
                            method: 'post_user_register',
                            timestamp: ymdhm,
                            sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                            app_key: BaseConfig.app_key
                        },
                        transformRequest: function (data) {
                        	console.log('注册用户：'+UrlUtil.http + "User/post_user_register?"+$.param(data));
                            return $.param(data);
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                        }
                    }).success(function (res) {
                    	layer.closeAll();
                        if (res.code == 200) {
                            var data = res.data,
                                userInfo = {
                                    id: data.UId,
                                    account: $scope.user.phone,
                                    password: $scope.user.password
                                };
                            // 缓存用户信息
                            localStorage.setItem(Const.USER_INFO, JSON.stringify(userInfo));

                            // 缓存用户账号
                            localStorage.setItem(Const.USER_ACCOUNT,$scope.user.account);

                            // 跳转............
                            LayerUtil.warning({
			                    content:'注册成功',
			                    time:1.5,
			                    shadeClose:false
			                })
	                    	setTimeout(function(){
	                    		$state.go("tab.login",{
	                    			params:JSON.stringify({
	                    				url:"#/tab/center"
	                    			})
	                    		});
	                    	},1000)

                        } else {
                            LayerUtil.error({
                                content: res.data
                            })
                        }
                    })
                }
            }

            // 获取手机验证码
            $scope.djs = {
                showDjs: "获取验证码"
            };

            // 获取验证码倒计时禁掉按钮点击
            $scope.loadGetYzm = false;

            // 获取验证码
            $scope.getYzm = function () {
            	// 验证码格式验证
            	if(isNaN($scope.user.checkCode)){
            		LayerUtil.warning({
	                    content:'请输入数字验证码',
	                    time:1.5,
	                    shade:true,
	                    shadeClose:true
	                })
					return;
            	}

                // 请求服务发送验证码
                var ymdhm = FormatDate.getYmdhm(),
                    pspre = BaseConfig.pspre;

                // 加载遮罩
                LayerUtil.load.loading();
                $http({
                    method: 'POST',
                    url: UrlUtil.http + "sms/post_sms_code",
                    data: {
                        phone: $scope.user.phone,// 手机号
                        codeKey : uuId,// 唯一标识
                        codeNum : $scope.user.checkCode,// 验证码
                        method: 'post_sms_code',
                        timestamp: ymdhm,
                        sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                        app_key: BaseConfig.app_key,
                        sendType: 1// 注册会员识别码
                    },
                    transformRequest: function (data) {
                    	console.log('获取验证码:'+UrlUtil.http + "sms/post_sms_code"+'?'+$.param(data))
                        return $.param(data);
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    }
                }).success(function (data) {
                    layer.closeAll();
                    if (data.code == 200) {
                        LayerUtil.warning({
                            content: '发送成功,请注意查收。'
                        })
                        var djsNum = 120;
                        $scope.loadGetYzm = true;
                        $scope.djs.showDjs = djsNum + "秒后重新获取";
                        djsNum--;

                        var djs = $interval(function () {
                            if (djsNum > 0) {
                                $scope.loadGetYzm = true;
                                $scope.djs.showDjs = djsNum + "秒后重新获取";
                                djsNum--;
                            } else {
                                $interval.cancel(djs);
                                djsNum = 120;
                                $scope.loadGetYzm = false;
                                $scope.djs.showDjs = "重新获取";
                                // 更新验证码
                                $scope.updateCheckCode();
                            }
                        }, 1000)
                    } else {
                        LayerUtil.error({
                            content: data.data
                        })

                    }
                })
            }

        }])
    // 忘记密码→验证手机号码
    .controller("ForgetPasswordCtrl", ['$scope', 'CustomReg', '$http', 'UrlUtil', 'MD5', 'BaseConfig', 'LayerUtil',
    '$state', 'FormatDate', '$timeout','UUID',
        function ($scope, CustomReg, $http, UrlUtil, MD5, BaseConfig, LayerUtil, $state, FormatDate, $timeout,UUID) {

            // 生成唯一ID post后台，替换session
            var uuId = UUID.getUuid();
            // 获取验证码
            $scope.checkCodeImg = UrlUtil.appCheckCodeImgUrl + '?key=' + uuId;

            // 生成最新的验证码
            $scope.updateCheckCode = function(){
            	uuId = UUID.getUuid();
	            // 获取验证码
	            $scope.checkCodeImg = UrlUtil.appCheckCodeImgUrl + '?key=' + uuId;
            }

            // 页面对象
            $scope.user = {
                phone: '',
                imgCheckCode:''
            }

            // 对于input type=number的数据进行输入字段长度监听(手机号最长11位)
        	$scope.$watch('user.phone', function (newVal, oldVal) {
                if(newVal > 99999999999){
                	$scope.user.phone = oldVal;
                }
            })

			// 校验是否可以进行下一步
			var flag = true;
            $scope.checkNext = function () {
            	flag = true;
            	if(CustomReg.phone($scope.user.phone) && $scope.user.imgCheckCode.trim() != ''){
            		flag = false;
            	}
                return flag;
            }

			// 发送短信验证码
            $scope.checkPhone = function () {
            	// 格式校验
            	if(isNaN($scope.user.imgCheckCode)){
            		LayerUtil.warning({
	                    content:'请输入数字验证码',
	                    time:1.5,
	                    shade:true,
	                    shadeClose:true
	                })
					return;
            	}

                // 加载遮罩
                LayerUtil.load.loading();



                /////////////////////////////////////////测试代码
                        /*LayerUtil.warning({
		                    content:'发送成功,请注意查收。',
		                    time:1.5,
		                    shadeClose:false
		                })
                    	setTimeout(function(){
                    		$state.go('tab.verification', {phone: $scope.user.phone});
                    	},1000)

                    	return;*/
				/////////////////////////////////////////测试代码



                var ymdhm = FormatDate.getYmdhm(),
                    pspre = BaseConfig.pspre;

                $http({
                    method: 'POST',
                    url: UrlUtil.http + "sms/post_sms_code",
                    data: {
                        phone: $scope.user.phone,
                        codeKey : uuId,// 唯一标识
                        codeNum : $scope.user.imgCheckCode,// 验证码
                        method: 'post_sms_code',
                        timestamp: ymdhm,
                        sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                        app_key: BaseConfig.app_key,
                        sendType: 2
                    },
                    transformRequest: function (data) {
                    	console.log('发送短信:'+UrlUtil.http + "sms/post_sms_code?"+$.param(data))
                        return $.param(data);
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    }
                }).success(function (data) {
                    layer.closeAll();
                    if (data.code == 200) {
                        LayerUtil.warning({
		                    content:'发送成功,请注意查收。',
		                    time:1.5,
		                    shadeClose:false
		                })
                    	setTimeout(function(){
                    		$state.go('tab.verification', {phone: $scope.user.phone});
                    	},1000)

                    } else {
                        LayerUtil.error({
                            content: data.data
                        })
                    }
                })
            }
        }])
    // 忘记密码
    .controller("VerificationCtrl", ['$scope', 'CustomReg', '$interval', '$stateParams', 'LayerUtil',
    '$http', 'UrlUtil', 'MD5', 'BaseConfig', '$state', 'FormatDate', '$timeout','UUID',
        function ($scope, CustomReg, $interval, $stateParams, LayerUtil, $http, UrlUtil, MD5, BaseConfig,
        	$state, FormatDate, $timeout,UUID) {

            // 生成唯一ID post后台，替换session
            var uuId = UUID.getUuid();
            // 刚加载不需要加载验证码
            $scope.isShowCodeImg = false;
            // 获取验证码
            $scope.checkCodeImg = UrlUtil.appCheckCodeImgUrl + '?key=' + uuId;

            // 更换验证码
            $scope.updateCheckCode = function(){
            	uuId = UUID.getUuid();
            	$scope.checkCodeImg = UrlUtil.appCheckCodeImgUrl + '?key=' + uuId;
            }

            // 密码框默认为密文
            $scope.passwordType = "password";
            $scope.see = true;

            // 密码【明文/密文】切换
            $scope.togglePassword = function () {
                $scope.passwordType = $scope.see == true ? "text" : "password";
                $scope.see = !$scope.see;
            }

            $scope.user = {
                phone: $stateParams.phone,
                phoneYzm: '',
                password: '',
                rePassword: '',
                checkCode:''
            }

            // 对于input type=number的数据进行输入字段长度监听(手机号最长11位)
        	$scope.$watch('user.phoneYzm', function (newVal, oldVal) {
                if(newVal > 999999){
                	$scope.user.phoneYzm = oldVal;
                }
            })


            // 初始加载进行倒计时
            var djsNum = 120;
            $scope.loadGetYzm = true;

            // 获取手机验证码
            $scope.djs = {
                showDjs: djsNum + "秒后重新获取"
            };
            djsNum--;

            var djs = $interval(function () {
                if (djsNum > 0) {
                    $scope.loadGetYzm = true;
                    $scope.djs.showDjs = djsNum + "秒后重新获取";
                    djsNum--;
                } else {
                    $interval.cancel(djs);
                    djsNum = 120;
                    $scope.loadGetYzm = false;
                    $scope.djs.showDjs = "重新获取";
                    // 更新验证码
            		$scope.isShowCodeImg = true;
                    $scope.updateCheckCode();
                }
            }, 1000)

            // 校验验证码格式
            var flag = true;
            $scope.checkGetCodeImg = function(){
            	flag = true;
            	if($scope.user.checkCode.trim() != ''){
            		flag = false;
            	}
            	return flag;
            }

            // 获取验证码
            $scope.getYzm = function () {


            // 请求服务基本参数
            var ymdhm = FormatDate.getYmdhm(),
                pspre = BaseConfig.pspre;

            	if(isNaN($scope.user.checkCode)){
            		LayerUtil.warning({
	                    content:'请输入数字验证码',
	                    time:1.5,
	                    shade:true,
	                    shadeClose:true
	                })
					return;
            	}

                // 加载遮罩
                LayerUtil.load.loading();
                $http({
                    method: 'POST',
                    url: UrlUtil.http + "sms/post_sms_code",
                    data: {
                        phone: $scope.user.phone,
                        codeKey : uuId,// 唯一标识
                        codeNum : $scope.user.checkCode,// 验证码
                        method: 'post_sms_code',
                        timestamp: ymdhm,
                        sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                        app_key: BaseConfig.app_key,
                        sendType: 2
                    },
                    transformRequest: function (data) {
                    	console.log('获取验证码：'+UrlUtil.http + "sms/post_sms_code?"+$.param(data))
                        return $.param(data);
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    }
                }).success(function (data) {
                    layer.closeAll();
                    ;
                    if (data.code == 200) {
                        LayerUtil.warning({
                            content: '发送成功,请注意查收。'
                        })

                        $scope.loadGetYzm = true;
                        $scope.djs.showDjs = djsNum + "秒后重新获取";
                        djsNum--;

                        var djs = $interval(function () {
                            if (djsNum > 0) {
                                $scope.loadGetYzm = true;
                                $scope.djs.showDjs = djsNum + "秒后重新获取";
                                djsNum--;
                            } else {
                                $interval.cancel(djs);
                                djsNum = 120;
                                $scope.loadGetYzm = false;
                                $scope.djs.showDjs = "重新获取";
                    			$scope.updateCheckCode();
                            }
                        }, 1000)
                    } else {
                        LayerUtil.error({
                            content: data.data
                        })
                    }
                })
            }

            // 按钮校验
            $scope.checkUpdateInfo = function () {
                if ($scope.user.phoneYzm != "" && $scope.user.password != "" && $scope.user.rePassword != "") {
                    return false;
                }
                return true;
            }

            // 提交修改数据
            $scope.submit = function () {
                // 密码比对
                if ($scope.user.password != $scope.user.rePassword) {
                    LayerUtil.warning({
                        content: '两次输入的密码不一致'
                    })
                    return;
                } else if(!CustomReg.password($scope.user.password.trim()) || $scope.user.password.trim().length<6 || $scope.user.password.trim().length>16){
    				LayerUtil.warning({
                        content: "密码必须由6-16位数字字母组成"
                    });
                    return;
        		}
                else {


		            // 请求服务基本参数
		            var ymdhm = FormatDate.getYmdhm(),
		                pspre = BaseConfig.pspre;

                    // 加载遮罩
                    LayerUtil.load.loading();

                    $http({
                        method: 'POST',
                        url: UrlUtil.http + "User/post_user_find_pwd",
                        data: {
                            phone: $scope.user.phone,
                            password: $scope.user.password.trim(),
                            confirmpassword: $scope.user.rePassword.trim(),
                            smsCode: $scope.user.phoneYzm,
                            method: 'post_user_find_pwd',
                            timestamp: ymdhm,
                            sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                            app_key: BaseConfig.app_key
                        },
                        transformRequest: function (data) {
                        	console.log('修改密码：'+UrlUtil.http + "User/post_user_find_pwd?"+$.param(data));
                            return $.param(data);
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                        }
                    }).success(function (data) {
                        layer.closeAll();
                        if (data.code == 200) {
                            LayerUtil.warning({
			                    content:'修改成功!',
			                    time:1.5,
			                    shadeClose:false
			                })
	                    	setTimeout(function(){
	                    		$state.go("tab.login",{
	                    			params:JSON.stringify({
	                    				url:"#/tab/center"
	                    			})
	                    		});
	                    	},1000)

                        } else {
                            LayerUtil.error({
                                content: data.data
                            })
                        }
                    })
                }
            }
        }])
    // 个人资料
    .controller('PersonalDataCtrl', ['$scope','$ionicActionSheet','$ionicModal','Const','UrlUtil',
    'LayerUtil','SystemParam','$http','FormatDate','BaseConfig','MD5','$cordovaCamera','Log',
        function ($scope,$ionicActionSheet,$ionicModal,Const,UrlUtil,LayerUtil,SystemParam,$http,
        	FormatDate,BaseConfig,MD5,$cordovaCamera,Log) {

	    	$scope.takePhoto=function(){

	    		$ionicActionSheet.show({
                    cancelOnStateChange:true,
                    titleText: "照片选择",
                    buttons: [
                        { text: "拍照" },
                        { text: "选择图库" }
                    ],
                    buttonClicked: function(index) {
                    	var options ={
			              //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
			              quality: 100,                                            //相片质量0-100
			              destinationType: Camera.DestinationType.DATA_URL,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
			              sourceType: Camera.PictureSourceType.PHOTOLIBRARY,             //从哪里选择图片：PHOTOLIBRARY=0，Camera=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
			              allowEdit: false,                                        //在选择之前允许修改截图
			              encodingType:Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
			              targetWidth: 200,                                        //照片宽度
			              targetHeight: 200,                                       //照片高度
			              mediaType:0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
			              cameraDirection:0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
			              popoverOptions: CameraPopoverOptions,
			              //saveToPhotoAlbum: true                                   //保存进手机相册  * 当调取设备为拍照的时候则此属性致失败
			            };

				        // 拍照
                    	if(index == 0){
                    		options.sourceType = Camera.PictureSourceType.Camera;
                    	}

			            $cordovaCamera.getPicture(options).then(function(imageData) {
			              var image = document.getElementById('userHeaderImg');
			              //image.src=imageData;
			              image.src = "data:image/jpeg;base64," + imageData;
			            }, function(err) {
			            	Log.fatal("www/js/self/controller_self.js---[PersonalDataCtrl]:调取设备获取照片异常信息："+err)
			            });

                        return true;
                    },
                    cancelText: "取消",
                    cancel: function() {
                        return true;
                    }
                });

	          };



            //初始数据绑定
            $scope.personalData = [];
            var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
            $scope.user = {
                usex: 0,
                Uname:'',
                UBirthday: '',
                editName:''
            };
            var _default_user_info={
                usex: 0,
                Uname:'',
                UBirthday: ''
            }

                LayerUtil.load.loading();
                var params = 'userId=' + userInfo.id + '&method=get_user_Info_userId' + SystemParam.get();

                console.log(' 查询用户基本信息URL：'+UrlUtil.http + "User/get_user_Info_userId?" + params)
                $http.get(UrlUtil.http + "User/get_user_Info_userId?" + params)
                    .success(function (res) {
                        layer.closeAll();
                        if (res.code == 200) {
                            var data = res.data;
                            $scope.user.UBirthday = data.UBirthday || '';//出生日期

                            //如果有出生日期则禁用选择出生日期时间
			                if (!$scope.user.UBirthday) {
			                    //$(".dw-i").css("width","100px");
			                    var currYear = (new Date()).getFullYear();
			                    var opt = {};
			                    opt.date = {preset: 'date'};
			                    opt.datetime = {preset: 'datetime'};
			                    opt.time = {preset: 'time'};
			                    opt.default = {
			                        theme: 'android-ics linght', //皮肤样式
			                        display: 'bottom', //显示方式
			                        mode: 'scroller', //日期选择模式
			                        dateFormat: '1998-06-05',
			                        setText: '确定',
			                        cancelText: '取消',
			                        yearText: '年',
			                        monthText: '月',
			                        dayText: '日',
			                        lang: 'zh',
			                        showNow: true,
			                        nowText: "今天",
			                        showOnFocus: false,
			                        rows:'5',
			                        startYear: currYear - 18 - 100, //开始年份
			                        endYear: currYear - 18//结束年份
			                    };
			                    $("#appDate").mobiscroll($.extend(opt['date'], opt['default']));
			                    var optDateTime = $.extend(opt['datetime'], opt['default']);
			                    var optTime = $.extend(opt['time'], opt['default']);
			                    $("#appDateTime").mobiscroll(optDateTime).datetime(optDateTime);
			                    $("#appTime").mobiscroll(optTime).time(optTime);
			                    //$(document).on("click", 'div#zhezhao', function () {
			                    //    $("span#_cancel_date").click();
			                    //});
			                }else{
			                    //有用户名在次点击时弹出提示框
			                    $scope.myWindow=function(){
			                        LayerUtil.warning({
			                            content: '您已填写过出生日期不能再修改了！'
			                        });
			                    }
			                }



                            $scope.user.usex = data.USex;//性别
                            $scope.user.Uname = data.UAccount;//昵称
                            $scope.user.editName = "";
                            //判断昵称是否存在，如果在则可以点击出model
                            $scope.myNickname=function(){
                            	$scope.user.editName = $scope.user.Uname;
                            	_default_user_info.editName = $scope.user.Uname;// 为了比较是否修改
                                $scope.nickNameModal.show();
                                setTimeout(function(){
									$('input#inEditUserName').focus();
                                },600)
                            };
                            //判断数据显示性别
                            if ($scope.user.usex == 0) {
                                $scope.user.usex = "保密";
                            } else if ($scope.user.usex == 1) {
                                $scope.user.usex = "女";
                            } else {
                                $scope.user.usex = "男";
                            }
                            //将获取到的值赋予新的对象 以便后来比较
                            _default_user_info = angular.extend(_default_user_info,$scope.user);
                        } else {
                            LayerUtil.error({
                                content: res.data
                            });
                        }
                    })
            // 修改性别modal
            $ionicModal.fromTemplateUrl("views/self/personalData/gender.html", {
                scope: $scope,
            }).then(function (modal) {
                $scope.genderModal = modal;

            });
            //修改昵称
            $ionicModal.fromTemplateUrl("views/self/personalData/nickName.html", {
                scope: $scope,
            }).then(function (modal) {
                $scope.nickNameModal = modal;
            });

            //点击返回键关闭model
			$scope.backPersonDataView=function(){
				 $scope.nickNameModal.hide();
			}
            // 监听是否改变
            $scope.checkSave=function(){
                var flag = true;
                angular.forEach(_default_user_info,function(val,key){
                    if(key == 'UBirthday'){
                    	if(val != $('#appDate').val()){
                    		flag = false;
                    	}
                    }else if(val != $scope.user[key]){
                    	flag = false;
                    }
                });
                return flag;
            };
            //点击保存向后台发送请求，改变性别，昵称，生日，（生日，昵称只能改变一次）
            $scope.save = function(){
                if (userInfo) {
                    LayerUtil.load.loading();
                    // 请求服务基本参数
                    var ymdhm = FormatDate.getYmdhm(),
                        pspre = BaseConfig.pspre,
                        sex = 0;
                    if ($scope.user.usex == "女") {
                        sex = 1;
                    }
                    if ($scope.user.usex == "男") {
                        sex = 2;
                    }
                    $scope.updateUserInfo=function(){
                        $http({
                            method: 'POST',
                            url: UrlUtil.http + "User/post_user_update",
                            data: {
                                USex: sex,
                                UAccount: $scope.user.Uname,
                                UBirthday: $('#appDate').val(),
                                UId: userInfo.id,
                                method: 'post_user_update',
                                timestamp: ymdhm,
                                sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                                app_key: BaseConfig.app_key
                            },
                            transformRequest: function (data) {
                            	console.log('修改用户信息URL:'+UrlUtil.http + "User/post_user_update?"+$.param(data));
                                return $.param(data);
                            },
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                            }
                        }).success(function (res) {
                            layer.closeAll();
                            if (res.code == 200) {
                                LayerUtil.warning({
                                    content: '修改成功！'
                                });
                                _default_user_info = angular.extend(_default_user_info,$scope.user);
                            } else {
                                LayerUtil.error({
                                    content: res.data
                                })
                            }
                        })

                    };
                    if($scope.user.UBirthday != _default_user_info.UBirthday){
                        layer.open({
                            content: '出生日期只能修改一次是否确定修改?',
                            btn: ['确认', '取消'],
                            shadeClose: false,
                            yes: function(){
                    			$scope.updateUserInfo();
                                layer.closeAll();
                            }, no: function(){
                                layer.closeAll();
                            }
                        });
                    }else{
                    	$scope.updateUserInfo();
                    }
                }
            };

            //隐藏选择性别model
            $scope.saveGender = function () {
                $scope.genderModal.hide();
            };
            //显示改变昵称model
            $scope.nickNameModalQ = function () {
            	var name = $scope.user.editName;
				var reg = new RegExp("\\s");
            	if(name.length<4 || name.length > 20){
            		LayerUtil.error({
	                    content:'会员昵称最少长度为4位，最大长度为20位！',
	                    btn:'好'
	                })
            		return;
            	}
            	if(reg.test(name)==true){
            		LayerUtil.error({
	                    content:'会员昵称不能填写特殊字符呦！',
	                    time:1.5
	                })
            		return;
            	}
            	// 如果修改了昵称，则发送请求更新
				if($scope.user.Uname != name){
            		$scope.user.Uname = name;
					$scope.save();
				}
				$scope.nickNameModal.hide();
            }
            //点击删除，删除所有输入内容
			$scope.clearEditName=function(){
				$scope.user.editName="";
			}

        }])
    //修改昵称页面
    /*.controller('nickNameCtrl',function(){

     })*/
    //修改性别页面
    .controller('GenderCtrl', function () {


    })
    // 收货地址
    .controller('ShippingAddressCtrl', ['$scope','$http','UrlUtil','LayerUtil','SystemParam','Const','FormatDate','BaseConfig','MD5','$state','$stateParams','$rootScope','$location',
        function ($scope,$http,UrlUtil,LayerUtil,SystemParam,Const,FormatDate,BaseConfig,MD5,$state,$stateParams,$rootScope,$location) {

        	// 添加新的地址
        	$scope.addNewAddress = function(){
        		$state.go('tab.addShippingAddress',{
        			param:''
        		})
        	}

        	// 结算页面  → 收货地址
        	var param = $stateParams.param;
        	if(param){
        		param = JSON.parse(param);
	        	$scope.chooseAddressId = param.addressId;

	        	// 选择收货地址，返回至结算页面
	        	$scope.chooseAddress = function(id){
	        		$state.go('tab.subOrder', {
	        			'param': JSON.stringify({
	        				'cartList':param.cartList,
	        				'addressId':id
	        			})
	        		})
	        	}
        	}

            // 收获地址
            $scope.address = [];
            var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));

            var params = 'userId=' + userInfo.id + '&Id=0' + '&method=get_user_address' + SystemParam.get();
            console.log('加载用户收货地址：'+UrlUtil.http + "Order/get_user_address?" + params)
            $http.get(UrlUtil.http + "Order/get_user_address?" + params)
            .success(function (res) {
                if (res.code == 200) {
                    $scope.address = res.data;
                    if($scope.address.length==0){
                    	$scope.noData = true;
                    }
                } else {
                    LayerUtil.error({
                        content: res.data
                    })
                }
            })

            // 选择当前地址为结算页面收货地址
            $scope.chooseCurrentAddress = function(){
            	angular.forEach($scope.address,function(item){
            		item.chooseCurrentAddress = false;
            	})

            	this.item.chooseCurrentAddress = true;

            	$scope.chooseAddress(this.item.Id);
            }

            // 编辑
            $scope.edit = function (item) {
                var addressInfo = JSON.stringify(item);
                $state.go('tab.addShippingAddress', {'param': addressInfo})
            }

            // 删除收获地址
            $scope.delete = function (item) {
                var index = layer.open({
                    content: '确认删除?',
                    btn: ['删除', '取消'],
                    shadeClose: false,
                    yes: function () {
                        // 请求服务基本参数
                        var ymdhm = FormatDate.getYmdhm(),
                            pspre = BaseConfig.pspre;

                        LayerUtil.load.loading();

                        $http({
                            method: 'POST',
                            url: UrlUtil.http + "Order/post_user_address_delete",
                            data: {
                                id: item.Id,
                                userId: userInfo.id,
                                method: 'post_user_address_delete',
                                timestamp: ymdhm,
                                sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                                app_key: BaseConfig.app_key
                            },
                            transformRequest: function (data) {
                            	console.log('删除收货地址：'+UrlUtil.http + "Order/post_user_address_delete?"+$.param(data))
                                return $.param(data);
                            },
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                            }
                        }).success(function (res) {
                            layer.closeAll();
                            if (res.code == 200) {
                                $scope.address.splice($scope.address.indexOf(item), 1);
                            } else {
                                LayerUtil.error({
                                    content: res.data
                                })
                            }
                        })
                    }
                })
            }
        }])
    // 新增和修改收货地址页面
    .controller('AddShippingAddressCtrl', ['$scope','LayerUtil','$http','UrlUtil','MD5','BaseConfig','$ionicHistory','FormatDate','Const','CustomReg','$stateParams','AddressServer',
        function ($scope,LayerUtil,$http,UrlUtil,MD5,BaseConfig,$ionicHistory,FormatDate,Const,CustomReg,$stateParams,AddressServer) {
        // 控制ion-view具体高度，防止因为真机键盘向上滑动将footer-bar顶上去
        $('ion-view').css('height',$(window).height())


		// 历史数据
		$scope.module={
			fifteen:false,// 15 遮罩
			eighteen:false // 地址
		}

			// 收货地址
		$scope.showAddress = function(){
			$scope.module.eighteen=true;
			$scope.module.fifteen=true;

		    // 关闭遮罩
		    $scope.closeLayer = function(){
		    	$scope.module.eighteen=false;
				$scope.module.fifteen=false;
		    }
	    }

		// 一级地址数据集合
		$scope.provinces = AddressServer.getProvince();
		$scope.citys = [];
		$scope.county = [];

		// 二级类目控制对象
		$scope.addressTwo = {
			twoAddress100:true,
			twoAddress50:false,
			twoAddress33:false
		}

		// 三级类目控制对象
		$scope.addressThree = {
			threeAddress100:true,
			threeAddress66:false
		}

		// 页面显示的地址
		$scope.address={
			currentProvinceName:"北京",
			currentCityName:"北京市",
			currentCountyName:"东城区",
			currentProvinceId:null,
			currentCityId : null
		}

		// 选择省份
		$scope.chooseProvinces = function(){
			$scope.address.currentProvinceName = this.item.name;

			// 控制当前选中样式
			angular.forEach($scope.provinces,function(item){
				item.click=false;
			})
			this.item.click = true;

			// 控制二级类目滑动显示
			angular.forEach($scope.addressTwo,function(val,key){
				$scope.addressTwo[key] = false;
			})
			$scope.addressTwo.twoAddress50 = true;

			// 控制三级类目滑动显示
			angular.forEach($scope.addressThree,function(val,key){
				$scope.addressThree[key] = false;
			})
			$scope.addressThree.threeAddress100 = true;

			// 获取城市信息
			$scope.citys = AddressServer.getCitysForProvinceId(this.item.id);

			// 记录省份ID
			$scope.address.currentProvinceId = this.item.id;
		}

		// 选择城市
		$scope.chooseCitys = function(){
			$scope.address.currentCityName = this.item.name;

			// 二级类目左移
			angular.forEach($scope.addressTwo,function(val,key){
				$scope.addressTwo[key] = false;
			})
			$scope.addressTwo.twoAddress33 = true;

			// 控制当前选中样式
			angular.forEach($scope.citys,function(item){
				item.click=false;
			})
			this.item.click = true;

			// 控制三级类目滑动显示
			angular.forEach($scope.addressThree,function(val,key){
				$scope.addressThree[key] = false;
			})
			$scope.addressThree.threeAddress66 = true;

			// 获取区县信息
			$scope.county = AddressServer.getCountyForCityId($scope.address.currentProvinceId,this.item.id);

			$scope.address.currentCityId = this.item.id;
		}

	    // 选择区县
	    $scope.chooseCounty = function(){
	    	// 当前选中的名字
	    	$scope.address.currentCountyName = this.item.name;
				console.log(this.item.name)
			// 控制当前选中样式
			angular.forEach($scope.county,function(item){
				item.click=false;
			})
			this.item.click = true;

			$('input#saveCityIds:hidden').val($scope.address.currentProvinceId + ',' + $scope.address.currentCityId + ',' + this.item.id);

			$('span#showChooseProvinces').text($scope.address.currentProvinceName+' / '+$scope.address.currentCityName+' / '+$scope.address.currentCountyName)

			$scope.address.citys = "反正不是null";

			$scope.closeLayer();
	    }

            var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
            $scope.address = {
                id: '',// 已存在的数据ID
                citys: '',// 省市区ID集合
                proSelect: '',// 省
                citySelect: '',// 市
                couSelect: '',// 区县
                consignee: '',// 收货人
                streetaddress: '',// 收获地址
                zipcode: '',// 邮编
                cellphone: null,// 手机号
                areacode: '',// 地址代码 null
                telephone: '',// 座机 null
                extension: '',// 电话分机 null
                userId: userInfo.id,
                url:''
            }

            // 对于input type=number的数据进行输入字段长度监听(手机号最长11位)
        	$scope.$watch('address.cellphone', function (newVal, oldVal) {
                if(newVal > 99999999999){
                	$scope.address.cellphone = oldVal;
                }
            })

            // 对于input type=number的数据进行输入字段长度监听(邮编最长6位)
        	$scope.$watch('address.zipcode', function (newVal, oldVal) {
                if(newVal > 999999){
                	$scope.address.zipcode = oldVal;
                }
            })

            // 验证保存收获地址按钮
            $scope.checkAddressInfo = function () {
                if ($scope.address.citys != ''
                    && $scope.address.consignee != ''
                    && $scope.address.streetaddress != ''
                    && $scope.address.cellphone != '') {
                    return true;
                }
                return false;
            }

            // 保存收货地址
            $scope.saveAddress = function () {
                if ($scope.address.consignee.length < 2) {
                    LayerUtil.warning({
                        content: '收货人长度不能小于2'
                    });
                    return;
                } else if ($scope.address.consignee.length > 10) {
                    LayerUtil.warning({
                        content: '收货人长度不能大于10'
                    });
                    return;
                } else if (!CustomReg.phone($scope.address.cellphone)) {
                    LayerUtil.warning({
                        content: '请输入正确的手机号码'
                    });
                    return;
                }
                else if ($scope.address.zipcode && (!angular.isNumber($scope.address.zipcode) || $scope.address.zipcode.length < 6)) {
                    LayerUtil.warning({
                        content: '请输入6位数字的邮编(如果不知道可以不填)'
                    });
                    return;
                }

                var cityArray = $('input#saveCityIds:hidden').val().split(',');

                $scope.address.proSelect = cityArray[0];
                $scope.address.citySelect = cityArray[1];
                $scope.address.couSelect = cityArray[2];

                // 请求服务基本参数
                var ymdhm = FormatDate.getYmdhm(),
                    pspre = BaseConfig.pspre;
                $scope.address.url = 'Order/post_user_address_add';
                $scope.address.hint = '添加成功';
                $scope.address.method = 'post_user_address_add';
                $scope.address.sign = (MD5.getMD5Val(pspre + ymdhm)).toUpperCase();
                $scope.address.app_key = BaseConfig.app_key;
                $scope.address.timestamp = ymdhm;

                LayerUtil.load.loading();
                // 更新收货地址
                if ($scope.address.id != '') {
                    $scope.address.method = 'post_user_address_update';
                    $scope.address.url = 'Order/post_user_address_update';
                    $scope.address.hint = '修改成功';
                }

                // 新增收货地址
                $http({
                    method: 'POST',
                    url: UrlUtil.http + $scope.address.url,
                    data: $scope.address,
                    transformRequest: function (data) {
                    	console.log('新增/修改收货地址URL:'+UrlUtil.http + $scope.address.url + '?' + $.param(data))
                        return $.param(data);
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    }
                }).success(function (res) {
                    layer.closeAll();
                    if (res.code == 200) {
                    	LayerUtil.warning({
		                    content:$scope.address.hint,
		                    time:1.5,
		                    shadeClose:false
		                })
                    	setTimeout(function(){
                    		$ionicHistory.goBack();
                    	},1000)
                    } else {
                        LayerUtil.error({
                            content: res.data
                        })
                    }
                })
            };


			// 编辑动作
            $scope.title = '创建收货地址';
            if ($stateParams.param != '') {
                var param = JSON.parse($stateParams.param);
                $scope.title = '修改收货地址';
                $scope.address.id = param.Id;
                $scope.address.consignee = param.Consignee;
                $scope.address.cellphone = param.Phone*1;
                $scope.address.streetaddress = param.StreetAddress;
                $scope.address.zipcode = param.ZipCode * 1;
                $scope.address.proSelect = param.Pid;
                $scope.address.citySelect = param.Cid;
                $scope.address.couSelect = param.Aid;
                $('input#saveCityIds:hidden').val(param.Pid + ',' + param.Cid + ',' + param.Aid);

                $scope.address.citys = "反正不是null";

                // 获取对应的中文名展示
                var names = AddressServer.getProvincesCityCountyName(param.Pid , param.Cid , param.Aid);
                $('span#showChooseProvinces').text(names.proName+' / '+names.cityName+' / '+names.countyName)
            }
        }])
    //查看订单页面
    .controller('OrderCtrl', ['$scope','$stateParams','$state','Const','LayerUtil','SystemParam','$http','UrlUtil',
    '$rootScope','FormatDate','BaseConfig','MD5','CancelOrderInfo','PayType','ProjectType',
    	function ($scope,$stateParams,$state,Const,LayerUtil,SystemParam,$http,UrlUtil,$rootScope,FormatDate,
    		BaseConfig,MD5,CancelOrderInfo,PayType,ProjectType) {

			$scope.goBack = function(){
				$state.go('tab.center');
			}

            // 默认加载参数
            var pageIndex = 0,// 默认页数
                totalPage = 1,// 默认总页数
                pageSize = 10,// 每页条数
                orderStatus = $stateParams.status,// 查询的状态
                userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));// 当前登录用户

            $scope.status = orderStatus;// 展示当前页面订单类型（全部订单、待付款、待发货、待收货）

            // 显示上啦刷新图标
            $scope.infiniteShow = true;

            // 订单数据
            $scope.datas=[];

            // 上啦加载更多
            $scope.loadMoreOrder = function (fn) {

            	// 分页判断
            	if(pageIndex >= totalPage){
            		return;
            	}

            	// 当前页自增
                pageIndex++;

                // 拼接请求参数

                var params = 'userId=' +userInfo.id+ '&pageIndex='+pageIndex+'&pageSize='+pageSize+'&orderStatus='+orderStatus+'&time=&method=get_user_order' + SystemParam.get();
                console.log("查看订单:"+UrlUtil.http + "Order/get_user_order?" + params)
                $http.get(UrlUtil.http + "Order/get_user_order?" + params).success(function (res) {
                    if (res.code == 200) {
                        var data = res.data;

                        // 封装订单页面数据
                        angular.forEach(data.datas,function(item){
                            $scope.datas.push(item);
                        });

                        // 更新总页数
                        totalPage = data.totalPage;

                        // 空数据提示
                        if($scope.datas.length == 0){
                        	$scope.noData = true;
                        }

                        // 执行落下刷新回调
                        if(fn){
                        	fn();
                        	return;
                        }

                        // 隐藏加载更多图标
                        $scope.infiniteShow = false;

                        // 广播上啦完成事件
                        $scope.$broadcast("scroll.infiniteScrollComplete");
                    }
                })
            }

            // 下拉刷新
            $scope.doRefresh=function(){
            	// 初始化分页、数据参数
                pageIndex = 0;
                totalPage = 1;
            	$scope.datas=[];
            	$scope.loadMoreOrder(function(){
            		$scope.$broadcast('scroll.refreshComplete');
            	});
            }

	        // 查询订单详情
	        $scope.orderInfo = function(id){
	        	$state.go('tab.orderInfo',{
	        		id:id
	        	});
	        }

            // 确认收货
            $scope.confirmOrder = function(orderId){
            	layer.open({
				  content: '确认收货吗',
				  btn: ['确认', '取消'],
				  shadeClose: false,
				  yes: function(){
	                var ymdhm = FormatDate.getYmdhm(),
	                    pspre = BaseConfig.pspre;

				  	$http({
                        method: 'POST',
                        url: UrlUtil.http + "Order/post_order_ok",
                        data: {
                            userId: userInfo.id,
                            orderId: orderId,
                            method: 'post_order_ok',
                            timestamp: ymdhm,
                            sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                            app_key: BaseConfig.app_key
                        },
                        transformRequest: function (data) {
                            console.log("确认收货"+UrlUtil.http + "Order/post_order_ok?"+$.param(data))
                            return $.param(data);
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                        }
                    }).success(function (res) {
                    	if(res.code == 200){
                    		LayerUtil.warning({
				                    content:'收货成功',
				                    time:1.5,
				                    shadeClose:false
				                })
		                    	setTimeout(function(){
		                    		$rootScope.rootBack();
		                    	},1000)
                    	}else{
                    		LayerUtil.error({
                    			content:res.data
                    		})
                    	}
                    })

				  }
				});
            }

	    	// 查看物流
	    	$scope.chakanwuliu = function(orderId){
            	$state.go('tab.logistics',{
            		express:JSON.stringify({
            			orderId:orderId,// 订单号
            			isSearch:true// 是否根据订单号搜索
            		})
            	})
            }


	    	// 取消订单
	    	$scope.zhezhao = false;
	    	$scope.chooseCancelDiv = false;
	    	$scope.cancelInfo = CancelOrderInfo.getAll();
	    	$scope.currentOrderId = null;

	    	// 取消订单→弹层选择理由
	    	$scope.cancelOrder = function(orderId){
	    		$scope.currentOrderId = orderId;

		      	$scope.zhezhao = true;
				$scope.chooseCancelDiv = true;

				$scope.closeLayer = function(){
			    	$scope.zhezhao = false;
			    	$scope.chooseCancelDiv = false;
				}
			}

	    	// 控制取消订单样式
	    	$scope.chooseCancelInfo = function(){
	    		//this.item.content
	    		angular.forEach($scope.cancelInfo,function(item){
	    			item.choose = false;
	    		})
	    		this.item.choose = true;
	    	}

	    	// 取消确定
	    	$scope.submitCancel = function(){

	    		var orderMsg = null;
	    		angular.forEach($scope.cancelInfo,function(item){
	    			if(item.choose){
	    				orderMsg = item.content;
	    			}
	    		})

	    		LayerUtil.load.loading();

                var ymdhm = FormatDate.getYmdhm(),
                    pspre = BaseConfig.pspre;

	    		$http({
                    method: 'POST',
                    url: UrlUtil.http + "Order/post_order_cancel",
                    data: {
                        orderId: $scope.currentOrderId,
                        userId: userInfo.id,
                        orderMsg : orderMsg,
                        ip: returnCitySN["cip"],
					    source: "",
					    type: 2,
                        method: 'post_order_cancel',
                        timestamp: ymdhm,
                        sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                        app_key: BaseConfig.app_key
                    },
                    transformRequest: function (data) {
                    	console.log("取消订单URL:"+UrlUtil.http + "Order/post_order_cancel?"+$.param(data))
                        return $.param(data);
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    }
                }).success(function (res) {
                	layer.closeAll();

                	if(res.code == 200){
                		$scope.zhezhao = false;
		    			$scope.chooseCancelDiv = false;


                		LayerUtil.warning({
		                    content:'取消成功',
		                    time:1,
		                    shade:true,
		                    shadeClose:true,
		                    success:function(){
		                    	$scope.doRefresh();
		                    }
		                })
                	}else{
                		LayerUtil.error({
                			content:res.data
                		})
                	}
                })
	    	}




    	// 支付方式
        $scope.payType = PayType.getAll();

        // 当前选择的支付方式
        var currentPayType = null;

        // 默认支付方式
        angular.forEach($scope.payType,function(item){
        	if(!item.disabled && item.selected){
        		currentPayType = item.payment;
        	}
        })

        // 选择支付方式
        $scope.tooglePayType = function(){

        	angular.forEach($scope.payType,function(item){
        		item.selected = false;
        	})

        	this.item.selected = true;

	        angular.forEach($scope.payType,function(item){
	        	if(!item.disabled && item.selected){
	        		currentPayType = item.payment;
	        	}
	        })
        }


        var paysn = null,
        	OrderTotalMoney = null;

		// 订单支付
    	$scope.pay = function(param_paysn,param_OrderTotalMoney){
    		paysn = param_paysn;
    		OrderTotalMoney = param_OrderTotalMoney;

    		$scope.showPayMoney = OrderTotalMoney;
        	$scope.zhezhao = true
        	$scope.choosePayType = true;
        	$scope.closeLayer = function(){
		    	$scope.zhezhao=false,
		    	$scope.choosePayType=false
        	}
   		}

        $scope.goPay = function(){

        	if(ProjectType.type == 'android'){
        		LayerUtil.load.loading();
        	}else{
        		LayerUtil.load.loading(10);
        	}

        	// 发送支付请求
        	switch (currentPayType){
        		case 0:
		        	// 微信付款
		        	wechatPay();
        			break;
        		case 1:
		        	// 支付宝付款
		        	alipay();
        			break;
        		default:
        			break;
        	}
        }

    	var wechatPay = function(){

            // 请求服务基本参数
            var ymdhm = FormatDate.getYmdhm(),
                pspre = BaseConfig.pspre;

        	$http({
                method: 'POST',
                url: UrlUtil.http + "OAuth/post_wxpay_app",
                data: {
                	paysn: paysn,
                    ip: returnCitySN["cip"],
                    method: 'post_wxpay_app',
                    timestamp: ymdhm,
                    sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                    app_key: BaseConfig.app_key
                },
                transformRequest: function (data) {
                	console.log('微信支付：'+UrlUtil.http + "OAuth/post_wxpay_order?"+$.param(data));
                    return $.param(data);
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                }
            }).success(function (res) {
            	console.log("微信统一下单接口返回值：")
            	console.log(res)
            	if(res.code == 200){

					var createUUID = (function (uuidRegEx, uuidReplacer) {
				        return function () {
				            return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
				        };
				    })(/[xy]/g, function (c) {
				        var r = Math.random() * 16 | 0,
				            v = c == "x" ? r : (r & 3 | 8);
				        return v.toString(16);
					});

	            	var appid = 'wxc9901becfe0a081d',
	            		data = res.data,
	            		noncestr = createUUID(),
	            		prepayid = data.prepay_id,
	            		partnerid = '1419094102',
	            		package = 'Sign=WXPay',
	            		timestamp = parseInt((new Date()).getTime()/1000)+'',
	            		apiKey = 'S9FH2LL8NK7SY8DF9G5Y1C3GZ15XF2SH',
	            		stringSignTemp = "appid=wxc9901becfe0a081d&noncestr="+noncestr+"&package="+package+"&partnerid="+partnerid+"&prepayid="+prepayid+"&timestamp="+timestamp+"&key="+apiKey,
	            		sign = MD5.getMD5Val(stringSignTemp).toUpperCase(),
	            		params = {
						    partnerid: partnerid, // merchant id   商户号
						    prepayid: prepayid, // prepay id  支付交易会话ID  (微信生成的预支付回话标识，用于后续接口调用中使用，该值有效期为2小时)
						    noncestr: noncestr,//data.nonce_str, // nonce  随机字符串，不长于32位  ([统一下单接口]返回)
						    timestamp: timestamp, // timestamp  时间戳
						    sign: sign, // signed string  微信返回的签名
						};

					console.log("微信支付："+sign)


					Wechat.sendPaymentRequest(params, function () {
						// 付款成功刷新订单
						$scope.doRefresh();
						layer.closeAll();
					}, function (reason) {
						layer.closeAll();
						LayerUtil.error({
		                    content:reason,
		                    btn:'好'
						})
					});
            	}else{
					layer.closeAll();
            		LayerUtil.error({
	                    content:res.data,
	                    btn:'好'
					})
            	}

            })

    	}


    	var alipay = function(){
    		window.alipay.pay({
			    tradeNo: paysn,
			    subject: "世峰户外商城商品订单",
			    body: "世峰户外商城商品订单",
			    price: OrderTotalMoney,
			    notifyUrl: UrlUtil.zfbNotify
			}, function(successResults){
				// 付款成功刷新订单
				$scope.doRefresh();
				layer.closeAll();
			}, function(errorResults){
				layer.closeAll();
				LayerUtil.error({
                    content:errorResults.memo,
                    btn:'好'
				})
			});
    	}








    }])
    // 订单详情页面
    .controller('OrderInfoCtrl',['$scope','$stateParams','$http','UrlUtil','SystemParam','$state','ExpressType',
    'Const','FormatDate','BaseConfig','MD5','LayerUtil','$rootScope','PayType','ProjectType',
    	function($scope,$stateParams,$http,UrlUtil,SystemParam,$state,ExpressType,Const,FormatDate,
    		BaseConfig,MD5,LayerUtil,$rootScope,PayType,ProjectType){

    		var orderId = $stateParams.id,
                params = 'orderId=' + orderId + '&method=get_user_order' + SystemParam.get(),
                userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO)),
				paysn = null,
        		OrderTotalMoney = null;
            // 获取订单详情

            console.log("订单详情:"+UrlUtil.http + "Order/get_user_order?" + params)
            $http.get(UrlUtil.http + "Order/get_user_order?" + params)
            .success(function (res) {
            	if(res.code == 200){
	            	var data = res.data;

                    // 快递信息{
                    $scope.ExpressInfo = data.ExpressInfo;

                    $scope.localExpressInfo = ExpressType.getKuaidi($scope.ExpressInfo.ExpressType);

                    // 缓存中的快递对应信息
                    if($scope.ExpressInfo.ExpressNumber && $scope.localExpressInfo){
	                    // 快递公司名称
	                    $scope.ExpressInfo.Val = $scope.localExpressInfo.Val;

	                    // 快递公司简称（小写字母用于查询）
	                    $scope.ExpressInfo.ExpressType = $scope.localExpressInfo.Letter;
                    }else{
                    	$scope.ExpressInfo.Val = '暂无对应的快递公司';
                    	$scope.ExpressInfo.ExpressType = '暂无对应的快递公司';
                    }

	            	// 订单信息
	            	$scope.orderInfo = data;

					paysn = $scope.orderInfo.OrderInfo.paysn,
	        		OrderTotalMoney = $scope.orderInfo.OrderInfo.OrderTotalMoney;

	            	// 比较每笔订单的提交时间距今有多久
	            	if(data.OrderInfo.OrderStatus == 3){
		            	var UserConfirmTime = new Date(data.OrderInfo.UserConfirmTime.replace('T'," ").replace(/-/g,"/")),// 用户确认收货时间
		            		currentDate = new Date();// 当前时间
							date3=currentDate.getTime()-UserConfirmTime.getTime(),  //时间差的毫秒数
							days=Math.floor(date3/(24*3600*1000));
						$scope.orderInfo.confirmTimeInterval = days;// 计算用户确认时间距离今天的时间
	            	}

	            	// 订单实付金额
	            	$scope.totalMoney = 0;
	            	angular.forEach(data.PaymentInfo,function(item){
	            		$scope.totalMoney += item.TotalMoney;
	            	})

	            	// 商品总价
	            	$scope.productsTotalMoney = 0;
	            	// 优惠价格
	            	$scope.procouponmoney = 0;
	            	angular.forEach(data.OrderDetailInfos,function(item){
	            		$scope.productsTotalMoney += item.TotalMoney;
	            		$scope.procouponmoney += item.procouponmoney;
	            	});

	            	// 如果当前订单的状态为等待收货，或者交易成功，那么根据快递单号查询最新物流信息
	            	if($scope.localExpressInfo){
		           	 	// 获取最新物流状态
		           	 	console.log('获取最新物流状态URL:'+UrlUtil.kuaidi+'query?type='+$scope.ExpressInfo.ExpressType+'&postid='+$scope.ExpressInfo.ExpressNumber+'&temp='+new Date().getTime())
		           	 	//$http.get(UrlUtil.kuaidi+'query?type=yunda&postid=1000723821471&temp='+new Date().getTime())
						$http.get(UrlUtil.kuaidi+'query?type='+$scope.ExpressInfo.ExpressType+'&postid='+$scope.ExpressInfo.ExpressNumber+'&temp='+new Date().getTime())
				        .success(function (res) {
				        	if(res.status == '200'){
				        		$scope.logistics = res;
				        	}else{
				        		$scope.expressInfoLoadFail = res.message;
				        	}
				        })
	            	}
            	}
            });

            // 支付方式
        $scope.payType = PayType.getAll();

        // 当前选择的支付方式
        var currentPayType = null;

        // 默认支付方式
        angular.forEach($scope.payType,function(item){
        	if(!item.disabled && item.selected){
        		currentPayType = item.payment;
        	}
        })

        // 选择支付方式
        $scope.tooglePayType = function(){

        	angular.forEach($scope.payType,function(item){
        		item.selected = false;
        	})

        	this.item.selected = true;

	        angular.forEach($scope.payType,function(item){
	        	if(!item.disabled && item.selected){
	        		currentPayType = item.payment;
	        	}
	        })
        }

    	$scope.zhezhao=false,
    	$scope.choosePayType=false

		// 订单支付
    	$scope.pay = function(){
			$scope.showPayMoney = OrderTotalMoney;
        	$scope.zhezhao = true
        	$scope.choosePayType = true;
        	$scope.closeLayer = function(){
		    	$scope.zhezhao=false,
		    	$scope.choosePayType=false
        	}
   		}

        $scope.goPay = function(){
	        if(ProjectType.type == 'android'){
        		LayerUtil.load.loading();
        	}else{
        		LayerUtil.load.loading(10);
        	}

        	// 发送支付请求
        	switch (currentPayType){
        		case 0:
		        	// 微信付款
		        	wechatPay();
        			break;
        		case 1:
		        	// 支付宝付款
		        	alipay();
        			break;
        		default:
        			break;
        	}
        }

    	var wechatPay = function(){

            // 请求服务基本参数
            var ymdhm = FormatDate.getYmdhm(),
                pspre = BaseConfig.pspre;

        	$http({
                method: 'POST',
                url: UrlUtil.http + "OAuth/post_wxpay_app",
                data: {
                	paysn: paysn,
                    ip: returnCitySN["cip"],
                    method: 'post_wxpay_app',
                    timestamp: ymdhm,
                    sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                    app_key: BaseConfig.app_key
                },
                transformRequest: function (data) {
                	console.log('微信支付：'+UrlUtil.http + "OAuth/post_wxpay_order?"+$.param(data));
                    return $.param(data);
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                }
            }).success(function (res) {
            	console.log("微信统一下单接口返回值：")
            	console.log(res)
            	if(res.code == 200){

					var createUUID = (function (uuidRegEx, uuidReplacer) {
				        return function () {
				            return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
				        };
				    })(/[xy]/g, function (c) {
				        var r = Math.random() * 16 | 0,
				            v = c == "x" ? r : (r & 3 | 8);
				        return v.toString(16);
					});

	            	var appid = 'wxc9901becfe0a081d',
	            		data = res.data,
	            		noncestr = createUUID(),
	            		prepayid = data.prepay_id,
	            		partnerid = '1419094102',
	            		package = 'Sign=WXPay',
	            		timestamp = parseInt((new Date()).getTime()/1000)+'',
	            		apiKey = 'S9FH2LL8NK7SY8DF9G5Y1C3GZ15XF2SH',
	            		stringSignTemp = "appid=wxc9901becfe0a081d&noncestr="+noncestr+"&package="+package+"&partnerid="+partnerid+"&prepayid="+prepayid+"&timestamp="+timestamp+"&key="+apiKey,
	            		sign = MD5.getMD5Val(stringSignTemp).toUpperCase(),
	            		params = {
						    partnerid: partnerid, // merchant id   商户号
						    prepayid: prepayid, // prepay id  支付交易会话ID  (微信生成的预支付回话标识，用于后续接口调用中使用，该值有效期为2小时)
						    noncestr: noncestr,//data.nonce_str, // nonce  随机字符串，不长于32位  ([统一下单接口]返回)
						    timestamp: timestamp, // timestamp  时间戳
						    sign: sign, // signed string  微信返回的签名
						};

					Wechat.sendPaymentRequest(params, function () {
						// 付款成功刷新订单
						$scope.doRefresh();
						layer.closeAll();
					}, function (reason) {
						layer.closeAll();
						LayerUtil.error({
		                    content:reason,
		                    btn:'好'
						})
					});
            	}else{
					layer.closeAll();
            		LayerUtil.error({
	                    content:res.data,
	                    btn:'好'
					})
            	}

            })

    	}


    	var alipay = function(){
        	LayerUtil.load.loading();
        	window.alipay.pay({
			    tradeNo: paysn,
			    subject: "世峰户外商城商品订单",
			    body: "世峰户外商城商品订单",
			    price: OrderTotalMoney,
			    notifyUrl: UrlUtil.zfbNotify
			}, function(successResults){
				// 付款成功刷新订单
				$scope.doRefresh();
				layer.closeAll();
			}, function(errorResults){
				layer.closeAll();
				LayerUtil.error({
                    content:errorResults.memo,
                    btn:'好'
				})
			});
        }






            // 确认收货
            $scope.confirmOrder = function(){
            	layer.open({
				  content: '确认收货吗',
				  btn: ['确认', '取消'],
				  shadeClose: false,
				  yes: function(){
	                var ymdhm = FormatDate.getYmdhm(),
	                    pspre = BaseConfig.pspre;

				  	$http({
                        method: 'POST',
                        url: UrlUtil.http + "Order/post_order_ok",
                        data: {
                            userId: userInfo.id,
                            orderId: orderId,
                            method: 'post_order_ok',
                            timestamp: ymdhm,
                            sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                            app_key: BaseConfig.app_key
                        },
                        transformRequest: function (data) {
                          console.log("确认收货URL:"+UrlUtil.http + "Order/post_order_ok?"+$.param(data));
                            return $.param(data);
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                        }
                    }).success(function (res) {
                    	if(res.code == 200){
                    		LayerUtil.warning({
				                    content:'收货成功',
				                    time:1.5,
				                    shadeClose:false
				                })
		                    	setTimeout(function(){
		                    		$rootScope.rootBack();
		                    	},1000)

                    	}else{
                    		LayerUtil.error({
                    			content:res.data
                    		})
                    	}
                    })

				  }
				});
            }

            // 查看物流{订单id，运单号，快递公司小写名称，快递公司全称，下单时间}
            $scope.chakanwuliu = function(orderId,postid,type,val,SubTime){
            	if($scope.expressInfoLoadFail){
            		LayerUtil.error({
            			content:$scope.expressInfoLoadFail
            		})
            	}else{
	            	$state.go('tab.logistics',{
	            		express:JSON.stringify({
	            			orderId:orderId,// 订单号
	            			postid:postid,// 运单号
	            			type:type,// 运单公司小写字母
	            			val:val,// 运单公司中文名称
	            			SubTime:SubTime,// 下单时间
	            			isSearch:false// 是否根据订单号搜索
	            		})
	            	})
            	}
            }
    }])
    // 订单物流信息
    .controller('LogisticsCtrl',['$scope','$stateParams','$http','UrlUtil','ExpressType','SystemParam','LayerUtil',
    	function($scope,$stateParams,$http,UrlUtil,ExpressType,SystemParam,LayerUtil){

		// 需要查询物流的信息
		$scope.express = JSON.parse($stateParams.express);

		// 是否查询该订单物流信息
		if($scope.express.isSearch){
			console.log('查询该订单物流信息URL:'+UrlUtil.http+'Order/get_order_express?orderId='+$scope.express.orderId + SystemParam.get())
			$http.get(UrlUtil.http+'Order/get_order_express?orderId='+$scope.express.orderId + '&method=get_order_express' + SystemParam.get())
	        .success(function (res) {

	        	if(res.code == 200){
	        		var data = res.data;

		        	$scope.express.postid = data.ExpressNumber;// 运单号
		        	$scope.express.SubTime = data.SubTime;// 下单时间

		        	// 快递信息
		        	var _ExpressType = ExpressType.getKuaidi(data.ExpressType);

	                // 快递公司名称
	                $scope.express.val = _ExpressType.Val;

	                // 快递公司简称（小写字母用于查询）
	                $scope.express.type = _ExpressType.Letter;

	                // 查询快递流程
					query();
	        	}

	        })
		}else{
			// 查询快递流程
			query();
		}

		// 查询快递流程
		function query(){
			console.log('查询快递流程:'+UrlUtil.kuaidi+'query?type='+$scope.express.type+'&postid='+$scope.express.postid+'&temp='+new Date().getTime())
			$http.get(UrlUtil.kuaidi+'query?type='+$scope.express.type+'&postid='+$scope.express.postid+'&temp='+new Date().getTime())
	        .success(function (res) {
	        	if(res.status != 200){
	        		LayerUtil.error({
	                    content:'查询异常',
	        		})
	        	}
	        	$scope.logistics = res;
	        })
		}
    }])
    //帮助
    .controller('HelpCtrl', function () {

    })
    //安全中心
    .controller('SafetyCtrl', function () {

    })
    //安全中心
    .controller('Sendback_stateCtrl', ['$scope','$http','SystemParam','UrlUtil','$rootScope','LayerUtil','Const','FormatDate','BaseConfig','MD5','$state','$stateParams',
        function($scope,$http,SystemParam,UrlUtil,$rootScope,LayerUtil,Const,FormatDate, BaseConfig, MD5,$state,$stateParams){
            var ServiceID = $stateParams.ServiceID;

              var params = "serviceId=" + ServiceID +'&method=get_after_service_entitys' + SystemParam.get();

                console.log("查看详情："+UrlUtil.http + "AfterService/get_after_service_entitys?" + params)
                $http.get(UrlUtil.http + "AfterService/get_after_service_entitys?" + params)
                    .success(function (res) {
                        if (res.code == 200) {
                            var data = res.data;
                            $scope.particularsData=data.after;
                            $scope.ProcessFlag=$scope.particularsData.ProcessFlag
                            console.log($scope.particularsData.ProcessFlag)
                        } else {
                            LayerUtil.error({
                                content: res.data
                            });
                        }
                    })

    }])
    //修改密码
    .controller('ModificationCtrl',['$scope','MD5','Const','UrlUtil','LayerUtil','$http','FormatDate','BaseConfig','$ionicHistory','CustomReg',
        function ($scope,MD5,Const,UrlUtil,LayerUtil,$http,FormatDate,BaseConfig,$ionicHistory,CustomReg) {
            $scope.password={
                oldPassword:'',
                newPasswordOne:'',
                newPassWordTwo:''
            };
            $scope.noClick = function () {
                if ($scope.password.oldPassword != ""
                    && $scope.password.newPasswordOne != ""
                    && $scope.password.newPassWordTwo != ""
                    && $scope.password.newPasswordOne.length >= 6
                    && $scope.password.newPassWordTwo.length >= 6) {
                    return false;
                }
                return true;
            };
            $scope.save=function(){

                var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
                var ymdhm = FormatDate.getYmdhm(),
                    pspre = BaseConfig.pspre;
                if($scope.password.newPasswordOne==$scope.password.newPassWordTwo){

                    if($scope.password.oldPassword == $scope.password.newPasswordOne){
                        LayerUtil.warning({
                            content: "新密码不能和旧密码一样!"
                        });
                        return;
                    }

        			if(!CustomReg.password($scope.password.newPasswordOne)  || $scope.password.newPasswordOne.trim().length<6 || $scope.password.newPasswordOne.trim().length>16){
        				LayerUtil.warning({
                            content: "密码必须由6-16位数字字母组成"
                        });
                        return;
        			}

                    LayerUtil.load.loading();
                    $http({
                        method: 'POST',
                        url: UrlUtil.http + "User/post_user_update_password",
                        data: {
                            userId: userInfo.id,
                            oldPwd: $scope.password.oldPassword.trim(),
                            newPwd:$scope.password.newPasswordOne.trim(),
                            confirmPassword:$scope.password.newPassWordTwo.trim(),
                            method: 'post_user_update_password',
                            timestamp: ymdhm,
                            sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                            app_key: BaseConfig.app_key
                        },
                        transformRequest: function (data) {
                          console.log('用户修改密码URL：'+UrlUtil.http + "User/post_user_update_password?"+$.param(data))
                            return $.param(data);
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                        }
                    }).success(function (res) {
                        layer.closeAll();
                        if (res.code == 200) {
                            LayerUtil.warning({
                                content: "修改成功!",
			                    time:1.5,
			                    shade:true,
			                    shadeClose:false,
			                    success: function (elem) {
			                    	setTimeout(function(){
			                    		$ionicHistory.goBack();
			                    	},1000)
			                    }

                            });
                            userInfo.password = $scope.password.newPasswordOne;
                            localStorage.setItem(Const.USER_INFO, JSON.stringify(userInfo));
                        } else {
                            LayerUtil.error({
                                content: res.data
                            })
                        }
                    })
                }else{
                    LayerUtil.warning({
                        content: "两次输入的密码不一致!"
                    });
                }
            }
        }])
    //修改email
    .controller('Mod_emailCtrl', function () {

    })
    //电话号码
    .controller('Mod_teleNumCtrl', function () {

    })
    //修改电话号码
    .controller('ChangeTelCtrl', function () {

    })

    //会员积分
    .controller('IntegralCtrl', ['$scope','UrlUtil','$http','LayerUtil','SystemParam','Const',
    	function ($scope,UrlUtil,$http,LayerUtil,SystemParam,Const) {

		var height = $('ion-header-bar').css('height').replace('px','')*1+$('div#customerDiv').css('height').replace('px','')*1;
		$('#ion-content').css('top',height);

		var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO)),
			page = 1,
			pageNum = 1;

		$scope.loadIcon = true;
		$scope.isInfinite = true;

		// 查询该用户会员信息
		var vip_params = "userId=" + userInfo.id + '&method=get_user_vip_grade' + SystemParam.get();
		console.log('查询该用户会员信息:'+UrlUtil.http + "User/get_user_vip_grade?" + vip_params)
		$http.get(UrlUtil.http + "User/get_user_vip_grade?" + vip_params)
        .success(function (res) {
            if (res.code == 200) {
                $scope.vipData = res.data;
            }
        })

		// 查询该用户积分
		var search = function(){
    		var params = "userId="+userInfo.id+"&page="+page+"&pageSize=20"+ '&method=get_user_integral' + SystemParam.get();
    		console.log('查询该用户积分:'+UrlUtil.http + "User/get_user_integral?" + params)

			$http.get(UrlUtil.http + "User/get_user_integral?" + params)
            .success(function (res) {
                if (res.code == 200) {
                    $scope.data = res.data;
                    $scope.datas = $scope.data.datas;
                	if(page == 1){
                		$scope.scopes = $scope.datas.score;
                	}else{
                		angular.forEach($scope.datas.score,function(item){
                			$scope.scopes.splice($scope.scopes.length,0,item);
                		})
                	}

                    page++;
                    pageNum = $scope.data.totalPage;

                    // 最大页
                    if(page > pageNum){
                    	$scope.isInfinite = false;
                    }

					// 广播上拉加载完成
					$scope.$broadcast("scroll.infiniteScrollComplete");

					$scope.loadIcon = false;

                }
            })
		}

		$scope.loadMore = function(){
			search();
		}

    }])

    //优惠券
    .controller('Coupon', ['$scope','$http','SystemParam','UrlUtil','$rootScope','LayerUtil','Const','FormatDate','BaseConfig','MD5',
        function ($scope,$http,SystemParam,UrlUtil,$rootScope,LayerUtil,Const,FormatDate, BaseConfig, MD5) {
            //标题滑动栏 var params = '&userId=0&state=3&page='+page+'&pageSize=10&method=get_user_coupons' + SystemParam.get();
            $(".oneIndex").on("click", function () {
                var _that = $(this).index();
                $(".selfIndex-redY").stop(true).animate({marginLeft: (_that * 33) - 100 + "%"}, 200);
            });
            var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
            // data
            $scope.showObj = [{
                name:'pro',
                choose:true,
                page:0,
                totalPage:1,
                url:1,
                data:[]
            }, {
                name:'shop',
                choose:false,
                page:0,
                totalPage:1,
                url:2,
                data:[]
            }, {
                name:'brand',
                choose:false,
                page:0,
                totalPage:1,
                url:3,
                data:[]
            }];
            // 切换收藏的类型
            $scope.myclick = function (index) {
                // 切换置顶
                $rootScope.$rootScrollTop();
                // 将当前选择的内容进行展示
                angular.forEach($scope.showObj, function (item, index) {
                    item.choose = false;
                });
                $scope.showObj[index].choose = true;

                // 判断当前类目是否可以进行上拉加载
                if($scope.showObj[index].page < $scope.showObj[index].totalPage){
                    $scope.infinite = true;
                }else{
                    $scope.infinite = false;
                }
            };
            $scope.reg=new RegExp("-","g");
            // 上啦加载
            $scope.infinite = true;
            $scope.infiniteShow = true;

            $scope.loadMore = function() {
            	// 防止无限加载
            	$scope.infinite = false;

                var url = '',
                    page = 0,
                    index=0,
                    pageSize = 10;
                angular.forEach($scope.showObj, function (item, $index) {
                    if(item.choose){
                        url = item.url;
                        page = ++item.page;
                        index = $index;
                    }
                });
                //var params = 'userId=' + userInfo.id + '&page='+page+'&pageSize='+pageSize+'&method=get_user_attention_goods' + SystemParam.get();
                var params = 'userId=' + userInfo.id + '&state='+url+'&page='+page+'&pageSize='+pageSize+'&method=get_user_coupons' + SystemParam.get();

                console.log("优惠券查询："+UrlUtil.http + "Coupons/get_user_coupons?" + params)
                $http.get(UrlUtil.http + "Coupons/get_user_coupons?" + params)
                    .success(function (res) {
                        if (res.code == 200) {
                            var data = res.data;
                            if($scope.showObj[index].data.length != 0){
                                angular.forEach(data.datas,function(item){
                                    $scope.showObj[index].data.push(item);
                                })
                            }else{
                                $scope.showObj[index].data = data.datas;
                            }
                            // 广播上啦完成事件
                            $scope.$broadcast("scroll.infiniteScrollComplete");

                            // 关闭加载图标
                            $scope.infiniteShow = false;
                            $scope.showObj[index].totalPage = data.totalPage;


                            if(page >= data.totalPage){
                                $scope.infinite = false;
                            }else{
                            	$scope.infinite = true;
                            }
                        } else {
                            LayerUtil.error({
                                content: res.data
                            });
                        }
                })

            }
        }])
    //设置
    .controller('SetCtrl', ['$scope', '$ionicActionSheet', 'LayerUtil', 'Version', 'Const', '$state',
			    'CustomerMessage','UploadAppVersion',
        function ($scope, $ionicActionSheet, LayerUtil, Version, Const, $state,
        	CustomerMessage,UploadAppVersion) {

		    $scope.update = function () {
		      UploadAppVersion.compare('handle');
		    }

            // 计算缓存
            var size = 0;
            for (item in window.localStorage) {
                if (window.localStorage.hasOwnProperty(item)) {
                    size += window.localStorage.getItem(item).length;
                }
            }
            $scope.size = (size / 1024).toFixed(2) + 'KB';
            $scope.showVersion = function () {
                LayerUtil.warning({
                    content: '当前APP版本号：' + Version.getVersion(),
                    time: 2
                })
            };
            // 退出登录
            $scope.logout = function () {
                // Show the action sheet
                $ionicActionSheet.show({
                    cancelOnStateChange: true,
                    cssClass: 'action_s',
                    titleText: CustomerMessage.logout,
                    buttons: [
                        {text: "<span class='font-color-red'>退出登录</span>"}
                    ],
                    buttonClicked: function (index) {
                        if (index == 0) {
                            localStorage.removeItem(Const.USER_INFO);
                            $state.go('tab.center');
                        }
                        return true;
                    },
                    cancelText: "取消",
                    cancel: function () {
                        // add cancel code..
                        console.log('执行了取消操作');
                        return true;
                    }
                });
            };
            // 清除缓存
            $scope.clearCache = function () {
                // Show the action sheet
                $ionicActionSheet.show({
                    cancelOnStateChange: true,
                    cssClass: 'action_s',
                    titleText: CustomerMessage.clearCache,
                    buttons: [
                        {text: "<span class='font-color-red'>清空缓存</span>"}
                    ],
                    buttonClicked: function (index) {
                        if (index == 0) {
                            // 将用户取出来别的全部清除
                            var userInfo = localStorage.getItem(Const.USER_INFO);
                            var cookieID = localStorage.getItem(Const.COOKIE_ID);
                            localStorage.clear();
                            // 保留用户缓存
                            if (userInfo) {
                                localStorage.setItem(Const.USER_INFO, userInfo);
                                localStorage.setItem(Const.COOKIE_ID, cookieID);
                                // 更新缓存
                                $scope.size = (userInfo.length / 1024).toFixed(2) + 'KB';
                            } else {
                                $scope.size = '0KB';
                            }
                        }
                        return true;
                    },
                    cancelText: "取消",
                    cancel: function () {
                        // add cancel code..
                        console.log('执行了取消操作');
                        return true;
                    }
                });
            }
        }])
    //关于我们
    .controller('About_ourCtrl',['$http','LayerUtil','$scope','UrlUtil','SystemParam','Const','$sanitize',
        function ($http,LayerUtil,$scope,UrlUtil,SystemParam,Const,$sanitize) {
            $scope.aboutOur=[];
		var params = 'method=get_about_id' + SystemParam.get();
            $http.get(UrlUtil.http + "About/get_about_id/1?" + params)
                .success(function (res) {
                    if (res.code == 200) {
                        $("h4#about_we").html(res.data.ColumnContent)
                        var imgs = $("h4#about_we").find("img");

                        $.each(imgs, function() {
                        	$(this).css({
                        		'width':'100%'
                        	})
                        });
                    }
                })
        }])
    //用户反馈
    .controller('User_feedbackCtrl', ['$scope', 'CustomReg', '$ionicActionSheet', 'CustomerMessage','$http', 'FormatDate', 'BaseConfig', 'MD5','Const','UrlUtil','LayerUtil','$state',
        function ($scope, CustomReg, $ionicActionSheet, CustomerMessage, $http, FormatDate, BaseConfig, MD5, Const, UrlUtil, LayerUtil,$state) {
            $scope.info = {
                textarea: '',
                len: 200 + '字',
                phoneOrEmail: ''
            };
            $scope.$watch('info.textarea', function (newVal, oldVal) {
                $scope.info.len = (200 - newVal.length)+'字';
            });
            /*$scope.checkSubmit = function () {
                if($scope.info.textarea != '' && $scope.info.phoneOrEmail != '' &&
                    ( CustomReg.phone($scope.info.phoneOrEmail) || CustomReg.email($scope.info.phoneOrEmail))){
                    return false;
                }
                return true;
            };*/

            // 提交反馈信息
            $scope.submit = function(){
                //如果手机号或邮箱输入错误提示对应信息
                if($scope.info.textarea != '' && $scope.info.phoneOrEmail != '' &&
                    ( CustomReg.phone($scope.info.phoneOrEmail) || CustomReg.email($scope.info.phoneOrEmail))){

                    	var ymdhm = FormatDate.getYmdhm(),
                            pspre = BaseConfig.pspre;
                			userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO)),
                    	_d = {
	                        userId: userInfo.id,
	                        contents:$scope.info.textarea,
	                        phone:CustomReg.phone($scope.info.phoneOrEmail) ? $scope.info.phoneOrEmail : '',
	                        email:CustomReg.email($scope.info.phoneOrEmail) ? $scope.info.phoneOrEmail : '',
	                        method: 'post_user_feedback',
	                        timestamp: ymdhm,
	                        sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
	                        app_key: BaseConfig.app_key
                    	};
		                LayerUtil.load.loading();
		                console.log(UrlUtil.http + "User/post_user_feedback")
		                console.log(_d)
		                	$http({
		                    method: 'POST',
		                    url: UrlUtil.http + "User/post_user_feedback",
		                    data: _d,
		                    transformRequest: function (data) {
		                    	console.log('提交反馈:'+UrlUtil.http + "User/post_user_feedback"+$.param(data))
		                        return $.param(data);
		                    },
		                    headers: {
		                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
		                    }
		                }).success(function (res) {
		                    layer.closeAll();
		                    if (res.code == 200) {
		                    	LayerUtil.warning({
				                    content:CustomerMessage.feedback,
				                    time:1.5,
				                    shadeClose:false
				                })
		                    	setTimeout(function(){
		                    		$state.go('tab.center')
		                    	},1000)
                    } else {
                        LayerUtil.error({
                            content: res.data
                        })
                    }
                })
                }else{
                	layer.open({
						  content: '手机号或邮箱填写不正确！请重新填写'
						  ,time: 1.5
						});
                }
            }
        }])
    //会员规则
    .controller('Mem_ruleCtrl', function () {
    })
    .controller('MyCollectCtrl', ['$scope','$http','SystemParam','UrlUtil','$rootScope','LayerUtil','Const','FormatDate','BaseConfig','MD5','$state','ShopCartHandle',
        function($scope,$http,SystemParam,UrlUtil,$rootScope,LayerUtil,Const,FormatDate,BaseConfig,MD5,$state,ShopCartHandle){

        	$scope.addShopCart = function(sku){
        		ShopCartHandle.add({
        			sku:this.item.Sku,
        			productid:this.item.PId,
        			shopid:this.item.Sid
        		})
        	}

            //副标题底部滑动条
            $(".subheader-a").on("click", function () {
                var _that = $(this).index();
                $(".myCollect-redW").stop(true).animate({marginLeft: _that * 32 + "%"})
            });
            // 当前登录用户
            var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
            // data
            $scope.showObj = [{
                name:'pro',
                choose:true,
                page:0,
                totalPage:1,
                url:'User/get_user_attention_goods',
                data:[]
            }, {
                name:'shop',
                choose:false,
                page:0,
                totalPage:1,
                url:'User/get_user_attention_shop',
                data:[]
            }, {
                name:'brand',
                choose:false,
                page:0,
                totalPage:1,
                url:'User/get_user_attention_brand',
                data:[]
            }];
            // 切换收藏的类型
            $scope.myclick = function (index) {
                // 切换置顶
                $rootScope.$rootScrollTop();
                // 将当前选择的内容进行展示
                angular.forEach($scope.showObj, function (item, index) {
                    item.choose = false;
                });
                $scope.showObj[index].choose = true;
                // 判断当前类目是否可以进行上拉加载
                if($scope.showObj[index].page < $scope.showObj[index].totalPage){
                    $scope.infinite = true;
                }else{
                    $scope.infinite = false;
                }
            };
            // 上啦加载
            $scope.infinite = true;
            $scope.infiniteShow = true;
            $scope.loadMore = function() {
                var url = '',
                    page = 0,
                    index=0,
                    pageSize = 10;

                angular.forEach($scope.showObj, function (item, $index) {
                    if(item.choose){
                        url = item.url;
                        page = ++item.page;
                        index = $index;
                    }
                });

                var params = 'userId=' + userInfo.id + '&page='+page+'&pageSize='+pageSize+'&method=get_user_attention_goods' + SystemParam.get();
                console.log("我的收藏："+UrlUtil.http + url+"?" + params)
                $http.get(UrlUtil.http + url+"?" + params)
                    .success(function (res) {
                        if (res.code == 200) {
                            var data = res.data;

                            if($scope.showObj[index].data.length != 0){
                                angular.forEach(data.datas,function(item){
                                    $scope.showObj[index].data.push(item);
                                })
                            }else{
                                $scope.showObj[index].data = data.datas;
                            }
                            //判断是否有图片，如果没有显示默认
                            for(var i=0;i<$scope.showObj[index].data.length;i++){
                            	console.log($scope.showObj[index].data[i].SShopLogo)
                            	if($scope.showObj[index].data[i].SShopLogo=='ShopLogoImg/'){
                            		$scope.showObj[index].data[i].SShopLogo='ShopLogoImg/ShopLogoDefeat.jpg'
                            	}
                            }
                            // 广播上啦完成事件
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            // 关闭加载图标
                            $scope.infiniteShow = false;
                            $scope.showObj[index].totalPage = data.totalPage;
                            if(page >= data.totalPage){
                                $scope.infinite = false;
                            }
                        } else {
                            LayerUtil.error({
                                content: res.data
                            });
                        }
                    })

            };
            $scope.remove = function (id, action, items, $index) {
                var index = layer.open({
                    content: '是否删除?',
                    btn: ['删除', '取消'],
                    shadeClose: false,
                    yes: function () {
                        if (userInfo) {
                            layer.close(index);
                            LayerUtil.load.loading();
                            // 请求服务基本参数
                            var ymdhm = FormatDate.getYmdhm(),
                                pspre = BaseConfig.pspre;
                            $http({
                                method: 'POST',
                                url: UrlUtil.http + "User/post_user_attention",
                                data: {
                                    action: action,
                                    key: id,
                                    userId: userInfo.id,
                                    method: 'post_user_attention',
                                    timestamp: ymdhm,
                                    sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                                    app_key: BaseConfig.app_key
                                },
                                transformRequest: function (data) {
                                    return $.param(data);
                                },
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                                }
                            }).success(function (res) {
                                layer.closeAll();
                                if (res.code == 200) {
                                    items.splice($index, 1);
                                } else {
                                    LayerUtil.error({
                                        content: res.data
                                    })
                                }
                            })
                        }
                    }
                })
            }
        }])
     //.controller('myStoreCtrl',function(){
    //    //我的收藏之店铺页面
    //})
    //.controller('myBrandCtrl',function(){
    //    //我的收藏之品牌页面
    //})
    .controller('TestT',function(){
    })
    //退货换货查询页
    .controller('Sendback_listCtrl',['$scope','$http','SystemParam','UrlUtil','$rootScope','LayerUtil','Const','FormatDate','BaseConfig','MD5','$state','$stateParams',
        function($scope,$http,SystemParam,UrlUtil,$rootScope,LayerUtil,Const,FormatDate, BaseConfig, MD5,$state,$stateParams){


            // 副标题底部滑动条
            $(".oneIndex").on("click", function () {
                var _that = $(this).index();
                $(".selfIndex-redWWW").stop(true).animate({left: (_that * 50)+"%"});
            });
          //缓存数据   用户名  用户ID  用户密码
            var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
            // 是否查询该订单号的申请售后订单  {$stateParams.orderId   传入参数 }
        	$scope.orderInfo={
        		orderId :$stateParams.orderId
        	};
            //输入框 删除按钮 （功能：根据input中是否有功能判断是不是该显示删除按钮）
            $scope.removeOut=function(){
                $scope.orderInfo.orderId="";
                $scope.loadMore()
            };
            //输入框 删除按钮（功能：影藏按钮）
            $scope.checkShowDelete = function () {
                if($scope.orderInfo.orderId == ''){
                    return false;
                }
                return true;
            };
            // data
            $scope.showObj = [{
                name:'pro',
                choose:true,
                page:0,
                totalPage:1,
                url:'AfterService/get_after_service_all',
                method : 'get_after_service_all',
                data:[]
                //ProductStatus:0
            }, {
                name:'shop',
                choose:false,
                page:0,
                totalPage:1,
                url:'AfterService/get_after_service_th',
                method : 'get_after_service_th',
                data:[]
            }];
          //定义数组
            $scope.myData=[];

            // 切换收藏的类型
            $scope.myclick = function (index) {
                // 切换置顶
                $rootScope.$rootScrollTop();
                // 将当前选择的内容进行展示
                angular.forEach($scope.showObj, function (item, index) {
                    item.choose = false;
                });
                $scope.showObj[index].choose = true;
                // 判断当前类目是否可以进行上拉加载
                if($scope.showObj[index].page < $scope.showObj[index].totalPage){
                    $scope.infinite = true;
                }else{
                    $scope.infinite = false;
                }
            };
            // 上啦加载
            $scope.infinite = true;
            $scope.infiniteShow = true;
            $scope.loadMore = function() {
                var url = '',
                    page = 0,
                    index=0,
                    pageSize = 10,
                    method = '',
                    orderId=$scope.orderInfo.orderId;
                angular.forEach($scope.showObj, function (item, $index) {
                    if(item.choose){
                        url = item.url;
                        method = item.method;
                        page = ++item.page;
                        index = $index;
                    }
                });
                //临时ID ，后期修改（userInfo.id真实ID）--->后期修改。。。。
                $scope.myQent=function(){
                	$scope.infinite = false;
                    var params = 'userId=' + userInfo.id +'&orderId='+orderId+'&page='+page+'&pageSize='+pageSize+'&method=' + method + SystemParam.get();
                    console.log("查询退换货:"+UrlUtil.http + url + "?" + params)

                    $http.get(UrlUtil.http + url+"?" + params)
                        .success(function (res) {
                            if (res.code == 200) {
                                var data = res.data;
                              //判断输入框是否有内容输入
                              console.log($scope.orderInfo.orderId)
                                if( $scope.orderInfo.orderId!=""){
                                    for(var i=0;i<data.datas.length;i++){
                                      //判断输入框是否相同的orderId
                                        if($scope.orderInfo.orderId==data.datas[i].OrderId){
                                            $scope.myData.push(data.datas[i]);
                                        }
                                    }
                                }else{
                                    $scope.myData= data.datas;
                                }
                                //上拉加载判断
                                if($scope.showObj[index].data.length != 0){
                                    angular.forEach(data.datas,function(item){
                                        $scope.showObj[index].data.push(item);
                                    })
                                }else{
                                    $scope.showObj[index].data = data.datas;
                                }
                                $scope.salesReturn=false;
                                $scope.exchangeGoods=false;
                                if($scope.showObj[0].data.length==0){
										$scope.salesReturn=true;
								}else if($scope.showObj[1].data.length==0){
										$scope.exchangeGoods=true;
								}
                              // 广播上啦完成事件
                                $scope.$broadcast("scroll.infiniteScrollComplete");

                                // 关闭加载图标
                                $scope.infiniteShow = false;
                                $scope.showObj[index].totalPage = data.totalPage;
                                if(page >= data.totalPage){
                                    $scope.infinite = false;
                                }else{
                                	$scope.infinite = true;
                                }
                            } else {
                                LayerUtil.error({
                                    content: res.data
                                });
                            }
                        });
                }
                $scope.myQent();

                //输入框搜索按钮  重新发送的请求
                $scope.mySeek=function(){
                    var orderId=$scope.orderInfo.orderId,
                  //userId 写死的 要求后期更换
                     params = 'userId=' + userInfo.id +'&orderId='+orderId+'&page='+page+'&pageSize='+pageSize+'&method=' + method + SystemParam.get();
                    $http.get(UrlUtil.http + url+"?" + params)
                        .success(function (res) {
                            if (res.code == 200) {
                                var data = res.data;
                                $scope.myData= data.datas;
                                $scope.showObj[0].data=$scope.myData;
                            } else {
                                LayerUtil.error({
                                    content: res.data
                                });
                            }
                        })
                }
                }

            $(document).keypress(function(e) {
                // 回车键事件
                if(e.which == 13) {
                    $scope.mySeek()
                }
            });

            //搜索框 删除按钮  删除全部输入内容
            $scope.removeOut=function(){
                $scope.orderInfo.orderId="";
                $scope.showObj[0].data.splice(0,$scope.showObj[0].data.length);
              //删除后重新发送请求 获取数据
                $scope.myQent()
            };
        }])
    //退货提交页
    .controller('SendbackCtrl', ['$scope','$http','SystemParam','UrlUtil','$rootScope','LayerUtil','Const','FormatDate','BaseConfig','MD5','$stateParams','$timeout',
        function($scope,$http,SystemParam,UrlUtil,$rootScope,LayerUtil,Const,FormatDate, BaseConfig, MD5,$stateParams,$timeout){


            //退款原因下拉框
                $('.settings').on('change', function() {
                    var demo, mode, display, lang;
                        demo = 'select';
                        mode = 'scroller',
                        display = 'bottom',
                        lang = 'zh';
                        $('.demo-cont').hide();
                        $("#demo_cont_" + demo).show();
                        $('#demo_select').mobiscroll().select({
                            mode: mode,
                            setText: '确定',
                            cancelText: '取消',
                            display: display,
                            lang: 'zh'
                    });

                });
                $('#demo_select').trigger('change');

                //控制底部导航栏显示OR影藏的属性
                $scope.submit=true;
                $scope.yesSubmit=false;

            //状态按钮切换
            $(".applyFor1").on("click",function(){
                if($(this).hasClass("sendback_btn")==true){
                    $(this).addClass("sendback_red_btn");
                    $(".applyFor2").removeClass("sendback_red_btn");
                    $("#show").show()
                    $("#explain2").hide();
                    $("#explain1").show();
                }
            });
            $(".applyFor2").on("click",function(){
                if($(this).hasClass("sendback_btn")==true){
                    $(this).addClass("sendback_red_btn");
                    $(".applyFor1").removeClass("sendback_red_btn");
                    $("#show").hide();
                    $("#explain2").show();
                    $("#explain1").hide();
                }
            });

            $("#demo_select_dummy").val("").attr('placeholder','请选择');

            //请求
            var categoryId = $stateParams.Id;
            console.log(categoryId)
            $scope.number=[];
            $scope.ueser={
                num:1,
                type:1,
                questionDesc:'',
                totalPrice:0
            };
            var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
            //$scope.loadMore = function() {
                var url = 'AfterService/get_after_service_all',
                    page = 0,
                    pageSize = 10;
                var params = 'userId=' + userInfo.id + '&detailId='+categoryId+'&method=get_after_service_entity' + SystemParam.get();
                $http.get(UrlUtil.http +"AfterService/get_after_service_entity?" + params)
                    .success(function (res) {
                        if (res.code == 200) {
                            var data = res.data;
                                if(categoryId == data.Id){
                                      $scope.number=data;
                                      console.log(data)
                                }
                          //增加退款数量
                            $scope.number.totalPrice=$scope.number.SoldPrice;
                            $scope.Oplus=function(){
                                $scope.ueser.num++;
                                //点击增加退换件数 确定退换金额
                                $scope.number.totalPrice=$scope.ueser.num*$scope.number.SoldPrice;
                                if($scope.ueser.num>$scope.number.Quantity){
                                    $scope.ueser.num=$scope.number.Quantity;
                                    $scope.number.totalPrice=$scope.ueser.num*$scope.number.SoldPrice;//重新赋值否则会在执行增加操作
                                }
                            };
                            $scope.subtract=function(){
                                $scope.ueser.num--;
                                //点击减少退换件数 确定退换金额
                                $scope.number.totalPrice=$scope.ueser.num*$scope.number.SoldPrice;
                                if($scope.ueser.num<=1){
                                    $scope.ueser.num=1;
                                    //当点击到1时停止减少，同时终止金额的减少
                                    $scope.number.totalPrice=$scope.ueser.num*$scope.number.SoldPrice;//重新赋值否则会在执行减少操作
                                }
                            };
                            // 广播上拉完成事件
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            // 关闭加载图标
                            $scope.infiniteShow = false;
                            $scope.showObj = data.totalPage;
                            if(page >= data.totalPage){
                                $scope.infinite = false;
                            }
                        } else {
                            LayerUtil.error({
                                content: res.data
                            });
                        }
                    })
            //};

            $scope.demand=function(){
            	   if($(".applyFor2").hasClass("sendback_red_btn")==true){$scope.ueser.type=2;}else{$scope.ueser.type=1;}
                				if (userInfo) {
                            		layer.close();
                            		LayerUtil.load.loading();
                            		// 请求服务基本参数
                            		var ymdhm = FormatDate.getYmdhm(),
                                		pspre = BaseConfig.pspre;
                                		$scope.numBM=$("#demo_select").val();
                                	console.log(categoryId+" "+userInfo.account+" "+$scope.ueser.num+" "+$scope.ueser.type+" "+$scope.numBM+" "+$scope.ueser.questionDesc+" "+$scope.number.ProductImage)
                            		$http({
                                		method: 'POST',
                                		url: UrlUtil.http + "AfterService/post_submit_service",
                                		data: {
		                                    detailId: categoryId,//商品ID
		                                    uaccount: userInfo.account,//用户账户
		                                    count: $scope.ueser.num,//商品数量
		                                    type:$scope.ueser.type ,//类型（退货，换货）
		                                    reason:$scope.numBM,//原因
		                                    questionDesc:$scope.ueser.questionDesc,//退款说明
		                                    jsonImageUrl:$scope.number.ProductImage,//图片地址
		                                    method: 'post_user_attention',
		                                    timestamp: ymdhm,
		                                    sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
		                                    app_key: BaseConfig.app_key
                                		},
                                		transformRequest: function (data) {
                                    			return $.param(data);
                                		},
                                		headers: {
                                    		'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                                		}
                            		}).success(function (res) {
                                		layer.closeAll();
                                		if (res.code == 200) {
		                                	layer.open({
											  content: '申请成功，请耐心等待客服处理'
											  ,time: 1.5
											});
											$timeout(function() {
												$scope.rootBack()
											}, 1600)
											$scope.submit=false;
		                					$scope.yesSubmit=true;
		                                } else if($scope.ueser.questionDesc==""){
		                                	layer.open({
											  content: '申请成功，请耐心等待客服处理'
											  ,time: 1.5
											});

		                                }else{
		                                	LayerUtil.error({
		                                        content: res.data
		                                    })
                                		}
                            		})
                        		}

            }

            //保存按钮 点击发送请求
            $scope.submitOne=function(){
            	if($scope.number.Quantity>1 && $scope.ueser.num<$scope.number.Quantity && $scope.numBM !="" && $scope.ueser.questionDesc !=""){
            		  layer.open({
							    content: '您的商品数量大于一件，该操作仅能操作一次，请确认您的退换件数！'
							    ,btn: ['确定', '取消']
							    ,skin: 'footer'
							    ,yes: function(){
							   		$scope.demand();
							    }
						});
            		}else{
            			if($scope.numBM !="" && $scope.ueser.questionDesc !=""){
            				$scope.demand();
            			}else{
            				layer.open({
							    content: '退款原因和退款说明不能为空！ '
							    ,time:1.5
						});
            			}

            		}
            	}
        	}])
  .controller('bingdingCouponCtrl',['$scope',
    function($scope){

    }
  ])
