angular.module("home.controller", [])

.controller('GuideCtrl',function($scope){
})

.controller('HomeCtrl', ['$scope','$http','LayerUtil','UrlUtil','SystemParam','$ionicSlideBoxDelegate',
'$ionicSlideBoxDelegate','$state','$rootScope','SearchHistory','Const','ArrayRepet','Statictis','$location',
	function($scope,$http,LayerUtil,UrlUtil,SystemParam,$ionicSlideBoxDelegate,$ionicSlideBoxDelegate,
		$state,$rootScope,SearchHistory,Const,ArrayRepet,Statictis,$location) {
			
	// 跳转商品详情
	$scope.tabHomeGoProductDetailInfo = function(imgLink){
		var sku = imgLink.substring(imgLink.lastIndexOf('/')+1,imgLink.lastIndexOf('.'));
		$state.go('tab.commIntro',{
        	skuId:sku
        });
	}
    var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
	    var userid = "0";
	    if (userInfo) {
	        userid = userInfo.id;
	    }

	//---------------------------------------------------------		搜索
	// 加载搜索历史
	$("p#no_history_search_p").show();
	var history_search_str = '',
		dyh = "'",
		parent_jq = null,
		history_search = null;

	// 加载搜索历史
	$scope.loadHistorySearch = function(){
		history_search = SearchHistory.get();
		if(history_search){
			history_search_str = ''
			angular.forEach(JSON.parse(history_search),function(item){
				history_search_str += '<a id="show_history_search_a" class="color-b fonS0293" >'+item+'</a>';
			})
			// 清除历史搜索数据
			$("a#show_history_search_a").remove();

			// 获取父标签进行数据插入
			parent_jq = $("p#no_history_search_p").parent();
			parent_jq.prepend(history_search_str);
			parent_jq.find('a#show_history_search_a').click(function(){
				getKeywordSearchData($(this).text().trim(),1)
			})

			// 隐藏“无搜索历史”
			$("p#no_history_search_p").hide();
		}else{
			$("a#show_history_search_a").hide()
			$("p#no_history_search_p").show();
		}
	}

	// 切换搜索页面和首页展示
	$scope.hideSearchView = true;
	$scope.showSearchModal = function(){
		$scope.loadHistorySearch();
		$scope.hideSearchView = false;
		setTimeout(function(){
			$('#in_search_input').focus();
		},200)
	}

	// 清空搜索关键字
	$scope.clearKeyword=function(){
		$scope.keyword = '';
		setTimeout(function(){
			$('#in_search_input').focus();
		},100)
	}

	// 清除历史搜索记录
	$scope.clearHistorySearch = function(){
        var index = layer.open({
            content: '清除搜索记录?',
            btn: ['确认', '取消'],
            shadeClose: false,
            yes: function(){
    			SearchHistory.clear();
    			$("a#show_history_search_a").hide();
    			$("p#no_history_search_p").show();
            	layer.close(index);
            }
        });
    }

	// 搜索建议
	$scope.searchData=[];
	$scope.keyword = '';

	// 监控输入的关键字进行查询
	$scope.$watch('keyword', function (newVal, oldVal) {
		if(newVal == ""){
			$scope.searchData=[];
			return;
		}
		$http.get(UrlUtil.solrUrl + "search/sug?keyword=" + newVal)
		.success(function(res) {
			$scope.searchData = [];
			// 数组去重
			if(res.s && res.s.length > 0){
				$scope.searchData = ArrayRepet.repeat(res.s);
			}
		}).error(function() {
			LayerUtil.error();
		})
	})

	// 点击（下拉关键词）进行搜索
	function getKeywordSearchData(item,type) {

		// 保存历史搜索数据
		if(type == 0){
			SearchHistory.set(item);
		}

		$scope.goSearchDataView(item);
		Statictis.SearchStatictis(item, userid,Statictis.getTime());
	}

	// 点击（下拉关键词）进行搜索
	$scope.getKeywordSearchData = function(item,type){

		// 保存历史搜索数据
		if(type == 0){
			SearchHistory.set(item);
		}

		$scope.goSearchDataView(item);
		Statictis.SearchStatictis(item, userid,Statictis.getTime());
	}

	// 监听回车搜索
	$(document).keypress(function(e) {
    // 回车键事件
       if(e.which == 13) {
       		  if ($location.path().indexOf('/home')>-1) {

	                SearchHistory.set($("input#in_search_input").val());

	                $scope.goSearchDataView($("input#in_search_input").val());
	                Statictis.SearchStatictis($("input#in_search_input").val(), userid, Statictis.getTime());
	            }
       }
   	});

	// 跳转搜索页面
   	$scope.goSearchDataView=function(keyword){
   		if(keyword.trim() == ''){
   			return;
   		}

		var params={
			itemId : null,// 不存在分类属性
			be : 'home',// 来自于首页
			keyword:keyword// 关键词
		}

		$scope.hideSearchView = true;

		$state.go('tab.classify', {
			params : JSON.stringify(params)
		});
   	}

	// 关闭搜索页面MODAL
	$scope.cancel = function () {
		$("input#in_search_input").val('');
		$scope.searchData=[];
		$scope.hideSearchView = true;
	}
	//---------------------------------------------------------		搜索

	// 控制banner图标
	setTimeout(function(){
    	$('.tab-home-banner>.slider-pager>span>i').removeClass().addClass('icon ion-minus-round')
	},1000)

	// 定义首页加载对象
	$scope.newHomePage={
		haqi:'新版首页,APP',
		banler:[],// 轮播图
		pedestrian:[],// 广告四联图
		foreshowActivity:null,// 活动预告
		newProduct:null,// 新品展示
		outdoors:[],// 户外装备
		mountaineering:[],// 登山鞋服
		riding:[],// 骑行
		fitness:[],// 健身
		goodShop:[],// 发现好店
		goodCargo:[]// 发现好货
	}

	// 默认读取缓存数据
	var home_cache = localStorage.getItem(Const.HOME_CACHE_DATA);
	if(home_cache){
		home_cache = JSON.parse(home_cache);
		$scope.newHomePage = home_cache.newHomePage;
       	$scope.newNum=home_cache.newNum;
       	$scope.str=home_cache.str;
       	$scope.newStr=home_cache.newStr;
       	$scope.newStr2=home_cache.newStr2;
       	$scope.newStr1=home_cache.newStr1;
	}
	
	// 初始化，加载首页数据
	var initLoad = function(){
	    var params = 'imgModule=' + $scope.newHomePage.haqi +'&method=get_homepage_PosterImage' + SystemParam.get() + '&temptime=' + new Date().getTime();
	    console.log('请求首页bar图URL:'+UrlUtil.http + "HomePage/get_homepage_PosterImage?" + params)
	    $http.get(UrlUtil.http + "HomePage/get_homepage_PosterImage?" + params)
	        .success(function (res) {
	            if (res.code == 200) {
	                var data = res.data;
	
				// 初始化页面数据
				$scope.newHomePage={
					haqi:'新版首页,APP',
					banler:[],// 轮播图
					pedestrian:[],// 广告四联图
					foreshowActivity:null,// 活动预告
					newProduct:null,// 新品展示
					outdoors:[],// 户外装备
					mountaineering:[],// 登山鞋服
					riding:[],// 骑行
					fitness:[],// 健身
					goodShop:[],// 发现好店
					goodCargo:[]// 发现好货
				}
	
	            // 封装数据
	            for(var i=0,len=data.length;i<len;i++){
	           		switch(data[i].ImgRank){
	           			case 106:
	           				$scope.newHomePage.outdoors.push(data[i]);//户外装备
	           				break;
	           			case 107:
	           				$scope.newHomePage.mountaineering.push(data[i]);//登山鞋服
	           				break;
	           			case 108:
	           				$scope.newHomePage.riding.push(data[i]);//骑行
	           				break;
	           			case 109:
	           				$scope.newHomePage.fitness.push(data[i]);//健身
	           				break;
	           			case 110:
	           				$scope.newHomePage.goodShop.push(data[i]);//发现好店
	           				break;
	           			case 111:
	           				$scope.newHomePage.goodCargo.push(data[i]);//发现好货
	           				break;
	           			case 114:
	           				$scope.newHomePage.banler.push(data[i]);// 轮播图
	           				break;
	           			case 115:
	           				$scope.newHomePage.pedestrian.push(data[i]);//行者
	               			$scope.newNum=$scope.newHomePage.pedestrian[0];
	               			$scope.str=$scope.newNum.ImgTitle.split("|");
							$scope.newStr=$scope.str[0]+$scope.str[1];
							$scope.newStr2=$scope.str[2];
							$scope.newStr1=$scope.str[3];
	           				break;
	           			case 116:
	           				$scope.newHomePage.newProduct = data[i];// 首页-新品展示
	           				break;
	           			case 117:
	           				$scope.newHomePage.foreshowActivity = data[i];// 首页-活动预告
	           				break;
	           		}
	            }
	            
	            // 活动预告链接
	            $rootScope.newHomePageForeshowActivityImgLink = $scope.newHomePage.foreshowActivity.ImgLink;
	            // 新品展示链接
	            $rootScope.newHomePageNewProductImgLink = $scope.newHomePage.newProduct.ImgLink;
	            
	            // 更新轮播图
				$ionicSlideBoxDelegate.$getByHandle('homeBannerSlideBox').update();
				$ionicSlideBoxDelegate.$getByHandle('homeBannerSlideBox').loop(true);
	
	            // 更新最新的缓存
				var home_cache_data = {
					newHomePage:$scope.newHomePage,
					newNum:$scope.newNum,
					str:$scope.str,
					newStr:$scope.newStr,
					newStr2:$scope.newStr2,
					newStr1:$scope.newStr1
				}
	
		        localStorage.setItem(Const.HOME_CACHE_DATA,JSON.stringify(home_cache_data));
	
	        } else {
	            LayerUtil.error({
	                content: res.data
	            });
	        }
	    }).error(function(){
	    	LayerUtil.error({
	    		content:'加载失败',
	            btn:'重新加载',
	            yes:function(){
	            	initLoad();
	            }
	    	})
	    })

	}
	
	initLoad();

    // 广告页跳转链接
    $scope.goZhuanTiView = function(href){
    	if(href.indexOf('#/tab/')>-1){
    		location.href = href;
    	}else{
    		// 站外广告链接
			$state.go('tab.dynamic',{
            	"url":href
            });
    	}
    }

	$scope.num=0;
	$scope.showNum=$scope.newHomePage.outdoors;

	// 查看更多
	$scope.viewMore = function(keyword){
		var params={
			itemId : null,// 不存在分类属性
			be : 'home',// 来自于首页
			keyword:keyword// 关键词
		}

		$state.go('tab.classify', {
			params : JSON.stringify(params)
		});
	}
  $scope.GoToMore=function(href){
	        $state.go('tab.specialOff', {
	          
	        });
	    }

	    //加载首页九点上新
	    var url = UrlUtil.http + "seckills/get_seckill?type=2&method=get_seckill" + SystemParam.get();
	    $http.get(url)
            .success(function (res) {
          
                if (res.code == "200") {
                    if (res.data) {
                        var url = UrlUtil.http + "Seckills/get_seckillsbyid_top?method=get_seckillsbyid_top&top=3&seckillid=" + res.data[0].Id + SystemParam.get();
                        $http.get(url)
                            .success(function (res) {
                                $scope.specialOffProduct = res.data;
                            }).error(function () {
                                alert("加载数据异常，请重新刷新...");
                            });
                    }
                }
            }).error(function () {

            });
        ///加载预售活动信息
	    var url = UrlUtil.http + "seckills/get_seckill_presell?type=2&method=get_seckill_presell" + SystemParam.get();
	    $http.get(url)
            .success(function (res) {
                console.log(res);
                if (res.code == "200") {
                    if (res.data) {
                        var url = UrlUtil.http + "Seckills/get_seckillsbyid_top?method=get_seckillsbyid_top&top=3&seckillid=" + res.data[0].Id + SystemParam.get();
                        $http.get(url)
                            .success(function (res) {
                                $scope.presellProduct = res.data;
                            }).error(function () {
                                alert("加载数据异常，请重新刷新...");
                            });
                    }
                }
            }).error(function () {

            });
	    $("#nineDiv").click(function () {
	        $(this).attr("class", "specialOffDoubleBtn specialOffDoubleOnBtn");
	        $("#ysDiv").attr("class", "specialOffDoubleBtn specialOffDoubleOffBtn");
	        $("#nineList").attr("style", "display:block");
	        $("#ysList").attr("style", "display:none");
	    });
	    $("#ysDiv").click(function () {
	        $(this).attr("class", "specialOffDoubleBtn specialOffDoubleOnBtn");
	        $("#nineDiv").attr("class", "specialOffDoubleBtn specialOffDoubleOffBtn");
	        console.log(123);
	        $("#nineList").attr("style", "display:none");
	        console.log(123);
	        $("#ysList").attr("style", "display:block");
	        console.log(123);
	    });
}])


// 商品内容
.controller('CommIntroCtrl', ['$scope','$stateParams','UrlUtil','$http','SystemParam','$ionicSlideBoxDelegate',
'Const','ShopCartHandle','FormatDate','BaseConfig','MD5','$state','LayerUtil','IsLogin','AddressServer','$rootScope','$timeout','$location','Statictis',
	function($scope,$stateParams,UrlUtil,$http,SystemParam,$ionicSlideBoxDelegate,Const,ShopCartHandle,FormatDate,
		BaseConfig,MD5,$state,LayerUtil,IsLogin,AddressServer,$rootScope,$timeout,$location,Statictis) {

		// 查看商家详情
		$scope.goShopDetail = function(sellerId){
			$state.go('tab.shop_list',{
				'sellerId':sellerId
			})
		}

		// sku ID
		$scope.skuId = $stateParams.skuId;

		// 购买
		$scope.buy = function(count){
			// 判断是否登录
			if(IsLogin.isGoLogin(null)){
				// 先加入购物车
				var isAddShopCart = ShopCartHandle.add({
					sku:$scope.skuId,
					isMessage:false,
					buy:1,
					count:typeof(count) == 'undefined'?1:count,
					productid:$scope.product.PId,
					shopid:$scope.product.SId,
					fn:function(cartId){
		                $state.go('tab.subOrder',{
		                	param:JSON.stringify({
		                		cartList:cartId,// 购物车ID
		                		addressId:0
		                	})
		                });
					}
				});
			}
		}
		// 添加购物车
		$scope.addShopCart = function(sku,count){
			ShopCartHandle.add({
				sku:sku,
				count:count,
				productid:$scope.product.PId,
				shopid:$scope.product.SId,
			});
		}

	     /*
	      * 默认单品页： 02 03 09
	     	上滑变化页：01  05 09
	     	右滑图文详情：02 05 09
		           弹窗：14
		           促销弹窗：13 15
		           加入购物车： 02 03 11 15
		           右滑评    价：
	     */


		// 历史数据
		$scope.module={
			one:false,// 1:上滑出现的标题
			two:true,// 2:初始加载的标题（商品、详情、评价）
			three:true,// 3:单品详情页
			four:false,// 4:售后保障
			five:false,// 5:商品详情页副标题
			six:false,// 6评价副标题
			seven:false,// 7有内容的评价
			eight:false,// 8无内容的评价
			nine:true,// 09'加入购物车'和购买【按钮】
			ten:false,// 10到货通知按钮
			eleven:false,// 11加入购物车选择sku弹窗
			thirteen:false,// 13促销弹窗
			fourteen:false,// 14右上角弹窗
			seventeen:false,// 优惠券弹窗
			fifteen:false,// 15 遮罩
			eighteen:false,// 地址弹窗
      nineteen:false// 分享弹窗
		}

		// 商品详情（详情、参数、售后保障）
		$scope.content = {
			detailOneIsHide:false,
			detailTwoIsHide:true,
			detailThreeIsHide:true,
		}

		// 切换商品详情tab
		var isLoadDetail = false;
		$scope.chooseContent = function(index){
			angular.forEach($scope.content,function(val,key){
				$scope.content[key] = true;
			})

			switch(index){
				case 0:
					$scope.content.detailOneIsHide = false;
					break;
				case 1:
					$scope.content.detailTwoIsHide = false;
					break;
				case 2:
					$scope.content.detailThreeIsHide = false;
					break;
			}


		}
	    // 标题切换显示模块
	    $scope.switchShowModule = function(index){
	    	angular.forEach($scope.module,function(val,key){
	    		$scope.module[key] = false;
	    	})

	    	switch(index){
	    		case 0:
		    		$scope.module.three = true;
		    		$scope.module.nine = true;
	    			break;

	    		case 1:
	    			$scope.module.five = true;
	    			$scope.module.nine = true;
	    			$scope.module.four = true;
	    			break;

	    		case 2:
	    			$scope.module.nine = true;
	    			$scope.module.seven = true;
	    			$scope.module.six = true;
	    			break;

	    	}

	    	$scope.module.two = true;
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

		var currentProvinceId = null;
		var currentCityId = null;

		// 页面显示的地址
		$scope.address={
			currentProvinceName:"北京",
			currentCityName:"北京市",
			currentCountyName:"东城区"
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
			currentProvinceId = this.item.id;
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
			$scope.county = AddressServer.getCountyForCityId(currentProvinceId,this.item.id);

			currentCityId = this.item.id;
		}

	    // 选择区县
	    $scope.chooseCounty = function(){
	    	// 当前选中的名字
	    	$scope.address.currentCountyName = this.item.name;

			// 控制当前选中样式
			angular.forEach($scope.county,function(item){
				item.click=false;
			})
			this.item.click = true;

			// 计算运费
			$scope.closeLayer();

			var params = "sku="+$scope.skuId+"&province="+currentProvinceId+"&city=" + currentCityId + '&method=get_product_sku_freight' + SystemParam.get();
			console.log("根据省份ID和城市ID计算运费:"+UrlUtil.http + "Product/get_product_sku_freight?" + params)
			$http.get(UrlUtil.http + "Product/get_product_sku_freight?" + params)
	        .success(function (res) {
	            if (res.code == 200) {
	            	$scope.freight = res.data == 0?"免运费":"¥"+res.data;
	            }
	        })
	    }

		// 计算默认运费(默认北京东城)
		var params = "sku="+$scope.skuId+"&province=1&city=24&method=get_product_sku_freight"+ SystemParam.get();

		console.log('计算运费:'+UrlUtil.http + "Product/get_product_sku_freight?" + params)
		$http.get(UrlUtil.http + "Product/get_product_sku_freight?" + params)
        .success(function (res) {
            if (res.code == 200) {
            	$scope.freight = res.data == 0?"免运费":"¥"+res.data;
            }
        })


		/*********************************		弹窗		start****************************************/

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

	    // 优惠券弹窗
	    $scope.youhui = function(){
			$scope.module.seventeen=true;
			$scope.module.fifteen=true;

		    // 关闭遮罩
		    $scope.closeLayer = function(){
		    	$scope.module.seventeen=false;
				$scope.module.fifteen=false;
		    }
	    }

	    // 促销弹窗
	    $scope.cuxiao = function(){
			$scope.module.thirteen=true;
			$scope.module.fifteen=true;

		    // 关闭遮罩
		    $scope.closeLayer = function(id){
				$scope.module.fifteen=false;
	    		$scope.module.fifteen=false;
		    }
	    }
	    
	    
	    
    	$scope.shareBtn = function(){
			$scope.module.nineteen=true;
			$scope.module.fifteen=true;

		    // 关闭遮罩
		    $scope.closeLayer = function(id){
				$scope.module.nineteen=false;
          		$scope.module.fifteen=false;
		    }
	    }
    	

	    // 请求购物车数量
        var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
        
    	// 分享测试
    	$scope.shareWechat = function(shareScene){
    		userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
			var mWebUrl = "http://m.seebong.com/#/tab/commIntro/"+$scope.skuId+"?UId="+(userInfo ? userInfo.id : "")+"&ShareTime="+FormatDate.getY_m_d_h_m_s();
			LayerUtil.load.loading(10);
			Wechat.share({
			    message: {
			        title: $scope.product.PName,
			        description: $scope.product.PName,
			        thumb: $scope.ossUrl+$scope.chooseSkuProductImg,
			        media: {
			            type: Wechat.Type.WEBPAGE,
			            webpageUrl: mWebUrl
			        }
			    },
			    scene: shareScene   // share to Timeline
			}, function () {
				layer.closeAll();
				LayerUtil.warning({
                    content:'分享成功',
                    time:1.5,
                    shade:true,
                    shadeClose:false
                })
			}, function (reason) {
				layer.closeAll();
				LayerUtil.error({
                    content:reason,
                    btn:'好'
				})
			});
			
    	}



		// sku弹窗
		$scope.chooseColorSpec = function(){
			$("div#commIntro-parameter").css('max-height',($(window).height()*0.4)+'px');

			$scope.module.eleven=true;
			$scope.module.fifteen=true;

		    // 关闭遮罩
		    $scope.closeLayer = function(id){
		    	$scope.module.eleven=false;
	    		$scope.module.fifteen=false;
		    }
		}


		/*********************************		弹窗		end	****************************************/

		// 修改单品页选择sku弹窗数量
		$scope.chooseSkuInfo = {
			count:1
		}
		$scope.shopCountHandle = function(num){
			if(num == 0){
				if($scope.chooseSkuInfo.count <= 1){
					return;
				}
				$scope.chooseSkuInfo.count--;
			}else{
				if($scope.chooseSkuInfo.count >= $scope.product.Stocks){
					return;
				}
 				$scope.chooseSkuInfo.count++;
			}
		}

    	// 动态选择规格，更新数据
    	$scope.chooseColorSKus=function(){
    		// 重置
    		angular.forEach($scope.rules,function(item){
    			angular.forEach(item.values,function(val){
    				val.btnNull = false;
    			})
    		})

    		angular.forEach(Pro_Rules,function(item){
    			if(item.ColorId == $scope.colorId && item.Stocks == 0){

    				angular.forEach($scope.rules,function(rule){

    					angular.forEach(rule.values,function(val){

    						if(val.RId == item.SpecId){
    							val.btnNull = true;
    						}

    					})

    				})

    			}
    		})

    		// 判断对应的规格
    		angular.forEach(Pro_Rules,function(item){
    			if(item.SpecId == $scope.specId && item.Stocks == 0){

    				angular.forEach($scope.rules,function(rule){

    					angular.forEach(rule.values,function(val){

    						if(val.RId == item.ColorId){
    							val.btnNull = true;
    						}

    					})

    				})

    			}
    		})

    	}

		// 请求sku详细数据
		var Pro_Rules = null,
			currentChooseColorIndex=0;
		function loadSkuDetail(skuId){
			layer.open({
                type:2,
                shadeClose:false,
                time:60
            })

			var sysParam = SystemParam.get();
			console.log('请求sku详细数据:' + UrlUtil.http +"Product/get_product_sku?sku=" + $scope.skuId + '&method=get_product_sku' + sysParam)
			$http.get(UrlUtil.http + "Product/get_product_sku?sku=" + skuId + '&method=get_product_sku' + sysParam)
	        .success(function (res) {
	        	layer.closeAll();

	            if (res.code == 200) {
	            	var data = res.data;

	            	// 商品信息
	            	$scope.product = data.ProductItem;

	            	// 替换店铺图标
	            	if($scope.product.SShopLogo){
	            		$scope.product.SShopLogo = $rootScope.ossUrl+'/ShopLogoImg/'+$scope.product.SShopLogo;
	            	}else{
						$scope.product.SShopLogo = 'img/noLog.jpg';
	            	}

	            	// 更新SKUID
	            	$scope.skuId = $scope.product.Id;

	            	// 选择sku页面的商品图
	            	$scope.chooseSkuProductImg = $scope.product.IPath.split('|')[currentChooseColorIndex];

	            	// 颜色排序数组
	            	$scope.colorSortArray = $scope.product.IColor.split('|');

	            	// 规格组合
	            	Pro_Rules = data.Pro_Rules;

	            	// 更新滑动框（例如，用带有ng-repeat的Angular，调整它里面的元素）。
	            	$ionicSlideBoxDelegate.update();

	            	// 解析sku
	            	$scope.rules = [];
	            	// 默认已选的规格
	            	$scope.color='';
	            	$scope.colorId='';
	            	$scope.spec='';
	            	$scope.specId='';
	            	var rTypes = [],
	            		rules = [];

	            	// 解析所有的key
	            	angular.forEach(data.Rules,function(rule){

	            		if(rTypes.indexOf(rule.RType) == -1){
	            			rTypes.push(rule.RType);
	            		}

	            		// 当前已选的sku颜色
	            		if(rule.RId == $scope.product.ColorId){
	            			$scope.color = rule.RDescribe;
	            			$scope.colorId = rule.RId;
	            		}

	            		// 当前已选的sku规格
	            		if(rule.RId == $scope.product.SpecId){
	            			$scope.spec = rule.RDescribe;
	            			$scope.specId = rule.RId;
	            		}

	            	})

	            	// 封装每个key对应的value数组
	            	angular.forEach(rTypes,function(type){
	            		var _data={
	            			describe:type,
	            			values:[]
	            		};

	            		angular.forEach(data.Rules,function(rule){
	            			if(rule.RType == type){
	            				_data.values.push({
	            					RId:rule.RId,
	            					RDescribe:rule.RDescribe
	            				})
	            			}
	            		})

	            		// 颜色排序
	            		if(type == '颜色'){
	            			var values = [];
	            			$.each($scope.colorSortArray, function(index) {
	            				$.each(_data.values, function(index2) {
	            					var item = _data.values[index2];
	            					if($scope.colorSortArray[index] == item.RDescribe){
	            						values.push({
			            					RId:item.RId,
			            					RDescribe:item.RDescribe
			            				})

	            						// 根据默认选中的颜色调取对应的图片
	            						if(item.RId == $scope.colorId){
	            							currentChooseColorIndex = index;
							            	// 选择sku页面的商品图
							            	$scope.chooseSkuProductImg = $scope.product.IPath.split('|')[currentChooseColorIndex];
	            						}

	            						return false;
	            					}
	            				});
	            			});



	            			_data.values = values;
	            		}
	            		rules.push(_data)
	            	})
	            	$scope.rules = rules;

			        // 查询当前登录用户是否已经收藏该商品
	            	if(userInfo){
				        var followProductParams = 'userId='+userInfo.id+'&pId=' +$scope.product.PId + '&method=get_user__is_follow_product' + SystemParam.get();

				        console.log('查询当前用户是否已经收藏该商品URL：'+UrlUtil.http + "User/get_user__is_follow_product?" + followProductParams )
					    $http.get(UrlUtil.http + "User/get_user__is_follow_product?" + followProductParams)
				        .success(function (res) {
				            if (res.code == 200) {
				                $scope.isFollowProduct = res.data == 0?false:true;
				            }
				        })

				        // 取消收藏该商品
				        $scope.unFollowProduct = function(){

	                    // 请求服务基本参数
	                    var ymdhm = FormatDate.getYmdhm(),
	                        pspre = BaseConfig.pspre;

				        	$http({
	                            method: 'POST',
	                            url: UrlUtil.http + "User/post_user_attention",
	                            data: {
	                                action: 'UnFollowProduct',
	                                key: $scope.product.PId,
	                                userId: userInfo.id,
	                                method: 'post_user_attention',
	                                timestamp: ymdhm,
	                                sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
	                                app_key: BaseConfig.app_key
	                            },
	                            transformRequest: function (data) {
	                            	console.log('取消收藏商品：'+UrlUtil.http + "User/post_user_attention?"+$.param(data))
	                                return $.param(data);
	                            },
	                            headers: {
	                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
	                            }
	                       }).success(function (res) {
	                       		if(res.code == 200){
		                       		$scope.isFollowProduct = !$scope.isFollowProduct;
	                       		}
	                       })
				        }
			    	}


			        // 收藏该商品
			        $scope.followProduct = function(){
			        	
			        	if(!IsLogin.isGoLogin(null)){
	                        return;
			        	}

	                    // 请求服务基本参数
	                    var ymdhm = FormatDate.getYmdhm(),
	                        pspre = BaseConfig.pspre;
	                        
			        	$http({
                            method: 'POST',
                            url: UrlUtil.http + "User/post_user_attention",
                            data: {
                                action: 'FollowProduct',
                                key: $scope.product.PId,
                                userId: userInfo.id,
                                "sku": $scope.skuId,
							  	"ip": returnCitySN["cip"],
							  	"source": "",
							  	"shopid": $scope.product.SId,
							  	"type": 2,
							  	
                                method: 'post_user_attention',
                                timestamp: ymdhm,
                                sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                                app_key: BaseConfig.app_key
                            },
                            transformRequest: function (data) {
                            	console.log('收藏该商品：'+UrlUtil.http + "User/post_user_attention?"+$.param(data))
                                return $.param(data);
                            },
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                            }
                       }).success(function (res) {
                       		if(res.code == 200){
	                       		$scope.isFollowProduct = !$scope.isFollowProduct;
                       		}
                       })
			        }

	            	// 判断库存
	            	$scope.chooseColorSKus();

	            	// 根据Sku获取相关促销
	            	var cuxiaoParams = "sku="+$scope.product.Id+"&sid="+$scope.product.SId + '&method=get_product_promotion_sku' + SystemParam.get();
	            	console.log("根据Sku获取相关促销："+UrlUtil.http + "Coupons/get_product_coupons_sku?" + cuxiaoParams)
	            	$http.get(UrlUtil.http + "Coupons/get_product_promotion_sku?" + cuxiaoParams)
			        .success(function (res) {
			            if (res.code == 200) {
			                $scope.cuxiaoArrays = res.data;
			            }
			        })

	            	// 根据Sku获取优惠券
	            	var youhuiquanParams = "sku="+$scope.product.Id+"&sid="+$scope.product.SId + '&method=get_product_coupons_sku' + SystemParam.get();
	            	console.log("根据Sku获取优惠券链接："+UrlUtil.http + "Coupons/get_product_coupons_sku?" + youhuiquanParams)
	            	$http.get(UrlUtil.http + "Coupons/get_product_coupons_sku?" + youhuiquanParams)
			        .success(function (res) {
			            if (res.code == 200) {
			                $scope.youhuiquanArrays = res.data;
			            }
			        });
			          //----------------推广统计代码,由于需求店铺编号参数，详情页的统计代码嵌入此处

	                console.log("-------------------推广代码开始------------------");
	                var url = $location.path();

	                var sku = url.substring(url.lastIndexOf("/") + 1, url.length);


	                var shopid = data.ProductItem.SId;
	                	var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
		    var userid = "0";
		    if (userInfo) {
		        userid = userInfo.id;
		    }

	                var channelid = "", channelurlid = "", activeid = "";
	                var statistic = JSON.parse(localStorage.getItem("statistic_storage"));

	                if (statistic) {
	                    channelid = statistic.channelid;
	                    channelurlid = statistic.channelurlid;
	                    activeid = statistic.activeid;
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
	                        second: "",
	                        three: "",
	                        visittime: Statictis.getTime(),
	                        source: window.document.referrer,
	                        activeid: activeid,
	                        channelurlid: channelurlid,
	                        type: 2,
	                        shopId: shopid

	                    },
	                    transformRequest: function (data) {

	                        console.log(data);
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
	            } else {
	                LayerUtil.error({
	                    content: res.data
	                });
	            }

				// 选择SKU
				$scope.chooseSku = function(type,index){
					currentChooseColorIndex = index;
					if(this.item.btnNull){
						return;
					}

					if(type == '颜色'){
						$scope.colorId = this.item.RId;
					}else{
						$scope.specId = this.item.RId;
					}

					// 进行颜色和规格重组
					$scope.chooseColorSKus();

					// 加载对应的sku信息
					angular.forEach(Pro_Rules,function(item){
						if(item.ColorId == $scope.colorId && item.SpecId == $scope.specId){
							if(item.Id == $scope.skuId){
								return false;
							}
							loadSkuDetail(item.Id);
							return false;
						}
					})
				}
				// 加载店铺评分信息
				var params = "sellerId=" +$scope.product.SId + '&method=get_shop_grade' + SystemParam.get();
				console.log('加载店铺评分信息:'+UrlUtil.http + "shop/get_shop_grade?" + params)
		        $http.get(UrlUtil.http + "shop/get_shop_grade?" + params)
		        .success(function (res) {
		            if (res.code == 200) {
		            	$scope.shopInfo = res.data;
		            }
		        })

	        })
		}
		// 加载默认的SKU数据
		loadSkuDetail($scope.skuId);


		// 领取优惠券
		$scope.lingquyouhuiquan = function(){

			if(!IsLogin.isGoLogin(null)){
				return;
			}
			var youhuiquanID = this.item.CouponsBatchID;// 优惠券ID

            // 请求服务基本参数
            var ymdhm = FormatDate.getYmdhm(),
                pspre = BaseConfig.pspre;

           $http({
                method: 'POST',
                url: UrlUtil.http + "Coupons/post_binding_coupons_userId",
                data: {
                    cid: youhuiquanID,
                    userId: userInfo.id,
                    method: 'post_binding_coupons_userId',
                    timestamp: ymdhm,
                    sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                    app_key: BaseConfig.app_key
                },
                transformRequest: function (data) {
                	console.log("领取优惠券请求地址："+UrlUtil.http + "Coupons/post_binding_coupons_userId?"+$.param(data))
                    return $.param(data);
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                }
           }).success(function (res) {
           		if(res.code == 200){
               		LayerUtil.warning({
	                    content:res.data,
	                    time:1.5,
	                    shade:true
               		})
           		}else{
           			LayerUtil.error({
	                    content:res.data,
	                    btn:'好'
	                })
           		}
           });
		}




		// 控制切换样式
	    $(".Comm").on("click", function () {
	      var _that = $(this).index();
	      $(".commIntro-i-red").stop(true).animate({left: (_that * 14)+32 + "%"})
	    });
/*    $("#commIntro-parameter").css('max-height',($(window).height()*0.6))*/
	}
])


  // 首页→专题页
  .controller('homeActivCtrl', ['$scope','$stateParams','UrlUtil','SystemParam','$http','$sce',
  'LayerUtil','$rootScope','$state','FormatDate','BaseConfig','MD5','Const','$ionicModal','CustomReg','IsLogin','$location',
    function($scope,$stateParams,UrlUtil,SystemParam,$http,$sce,LayerUtil,
    	$rootScope,$state,FormatDate,BaseConfig,MD5,Const,$ionicModal,CustomReg,IsLogin,$location) {
	LayerUtil.load.loading();

	var param = $stateParams.params,// 专题参数
		type = null,// 活动类型
		lotteryID = null,// 活动编号
		key = null,// 专题页编号
		userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));// 当前用户


	// 判断活动类型
	// 连接示例     #/tab/homeActiv/app04-choujiang-3
	if(param.indexOf("-")>-1){
		var arr = param.split('-');// 截取活动参数
		key = arr[0];// 专题页编号
		type = arr[1];// 活动类型

		if(type == 'choujiang'){
			lotteryID = arr[2];// 活动编号
		}
	}else{
		key = param;
	}

	var params = "key=" + key + '&method=get_about_id' + SystemParam.get();
	console.log("活动链接地址:"+UrlUtil.http + "Special/get_about_id?" + params)
	$http.get(UrlUtil.http + "Special/get_about_id?" + params)
    .success(function (res) {
    	layer.closeAll();
        if (res.code == 200) {
			var html = '<!DOCTYPE html>'
				+'<html lang="en">'
				+'<meta charset="UTF-8">'
				+'<title>Title</title>'
				+'<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">'
				+'<body>'
				+ res.data.SpecialContent
				+'</body>'
				+'</html>';

			// 渲染页面数据
			$scope.SpecialContent=$sce.trustAsHtml(html);

/*		   var ActiveJs=function() {
		   	var $img = $("#customer-homeactiv-img").find("img"),
		   		height = null,
		   		width = null;
		   	$.each($img, function() {
		   		height = $(this).css("height").replace("px","");
		   		width = $(this).css("width").replace("px","");
		   		$(this).parent().css({
		   			"height":height / 20 + "rem",
		   			"width":width / 750*100  + "%"
		   		})
		   	});
	      }
		   setTimeout(function(){
			ActiveJs();
		   },1000)*/


			// 判断是否抽奖活动
			if(type == 'choujiang'){
				// 注册抽奖点击事件
				choujiang();

				// 计算抽奖次数
				getLotteryNum();

				// 获取中奖名单
				getLotteryInfo();

				// 注册实物中奖回写联系人信息model页面
				registerModel();


			}

			function registerModel(){
				// create modal
                $ionicModal.fromTemplateUrl("views/home/homeActiv/lotteryModalHtml.html", {
                    scope: $scope,
                }).then(function (modal) {
                    $scope.modal = modal;
                })
			}

			// 获取中奖名单
			function getLotteryInfo(){
				// 加载获取名单
				var params = 'lotteryID=' + lotteryID + '&method=get_lottery_winrecord' + SystemParam.get(),
					formatPhone = null;
                console.log('加载获取名单：'+UrlUtil.http + "Lottery/get_lottery_winrecord?" + params)
				$http.get(UrlUtil.http + "Lottery/get_lottery_winrecord?" + params)
                .success(function (res) {
                	if(res.code == 200){
                		var phoneReg = CustomReg.getPhoneReg();
                		var marquee = '<marquee direction="up" height="250" scrollamount="2" style="text-align:center" ><ul>';
                		$.each(res.data, function() {
                			if(phoneReg.test(this.UserName)){
                				formatPhone = this.UserName.substring(0,3)+"****"+this.UserName.substring(7,11);
                				marquee+="<li>"+formatPhone+"&nbsp;&nbsp;&nbsp;抽中了"+this.PrizeName+"</li>";
                			}else{
                				marquee+="<li>"+this.UserName+"&nbsp;&nbsp;&nbsp;抽中了"+this.PrizeName+"</li>";
                			}

                		});
                		marquee += "</ul></marquee>";
                		$("div#showLotteryInfoDIV").html(marquee);
                	}

                })
			}
			setTimeout(function(){

				$("[type-coupons]").click(function(){
				 if(!IsLogin.isGoLogin(null)){
                    return;
		       }
				 var id=$(this).attr("type-coupons");
	    		var ymdhm = FormatDate.getYmdhm(),
                pspre = BaseConfig.pspre;
				$http({
                    method: 'POST',
                    url: UrlUtil.http + "Coupons/post_binding_coupons_userId",
                    data: {
                    	cid :id,
                    	userid : userInfo.id,
                    	username: userInfo.account,
                        method: 'post_binding_coupons_userId',
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
                	console.log("-------------------------------返回抽奖结果 START-------------------------------")
                	console.log(res);
                	if(res.code==200){
                		LayerUtil.warning({
						                    content:"优惠券领取成功！",
						                    time:2,
						                    shade:true,
						                    shadeClose:true
						                })

                	}
                	else{
                		LayerUtil.warning({
						                    content:res.data,
						                    time:2,
						                    shade:true,
						                    shadeClose:true
						                })

                	}
                }).error(function() {
					LayerUtil.error();
				})

			});
			},1000);


			// 计算抽奖次数
			function getLotteryNum(){
				if(userInfo){

                    // 请求服务基本参数
                    var ymdhm = FormatDate.getYmdhm(),
                        pspre = BaseConfig.pspre;
					$http({
                        method: 'POST',
                        url: UrlUtil.http + "Lottery/post_lotterycount",
                        data: {
                        	lotteryID : lotteryID,
                        	userID : userInfo.id,
                            method: 'post_lotterycount',
                            timestamp: ymdhm,
                            sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                            app_key: BaseConfig.app_key
                        },
                        transformRequest: function (data) {
                        	console.log('计算抽奖次数：'+UrlUtil.http + "Lottery/post_lotterycount?"+$.param(data));
                            return $.param(data);
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                        }
                    }).success(function (res) {
                    	console.log('--------------------------------请求抽奖次数结果--------------------------------')
                    	console.log(res)
                    	console.log('--------------------------------请求抽奖次数结果--------------------------------')

                    	if(res.code == 200){
                    		$("#lotteryNum").text(res.data)
                    	}else{
                    		LayerUtil.warning({
			                    content:res.data,
			                    time:2,
			                    shade:true,
			                    shadeClose:true
			                });
			                $("#lotteryNum").text(3)
                    	}
                    }).error(function() {
                		LayerUtil.warning({
		                    content:'发生异常,请稍后操作!',
		                    time:2,
		                    shade:true,
		                    shadeClose:true
		                });
                		$("#lotteryNum").text(3)
                    })
				}
			}
			// 初始化抽奖
			function choujiang(){
				// 加载奖品
				var params = 'lotteryID=' + lotteryID + '&method=get_lottery_prize' + SystemParam.get();
				var indexArr = null,
					lotterys = '';

                console.log('加载奖品：'+UrlUtil.http + "Lottery/get_lottery_prize?" + params)
				$http.get(UrlUtil.http + "Lottery/get_lottery_prize?" + params)
                .success(function (res) {
                	indexArr = [0,1,2,7,8,3,6,5,4];
                	$.each(indexArr, function(i,location) {
                		if(location == 8){
            				lotterys += '<div class="home-raffle-main-inner-one home-raffle-main-btn" id="clickStart">'
										+'点我<br>抽奖'
										+'</div>';
            			}
                		$.each(res.data, function(index,lottery) {
                			if(index == location){
                				lotterys += '<div class="home-raffle-main-inner-one" data-id="'+lottery.ID+'"'
                							+'prizeType="'+lottery.PrizeType+'" index="'+location+'">'
											+'<img src="'+UrlUtil.oss+lottery.ImagePath+'">'
											+'<div class="home-raffle-mengceng" style="display: none;">'
											+'<span>'+lottery.Name+'</span>'
											+'</div>'
											+'</div>';
                			}
                		});

                	});

                	$("div#parentDiv").html(lotterys);


					var prizeArr = $("div#parentDiv").children(":not(#clickStart)"),
						time = 50,
						index = 0,
						orderArr = [],
						obji = null,
						objj = null,
						temp = null,
						endIndex = null,
						isCheck = false,
						criticalNum = 500,// 减速临界值(当500毫秒转到下一个元素时，即进行结果的判断)
						responseData = null;

					// 数组排序
					for(var i=0;i<prizeArr.length;i++){
						obji = $(prizeArr[i]);
						for(var j=i+1;j<prizeArr.length;j++){
							objj = $(prizeArr[j]);
							if((obji.attr("index")*1) > (objj.attr("index")*1)){
								temp = prizeArr[i];
								prizeArr[i] = prizeArr[j];
								prizeArr[j] = temp;
								// 更新替换后的值
								obji = $(prizeArr[i]);
							}
						}
					}

					// 注册点击事件
					function registerClick(){
						$('div#clickStart').on("click",function(){
					        if(!IsLogin.isGoLogin(null)){
			                    return;
					        }

					        if(!($("#lotteryNum").text()*1 > 0)){
					        	LayerUtil.error({
				                    content:'您当前无可抽奖次数!',
				                    btn:'好',
				                    yes:null
					        	})
					        	return;
					        }


							// 防止重复点击
							$("div#clickStart").off("click");

							// 设置初始默认值
							time = 50;
							isCheck = false;

							timeout();

		                    // 请求服务基本参数
		                    var ymdhm = FormatDate.getYmdhm(),
		                        pspre = BaseConfig.pspre;
								$http({
			                        method: 'POST',
			                        url: UrlUtil.http + "Lottery/post_lotterymethod",
			                        data: {
			                        	lotteryid : lotteryID,
			                        	userid : userInfo.id,
			                        	username: userInfo.account,
			                            method: 'post_lotterymethod',
			                            timestamp: ymdhm,
			                            sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
			                            app_key: BaseConfig.app_key
			                        },
			                        transformRequest: function (data) {
			                        	console.log('抽奖：'+UrlUtil.http + "Lottery/post_lotterymethod?"+$.param(data));
			                            return $.param(data);
			                        },
			                        headers: {
			                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
			                        }
			                    }).success(function (res) {
			                    	console.log("-------------------------------返回抽奖结果 START-------------------------------")
			                    	console.log(res)
			                    	console.log("-------------------------------返回抽奖结果 END-------------------------------")
			                    	responseData = res.data;

			                    	// 中奖
			                    	if(responseData.Code == 1){
			                    		endIndex = $("div[data-id="+responseData.WinPrize.ID+"]:eq(0)").attr("index");
			                    	}else{
			                    		endIndex = $("div[prizeType=3]:eq(0)").attr("index"); // "+parseInt(Math.random()*3)+"
			                    	}

			                    	// 削减抽奖次数
			                    	$("#lotteryNum").text($("#lotteryNum").text()*1-1);

									// 此段代码放到ajax成功回调后，计算中奖下标并设置 endIndex
									var inter = setInterval(function(){
										time += 100;
										if(time >= criticalNum){
											clearInterval(inter);
										}
									},1000)
			                    }).error(function() {
									LayerUtil.error();
									endIndex = $("div[prizeType=3]:eq("+parseInt(Math.random()*3)+")").attr("index");
									// 此段代码放到ajax成功回调后，计算中奖下标并设置 endIndex
									var inter = setInterval(function(){
										time += 100;
										if(time >= criticalNum){
											clearInterval(inter);
										}
									},1000)
								})

						})
					}
					registerClick();

					function timeout(){
						var timeFn = setTimeout(function(){
							$.each(prizeArr, function(index) {
								$(prizeArr[index]).children("div").hide();
							});

							$(prizeArr[index]).children("div").show();

							if(isCheck && index == endIndex){
								$(prizeArr[index]).children("div").show();
								clearTimeout(timeFn);
								registerClick();

								// 未中奖，或者中奖非实物
								if(responseData.Code == 0 || (responseData.Code == 1 && responseData.WinPrize.PrizeType != "0")){
									// 抽奖结果提示
									setTimeout(function(){
										LayerUtil.warning({
						                    content:responseData.Message,
						                    time:2,
						                    shade:true,
						                    shadeClose:true
						                })
									},100)
								}
								// 中奖且是实物
								else if(responseData.Code == 1 && responseData.WinPrize.PrizeType == "0"){
	                    			// 中奖编号
	                    			$scope.WinRecordID = responseData.WinRecordID;
	                    			// 联系人信息
	                    			$scope.modal.show();
									// 抽奖结果提示
									setTimeout(function(){
										LayerUtil.warning({
						                    content:'恭喜您中奖,请填写收货人信息!',
						                    time:2,
						                    shade:true,
						                    shadeClose:true
						                })
									},100)
	                    		}else{
									LayerUtil.warning({
					                    content:responseData.Message,
					                    time:2,
					                    shade:true,
					                    shadeClose:true
					                })

	                    		}

	                    		return;
							}

							index++;

							if(index > prizeArr.length-1){
								index = 0;
							}

							if(time < criticalNum){
								timeout();
							}
							else{
								var selectIndex = 0;
								$.each(prizeArr, function(index) {
									if($(this).children("div").css('display') == 'block'){
										selectIndex = index;
									}
								});
								// 如果转盘不在中奖的位置，接着进行延迟转圈
								if(selectIndex != endIndex){
									time = criticalNum;
									timeout();
									isCheck = true;
								}else{
									clearTimeout(timeFn);
									registerClick();

									// 未中奖，或者中奖非实物
									if(responseData.Code == 0 || (responseData.Code == 1 && responseData.WinPrize.PrizeType != "0")){
										// 抽奖结果提示
										setTimeout(function(){
											LayerUtil.warning({
							                    content:responseData.Message,
							                    time:2,
							                    shade:true,
							                    shadeClose:true
							                })
										},100)
									}
									// 中奖且是实物
									else if(responseData.Code == 1 && responseData.WinPrize.PrizeType == "0"){
		                    			// 中奖编号
		                    			$scope.WinRecordID = responseData.WinRecordID;
		                    			// 联系人信息
		                    			$scope.modal.show();
										// 抽奖结果提示
										setTimeout(function(){
											LayerUtil.warning({
							                    content:'恭喜您中奖,请填写收货人信息!',
							                    time:2,
							                    shade:true,
							                    shadeClose:true
							                })
										},100)
		                    		}else{
										LayerUtil.warning({
						                    content:responseData.Message,
						                    time:2,
						                    shade:true,
						                    shadeClose:true
						                })

		                    		}
								}
							}
						},time)
					}
                })

			}

        }
    })

	// 返回顶部
	$("ion-content").on("click",'#goTop',function(){
		$rootScope.$rootScrollTop();
	})

	// 返回首页
	$("ion-content").on("click",'#goHome',function(){
		$state.go('tab.home')
	})
      //水壶 2016年11月9日09:50:59
      setTimeout(function(){
        $('#fushihuwai').click(function(){
          $('#fushihuwaiWarp').css('display','block')
          $('#xiewapeishiWarp').css('display','none')
          $('#tubudengshanWarp').css('display','none')
          $('#qixingziyingWarp').css('display','none')
          $('#yeyinglucanWarp').css('display','none')
        })
        $('#xiewapeishi').click(function(){
          $('#fushihuwaiWarp').css('display','none')
          $('#xiewapeishiWarp').css('display','inline')
          $('#tubudengshanWarp').css('display','none')
          $('#qixingziyingWarp').css('display','none')
          $('#yeyinglucanWarp').css('display','none')
        })
        $('#tubudengshan').click(function(){
          $('#fushihuwaiWarp').css('display','none')
          $('#xiewapeishiWarp').css('display','none')
          $('#tubudengshanWarp').css('display','block')
          $('#qixingziyingWarp').css('display','none')
          $('#yeyinglucanWarp').css('display','none')
        })
        $('#qixingziying').click(function(){
          $('#fushihuwaiWarp').css('display','none')
          $('#xiewapeishiWarp').css('display','none')
          $('#tubudengshanWarp').css('display','none')
          $('#qixingziyingWarp').css('display','block')
          $('#yeyinglucanWarp').css('display','none')
        })
        $('#yeyinglucan').click(function(){
          $('#fushihuwaiWarp').css('display','none')
          $('#xiewapeishiWarp').css('display','none')
          $('#tubudengshanWarp').css('display','none')
          $('#qixingziyingWarp').css('display','none')
          $('#yeyinglucanWarp').css('display','block')
        })
      },3000)
  }])

  // 抽奖回写收货人信息页面
  .controller('lotteryModalCtrl',['$scope','CustomReg','FormatDate','BaseConfig','MD5','LayerUtil','$http','UrlUtil',
  function($scope,CustomReg,FormatDate,BaseConfig,MD5,LayerUtil,$http,UrlUtil){
  		$scope.newUser = {
  			contacts:"",
  			phone:"",
  			address:""
  		};

  		// 是否可以创建提交表单
  		$scope.isCreateUser = function(){
  			var flag = true;
  			angular.forEach($scope.newUser,function(value,key){
  				if($scope.newUser[key].toString().trim() == ""){
  					flag = false;
  				}
  			})
  			return flag;
  		}

  		$scope.closeLotteryModal = function(){
		  var layerIndex = layer.open({
		    content: '是否确定放弃领取该奖品？'
		    ,btn: ['放弃', '取消']
		    ,yes: function(index){
		    	$scope.modal.hide();
		    	layer.close(layerIndex)
		    }
		  });
  		}

  		// 创建收货人信息
        $scope.createContact = function () {
  			if(!CustomReg.phone($scope.newUser.phone)){
				LayerUtil.warning({
					content:'请输入正确的手机号码',
                    time:1.5,
                    shade:true,
                    shadeClose:true,
				})
  				return;
  			}

        	LayerUtil.load.loading();
        	// 请求服务基本参数
            var ymdhm = FormatDate.getYmdhm(),
                pspre = BaseConfig.pspre;
				$http({
                    method: 'POST',
                    url: UrlUtil.http + "Lottery/post_update_winrecord",
                    data: {
                    	winrecordid : $scope.WinRecordID,
                    	phone : $scope.newUser.phone,
                    	address: $scope.newUser.address,
                    	contacts:$scope.newUser.contacts,
                        method: 'post_update_winrecord',
                        timestamp: ymdhm,
                        sign: (MD5.getMD5Val(pspre + ymdhm)).toUpperCase(),
                        app_key: BaseConfig.app_key
                    },
                    transformRequest: function (data) {
                    	console.log('实物中奖回写联系人信息：'+UrlUtil.http + "Lottery/post_update_winrecord?"+$.param(data));
                        return $.param(data);
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    }
                }).success(function (res) {
                	console.log('--------------------实物中奖回写联系人信息--------------------')
                	console.log(res);
                	console.log('--------------------实物中奖回写联系人信息--------------------')

                	layer.closeAll();
                	if(res.code == 200){
	                	LayerUtil.warning({
		                    content:'填写成功',
		                    time:2,
		                    shade:true,
		                    shadeClose:false,
		                    success: function (elem) {
			                	setTimeout(function(){
			                		$scope.modal.hide();
			                	},1500)
		                	}
		                })
                	}else{
	                	LayerUtil.error({
		                    content:res.data
		                })
                	}


                }).error(function() {
                	layer.closeAll();
                    LayerUtil.error({
                        content: '请求异常'
                    })
                })
        }
  }])

  // 首页→活动预告页
  .controller('foreshowActivityCtrl', ['$scope','$stateParams','UrlUtil','SystemParam','$http','$sce',
  'LayerUtil','$rootScope','$state',
    function($scope,$stateParams,UrlUtil,SystemParam,$http,$sce,LayerUtil,$rootScope,$state) {
	LayerUtil.load.loading();

	var params = "key=" + $stateParams.id+ '&method=get_about_id' + SystemParam.get();

	console.log("活动链接地址:"+UrlUtil.http + "Special/get_about_id?" + params)
	$http.get(UrlUtil.http + "Special/get_about_id?" + params)
    .success(function (res) {
    	layer.closeAll();
        if (res.code == 200) {
			var html = '<!DOCTYPE html>'
				+'<html lang="en">'
				+'<meta charset="UTF-8">'
				+'<title>Title</title>'
				+'<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">'
				+'<body>'
				+res.data.SpecialContent
				+'</body>'
				+'</html>';

			$scope.SpecialContent=$sce.trustAsHtml(html);
        }
    })

	// 返回顶部
	$("ion-content").on("click",'#goTop',function(){
		$rootScope.$rootScrollTop();
	})

	// 返回首页
	$("ion-content").on("click",'#goHome',function(){
		$state.go('tab.home')
	})

  }])

  //  首页→站外链接
  .controller('dynamicCtrl', ['$scope','$stateParams',
	  function($scope,$stateParams) {
	  	$('div#iframe').css('top',$('ion-header-bar').height()+10+'px');
	  	var iframe = '<iframe src="'+$stateParams.url+'" style="width: 100%;height: 100%;"></iframe>';
	  	$('div#iframe').html(iframe);
  }])
  
  // 引导页
  .controller('GuideCtrl',function($scope,$ionicSlideBoxDelegate,$state,Const){
		var isLoad = localStorage.getItem(Const.GUIDE_ID);
		
		if(isLoad){
			$state.go("tab.home");
		}else{
			$scope.isLoadGuide = true;
			$scope.slideHasChanged = function(index){
				if(index == 3){
					$ionicSlideBoxDelegate.$getByHandle('guideSlideBox').stop();
				}
			}
			
			$scope.guideClick = function(){
				if($ionicSlideBoxDelegate.$getByHandle('guideSlideBox').currentIndex() == 3){
					$state.go("tab.home");
				}
			}
			
			localStorage.setItem(Const.GUIDE_ID,1);
		}
  	
  	
	});
