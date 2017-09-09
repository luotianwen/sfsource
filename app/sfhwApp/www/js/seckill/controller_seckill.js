angular.module("seckill.controller", [])

  .controller('seckillCtrl', ['$scope', 'SystemParam', '$http', '$interval','UrlUtil',
function ($scope, SystemParam, $http, $interval,UrlUtil) {
    var url = UrlUtil.http + "seckills/get_seckill?method=get_seckill" + SystemParam.get();
    //var url = "http://localhost:14588/api/Seckills/get_seckill?method=get_seckill" + SystemParam.get();
        console.log(url);
        $http.get(url)
            .success(function (res) {
                console.log(res);
                if (res.code == "200") {
                    $scope.seckills = res.data;
                    var str = "";
                    angular.forEach(res.data, function (data,index) {

                        if (data.Descript == "已经开始") {
                            str += "<li class='seckillLi' style='background:#fe404c;color:#fff' data-id="+data.Id+" data-des="+data.Descript+"><p>" + data.StartTime + "</p><p>" + data.Descript + "</p></li>";
                            var _that = index * -1;
                            $("#seckillUl").stop(true).animate({ left: (_that * 20) + 40 + "%" });
                          //  var url = "http://localhost:14588/api/Seckills/get_seckillsbyid?method=get_seckill&seckillid=" + data.Id + SystemParam.get();
                            var url = UrlUtil.http + "Seckills/get_seckillsbyid?method=get_seckillsbyid&seckillid=" + data.Id + SystemParam.get();
                            $http.get(url)
                                .success(function (res) {
                                    $scope.Product = res.data;
                                    $scope.Descript = data.Descript;
                                }).error(function () {

                                });
                        }
                        else {
                            str += "<li class='seckillLi' data-id=" + data.Id + " data-des=" + data.Descript + "><p>" + data.StartTime + "</p><p>" + data.Descript + "</p></li>";
                        }
                    });
                    $("#seckillUl").html(str);
                    //nav 点击效果
                    var seckillUlWarpWidth = $(window).width();
                    $('.seckillLi').css('width', seckillUlWarpWidth / 5 + 'px');
                    $('#seckillUl').css('width', $('.seckillLi').width() * $('.seckillLi').length + 'px');
                    $('.seckillLi').on('click', function () {

                        var _that = $(this).index() * -1;
                        $("#seckillUl").stop(true).animate({ left: (_that * 20) + 40 + "%" });
                        $('.seckillLi').css({ 'background': '#343843', 'color': '#888' });
                        $(this).css({ 'background': '#fe404c', 'color': '#fff' });
                        var id = $(this).attr("data-id");
                        $scope.Descript = $(this).attr("data-des");
                        console.log($(this).attr("data-des"));
                       // var url = "http://localhost:14588/api/Seckills/get_seckillsbyid?method=get_seckill&seckillid=" + id + SystemParam.get();
                        var url = UrlUtil.http + "Seckills/get_seckillsbyid?method=get_seckill&seckillid=" + data.Id + SystemParam.get();
                        console.log(url);
                        $http.get(url)
                            .success(function (res) {
                                $scope.Product = res.data;
                                console.log($scope.Product);
                            }).error(function () {

                            });
                    });
                    $('#seckillContent').css('top', $('.seckill-subar').height() + $('.seckill-header').height());
                }
            }).error(function () {

            });






        var interval = 1000;
        function ShowCountDown(year, month, day, divname) {
            angular.forEach($scope.seckills, function (data, index) {

                if (data.Descript == "已经开始") {
                    var now = new Date();

                    var d = data.EndTime.split(":");
                    var endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), d[0], d[1], 0);

                    var leftTime = endDate.getTime() - now.getTime();
                    var leftsecond = parseInt(leftTime / 1000);
                    //var day1=parseInt(leftsecond/(24*60*60*6));
                    var day1 = Math.floor(leftsecond / (60 * 60 * 24));
                    var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
                    var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
                    var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
                    var cc = document.getElementById(divname);
                    $scope.dateString = "距离结束还有<i>" + hour + "</i>:<i>" + minute + "</i>:<i>" + second + "</i>";
                }
            });


        }
        $interval(function () { ShowCountDown(2010, 4, 20, 'divdown1'); }, interval);


    }]);
