angular.module('index.controllers', [])

    .controller("TabsController", ['$scope','$state','$rootScope','$ionicHistory','UrlUtil',
    '$ionicScrollDelegate','SystemParam','$http','Const','LayerUtil','IsLogin','$location','Statictis','ProjectType','MD5','Guid',
        function ($scope, $state,$rootScope,$ionicHistory,UrlUtil,$ionicScrollDelegate,SystemParam,
        	$http,Const,LayerUtil,IsLogin,$location,Statictis,ProjectType,MD5,Guid) {

        // 当前项目类型
        $rootScope.projectType = ProjectType.type;

    	// 需要登录拦截并且不带参数的跳转
		$rootScope.loginGoTarget=function(state){
    		if(IsLogin.isGoLogin()){
    			$state.go(state);
    		}
    	}

		// 跳转不需要登录拦截并且不需要参数的页面
		$rootScope.goTargetNoLogin = function(tab){
			// 清空搜索缓存问题
			if(tab == 'tab.equipment'){
				$("input#in_search_input").val('')
			}
			$state.go(tab);
		}

        // 跳转单品页
        $rootScope.goProductDetailInfo = function(sku){
			$state.go('tab.commIntro',{
            	skuId:sku
            });
		}

        // 跳转店铺页
        $rootScope.goBrandDetailInfo = function(sellerId){
			$state.go('tab.shop_list',{
            	sellerId:sellerId
            });
		}

        // 跳转品牌详情
        $rootScope.goShopInnerDetailInfo = function(id){
        	$state.go('tab.shop_inner',{
            	id:id
            });
        }

        // 跳转店铺页
        $rootScope.goSearchShop = function(){
			$state.go('tab.equipment');
		}

            // 查询购物车数量
        $rootScope.tab = {
            shopCartNum : 0
        };

        // 为防止在别的客户端修改过账号密码，所以每次打开app要调用缓存的账号密码重新登录一次
        var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
        if(userInfo){

            var params = "account=" + userInfo.account + "&password=" + MD5.getMD5Val(userInfo.password) + '&ip=' +returnCitySN["cip"]+ '&source=&type=2&method=get_user_login' + SystemParam.get();
            console.log('校验是否修改过密码：'+ UrlUtil.http + "User/get_user_login?" + params)
            $http.get(UrlUtil.http + "User/get_user_login?" + params)
                .success(function (res) {
                    if (res.code == 200) {
                        // 请求购物车数量
                        var params = 'userId='+userInfo.id+'&type=0&method=get_user_cart' + SystemParam.get();

                      	console.log('请求购物车数量url:'+UrlUtil.http + "cart/get_user_cart?" + params);
                        $http.get(UrlUtil.http + "cart/get_user_cart?" + params)
                            .success(function (res) {
                                if (res.code == 200) {
                                    var count = res.data.count;
                                    if(count != 0){
                                        $rootScope.tab.shopCartNum = count*1;
                                    }
                                }
                            })
                    } else {
                    	var params = {
		        			alertInfo:'因为您在其他客户端修改过登录密码，请您重新登录，如非本人操作请联系客服对账号进行冻结，避免财产的损失!'
		        		}
                        // 跳转登录页面............
                        $state.go('tab.login',{
                        	params:JSON.stringify(params)
                        });
                    }
                })
        }
        // 查询缓存中数据
        else{
            // 购物车数量
            /*var shopCache = localStorage.getItem(Const.SHOP_CART_CACHE);
            if(shopCache){
                $rootScope.tab.shopCartNum = JSON.parse(shopCache).num;
            }*/
        }

        // 默认所有页面都不带底部导航
        $rootScope.hideTabs = true;

        // 缓存活动样式
		var activeStyle = null;

        // 监听页面跳转（对应的controller执行之“后”）
        $rootScope.$on('$ionicView.beforeEnter', function () {
        	// 控制专题页行内样式不会与其他页面冲突
        	$rootScope.stateCurrentName = $state.current.name;
            // 不需要隐藏底部tabs对应的url
            var homeTabNames=['tab.home','tab.center','tab.equipment','tab.specialOffDouble','tab.brand_street'],
            	needExcludes = ['tab.shopping'];// 不进行[监听]的路由，tabs由该路由自行配置

//			console.log("----------------------页面路由监听----------------------")
//			console.log(window.location.href)
//			console.log("----------------------页面路由监听----------------------")


            if(needExcludes.indexOf($state.current.name) == -1){
            	//alert(homeTabNames.indexOf($rootScope.stateCurrentName))
	            if (homeTabNames.indexOf($rootScope.stateCurrentName) > -1) {
	            	// 一级页面显示tabs
	                $rootScope.hideTabs = false;
	            } else {
	            	// 子页面隐藏tabs
	                $rootScope.hideTabs = true;
	            }
            }

           //--------------------------------推广统计代码,此处不对详情页进行统计，由于详情页需求店铺编号参数，详情页单个请求
            var url = $location.path();
            if (url.indexOf("homeActiv") > -1) {
                url = window.location.href;
                url = url.substring(url.indexOf("#")+1,url.length);
            }
            if (url.indexOf("commIntro") > -1) return;
            var second = "", three = "", channelid = "", channelurlid = "", activeid = "", sku = "",shopId="0",userid="0";
            if (url.indexOf("channelid") > -1) {
                var s1 = url.split('?');
                if (s1.length > 1) {
                    console.log(s1[1]);
                    var s2 = s1[1].split('&');
                    for (var i = 0; i < s2.length; i++) {
                        var name = s2[i].split('=')[0];//键值
                        var val = s2[i].split('=')[1];//对应的值
                        if (name == "channelid") {
                            channelid = val;
                        }
                        else if (name == "activeid") {
                            activeid = val;
                        }
                        else if (name == "channelurlid") {
                            channelurlid = val;
                        }
                    }
                }
            }
            else if (url.indexOf("commIntro") > -1) {
                sku = url.substring(url.lastIndexOf("/") + 1, url.length);
            }
            else if (url.indexOf("equipment") > -1) {
                console.log(unescape(url) + ":二级页面");
                second="true"
            }
            else if (url.indexOf("classify") > -1) {
                console.log(unescape(url)+":三级页面");
                three = "true";
            }
            else if (url.indexOf("shop_list") > -1) {
                shopId = url.substring(url.lastIndexOf("/") + 1, url.length);
            }

            // url = unescape(url);
            if (channelid.length > 0) {
                var statistic = {
                    channelid: channelid,
                    channelurlid: channelurlid,
                    activeid: activeid
                };
                console.log("data:"); console.log(statistic);
                localStorage.setItem("statistic_storage", JSON.stringify(statistic));
            }
            else {
                var statistic = JSON.parse(localStorage.getItem("statistic_storage"));
                if (statistic) {
                    channelid = statistic.channelid;
                    channelurlid = statistic.channelurlid;
                    activeid = statistic.activeid;
                }
            }
            if (userInfo) {
                userid = userInfo.id;
            }

            // 判断COOKIE ID
            var cookieID = localStorage.getItem(Const.COOKIE_ID);
            if(!cookieID){
            	cookieID = Guid.getGuid();
            	localStorage.setItem(Const.COOKIE_ID,cookieID)
            }

            $http({
                method: 'POST',
                url: UrlUtil.bigData + "visit/req",
                data: {
                    userid: userid,
                    ip: returnCitySN["cip"],
                    channelid: channelid,
                    sku: sku,
                    url: url,
                    second: second,
                    three: three,
                    visittime: Statictis.getTime(),
                    source: "wap",
                    activeid: activeid,
                    channelurlid: channelurlid,
                    type: 2,
                    shopId: shopId,
                    cookieid:cookieID

                },
                transformRequest: function (data) {
                    return $.param(data);
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                }
            }).success(function (res) {
                console.log("-------------------------------推广统计结果-------------------------------")
                console.log(res);

            }).error(function () {
                console.log("-------------------------------推广错误结果-------------------------------")
            });


            //----------------------------------推广统计代码
        });

		// 监听页面跳转（对应的controller执行之“前”）
      	$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
      		// 路由跳转之前清除页面浮动层
			layer.closeAll();
			//清除售后申请的下拉框
			$('#demo_select').trigger('change');
			//手机物理回退时关闭打开的出生日期选择框
			$(".dw-persp").css("display","none");
      	})

        // 全局后退按钮
        $rootScope.rootBack= function () {
            $ionicHistory.goBack();
        }

        // 阿里云oss图片库地址
        $rootScope.ossUrl=UrlUtil.oss;

        //$rootScope.

        // 滚动至顶部
        $rootScope.$rootScrollTop = function () {
            // true：使用滚动动画
            $ionicScrollDelegate.scrollTop(true);
        }
    }])
;

