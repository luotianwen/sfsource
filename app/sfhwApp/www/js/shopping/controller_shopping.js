angular.module("shopping.controller", [])
    // 购物车
    .controller('ShoppingCtrl', ['$scope','Const','SystemParam','UrlUtil','$rootScope','LayerUtil','$http','FormatDate',
    'BaseConfig','MD5','$stateParams','$state','IsLogin','ShopCartHandle','AddressServer',
          function ($scope,Const,SystemParam,UrlUtil,$rootScope,LayerUtil,$http,FormatDate,BaseConfig,MD5,$stateParams,
          	$state,IsLogin,ShopCartHandle,AddressServer) {
        	// 结算
        	$scope.account = function(){
        		var ids = '';
                angular.forEach($scope.shopData, function (items) {
                    angular.forEach(items, function (item) {
                        if (item.choose) {
                            if (ids == '') {
                                ids = item.Id;
                            } else {
                                ids += ',' + item.Id;
                            }
                        }
                    })
                })

                if(ids == ''){
                	LayerUtil.warning({
	                    content:'请选择商品进行结算',
	                    time:1.5,
	                    shade:true
                	})
                }else{
	                $state.go('tab.subOrder',{
	                	param:JSON.stringify({
	                		cartList:ids,
	                		addressId:0
	                	})
	                });
                }
        	}

        	// 控制footerbar距离底部的距离，默认是存在tabs所以要有间距
        	$scope.bottompx = 49;
        	// 当需要返回键及隐藏tab的情况下（非tabs主页链接进来的请求）
        	if($stateParams.isBack){
        		// 隐藏tabs
        		$rootScope.hideTabs = true;
        		$scope.bottompx = 0;
        	}else{
        		$rootScope.hideTabs = false;
        	}

            // 全选
            $scope.choose = {
                allChoose: false
            }

            // 当前登录用户
            var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
            $scope.shopData = [];

            // 商品数量
            $scope.shopNum = 0;

            // 结算价格
            $scope.prices = 0;

            // 默认全选
            $scope.choose.allChoose = true;

            // 编辑删除商品
            $scope.deleteshop = false;
            $scope.editOrDelete = '编辑';

            // 编辑按钮
            $scope.edit = function () {
                if (!$scope.deleteshop) {
                    // 切换样式
                    $scope.deleteshop = true;
                    $scope.editOrDelete = '完成';

                    // 取消全选
                    angular.forEach($scope.shopData, function (items) {
                        items.choose = false;
                        angular.forEach(items, function (item) {
                            item.choose = false;
                        })
                    })

                    $scope.choose.allChoose = false;

                } else {
                    // 切换样式
                    $scope.deleteshop = false;
                    $scope.editOrDelete = '编辑';

                    // 全选
                    angular.forEach($scope.shopData, function (items) {
                        items.choose = true;
                        angular.forEach(items, function (item) {
                            item.choose = true;
                        })
                    })
                    $scope.choose.allChoose = true;

                    $scope.generateNewData();
                }
            }

            if (userInfo) {
            	LayerUtil.load.loading();
                // 请求购物车数量
                var params = 'userId=' + userInfo.id + '&method=get_user_cart_all' +SystemParam.get();

                console.log("购物车数据详情："+UrlUtil.http + "Cart/get_user_cart_all?" + params)
                $http.get(UrlUtil.http + "Cart/get_user_cart_all?" + params)
                    .success(function (res) {
                    	layer.closeAll();
                        if (res.code == 200) {
                            if (angular.isArray(res.data)) {
                                // 默认所有数据为选中
                                var count = 0;
                                angular.forEach(res.data, function (items) {
                                    items.choose = true;
                                    angular.forEach(items, function (item) {
                                        item.choose = true;
                                        count += item.Count;
                                    })
                                })

                                // 购物车数量
                                $rootScope.tab.shopCartNum = count * 1;

                                // 购物车数据集合
                                $scope.shopData = res.data;

                                // 计算购物车数量和金额
                                $scope.generateNewData();
                            } else {
                                $rootScope.tab.shopCartNum = '';
                                $scope.nullData = true;
                            }
                        } else {
                            LayerUtil.error({
                                content: res.data
                            })
                        }
                    }).error(function () {
                    LayerUtil.error()
                })
            } else{
            	$scope.nullData = true;
            }

            /*else {
                // 购物车数量
                var shopCache = localStorage.getItem(Const.SHOP_CART_CACHE);

                if (shopCache) {
                	shopCache = JSON.parse(shopCache);

                	// 购物车数量
                    $rootScope.tab.shopCartNum = shopCache.num;

                    if(shopCache.num > 0){
                    	var skus = '';
                    	angular.forEach(shopCache.skus,function(item){
                    		if(skus == ''){
                    			skus += item.Sku;
                    		}else{
                    			skus += ','+item.Sku;
                    		}
                    	})

	                    // 根据商品ID查询购物车所展示的数据
		                var params = 'skus=' + skus + '&method=get_user_cart_all_NoLogin' + SystemParam.get();

                		console.log("根据缓存 中购物车数据详情："+UrlUtil.http + "Cart/get_user_cart_all?" + params)
		                $http.get(UrlUtil.http + "Cart/get_user_cart_all_NoLogin?" + params)
		                    .success(function (res) {
		                        if (res.code == 200) {

		                        	// 修改为二维数组结构
		                        	var shopIds = [];
		                        	$scope.shopData=[];

		                        	// 解析店铺数据
		                        	angular.forEach(res.data,function(item){
		                        		if(shopIds.indexOf(item.SId) == -1){
		                        			shopIds.push(item.SId);

		                        			// 将同一个店铺的数据封装到一个数组
		                        			var shops = [];
		                        			angular.forEach(res.data,function(pro){
		                        				if(pro.SId == item.SId){
		                        					shops.push(pro);
		                        				}
		                        			})
		                        			$scope.shopData.push(shops);
		                        		}
		                        	})


		                            // 默认所有数据为选中
		                            var count = 0;
		                            angular.forEach($scope.shopData, function (items) {
		                                items.choose = true;
		                                angular.forEach(items, function (item) {
		                                    item.choose = true;

		                                    // 解析缓存购物车数量
		                                    angular.forEach(shopCache.skus,function(cache){
		                                    	if(cache.Sku == item.SKU){
		                                    		item.Count = cache.Count;
		                                    	}
		                                    })

		                                    count += item.Count;
		                                })
		                            })

		                            // 购物车数量
		                            $rootScope.tab.shopCartNum = count;

		                            // 计算购物车数量和金额
		                            $scope.generateNewData();
		                        } else {
		                            LayerUtil.error({
		                                content: res.data
		                            })
		                        }
		                    })

                    }else{
	                    $scope.nullData = true;
	                }
                }else{
                    $scope.nullData = true;
                }

            }*/

            // 批量删除
            $scope.deleteShops = function () {
                // 登录状态同步后台数据
                /*var index = layer.open({
                    content: '是否删除?',
                    shadeClose: false,
                    btn: ['删除', '取消'],
                    yes: function () {

                    }
                })*/


                if (userInfo) {
                    LayerUtil.load.loading();
                    // 请求服务基本参数
                    var ymdhm = FormatDate.getYmdhm(),
                        pspre = BaseConfig.pspre,
                        ids = '';

                    angular.forEach($scope.shopData, function (items) {
                        angular.forEach(items, function (item) {
                            if (item.choose) {
                                if (ids == '') {
                                    ids = item.Id;
                                } else {
                                    ids += ',' + item.Id;
                                }
                            }
                        })
                    })
                    
                    if(!ids){
                    	LayerUtil.error({
                            content: "请选择要删除的商品"
                        })
                    }

                    $http({
                        method: 'POST',
                        url: UrlUtil.http + "Cart/post_user_cart_deletes",
                        data: {
                            Ids: ids,
                            userId: userInfo.id,
                            method: 'post_user_cart_deletes',
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
                            // 从页面上移除已经删除的数据
                            for (var j = 0; j < $scope.shopData.length;) {
                                var items = $scope.shopData[j];
                                for (var i = 0; i < items.length;) {
                                    var item = items[i];
                                    // 只判断商品数据
                                    if (item.choose) {
                                        items.splice(i, 1);
                                    } else {
                                        i++;
                                    }
                                }
                                if (items.length == 0) {
                                    $scope.shopData.splice(j, 1);
                                } else {
                                    j++
                                }

                            }

                            // 生成最新的数据
                            $scope.generateNewData();

                        } else {
                            LayerUtil.error({
                                content: res.data
                            })
                        }
                    }).error(function () {
                        layer.closeAll();
                        LayerUtil.error();
                    });
                } else {
                	var delSkus=[];

                    // 从页面上移除已经删除的数据
                    for (var j = 0; j < $scope.shopData.length;) {
                        var items = $scope.shopData[j];
                        for (var i = 0; i < items.length;) {
                            var item = items[i];
                            // 只判断商品数据
                            if (item.choose) {
                            	delSkus.push(item.SKU);
                                items.splice(i, 1);
                            } else {
                                i++;
                            }
                        }
                        if (items.length == 0) {
                            $scope.shopData.splice(j, 1);
                        } else {
                            j++
                        }
                    }
                    $scope.generateNewData();
                }



            }

            // 删除数据
            $scope.remove = function (items, item) {

                // 登录状态同步后台数据
                /*var index = layer.open({
                    content: '是否删除?',
                    shadeClose: false,
                    btn: ['删除', '取消'],
                    yes: function () {

                    }
                })*/


               if (userInfo) {
                    LayerUtil.load.loading();
                    // 请求服务基本参数
                    var ymdhm = FormatDate.getYmdhm(),
                        pspre = BaseConfig.pspre;
                    $http({
                        method: 'POST',
                        url: UrlUtil.http + "Cart/post_user_cart_delete",
                        data: {
                            Id: item.Id,
                            userId: userInfo.id,
                            method: 'post_user_cart_delete',
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
                            items.splice(items.indexOf(item), 1);
                            if (items.length == 0) {
                                $scope.shopData.splice($scope.shopData.indexOf(items), 1);
                            }

                            $scope.generateNewData();
                        } else {
                            LayerUtil.error({
                                content: res.data
                            })
                        }
                    }).error(function () {
                    	layer.closeAll();
                        LayerUtil.error();
                    });
                }

                /*else {
                    items.splice(items.indexOf(item), 1);
                    if (items.length == 0) {
                        $scope.shopData.splice($scope.shopData.indexOf(items), 1);
                    }

                    $scope.generateNewData();

                    ShopCartHandle.removeForSku(item.SKU);
                }*/

            }


            // 添加商品数量
            $scope.addNum = function (item) {

                if (userInfo) {

                    // 请求服务基本参数
                    var ymdhm = FormatDate.getYmdhm(),
                        pspre = BaseConfig.pspre;

                    $http({
                        method: 'POST',
                        url: UrlUtil.http + "Cart/post_cart_product_number_add",
                        data: {
                            Id: item.Id,
                            userId: userInfo.id,
                            method: 'post_cart_product_number_add',
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
                            item.Count++;

                            $scope.generateNewData();
                        } else {
                            LayerUtil.error({
                                content: res.data
                            })
                        }
                    }).error(function () {
                        LayerUtil.error();
                    });
                }

                else {

                	if(item.Count >= 10){
                		LayerUtil.error({
                            content: '购物车单个商品数量只能为1-10个'
                        })
                		return;
                	}

                	// 更新缓存
                	ShopCartHandle.add({
                		sku:item.SKU
                	})

					// 更新显示数量
                    item.Count++;
                    $scope.generateNewData();
                }
            };

            // 减少商品数量
            $scope.reduceNum = function (item) {
                if (item.Count == 1) {
                    return;
                }

                if (userInfo) {
                    // 请求服务基本参数
                    var ymdhm = FormatDate.getYmdhm(),
                        pspre = BaseConfig.pspre;

                    $http({
                        method: 'POST',
                        url: UrlUtil.http + "Cart/post_cart_product_number_reduce",
                        data: {
                            Id: item.Id,
                            userId: userInfo.id,
                            method: 'post_cart_product_number_reduce',
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
                            item.Count--;

                            $scope.generateNewData();
                        } else {
                            LayerUtil.error({
                                content: res.data
                            })
                        }
                    }).error(function () {
                        LayerUtil.error();
                    });

                } else {
                    item.Count--;

                    // 计算最新的商品数量及价格
                    $scope.generateNewData();
                }

            };

            // 计算最新的商品数量及价格
            $scope.generateNewData = function () {
                var i = 0,// 结算数量
                    prices = 0,// 总价
                    shopNum = 0;// 购物车数量
                angular.forEach($scope.shopData, function (items) {
                    angular.forEach(items, function (item) {
                        shopNum += item.Count;
                        if (item.choose) {
                            i += item.Count;
                            prices += (item.Count * item.InitPrice);
                        }
                    })
                });

                // 所有商品数量
                $scope.shopNum = i;

                // 购物车数量
                $rootScope.tab.shopCartNum = shopNum;

                // 所有商品价格
                $scope.prices = prices;

                // 数据为空提示
                $scope.nullData = shopNum == 0 ? true : false;
            };

            // 点击单品触发事件
            $scope.clickShop = function (items) {
                var _all_choose = true;
                // 实现【子商品全部选中后，将该店铺对应的checkbox也选中；
                // 若店铺的checkbox已经选中，那么只要取消其中一个子商品，对应的店铺checkbox也改为false】
                angular.forEach(items, function (item) {
                    if (!item.choose) {
                        _all_choose = false;
                    }
                });
                items.choose = _all_choose;

                // 判断当前购物车数据是否已经全选
                var _all_shop_choose = true;
                angular.forEach($scope.shopData, function (items) {
                    if (!items.choose) {
                        _all_shop_choose = false;
                    }
                });
                $scope.choose.allChoose = _all_shop_choose;


                // 判断该商品同级的商品是否已经全选（同一店铺的商品）
                $scope.generateNewData();
            };

            // 点击店铺全选/反选所有的子元素
            $scope.chooseAllChildrens = function (items) {
                // 选中该店铺对应的所有商品
                angular.forEach(items, function (item) {
                    item.choose = items.choose;
                });

                // 判断当前购物车数据是否已经全选，控制全选按钮
                var _all_shop_choose = true;
                angular.forEach($scope.shopData, function (items) {
                    if (!items.choose) {
                        _all_shop_choose = false;
                    }
                });
                $scope.choose.allChoose = _all_shop_choose;

                $scope.generateNewData();
            };

            // 全选/反选
            $scope.chooseAll = function () {
                var flag = $scope.choose.allChoose;
                angular.forEach($scope.shopData, function (items) {
                    items.choose = flag;
                    angular.forEach(items, function (item) {
                        item.choose = flag;
                    })
                });

                $scope.generateNewData();
            }

        }])
    //商品九宫格
    .controller('Shop_innerCtrl', ['$scope','$http','SystemParam','UrlUtil','$rootScope','LayerUtil','Const','FormatDate','BaseConfig','MD5','$state','$stateParams','ShopCartHandle','$timeout','IsLogin',
        function($scope,$http,SystemParam,UrlUtil,$rootScope,LayerUtil,Const,FormatDate, BaseConfig, MD5,$state,$stateParams,ShopCartHandle,$timeout,IsLogin){
			//点击添加购物车
        	$scope.myAddition=function(sku,pid,sid){
        		alert(sku)
        		alert(pid)
        		alert(sid)
        		return;
                ShopCartHandle.add({
                	"sku":sku,
                	productid:pid,
                	shopid:sid
                });
            }

        	//接收的参数
        	$scope.skuId={
        		Id :$stateParams.id
        	};
        	var Id=$scope.skuId.Id

        	//品牌故事
        	$scope.shop_skip=function(){
        		$state.go('tab.Comm_story',{
        			"id":Id
        		})
        	}

            //副标题底部导航栏
            $(".oneIndex").on("click", function () {
	            var _that = $(this).index();
	            $(".shop_list_redW").stop(true).animate({left: (_that * 25) + "%"})
        	});
            var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO)),
                currentOrderby= 0,// 当前排序下标，避免针对同一排序重复加载
                isOrderBy = false,// 排序标示，如果为true则覆盖数据
                type='',//typeId
                page = 0,//页数
                pageSize = 10,//分页显示条数
                synthesize=true,//综合
                salesVolume=true,//销量
                price=true,//价格
            	categoryId = $scope.skuId.categoryId;//
            $scope.showObj = {//定义的全局参数
                name:'pro',
                choose:true,
                page:0,
                myButton:true,//收藏
                myCollect:false,//已收藏
                totalPage:1,
                url:'Brand/get_brand_pro_Id',//请求地址
                proList:[],//绑定数据用到的数组
                classify:[],//商品菜单初始数组
                brandClassify:[],//品牌菜单初始数组
                oneClassifyN:[],
                twoClassifyN:[],
                orderby:3,
                chooseOne:true
            };

            $scope.num=[]

            $scope.myclick=function(item){
            	$rootScope.$rootScrollTop();
          	    type='';

                    if(currentOrderby != item){
                    	$scope.showObj.page=0;
                        if(item==1){
 //                   	$scope.choose=true;
//            			$scope.showObj.choose=false;
                        $scope.showObj.orderby=2;
//                          if(synthesize){
//                          	synthesize=false;
                    		page = ++ $scope.showObj.page;
                    		$scope.myQuery();
//                          }
                    }else if(item==2){
                        $scope.showObj.orderby=1;
//                          if(salesVolume){
//                          	salesVolume=false;
                    		page = ++ $scope.showObj.page;
                    		$scope.myQuery();
//                          }
                    }else{
                    	$scope.showObj.orderby=3;
//                          if(price){
//                          	price=false;
                    		page = ++ $scope.showObj.page;
                    		$scope.myQuery();
//                          }
                    }
                    currentOrderby = item;
                    isOrderBy=true;
                }
            }
            // 上啦加载
            $scope.infinite = true;
            $scope.infiniteShow = true;
            $scope.loadMore = function() {
                //$rootScope.$rootScrollTop();
                    if( $scope.showObj.choose){
                        page = ++ $scope.showObj.page;
                        $scope.myQuery();
                    }

            };
            $scope.myQuery=function(){
        		var userId="0";
        		if(userInfo){
        			userId=userInfo.id
        		}
                var url=$scope.showObj.url,
                    orderBy=$scope.showObj.orderby,
                    params =  '?bId='+Id+'&userId='+userId+'&pageSize='+pageSize+ '&page='+page+'&orderby='+orderBy+'&method=get_brand_pro_Id' + SystemParam.get();
                console.log("品牌请求地址"+UrlUtil.http + url + params)
                $http.get(UrlUtil.http + url + params).success(function (res) {

                    if (res.code == 200) {
                    	console.log($scope.showObj.orderby)
                        var data = res.data;

                        	$scope.follow=data.follow;//是否关注
                        if($scope.follow == 1){
				            $scope.showObj.myButton=false;
				            $scope.showObj.myCollect=true;
				        }else{
				        	 $scope.showObj.myButton=true;
				        	 $scope.showObj.myCollect=false;
				        }
                        $scope.num=data.remark.BrandName;
                        $scope.SellerId=data.remark.Id;
                        $scope.numExtent=data.totalPage;
							if($scope.showObj.proList.length != 0){
                            if(isOrderBy){//如果不存在表示下拉加载
                                $scope.showObj.proList = data.datas;
                            }else{//否则表示切换
                                angular.forEach(data.datas,function(item){
                                    $scope.showObj.proList.push(item);
                                })
                            }
                        }else{
                            $scope.showObj.proList = data.datas;
                      }
                        // 广播上啦完成事件
                        $scope.$broadcast("scroll.infiniteScrollComplete");
                        // 关闭加载图标
                        $scope.infiniteShow = false;
                        $scope.showObj.totalPage = data.totalPage;
                        if(page >= data.totalPage){
                        	page=data.totalPage
                            $scope.infinite = false;
                        }else{
                        	$scope.infinite = true;
                        }
                        // 恢复默认 防止重复加载
                        isOrderBy = false;
                        }
                     else {
                        LayerUtil.error({
                            content: res.data
                        });
                    }
                })
          	};
          	$scope.choose=false;
            $scope.paixuTwo=function(){
            	$rootScope.$rootScrollTop();
            	if($scope.choose){
            		$scope.choose=false;
            		$scope.showObj.chooseOne=true;
            	}else{
            		$scope.choose=true;
            		$scope.showObj.chooseOne=false;
            	};

            };
            //后台请求
            $scope.remove = function () {
                LayerUtil.load.loading();
                // 请求服务基本参数
                var ymdhm = FormatDate.getYmdhm(),
                    pspre = BaseConfig.pspre;
                $http({
                    method: 'POST',
                    url: UrlUtil.http + "User/post_user_attention",
                    data: {
                        action: 'FollowBrand',
                        userId: userInfo.id,
                        key:$scope.SellerId,
                        method: 'post_user_attention',
                        timestamp:ymdhm,
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
                        $scope.showObj.myButton=false;
		            	$scope.showObj.myCollect=true;
                    } else {
                        LayerUtil.error({
                            content: res.data
                        })
                    }
                })
            };

            //点击商品跳转对应商品详情页带SKu参数
          	$scope.skip=function(){
              	$state.go('tab.commIntro',{
              		"skuId":this.itemSendback.Sku
              	})
    	  	}


    }])
    //商品列表
    .controller('Shop_listCtrl', ['$scope','$http','SystemParam','UrlUtil','$rootScope','LayerUtil','Const','FormatDate','BaseConfig','MD5','$state',
    '$stateParams','ShopCartHandle','$timeout','IsLogin','$location',
        function($scope,$http,SystemParam,UrlUtil,$rootScope,LayerUtil,Const,FormatDate, BaseConfig, MD5,$state,$stateParams,ShopCartHandle,$timeout,IsLogin,$location){
          //点击添加购物车
        	$scope.myAddition=function(sku,pid,sid){
                ShopCartHandle.add({
                	sku:sku,
    				productid:pid,
    				shopid:sid
                });
            }
        	//接收的参数
        	$scope.skuId={
        		categoryId :$stateParams.sellerId
        	};
        	
            //副标题底部导航栏
            $(".oneIndex").on("click", function () {
	            var _that = $(this).index();
              $(".shop_list_redW").stop(true).animate({left: (_that * 25) + "%"})
        	});
            var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO)),
                currentOrderby= 0,// 当前排序下标，避免针对同一排序重复加载
                isOrderBy = false,// 排序标示，如果为true则覆盖数据
                type='',//typeId
                page = 0,//页数
                synthesize=true,//综合
                salesVolume=true,//销量
                price=true,//价格
                pageSize = 10,//分页显示条数
            	categoryId = $scope.skuId.categoryId;//
            $scope.showObj = {//定义的全局参数
                        name:'pro',
                        choose:true,
                        page:0,
                        myButton:true,//收藏
                        myCollect:false,//已收藏
                        totalPage:1,
                        url:'Shop/get_shop_product_all',//请求地址
                        proList:[],//绑定数据用到的数组
                        classify:[],//商品菜单初始数组
                        brandClassify:[],//品牌菜单初始数组
                        oneClassifyN:[],
                        twoClassifyN:[],
                        orderby:3,
                        chooseTwo:true
                    };
            // 筛选页面
            $scope.num=[]
            $scope.filterLeft = false;
            $scope.filter = function() {
                $scope.filterRight = false;
                $scope.filterLeft = true;
                $scope.searchBackdrop = true;
                var userId = "";
                if(userInfo){
                	userId = userInfo.id;
                }
                var params = 'userId=' + userId +'&sellerId='+categoryId+'&method=get_shop_category_sellerId' + SystemParam.get();
                $http.get(UrlUtil.http + "Shop/get_shop_category_sellerId?" + params)
                    .success(function (res) {
                        if (res.code == 200) {
                            var data = res.data;
                          $scope.showObj.classify = data;
                        } else {
                            LayerUtil.error({
                                content : res.data
                            });
                        }
                    })
            };
            //商品菜单下拉框
            $scope.myOneClassify=function(){
              $scope.showObj.oneClassifyN=this.classify.ListCategories;
              angular.forEach($scope.showObj.classify,function(item){
                item.thereClassify = false;
              });
              this.classify.thereClassify = true;
            };

			$scope.bind=function(classify){
				angular.forEach($scope.showObj.classify,function(item){
					item.myBind = '';
				})
				classify.myBind=this.nLi.Descript;
				$scope.myType3=this.nLi.Id;//获取typeid 目前用三级菜单的ID代替
			}
			//未完成  暂缺接口...
			$scope.shopBrabdName=function(classify){
				$scope.classifyId=classify.Id //categoryId
				var userId = '';
				if(userInfo){
					userId = userInfo.id;
				}else{
					userId = 1;
				}
				var params = "bId=" + classify.Id + '&userId= '+userId+' &page=' + page +'&pageSize='+pageSize+'&method=get_brand_pro_Id' + SystemParam.get();

				console.log('搜索商品：'+UrlUtil.http + "Brand/get_brand_pro_Id?" + params);
                $http.get(UrlUtil.http + "Brand/get_brand_pro_Id?" + params)
                .success(function (res) {
                  if (res.code == 200) {
                    var data = res.data;
                    $scope.showObj.proList=data.datas;
                  } else {
                    LayerUtil.error({
                      content: res.data
                    });
                  }
                })
				 $scope.closeFilter();

			}
        	//品牌菜单下拉框
            $scope.myTwoClassify=function(){
            $scope.showObj.twoClassifyN=this.classify.ListCategories;
            angular.forEach($scope.showObj.classify,function(item){
              item.thereClassify = false;
            });
            this.classify.thereClassify = true;
          };

            // 关闭筛选页面
            $scope.filterRight = false;
            $scope.closeFilter = function() {
                //search(null, pageNow, sort);
                // 关闭筛选
                $scope.filterRight = true;
                $scope.filterLeft = false;
                $timeout(function() {
                    $scope.searchBackdrop = false;
                }, 400)
            }
            //筛选页面—>分类开关
            $scope.oneClassify=true;
            $scope.switch=function(item){
                if(item == 1){
                    $scope.oneClassify=true;
                   $scope.twoClassify=false;
                  // $scope.thereClassify=false;
                }else if(item==2){
	                var userId = "";
	                if(userInfo){
	                	userId = userInfo.id;
	                }
                  var params = 'userId=' + userId +'&sellerId='+categoryId+'&method=get_shop_brand_sellerId' + SystemParam.get();
                  $http.get(UrlUtil.http + "Shop/get_shop_brand_sellerId?" + params)
                    .success(function (res) {
                      if (res.code == 200) {
                        var data = res.data;
                        $scope.showObj.brandClassify = data;
                      } else {
                        LayerUtil.error({
                          content: res.data
                        });
                      }
                    })
                  $scope.twoClassify=true;
                  $scope.oneClassify=false;
                 // $scope.thereClassify=false;
                }/*else{暂缓开通
                  $scope.thereClassify=true;
                  $scope.twoClassify=false;
                  $scope.oneClassify=false;
                }*/

            }

            $scope.myclick=function(item){

                	$rootScope.$rootScrollTop();
                	$scope.showObj.page=0;
                	type='';
                    if(currentOrderby != item){
                        if(item==1){//销量
                            $scope.showObj.orderby=2;
//                          if(salesVolume){
//                          	salesVolume=false;
                            	page = ++ $scope.showObj.page;
                            	$scope.myQuery();
//                          }
                        }else if(item==2){//价格
                            $scope.showObj.orderby=1;
//                          if(price){
//                          	price=false;
                            	page = ++ $scope.showObj.page;
                            	$scope.myQuery();
//                          }
                        }else if(item==3){//综合
                        	$scope.showObj.orderby=3;
//                      	if(synthesize){
//                      		synthesize=false;
                            	page = ++ $scope.showObj.page;
                            	$scope.myQuery();
//                      	}
                        }
                        currentOrderby = item;
                        isOrderBy = true;
                    }
                }
            // 上啦加载
            $scope.infinite = true;
            $scope.infiniteShow = true;
            $scope.loadMore = function() {
//              $rootScope.$rootScrollTop();
                if( $scope.showObj.choose){
                    page = ++ $scope.showObj.page;
                    $scope.myQuery();
                }

            };
            $scope.myQuery=function(){
					var userId = "";
					if(userInfo){
						userId = userInfo.id;
					}

                   		var url=$scope.showObj.url,
                        orderBy=$scope.showObj.orderby,
                        params = 'userId=' + userId +'&orderby='+orderBy+'&pageSize='+pageSize+ '&page='+page+ '&type3='+type+ '&sellerId='+categoryId+'&method=get_shop_product_all' + SystemParam.get();
                        console.log("搜索店铺商品："+UrlUtil.http + url+"?" + params)
                   		$http.get(UrlUtil.http + url+"?" + params)
                        .success(function (res) {
                            if (res.code == 200) {
                                var data = res.data;
                                $scope.follow=data.Follow;//是否关注
                                if($scope.follow == 1){
						            $scope.showObj.myButton=false;
						            $scope.showObj.myCollect=true;
						        }else{
						        	 $scope.showObj.myButton=true;
						        	 $scope.showObj.myCollect=false;
						        }
                                $scope.num=data.ShopName;
                                $scope.SellerId=data.SellerId;
									if($scope.showObj.proList.length != 0){
                                    if(isOrderBy){//如果不存在表示下拉加载
                                        $scope.showObj.proList = data.proList;
                                    }else{//否则表示切换
                                        angular.forEach(data.proList,function(item){
                                            $scope.showObj.proList.push(item);
                                        })
                                    }
                                }else{
                                    $scope.showObj.proList = data.proList;
                                }
                                // 广播上啦完成事件
                                $scope.$broadcast("scroll.infiniteScrollComplete");
                                // 关闭加载图标
                                $scope.infiniteShow = false;
                                $scope.showObj.totalPage = data.totalPage;
                                if(page >= data.TotalPage){
                                	page=data.TotalPage
                                    $scope.infinite = false;
                                }else{
                                	$scope.infinite = true;
                                }
                                // 恢复默认 防止重复加载
                                isOrderBy = false;
                            } else {
                                LayerUtil.error({
                                    content: res.data
                                });
                            }
                        })



            };
             $scope.choose=false;
            $scope.paixuTwo=function(){
            	$rootScope.$rootScrollTop();
                if($scope.choose){
            		$scope.choose=false;
            		$scope.showObj.chooseTwo=true;
            	}else{
            		$scope.choose=true;
            		$scope.showObj.chooseTwo=false;
            	};
            };
            // 收藏店铺
            $scope.collect = function () {
                if (IsLogin.isGoLogin(null)) {
                    LayerUtil.load.loading();
                    // 请求服务基本参数
                    var ymdhm = FormatDate.getYmdhm(),
                        pspre = BaseConfig.pspre;
                    $http({
                        method: 'POST',
                        url: UrlUtil.http + "User/post_user_attention",
                        data: {
                            action: 'FollowShop',
                            userId: userInfo.id,
                            key:$scope.SellerId,
							"ip": returnCitySN["cip"],
							"source": "",
							"shopid": $stateParams.sellerId,
							"type": 2,
                            method: 'post_user_attention',
                            timestamp:ymdhm,
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
                            $scope.showObj.myButton=false;
			            	$scope.showObj.myCollect=true;
                        } else {
                            LayerUtil.error({
                                content: res.data
                            })
                        }
                    })
                }
            };

			$scope.demand = function(){
				 $scope.infiniteShow = true;
				type=$scope.myType3;
				$scope.showObj.page = 1;
                var page = 0,
                    index=0,
                    pageSize = 10,
                    url = $scope.showObj.url,
                    orderBy = $scope.showObj.orderby,
                    params = 'userId=' + userInfo.id +'&orderby='+orderBy+'&pageSize='+pageSize+ '&page='+page+ '&type3='+type+ '&sellerId='+categoryId+'&method=get_shop_product_all' + SystemParam.get();
                    $http.get(UrlUtil.http + url+"?" + params)
                        .success(function (res) {
                            if (res.code == 200) {
                                var data = res.data;
                                $scope.showObj.proList=data.proList;
                            	if(page >= data.TotalPage){
                            		$scope.infinite = false;
                            	}else{
                                	$scope.infinite = true;
                                }
                                $scope.infiniteShow = false;

                                $scope.closeFilter();
                            } else {
                                LayerUtil.error({
                                    content: res.data
                                });
                            }
                        })

			}

        }])
    //品牌故事
    .controller('Comm_storyCtrl', ['$http','LayerUtil','$scope','UrlUtil','SystemParam','Const','$sanitize','$stateParams',
        function ($http,LayerUtil,$scope,UrlUtil,SystemParam,Const,$sanitize,$stateParams) {
            $scope.num = [];
            $scope.orderInfo = {
                Id:$stateParams.id
            };
            var sellerId=$scope.orderInfo.Id,url = 'Brand/get_barnd_Id',
             params ='&bId=' + sellerId + '&method=get_barnd_Id' + SystemParam.get();

             console.log('品牌详情：'+UrlUtil.http + url + "?" + params)
            $http.get(UrlUtil.http + url + "?" + params)
                .success(function (res) {
                    if (res.code == 200) {
                        var data = res.data;
                            $scope.num = data;

                        $('p#about_we').html(res.data.BrandDescript);

                        var src = null,
                        	item = null;
                        	substring_url = null,
                        	new_url = null;
                        var imgs = $("p#about_we").find('img');
                        imgs.css("width","43%")
                        $.each(imgs, function() {
                        	item = $(this);
                        	src = item.attr('src');
                        	if(src.indexOf('WBManage/attached') > -1){
                        		substring_url = src.substring(src.indexOf('/attached'),src.length);
                        		new_url = UrlUtil.oss + substring_url;
                        		item.attr('src',new_url);
                        	}
                        });
                    }
                })
    }])
    //评价晒单
    .controller('User_evaluCtrl', function () {
        $.fn.raty.defaults.path = '../../img/app/center';
        $('#function-demo').raty({
            number: 5,//多少个星星设置
            targetType: 'hint',//类型选择，number是数字值，hint，是设置的数组值
            path: 'img/app/center',
            hints: ['差', '一般', '好'],
            size: 24,
            starHalf: 'star-half-big.png',
            starOff: 'star-off-big.png',
            starOn: 'star-on-big.png',
            target: '#function-hint',
            cancel: false,
            targetKeep: true,
            targetText: '请选择评分'
        });

        $('#function-demo1').raty({
            number: 5,//多少个星星设置
            score: 2,//初始值是设置
            targetType: 'number',//类型选择，number是数字值，hint，是设置的数组值
            path: 'img/app/center',
            size: 24,
            starHalf: 'star-half-big.png',
            starOff: 'star-off-big.png',
            starOn: 'star-on-big.png',
            target: '#function-hint1',
            cancel: false,
            targetKeep: true,
            precision: false//是否包含小数
        });
        $('#function-demo').raty({
            number: 5,//多少个星星设置
            targetType: 'hint',//类型选择，number是数字值，hint，是设置的数组值
            path: 'img/app/center',
            hints: ['差', '一般', '好'],
            size: 24,
            starHalf: 'star-half-big.png',
            starOff: 'star-off-big.png',
            starOn: 'star-on-big.png',
            target: '#function-hint',
            cancel: false,
            targetKeep: true,
            targetText: '请选择评分'
        });

        $('#function-demo1').raty({
            number: 5,//多少个星星设置
            score: 2,//初始值是设置
            targetType: 'number',//类型选择，number是数字值，hint，是设置的数组值
            path: 'img/app/center',
            size: 24,
            starHalf: 'star-half-big.png',
            starOff: 'star-off-big.png',
            starOn: 'star-on-big.png',
            target: '#function-hint1',
            cancel: false,
            targetKeep: true,
            precision: false//是否包含小数
        });
        $('#function-demo2').raty({
            number: 5,//多少个星星设置
            score: 2,//初始值是设置
            targetType: 'number',//类型选择，number是数字值，hint，是设置的数组值
            path: 'img/app/center',
            size: 24,
            starHalf: 'star-half-big.png',
            starOff: 'star-off-big.png',
            starOn: 'star-on-big.png',
            target: '#function-hint1',
            cancel: false,
            targetKeep: true,
            precision: false//是否包含小数
        });
        $('#function-demo3').raty({
            number: 5,//多少个星星设置
            score: 2,//初始值是设置
            targetType: 'number',//类型选择，number是数字值，hint，是设置的数组值
            path: 'img/app/center',
            size: 24,
            starHalf: 'star-half-big.png',
            starOff: 'star-off-big.png',
            starOn: 'star-on-big.png',
            target: '#function-hint1',
            cancel: false,
            targetKeep: true,
            precision: false//是否包含小数
        });
        $('#function-demo4').raty({
            number: 5,//多少个星星设置
            score: 2,//初始值是设置
            targetType: 'number',//类型选择，number是数字值，hint，是设置的数组值
            path: 'img/app/center',
            size: 24,
            starHalf: 'star-half-big.png',
            starOff: 'star-off-big.png',
            starOn: 'star-on-big.png',
            target: '#function-hint1',
            cancel: false,
            targetKeep: true,
            precision: false//是否包含小数
        });

    })
    //	结算
    .controller('SubOrderCtrl', ['$scope','$stateParams','$http','UrlUtil','Const','SystemParam',
    '$state','LayerUtil','PayType','FormatDate','BaseConfig','MD5','ProjectType',
    	function ($scope,$stateParams,$http,UrlUtil,Const,SystemParam,
    		$state,LayerUtil,PayType,FormatDate,BaseConfig,MD5,ProjectType) {

		// 直接跳入添加收货地址页面
		$scope.addNewAddress = function(){
			$state.go('tab.addShippingAddress',{
    			param:''
    		})
		}
		// 参与结算的用户ID
		var param = JSON.parse($stateParams.param),// {skuIds:'1,2,3',addressId:'123'}
			userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO)),
			accountParams = "userId="+userInfo.id+"&cartList="+param.cartList+'&method=get_order_cart_detail'+SystemParam.get(),
			userAddressParams = 'userId=' + userInfo.id +'&Id=' + param.addressId + '&method=get_user_address' + SystemParam.get();

		$scope.addressId = param.addressId;
		// 选择其他收货地址
		$scope.chooseAddress = function(addressId){
			$state.go('tab.shippingAddress',{
				'param':JSON.stringify({
					cartList:param.cartList,
					addressId:$scope.addressId
				})
			})
		}

		// 收货地址
		console.log('查询用户收货地址URL:'+UrlUtil.http + "Order/get_user_address?" + userAddressParams)
        $http.get(UrlUtil.http + "Order/get_user_address?" + userAddressParams)
        .success(function (res) {
            if (res.code == 200) {
                $scope.userAddress = res.data;
                if($scope.userAddress.length > 0){
                	$scope.addressId = $scope.userAddress[0].Id;
                }
            } else {
                LayerUtil.error({
                    content: res.data
                })
            }
        })

		// 金额统计
		$scope.moneyInfo = {
			totalMoney:0,// 商品总价
			activeCouponMoney:0,// 优惠金额
			freight:0,// 运费
			couponMoney:0,// 优惠券
			proCount:0,// 商品数量
			CouponsBatchesDetails:0, // 优惠券数量
			summation:0 // 合计
		}

		// 购物车商品结算详情
		console.log("结算详情URL:"+UrlUtil.http + "Order/get_order_cart_detail?" + accountParams)

		LayerUtil.load.loading();
		$http.get(UrlUtil.http + "Order/get_order_cart_detail?" + accountParams)
        .success(function (res) {
            layer.closeAll();
            if (res.code == 200) {
            	var data = res.data,
            		cartInfo = data.CartInfo;

            	// 优惠券集合
            	$scope.couponse = data.CouponsBatchesDetails;

            	// 运费统计
            	$scope.Express = data.Express;
            	angular.forEach(data.Express,function(item){
            		$scope.moneyInfo.freight += item.ExpressEelivery;
            	})

            	// 优惠券数量
            	$scope.moneyInfo.CouponsBatchesDetails = data.CouponsBatchesDetails.length;

        		// 商品数量
        		$scope.moneyInfo.proCount = cartInfo.length;

            	// 封装店铺信息
            	var shopIds = [],
            		InitTotalPrice = 0,
            		SoldTotalPrice = 0;
            	$scope.shops = [];
            	angular.forEach(cartInfo,function(item,cartIndex){
            		if(shopIds.indexOf(item.SId) == -1){
            			shopIds.push(item.SId);
            			var shop={
            				SId:item.SId,// 店铺ID
            				ShopName:item.ShopName,// 店铺名称
            				SoldTotalPrice:0,// 当前店铺总金额
            				shopExpress:null,// 运费
            				remark:'',// 留言
            				product:[]
            			};

	            			// 封装店铺快递信息
		            	angular.forEach(data.Express,function(express){
		            		if(express.Sid == item.SId){
		            			shop.shopExpress = express;
		            		}
		            	})

            			// 封装该店铺对应的商品信息
	            		angular.forEach(cartInfo,function(cart){
	            			if(cart.SId == item.SId){
	            				shop.product.push(cart)

	            				// 赠品判断
	            				if(cart.ProductType != 1){
		            				// 当前店铺总金额
		            				shop.SoldTotalPrice += cart.SoldTotalPrice;

		            				// 商品总价
		            				$scope.moneyInfo.totalMoney += cart.SoldTotalPrice;

		            				// 计算优惠金额(先统计价格)
		            				InitTotalPrice += cart.InitTotalPrice;
		            				SoldTotalPrice += cart.SoldTotalPrice;
	            				}
	            			}
	            		})

            			$scope.shops.push(shop);
            		}
            	})

            	// 相减获得优惠金额
            	$scope.moneyInfo.activeCouponMoney = InitTotalPrice-SoldTotalPrice;

            } else {
                LayerUtil.error({
                    content: res.data
                });
            }
        })

        // 用户/企业发票选择
        $scope.choose = {
            user: true,
            group: false,
            groupName:''
        }

        // 选择用户发票
        $scope.chooseUser = function () {
            $scope.choose.user = true;
            $scope.choose.group = false;
            $scope.invoiceUserName = true;
        }

        // 选择企业发票
        $scope.chooseGroup = function () {
            $scope.choose.group = true;
            $scope.choose.user = false;
            $scope.invoiceUserName = false;
        }

        // 开具发票
        $scope.invoiceType = true;// 默认不开发票
        $scope.invoiceUserName = true;// 默认发票类型为个人
        $scope.toggleInvoice = function(){
        	$scope.invoiceType = !$scope.invoiceType;
        }

        // 提交订单显示/隐藏
    	$scope.zhezhaoHide=true;
    	$scope.choosePayType=false;
    	$scope.chooseCoupons = false;// 优惠券


    	// 选择优惠券
    	$scope.chooseCoupon = function(){
	    	$scope.zhezhaoHide = false;
	    	$scope.chooseCoupons = true;// 优惠券

        	$scope.closeLayer = function(){
		    	$scope.zhezhaoHide=true,
		    	$scope.chooseCoupons=false
        	}
    	}

    	// 选择优惠券
    	$scope.useCoupon = function(){
    		angular.forEach($scope.couponse,function(item){
    			item.use = false;
    		})

    		this.item.use = true;
    		$scope.closeLayer();

    		// 展示选择优惠券面额
    		$('span#showCoupon').text('优惠券:¥'+this.item.CouponsFaceValue+' >');

    		// 减去的优惠券金额
    		$scope.moneyInfo.couponMoney = this.item.CouponsFaceValue;
    	}


        // 提交订单
        $scope.submitOrder = function(){

        	LayerUtil.load.loading();

        	// 基础参数
        	var ymdhm = FormatDate.getYmdhm(),
                pspre = BaseConfig.pspre,
                messages = [],// 店铺信息...
                cartList = '',// skuList
                CouponsBatchesDetailID = 0;// 优惠券ID

                // 获取优惠券ID
                angular.forEach($scope.couponse,function(item){
                	if(item.use){
                		CouponsBatchesDetailID = item.CouponsBatchesDetailID;
                	}
                })

                // 封装店铺信息
    			angular.forEach($scope.shops,function(item){
    				// 封装店铺信息
    				messages.push({
    					Seller:item.SId,// 店铺ID
    					ShopName:item.ShopName,// 店铺名称
    					remark:item.remark// 给商家的备注
    				})

    				// 封装sku信息
    				angular.forEach(item.product,function(sku){
    					if(cartList == ''){
    						cartList += sku.Id;
    					}else{
    						cartList += ','+sku.Id;
    					}
    				})
    			})
    			
    			
				var channelid = "", channelurlid = "", activeid = "";
    			var statistic = JSON.parse(localStorage.getItem("statistic_storage"));
    			if (statistic) {
    			    channelid = statistic.channelid;
    			    channelurlid = statistic.channelurlid;
    			    activeid = statistic.activeid;
    			}
		        
            $http({
                method: 'POST',
                url: UrlUtil.http + "Order/post_order_submit",
                data: {
                	channelid: channelid,
                    channelurlid: channelurlid,
                    activeid: activeid,
                    type:2,
                    ip: returnCitySN["cip"],
                    UserId : userInfo.id,// 用户ID
                    address : $scope.addressId,// 收货地址ID
                    payment : 1, // 支付类型(默认支付宝，支付成功回调中再次修改)
                    invoiceType : $scope.toggleInvoiceModel==true?1:0,// 发票类型 1：普通发票； 0：以后再开；
                    titleType : $scope.choose.user == true?1:2,// 抬头类型 1：个人；2：单位；
                    unit : $scope.choose.groupName,// 发票信息 选择单位 填写 用户填写的单位名称
                    content : '明细',// 如果选择的个人，内容为明细
                    cartList : cartList,// skuList
                    message : JSON.stringify(messages),// 店铺信息...
                    couponsdetail : CouponsBatchesDetailID,// 优惠券ID
                    method: 'post_order_submit',
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

                	$scope.submitOrderInfo = res.data;
                	
					console.log("提交订单成功，返回信息：");
                	console.log(res.data);

		        	$scope.zhezhaoHide = false
		        	$scope.choosePayType = true;
		        	$scope.closeLayer = function(){
				    	$scope.zhezhaoHide=true,
				    	$scope.choosePayType=false
		        	}

                } else {
                    LayerUtil.error({
                        content: res.data
                    });

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
        }

        // 去支付
        $scope.pay = function(){
        	if(ProjectType.type == 'android'){
        		LayerUtil.load.loading();
        	}else{
        		LayerUtil.load.loading(10);
        	}
        	
        	
        	
        	var totalMoney = 0,// 总金额
        		paysn = null,// 支付单号
        		payment = 0;// 支付方式
        		
        	// 计算支付单号，和总金额
        	angular.forEach($scope.submitOrderInfo,function(item){
        		paysn = item.paysn;
        		totalMoney += item.OrderTotalMoney;
        	})
        	
        	// 获取支付方式
        	angular.forEach($scope.payType,function(item){
        		if(item.selected){
        			payment = item.payment;
        		}
        	})
        	
        	// 发送支付请求
        	switch (payment){
        		case 0:
		        	// 微信付款
		        	wechatPay();
        			break;
        		case 1:
		        	// 支付宝付款
		        	aliPay(totalMoney,paysn);
        			break;
        		default:
        			break;
        	}
        	
        }
        
        // 微信支付
        var wechatPay = function(){
            // 请求服务基本参数
            var ymdhm = FormatDate.getYmdhm(),
                pspre = BaseConfig.pspre;
                
        	$http({
                method: 'POST',
                url: UrlUtil.http + "OAuth/post_wxpay_app",
                data: {
                	paysn: $scope.submitOrderInfo[0].paysn,
                    ip: returnCitySN["cip"],
                    method: 'post_wxpay_app',
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
						layer.closeAll();
						LayerUtil.warning({
		                    content:'付款成功',
		                    time:1.5,
		                    shade:true,
		                    shadeClose:false,
		                    success: function (elem) {
		                    	setTimeout(function(){
									// 付款成功跳转待收货页面查看
									$state.go('tab.orders',{
										status:1
									})
		                    	},1.3*1000)
		                    }
						})
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
        
        // 阿里支付
        var aliPay = function(totalMoney,paysn){
        	window.alipay.pay({
			    tradeNo: paysn,
			    subject: "世峰户外商城商品订单",
			    body: "世峰户外商城商品订单",
			    price: totalMoney,
			    notifyUrl: UrlUtil.zfbNotify
			}, function(successResults){
				layer.closeAll();
				LayerUtil.warning({
                    content:'付款成功',
                    time:1.5,
                    shade:true,
                    shadeClose:false,
                    success: function (elem) {
                    	setTimeout(function(){
							// 付款成功跳转待收货页面查看
							$state.go('tab.orders',{
								status:1
							})
                    	},1.3*1000)
                    }
				})
			}, function(errorResults){
				layer.closeAll();
				LayerUtil.error({
                    content:errorResults.memo,
                    btn:'好'
				})
			});
        }

    }])
    //修改昵称页面
  .controller('shop_innerBeifen',function(){

  })
    //修改昵称页面
  .controller('subOder-couponCtrl',function(){

  })

