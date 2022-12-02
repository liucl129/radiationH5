<template>
  <view> </view>
</template>

<script>
export default {
  data() {
    return {
        keyMap:"0563aa9f48e7478a5ce4ec38823668b1"
    };
  },
  mounted() {
    this.showPlace = this.show;
    var script = document.getElementById("mapTest");
    let that = this;
    script
      ? this.loop()
      : (function () {
          var script = document.createElement("script");
          script.type = "text/javascript";
          script.setAttribute("id", "mapTest");
          script.src = `https://webapi.amap.com/maps?v=2.0&key=${that.keyMap}`;
          document.body.appendChild(script);
          that.loop();
        })();
  },
  methods: {
    loop() {
      try {
        this.initMapWeb();
      } catch (e) {
        setTimeout(() => this.loop(), 200);
      }
    },
    initMapWeb() {
      let that = this;
      this.map = new AMap.Map("map", {
        center: ["106.55", "29.57"],
        zoom: 16,
      });

      this.map.on("click", (e) => {
        if (this.marker) {
          this.marker.setMap(null);
        }
        that.addMarker(e.lnglat.lng, e.lnglat.lat);
        that.getPlaces("", `${e.lnglat.lng}, ${e.lnglat.lat}`);
        that.getNowPlace(`${e.lnglat.lng}, ${e.lnglat.lat}`);
      });

      if (this.initLocation.length > 0) {
        let tempArr = this.initLocation.split(",");
        that.addMarker(tempArr[0], tempArr[1]);
        that.getPlaces("", `${tempArr[0]}, ${tempArr[1]}`);
        that.getNowPlace(`${tempArr[0]}, ${tempArr[1]}`);
        return;
      }

      AMap.plugin("AMap.Geolocation", function () {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(10, 20),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: "RB",
        });

        geolocation.getCurrentPosition(function (status, result) {
          if (result.info == "SUCCESS" && result.position && result.position) {
            that.addMarker(result.position.lng, result.position.lat);
            that.getPlaces(
              "",
              `${result.position.lng}, ${result.position.lat}`
            );
            that.getNowPlace(`${result.position.lng}, ${result.position.lat}`);
          }
        });
      });
    },
    getNowPlace(location) {
      uni.request({
        url: `https://restapi.amap.com/v3/geocode/regeo?key=${this.AMapKeyWeb}&location=${location}`,
        method: "GET",
        success: (res) => {
          let result = res.data;
          if (result.status == "1") {
            let tempObj = result.regeocode;
            this.checked = {
              adcode: tempObj.addressComponent.adcode,
              city: tempObj.addressComponent.city,
              district: tempObj.addressComponent.district,
              location,
              addressLocal: tempObj.formatted_address,
            };
          }
        },
        fail: (err) => {
          uni.showToast({
            title: JSON.stringify(err),
            icon: "none",
          });
        },
      });
    },

    addMarker(lng, lat) {
      var icon = new AMap.Icon({
        // 图标的取图地址
        image:
          "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        // 图标所用图片大小
        imageSize: new AMap.Size(32, 42),
      });

      this.marker = new AMap.Marker({
        icon,
        position: [lng, lat],
      });

      this.marker.setMap(this.map);
      this.map.setCenter([lng, lat]);
    },

    getPlaces(keywords, location) {
      uni.request({
        url: `https://restapi.amap.com/v3/assistant/inputtips?key=${this.AMapKeyWeb}&keywords=${keywords}&location=${location}`,
        method: "GET",
        success: (res) => {
          // console.log(res)
          let result = res.data;
          if (result.status === "1") {
            this.list = result.tips.filter(
              (item) => item.location && item.location.length > 0
            );
            // console.log(this.list, result.tips)
          }
        },
        fail: (err) => {
          uni.showToast({
            title: JSON.stringify(err),
            icon: "none",
          });
        },
      });
    },
  },
};
</script>

<style>
</style>