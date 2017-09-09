angular.module("category.controller", [])
.controller('EquipmentCtrl', ['$scope','$http','LayerUtil','UrlUtil','Const','Categorys','SystemParam','$state',
		function($scope,$http,LayerUtil,UrlUtil,Const,Categorys,SystemParam,$state) {

			$('div.grade-eject').css('top',$('ion-header-bar').height()+10+'px')
			
			// 商城服务器图片地址
			$scope.aliOssUrl = UrlUtil.oss;
			
			// 加载缓存获取数据
			$scope.category1 = Categorys.getCategorys();
			$scope.category2 = [];
			$scope.category3 = [];
			if (!$scope.category1 || $scope.category1.length == 0) {
				// 加载遮罩
				LayerUtil.load.loading();
				var params = 'method=get_category_all' + SystemParam.get();
				
            	console.log('获取分类信息:'+UrlUtil.http + "Category/get_category_all?" + params)
				$http.get(UrlUtil.http + "Category/get_category_all?" + params)
					.success(function(res) {
						layer.closeAll();
						if (res.code == 200) {
							
							// 一级分类
		                	var array = [];
		                	angular.forEach(res.data,function(item,index){
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
							
							var categorys = {
								time: new Date().getTime(),
								data: array
							};
							
							// 加入缓存
							localStorage.setItem(Const.CATEGORYS, JSON.stringify(categorys));

							// 加入公共服务类
							Categorys.setCategorys(categorys);
							$scope.category1 = categorys;
							$scope.category2 = categorys.data[0].Childrens;
							$scope.oneImage = categorys.data[0].Image;
						} else {
							LayerUtil.error({
								content: res.data
							})
						}
					}).error(function() {
						layer.closeAll();
						LayerUtil.error();
					})
			}else{
				$scope.category2 = $scope.category1.data[0].Childrens;
				$scope.oneImage = $scope.category1.data[0].Image;
			}

			// 根据不同机型对应的头部高度设置不同显示方式
			$('ion-content>div.grade-eject').css('top',$('ion-header-bar').css('height'));

			// 二级菜单隐藏显示控制
			$scope.two_left = false;

			// 三级菜单隐藏显示控制
			$scope.three_left = false;

			// 一级菜单点击函数
			$scope.oneCategory = function() {

				// 清空一级菜单历史选中的背景
				angular.forEach($scope.category1.data, function(item) {
					item.background = false;
				})

				// 清空二级菜单历史选中的背景
				/*angular.forEach($scope.category2, function(item) {
					item.background = false;
				})*/

				// 清空三级菜单历史选中的背景
				/*angular.forEach($scope.category3, function(item) {
					item.background = false;
				})*/

				// 高亮显示选中的菜单
				this.item.background = true;

				// 渲染二级菜单数据
				$scope.category2 = this.item.Childrens;
				
				// 一级分类的图片
				$scope.oneImage = this.item.Image;
				
				$('ul#childrenShowView').animate({ scrollTop: 0 }, 200);

				// 显示二级菜单
				/*$scope.two_left = true;
				$scope.three_left = false;*/
			}

			// 二级菜单点击函数
			/*$scope.twoCategory = function() {

				// 清空二级菜单历史选中的背景
				angular.forEach($scope.category2, function(item) {
					item.background = false;
				})

				// 清空三级菜单历史选中的背景
				angular.forEach($scope.category3, function(item) {
					item.background = false;
				})

				// 高亮显示选中的菜单
				this.item.background = true;
				
				if(this.item.type && this.item.type == 'all'){
					var params={
						itemId : this.item.Id,
						be : 'equipment',
						keyword:''
					}
	
					$state.go('tab.classify', {
						params : JSON.stringify(params)
					});
				}else{
					// 渲染三级菜单数据
					$scope.category3 = Categorys.getChildrens(this.item.Id, 3);
	
					// 显示三级菜单
					$scope.three_left = true;
				}
			}*/

			// 三级菜单点击函数
			$scope.threeCategory = function() {

				// 清空三级菜单历史选中的背景
				/*angular.forEach($scope.category3, function(item) {
					item.background = false;
				})*/

				// 高亮显示选中的菜单
				//this.item.background = true;
				var params={
					itemId : this.item.id,
					be : 'equipment',
					keyword:''
				}

				$state.go('tab.classify', {
					params : JSON.stringify(params)
				});
			}
		}
	])
	.controller('ClassifyCtrl', ['$scope','$ionicModal','$stateParams','SystemParam','UrlUtil','LayerUtil',
	'$http','$timeout','FormatDate','BaseConfig','MD5','Const','$rootScope','ShopCartHandle','SearchHistory','ArrayRepet','$location','Statictis',
		function($scope,$ionicModal,$stateParams,SystemParam,UrlUtil,LayerUtil,$http,$timeout,FormatDate,
			BaseConfig,MD5,Const,$rootScope,ShopCartHandle,SearchHistory,ArrayRepet,$location,Statictis) {
			
			var userInfo = JSON.parse(localStorage.getItem(Const.USER_INFO));
		    var userid = "0";
		    if (userInfo) {
		        userid = userInfo.id;
		    }
			
			// 控制筛选页面拉动影响到数据搜索页面的滚动效果
			$scope.scrollCustom = true;
			
			// 向上滑动隐藏头部和筛选页面
			$scope.onDragUp = function() {
				// 向上滑动，打开上拉加载
				$scope.isfiniteShow = true;
				if($scope.scrollCustom){
					$scope.headerSlideUp = true;
				}
			}

			// 向下滑动展示头部以及筛选页面
			$scope.onDragDown = function() {
				$scope.headerSlideUp = false;
			}

			var stateParams = JSON.parse($stateParams.params),
				categoryId = stateParams.itemId, // 分类ID
				be_form = stateParams.be,// 标识来自于不同的controller
				sort = 0, // 默认按照综合排序
				stateParamsKeyword = stateParams.keyword,// 搜索关键词
				loadSku = false;// 标识是否已经加载筛选条件
				
			// 默认隐藏搜索页面
			$scope.hideSearchView = true;

			// brand list
			$scope.brands = [];

			// sku list
			$scope.propertyLookup = [];

			// 当前页
			var pageNow = 0,
				pageCount = 1;

			// 加载筛选页面
			$scope.filterLeft = false;
			$scope.filter = function() {
				$scope.filterRight = false;
				$scope.filterLeft = true;
				$scope.searchBackdrop = true;
				// 禁止背景滚动监听
				$scope.scrollCustom = false;
				
				if(!loadSku){
					loadSku = true;
					var params = '?sort=0'
					if(categoryId){
						params += '&c='+categoryId;
					}else if(stateParamsKeyword){
						params += '&keyword='+stateParamsKeyword;
					}
					$http.get(UrlUtil.solrUrl + 'search/p' + params)
						.success(function(res) {
							$scope.brands = res.Brands;
							$scope.propertyLookup = res.PropertyLookup;
						}).error(function() {
							LayerUtil.error();
					})
				}
			}

			// 关闭筛选页面
			$scope.filterRight = false;
			$scope.closeFilter = function() {
				// 开启背景滚动监听
				$scope.scrollCustom = true;

				search(null, pageNow, sort);
				// 关闭筛选
				$scope.filterRight = true;
				$scope.filterLeft = false;
				$timeout(function() {
					$scope.searchBackdrop = false;
				}, 400)
			}

			// 向右滑动隐藏筛选条件
			$scope.onDragRight = function () {
				$scope.filterRight = true;
				$scope.filterLeft = false;
				$timeout(function() {
					$scope.searchBackdrop = false;
				}, 400)
			}

			// 重置筛选条件
			$scope.reset = function() {
				angular.forEach($scope.brands, function(item) {
					item.choose = false;
				})

				// 循环选中的SKU
				angular.forEach($scope.propertyLookup, function(items) {
					angular.forEach(items, function(item) {
						item.choose = false;
					})
				})
					//search();
			}

			// create modal
			//$ionicModal.fromTemplateUrl("views/category/screen/screen.html", {
			//    scope: $scope,
			//}).then(function (modal) {
			//    $scope.screenModal = modal;
			//})

			// load data
			$scope.productData = [];
			var paraCache = '',
				paraPageCache = '',
				paraSortCache,
				keywordCache = '';

			// 排序操作
			$scope.sortArray = [{
				sort: 0,
				script: '综合',
				fontRed: true
			}, {
				sort: 1,
				script: '销量'
			}, {
				sort: 2,
				script: '价格',
				iconSort: true,
				asc: true,
				isInit: true
			}]

			// 排序操作
			$scope.sortHandle = function(num) {
				sort = num;
				// 重置别的属性样式
				angular.forEach($scope.sortArray, function(item) {
						item.fontRed = false;
					})
					// 价格排序
				if (num == 2) {
					// 判断是否初始化
					if (!this.item.isInit) {
						this.item.asc = !this.item.asc;
						if (!this.item.asc) {
							sort = 3;
						}
					}
					this.item.isInit = false;
				} else {
					$scope.sortArray[2].isInit = true;
					$scope.sortArray[2].asc = true;
				}
				// 高亮
				this.item.fontRed = true;
				search(null, 1, sort);
			}

			$scope.search = {
				keyword : stateParamsKeyword
			};
			// 查询函数，参数为1：回调函数；2：查询的页数;3:排序(0:综合；1：销量；2：价格从低到高；3：价格从高到低)
			var search = function(fn, page, sort) {
				if (angular.isFunction(fn)) {
					fn(page);
				}

				var fv = '',
					b = '',
					params = '1=1',
					keyword = $scope.search.keyword;

				// 循环选中的品牌
				angular.forEach($scope.brands, function(item) {
					if (item.choose) {
						if (b == '') {
							b = item.Id;
						} else {
							b += ',' + item.Id;
						}
					}
				})

				// 循环选中的SKU
				angular.forEach($scope.propertyLookup, function(items) {
					angular.forEach(items, function(item) {
						if (item.choose) {
							if (fv == '') {
								fv = item.PropertyValueID;
							} else {
								fv += ',' + item.PropertyValueID;
							}
						}
					})
				})

				if(categoryId){
					params += '&c=' + categoryId;
				}

				if (fv != '') {
					params += '&fv=' + fv;
				}
				if (b != '') {
					params += '&b=' + b;
				}

				// 参数缓存,如果和上次搜索的参数一样将不再进行查询
				if (paraCache == params && paraSortCache == sort && keyword == keywordCache) {
					// 分页参数没有发生任何变化不进行查询
					if (paraPageCache == page) {
						return;
					}
				} else { // 当基础查询数据发生了变化将重新重置页数,如果只是分页信息发生变化不进行遮罩处理
					// 清空历史数据，显示加载图标
					page = 1;
				}

				// 缓存查询的参数和页数
				paraCache = params;
				paraPageCache = page;
				paraSortCache = sort;
				keywordCache = keyword;

				var url = UrlUtil.solrUrl + "search/p?" + params + '&pageNow=' + page + '&sort=' + sort ;
				if(keyword){
					url += '&keyword=' + keyword;
				}
				
				// 防止查询过程中触发上拉加载事件
				$scope.isfiniteShow = false;
				LayerUtil.load.loading();

				// 请求搜索服务
				$http.get(url)
					.success(function(res) {

						// 当重新查询数据的时候进行覆盖，否则做添加操作
						if (page == 1) {
							$scope.productData = res.result;
						} else {
							angular.forEach(res.result, function(item) {
								item.addCurrentTime = null;
								$scope.productData.splice($scope.productData.length, 0, item);
							})
						}
						$scope.vacancy=false;
						if($scope.productData.length==0){
							$scope.vacancy=true;
						}
						// 更新总页数
						pageCount = res.pageCount;

						// 更新当前页
						pageNow = res.pageNow;

						layer.closeAll();

						// 广播上拉加载完成
						$scope.$broadcast("scroll.infiniteScrollComplete");

						// 加载一次后不在显示上拉刷新加载的图标,否则会出现顶部空格现象
						$scope.infiniteShow = false;
					}).error(function() {
						layer.closeAll();
						LayerUtil.error()
					})
				
			}
			
			// 上拉刷新加载更多数据
			$scope.infiniteShow = true;
			// 不采用上啦加载触发loadMore函数(当数据为空的时候也会自动加载，不好控制，所以全部改为人为控制)
			$scope.isfiniteShow = false;
			$scope.loadMore = function() {
				var nextPage = pageNow + 1;
				if (nextPage > pageCount) {
					/*LayerUtil.warning({
						content: '最后一页!',
						shade: false
					})*/
					return;
				}

					search(/*function(nextPage) {
						if (nextPage != 1) {
							LayerUtil.load.loading();
						}
					}*/null, nextPage, sort);

			}
			if(be_form != 'home'){
				$scope.loadMore();
			}

			// load sku
			/*var params = 'property=0&pageIndex=1&pageSize=100&prop=0&brandId=0&category=' + categoryId + '&orderBy=0&priceArea=0&def=0&method=get_product_attribute' + SystemParam.get();
			console.log('加载sku属性:'+UrlUtil.http + "Product/get_product_attribute?" + params)
			
			$http.get(UrlUtil.http + "Product/get_product_attribute?" + params)
				.success(function(res) {
					if (res.code == 200) {
						var data = res.data.datas;

						$scope.brands = data.Brands;
						$scope.propertyLookup = data.PropertyLookup;
					} else {
						LayerUtil.error({
							content: res.data
						})
					}
				}).error(function() {
					LayerUtil.error();
			})*/
			

			// 展示隐藏品牌多余的属性
			$scope.down = true;
			$scope.showAndHideAllBrands = function() {
				angular.forEach($scope.brands, function(item) {
					item.display = $scope.down;
				})
				$scope.down = !$scope.down;
			}

			// 选中标签修改样式及搜索条件
			$scope.brandClickChangeClass = function() {
				this.item.choose = !this.item.choose;
				//search();
			}

			// 选中标签修改样式及搜索条件
			$scope.propertyClickChangeClass = function(items) {
				angular.forEach(items,function(item){
					item.choose = false;
				})
				this.item.choose = !this.item.choose;
				//search();
			}

			// 展示隐藏sku多余的属性
			$scope.showAndHideSku = function(items) {
				var _this = this;
				angular.forEach(items, function(item) {
					item.display = _this.items.up == true ? false : true;
				})
				this.items.up = !this.items.up;
			}

			// 添加到购物车
			$scope.addShopCart = function (sku,shopId,pid) {
				ShopCartHandle.add({
					sku:sku,
					shopid:shopId,
					productid:pid
				});
			}

			$(document).keypress(function(e) {
		    	// 回车键事件
		       if(e.which == 13) {
       			 if ($location.path().indexOf('/classify') > -1) {
			            SearchHistory.set($scope.search.keyword);
			            // 更新历史搜索
			            $scope.loadHistorySearch();

			            $scope.hideSearchView = true;
			            $('span#classify_search_key_word').text($scope.search.keyword);
			            pageNow = 0;
			            pageCount = 1;
			            categoryId = ''; 
			            search(null, 1, 0);
			            Statictis.SearchStatictis($scope.search.keyword, userid, Statictis.getTime());
			        }
		       }
		   });

			// 展示搜索页面
			$scope.showSearchModal = function () {
				$('#searchGoodContent').css('top',($('#searchGoodHeader').height()+9)+'px');
				$scope.hideSearchView = false;
				setTimeout(function () {
					$('#in_search_input').focus();
				},500)
			}
			
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
        				getKeywordSearchDataOnClick($(this).text().trim(),1)
        			})
        			
        			
        			// 隐藏“无搜索历史”
        			$("p#no_history_search_p").hide();
				}else{
					$("a#show_history_search_a").hide()
					$("p#no_history_search_p").show();
				}
			}
			$scope.loadHistorySearch();

			// 点击（下拉关键词）进行搜索
			function getKeywordSearchDataOnClick(item,type) {
				// 保存历史搜索数据
				if(type == 0){
					SearchHistory.set(item);
					// 更新历史搜索
					$scope.loadHistorySearch();
				}
				
				$scope.search.keyword = item;
				$('span#classify_search_key_word').text(item+'');
				$scope.hideSearchView = true;
				pageNow = 0;
				pageCount = 1;
				categoryId = '';
				search(null,1,0);
				Statictis.SearchStatictis(item, userid, Statictis.getTime());
			}

			// 点击（下拉关键词）进行搜索
			$scope.getKeywordSearchData = function(item,type) {
				// 保存历史搜索数据
				if(type == 0){
					SearchHistory.set(item);
					// 更新历史搜索
					$scope.loadHistorySearch();
				}
				
				$scope.search.keyword = item;
				$('span#classify_search_key_word').text(item+'');
				$scope.hideSearchView = true;
				pageNow = 0;
				pageCount = 1;
				categoryId = '';
				search(null,1,0);
				Statictis.SearchStatictis(item, userid, Statictis.getTime());
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

			// 历史搜索数据
			$scope.showModule = {
				historySearch:false,
				shop:false
			}

			// 关闭搜索页面MODAL
			$scope.cancel = function () {
				var searchKeyword = $scope.search.keyword;
				$('span#classify_search_key_word').text(searchKeyword);
				$scope.hideSearchView = true;
			}

			// 搜索建议
			$scope.searchData=[];
			$scope.$watch('search.keyword', function (newVal, oldVal) {
				if(newVal == ""){
					$scope.searchData=[];
					return;
				}
				
				console.log('搜索建议:'+UrlUtil.solrUrl + "search/sug?keyword=" + newVal )
				
				$http.get(UrlUtil.solrUrl + "search/sug?keyword=" + newVal )
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

			$scope.clearKeyword=function(){
				$scope.search.keyword = '';
				setTimeout(function(){
					$('#in_search_input').focus();
				},100)
			}

			if(be_form == 'home'){
				$('span#classify_search_key_word').text(stateParamsKeyword);
				search(null,1,0);
			}

		}
	])

	.controller('ClassifyListCtrl',function() {
		//装备聚合页列表模式
	})
	.controller('SeekShopCtrl', function() {

	});
