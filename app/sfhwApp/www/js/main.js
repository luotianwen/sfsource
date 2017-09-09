angular.module('ionicApp', ['ionic', 'ionic.services', 'index.controllers', 'home.controller',
    'self.controller', 'category.controller','shopping.controller','brand_street.controller','ngCordova','ionicLazyLoad','seckill.controller','serviceman.controller','specialOff.controller'])

    .run(['$ionicPlatform', '$rootScope','LayerUtil','$state','UploadAppVersion','ProjectType',
    function ($ionicPlatform, $rootScope,LayerUtil,$state,UploadAppVersion,ProjectType) {

        $ionicPlatform.ready(function ($rootScope) {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            if(ProjectType.type == 'android'){
            	// 检测版本更新
            	UploadAppVersion.compare();
            }
        });

        // 双击退出
        var exitPath = ['tab.home','tab.brand_street','tab.equipment','tab.shopping','tab.center'];// 需要监听退出的路由名
    	$rootScope.backButtonPressedOnceToExit = false;
        $ionicPlatform.registerBackButtonAction(function () {// 注册退出服务
			if(exitPath.indexOf($state.current.name) > -1){
				if($rootScope.backButtonPressedOnceToExit){
		        	ionic.Platform.exitApp();
		        }else{
		           $rootScope.backButtonPressedOnceToExit = true;
		           LayerUtil.warning({
	                    content:'再按一次退出系统',
                    	time:1
                   })
		           setTimeout(function(){
		                $rootScope.backButtonPressedOnceToExit = false;
		           }, 2000);
		        }
			}else {

				if($state.current.name == 'tab.orders'){
					$state.go('tab.center');
				}else{
					navigator.app.backHistory();
				}

			}
  		},100);
    }])

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        // 设置位置
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        // 标题对齐方式
        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('center');

        // 回退按钮图标
        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        // 转场效果
        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');

        // 禁止在ios左滑触发返回
        $ionicConfigProvider.views.swipeBackEnabled(false)


        // 路由
        $stateProvider

            .state('tab', {
                url: '/tab',
                abstract: true,// abstract表示此页面作为一个基类每个页面都会嵌套进去
                templateUrl: 'views/tabs.html',
                controller:"TabsController"
            })

            .state('tab.guide', {
                url: '/guide',
                views: {
                    'tab-home': {
                        templateUrl: 'views/home/guide.html',
                        controller: 'GuideCtrl'
                    }
                }
            })

            .state('tab.home', {
                url: '/home',
                views: {
                    'tab-home': {
                        templateUrl: 'views/home/tab-home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('tab.center', {
                url: '/center',
                cache: false,
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/center.html',
                        controller: 'CenterCtrl'
                    }
                }
            })
            //个人资料页 2016/7/26日添加
            .state('tab.personalData', {
                url: '/personalData',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/personalData/personalData.html',
                        controller: 'PersonalDataCtrl'
                    }
                }
            })
            //管理收货地址页面 2016/7/28添加 关联js controller_self
            .state('tab.shippingAddress', {
                url: '/shippingAddress/:param',
                cache:false,
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/personalData/shippingAddress.html',
                        controller: 'ShippingAddressCtrl'
                    }
                }
            })
            //添加收货地址页面 2016/7/28添加  关联js controller_self
            .state('tab.addShippingAddress', {
                url: '/addShippingAddress/:param',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/personalData/addShippingAddress.html',
                        controller: 'AddShippingAddressCtrl'
                    }
                }
            })

            //查看订单页面 2016/7/29添加 关联js controller_self
            .state('tab.orders', {
                url: '/orders/:status',
                //cache:false,
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/orders/order.html',
                        controller: 'OrderCtrl'
                    }
                }
            })
            //订单详情页 2016/7/30添加 关联js controller_self
            .state('tab.orderInfo', {
                url: '/orderInfo/:id',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/orders/orderInfo/orderInfo.html',
                        controller: 'OrderInfoCtrl'
                    }
                }
            })
            //物流详情 2016/7/30添加 关联js controller_self
            .state('tab.logistics', {
                url: '/logistics/:express',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/orders/orderInfo/logistics.html',
                		controller: 'LogisticsCtrl'
            		}
            	}
            })
            //我的收藏 2016/8/1添加 关联js controller_self
            .state('tab.myCollect', {
                url: '/myCollect',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/collect/myCollect.html',
                        controller: 'MyCollectCtrl'
                    }
                }
            })
            .state('tab.login', {
                url: '/login/:params',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/login/login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tab.register', {
                url: '/register',
                cache:false,
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/login/register.html',
                        controller: 'RegisterCtrl'
                    }
                }
            })
            .state('tab.register_agreemen', {
                url: '/register_agreemen',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/login/register_agreement.html'
                    }
                }
            })
            .state('tab.forgetPassword', {
                url: '/forgetPassword',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/login/forgetPassword.html',
                        controller: 'ForgetPasswordCtrl'
                    }
                }
            })
            .state('tab.verification', {
                url: '/verification/:phone',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/login/verification.html',
                        controller: 'VerificationCtrl'
                    }
                }
            })
            .state('tab.equipment', {
                url: '/equipment',
                views: {
                    'tab-category': {
                        templateUrl: 'views/category/equipment.html',
                        controller: 'EquipmentCtrl'
                    }
                }
            })
            //商品展示页
            .state('tab.classify', {
                url: '/classify/:params',
                views: {
                    'tab-category': {
                        templateUrl: 'views/category/classify/classify.html',
                        controller: 'ClassifyCtrl'
                    }
                }
            })
            //商品展示 列表模式页面
            /*.state('tab.classify-list', {
                url: '/classify-list',
                views: {
                    'tab-category': {
                        templateUrl: 'views/category/classify/classify-list.html',
                        controller: 'ClassifyListCtrl'
                    }
                }
            })*/
            //搜索页面
            /*.state('tab.searchGood', {
                url: '/searchGood',
                views: {
                    'tab-category': {
                        templateUrl: 'views/category/classify/searchGood.html',
                        controller: 'searchGoodCtrl'
                    }
                }
            })*/
            //搜索商店页
            .state('tab.seekShop', {
                url: '/seekShop',
                views: {
                    'tab-category': {
                        templateUrl: 'views/category/classify/seekShop.html',
                        controller: 'SeekShopCtrl'
                    }
                }
            })
            //购物车页面
            .state('tab.shopping', {
                url: '/shopping/:isBack',
                cache: false,
                views: {
                    'tab-shop-cart': {
                        templateUrl: 'views/shopping/shopping.html',
                        controller: 'ShoppingCtrl'
                    }
                }
            })
            //商铺宫格页
            .state('tab.shop_inner', {
                url: '/shop_inner/:id',
                views: {
                    'tab-me': {
                        templateUrl: 'views/shopping/shop_inner/shop_inner.html',
                        controller: 'Shop_innerCtrl'
                    }
                }
            })
            //商铺列表页
            .state('tab.shop_list', { //'/classify/:itemId',
                url: '/shop_list/:sellerId',
                views: {
                    'tab-me': {
                        templateUrl: 'views/shopping/shop_list/shop_list.html',
                        controller: 'Shop_listCtrl'
                    }
                }
            })
        //页面安全页
        .state('tab.set', {
            url: '/set',
            views: {
                'tab-me': {
                    templateUrl: 'views/self/set/set.html',
                    controller: 'SetCtrl'
                }
            }
        })
            //设置帮助中心
            .state('tab.help', {
                url: '/help',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/set/help/help.html',
                        controller: 'HelpCtrl'
                    }
                }
            })
            .state('tab.safety', {
                url: '/safety',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/set/safety/safety.html',
                        controller: 'SafetyCtrl'
                    }
                }
            })
            //修改密码
        .state('tab.modification', {
            url: '/modification',
            views: {
                'tab-me': {
                    templateUrl: 'views/self/set/safety/modification/modification.html',
                    controller: 'ModificationCtrl'
                }
            }
        })
            //绑定邮箱
            .state('tab.mod_email', {
                url: '/mod_email',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/set/safety/mod_email/mod_email.html',
                        controller: 'Mod_emailCtrl'
                    }
                }
            })
            //手机号页面
            .state('tab.mod_teleNum', {
                url: '/mod_teleNum',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/set/safety/mod_teleNum/mod_teleNum.html',
                        controller: 'Mod_teleNumCtrl'
                    }
                }
            })
            //绑定手机号
            .state('tab.changeTel', {
                url: '/changeTel',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/set/safety/mod_teleNum/changeTel.html',
                        controller: 'ChangeTelCtrl'
                    }
                }
            })
            //优惠券
            .state('tab.coupon', {
                url: '/coupon',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/coupon/coupon.html',
                        controller: 'Coupon'
                    }
                }
            })
            //关于我们
            .state('tab.about_our', {
                url: '/about_our',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/about_our/about_our.html',
                        controller: 'About_ourCtrl'
                    }
                }
            })
            //用户反馈
            .state('tab.user_feedback', {
                url: '/user_feedback',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/user_feedback/user_feedback.html',
                        controller: 'User_feedbackCtrl'
                    }
                }
            })
            //会员积分
            .state('tab.integral', {
                url: '/integral',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/integral/integral.html',
                        controller: 'IntegralCtrl'
                    }
                }
            })
            //会员规则
            .state('tab.mem_rule', {
                url: '/mem_rule',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/integral/mem_rule/mem_rule.html',
                        controller: 'Mem_ruleCtrl'
                    }
                }
            })

            //退货
            .state('tab.sendback', {
                url: '/sendback/:Id',
                cache: false,
                views: {
                    'tab-me': {
                        templateUrl: 'views/shopping/sendback/sendback.html',
                        controller: 'SendbackCtrl'
                    }
                }
            })
            //评价晒单
            .state('tab.user_evalu', {
                url: '/user_evalu',
                views: {
                    'tab-me': {
                        templateUrl: 'views/shopping/user_evalu/user_evalu.html',
                        controller: 'User_evaluCtrl'
                    }
                }
            })
            //评价晒单
            .state('tab.sendback_list', {
                url: '/sendback_list/:orderId',
                cache: false,
                views: {
                    'tab-me': {
                        templateUrl: 'views/shopping/sendback_list/sendback_list.html',
                        controller: 'Sendback_listCtrl'
                    }
                }
            })
            //测试
            .state('tab.testT', {
                url: '/testT',
                views: {
                    'tab-me': {
                        templateUrl: 'views/self/testT/testT.html',
                        controller: 'TestT'
                    }
                }
            })
            //商铺内容
            .state('tab.commIntro', {
                url: '/commIntro/:skuId',
                views: {
                    'tab-category': {
                        templateUrl: 'views/home/commIntro/commIntro.html',
                        controller: 'CommIntroCtrl'
                    }
                }
            })
            //商铺内容
            .state('tab.subOrder', {
                url: '/subOrder/:param',
                cache:false,
                views: {
                    'tab-shop-cart': {
                        templateUrl: 'views/shopping/subOrder/subOrder.html',
                        controller: 'SubOrderCtrl'
                    }
                }
            })
            //品牌故事
            .state('tab.Comm_story', {
                url: '/Comm_story/:id',
                views: {
                    'tab-me': {
                        templateUrl: 'views/shopping/comm_story/comm_story.html',
                        controller: 'Comm_storyCtrl'
                    }
                }
            })
            //品牌街
            .state('tab.brand_street', {
                url: '/brand_street',
                views: {
                    'tab-me': {
                        templateUrl: 'views/brand_street/brand_street.html',
                        controller: 'Brand_streetCtrl'
                    }
                }
            })
            //退货状态
            .state('tab.sendback_state', {
                url: '/sendback_state/:ServiceID',
                views: {
                    'tab-brand': {
                        templateUrl: 'views/shopping/sendback_list/sendback_state.html',
                        controller: 'Sendback_stateCtrl'
                    }
            	}
            })
            //商品列表备份
            .state('tab.shop_innerBeifen', {
                url: '/shop_innerBeifen',
                views: {
                    'tab-brand': {
                        templateUrl: 'views/shopping/shop_inner/shop_innerBeifen.html',
                        controller: 'shop_innerBeifen'
                    }
            	}
            })
            //活动页
            .state('tab.homeActiv', {
                url: '/homeActiv/:params',
                cache:false,
                views: {
                    'tab-home': {
                        templateUrl: 'views/home/homeActiv/homeActiv.html',
                        controller: 'homeActivCtrl'
                    }
            	}
            })
            //首页→活动预告
            .state('tab.foreshowActivity', {
                url: '/foreshowActivity/:id',
                views: {
                    'tab-home': {
                        templateUrl: 'views/home/homeActiv/foreshowActivity.html',
                        controller: 'foreshowActivityCtrl'
                    }
            	}
            })
            // 首页→站外广告链接
            .state('tab.dynamic', {
                url: '/dynamic/:url',
                views: {
                    'tab-home': {
                        templateUrl: 'views/home/homeActiv/dynamic.html',
                        controller: 'dynamicCtrl'
                    }
            	}
            })
            // 秒杀
          .state('tab.seckill', {
            url: '/seckill',
            views: {
              'tab-home': {
                templateUrl: 'views/seckill/seckill.html',
                controller: 'seckillCtrl'
              }
            }
          })
          // 客服
          .state('tab.serviceman', {
            url: '/serviceman',
            views: {
              'tab-home': {
                templateUrl: 'views/serviceman/serviceman.html',
                controller: 'servicemanCtrl'
              }
            }
          })
          // 客服聊天
          .state('tab.serviceInner', {
            url: '/serviceInner',
            views: {
              'tab-home': {
                templateUrl: 'views/serviceman/serviceInner.html',
                controller: 'serviceInnerCtrl'
              }
            }
          })
          // 上新
          .state('tab.specialOff', {
            url: '/specialOff',
            views: {
              'tab-brand': {
                templateUrl: 'views/specialOff/specialOff.html',
                controller: 'specialOffCtrl'
              }
            }
          })
          // 特卖
          .state('tab.specialOffDouble', {
            url: '/specialOffDouble',
            views: {
              'tab-brand': {
                templateUrl: 'views/specialOff/specialOffDouble.html',
                controller: 'specialOffDoubleCtrl'
              }
            }
          })
          // 预售
          .state('tab.specialYshou', {
            url: '/specialYshou',
            views: {
              'tab-brand': {
                templateUrl: 'views/specialOff/specialYshou.html',
                controller: 'specialYshouCtrl'
              }
            }
          })
          // 绑定优惠券
          .state('tab.bingdingCoupon', {
            url: '/bingdingCoupon',
            views: {
              'tab-brand': {
                templateUrl: 'views/self/coupon/bindingCoupon.html',
                controller: 'bingdingCouponCtrl'
              }
            }
          })
        ;
        // 当路径找不到的时候跳往首页
        $urlRouterProvider.otherwise('/tab/guide');
    });
