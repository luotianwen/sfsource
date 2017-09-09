angular.module("brand_street.controller", [])
    .controller('Brand_streetCtrl', ['$scope', '$ionicModal', '$stateParams', 'SystemParam', 'UrlUtil', 'LayerUtil', '$http', '$timeout', 'FormatDate', 'BaseConfig', 'MD5','Const','$rootScope','ShopCartHandle',
    '$state','$anchorScroll','$location','streetBrand','Statictis','$location',
		function($scope, $ionicModal, $stateParams, SystemParam, UrlUtil, LayerUtil, $http, $timeout, FormatDate, BaseConfig, MD5, Const, $rootScope,ShopCartHandle,$state,$anchorScroll,$location,streetBrand,Statictis,$location) {

      $(".brand_street_ul_two").css("height",$(window).height()+"px");
      var bodyHeight=$(window).height()
      if(bodyHeight<645){
        var elementHeight=(645-bodyHeight)
        $(".brand_street_ul_two").css("height",bodyHeight-152+"px");
      }else{
        $(".brand_street_ul_two li").css("height",(bodyHeight-150)/26+"px");
      }
        	//锚点
           $(document).ready(function(){
           	window.setTimeout(function(){
           		$(".anchor").each(function(index){
                $(this).attr({"id":"mo"+index,name:"mo"+index});
               })
           	},1000)
           })
           //定位跳转
            $scope.gotoTop = function (index) {
        		$location.hash(index);
        		$anchorScroll();
      		};

      		//获取缓存数据
      		$scope.shopName = streetBrand.getFirsts();
      		console.log($scope.shopName)

        	//下拉框影藏or显示
     /*   	$scope.content="";
        	$scope.click=function(){
        		if($scope.content != ""){
//      			return true
//      		}else{
//      			return false
        		}
        	};*/


        	// 搜索页面MODAL
			$ionicModal.fromTemplateUrl("views/brand_street/brand_SearchGood.html", {
				scope: $scope
			}).then(function (modal) {
				$scope.modal = modal;

			})

			// 展示搜索页面
			$scope.showSearchModal = function () {
				$scope.modal.show();
				$(document).ready(function(){
					$timeout(function () {
					$('#in_search_input').focus();
				},600)
				})

			}
   			var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
		    var userid = "0";
		    if (userInfo) {
		        userid = userInfo.id;
		    }

			// 根据关键词搜索
			$scope.searchKeyword = '';
			$scope.getKeywordSearchData = function (item) {
				console.log(item);
				$("input#in_search_input").val(this.items.BrandName);
				$scope.modal.hide();
				$scope.searchKeyword = this.items.BrandName;
				console.log($scope.searchKeyword)
				Statictis.SearchStatictis(item, userid, Statictis.getTime());
				/*$scope.keyword=this.items.BrandName;*/
				//search(null,1,0);
				$state.go('tab.shop_inner',{
        			"id":this.items.Id
        		})
			}

			$(document).keypress(function(e) {
		    // 回车键事件
		       if(e.which == 13) {
				  if ($location.path().indexOf('/brand_street') > -1) {
		                $scope.modal.hide();
		                $scope.searchKeyword = $("input#in_search_input").val();
		                Statictis.SearchStatictis($("input#in_search_input").val(), userid, Statictis.getTime());
		                //search(null,1,0);
		            }
		       }
		   });

        	$scope.skip=function(){
        		$state.go('tab.shop_inner',{
        			"id":this.items.Id
        		})
        	}

        	//请求所有店铺信息
            var params ='&brandName='+'&method=Brand/get_barnd_all' + SystemParam.get();
            if(!$scope.shopName || $scope.shopName.length==0){
            	console.log('请求所有店铺信息URL:'+UrlUtil.http + "Brand/get_barnd_all?" + params)

            	$http.get(UrlUtil.http + "Brand/get_barnd_all?" + params)
                .success(function (res) {
                    if (res.code == 200) {
                        	var streetbrand = {
								time: new Date().getTime(),
								data: res.data
							};

                        	// 加入缓存
							localStorage.setItem(Const.STREETBRAND, JSON.stringify(streetbrand));
							// 加入公共服务类
							streetBrand.setCategorys(streetbrand);
							$scope.shopName = streetBrand.getFirsts();
                    } else {
                        LayerUtil.error({
                            content: res.data
                        });
                    }
            	}).error(function() {
						layer.closeAll();
						LayerUtil.error();
					})
            }

    }])

    // 搜索页面
	.controller('bradn_SearchModelCtrl', ['$scope','Const','UrlUtil','$http','LayerUtil','SystemParam','ArrayRepet',
		function ($scope,Const,UrlUtil,$http,LayerUtil,SystemParam,ArrayRepet) {
		var _history_search = JSON.parse(localStorage.getItem(Const.HISTORY_SEARCH));

		// 历史搜索数据
		$scope.showModule = {
			historySearch:false,
			shop:false
		}

		// 关闭搜索页面MODAL
		$scope.cancel = function () {
			$('input#classify_search_key_word').val($scope.keyword);
			$scope.modal.hide();
		}

		// 搜索建议
		$scope.searchData=[];
		$scope.keyword = '';
		$scope.$watch('keyword', function (newVal, oldVal) {
			console.log($scope.keyword)
			if(newVal == ""){
				$scope.searchData=[];
				return;
			}
			var param = SystemParam.get();
			console.log('搜索建议：'+UrlUtil.http + "Brand/get_barnd_all?&brandName=" + newVal + '&method=get_barnd_all' + param)

			$http.get(UrlUtil.http + "Brand/get_barnd_all?&brandName=" + newVal + '&method=get_barnd_all' + param)
			.success(function(res) {
				$scope.searchData = ArrayRepet.repeat(res.data);
			}).error(function() {
				LayerUtil.error();
			})
		})

	}])

