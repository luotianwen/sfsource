angular.module("specialOff.controller", [])

  .controller('specialOffCtrl', ['$scope', 'SystemParam', '$http', '$interval', 'UrlUtil',
    function ($scope, SystemParam, $http, $interval, UrlUtil) {//九点上新
        var url = UrlUtil.http + "seckills/get_seckill?type=2&method=get_seckill" + SystemParam.get();
        $http.get(url)
            .success(function (res) {
                console.log(res);
                if (res.code == "200") {
                    if (res.data) {
                        var url = UrlUtil.http + "Seckills/get_seckillsbyid?method=get_seckillsbyid&seckillid=" + res.data[0].Id + SystemParam.get();
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
      
    }])
  .controller('specialOffDoubleCtrl', ['$scope', 'SystemParam', '$http', '$interval', 'UrlUtil',
    function ($scope, SystemParam, $http, $interval, UrlUtil) {//天天特价

        //加载
        var url = UrlUtil.http + "seckills/get_seckill?type=1&method=get_seckill" + SystemParam.get();
        $http.get(url)
            .success(function (res) {
                console.log(res);
                if (res.code == "200") {
                    if (res.data) {
                        var url = UrlUtil.http + "Seckills/get_seckillsbyid?method=get_seckillsbyid&seckillid=" + res.data[0].Id + SystemParam.get();
                        $http.get(url)
                            .success(function (res) {
                                $scope.specialOffDoubleProduct = res.data;
                            }).error(function () {
                                alert("加载数据异常，请重新刷新...");
                            });
                    }
                }
            }).error(function () {

            });
        ///加载预售活动信息
        var url = UrlUtil.http + "seckills/get_seckill_presell?type=1&method=get_seckill_presell" + SystemParam.get();
        $http.get(url)
            .success(function (res) {
                if (res.code == "200") {
                    if (res.data) {
                        var url = UrlUtil.http + "Seckills/get_seckillsbyid?method=get_seckillsbyid&seckillid=" + res.data[0].Id + SystemParam.get();
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

        $("#sdDiv").click(function () {
            $("#sdysDiv").attr("class", "specialOffDoubleBtn specialOffDoubleOffBtn");
            $(this).attr("class", "specialOffDoubleBtn specialOffDoubleOnBtn");

            $("#sdList").attr("style", "display:block");
            $("#sdysList").attr("style", "display:none");
        });

        $("#sdysDiv").click(function () {
            $("#sdDiv").attr("class", "specialOffDoubleBtn specialOffDoubleOffBtn");
            $(this).attr("class", "specialOffDoubleBtn specialOffDoubleOnBtn");
            $("#sdList").attr("style", "display:none");
            $("#sdysList").attr("style", "display:block");
        });
    }]);

