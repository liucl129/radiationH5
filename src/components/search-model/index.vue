<template>
  <view class="search-model d-flex-item d-space-between">
    <view class="search-model-date d-flex-item d-space-between">
      <!-- <view class="model-date-start" @click="show('start')">
				{{startTime}}
			</view>
			<view class="model-date-text">
				至
			</view>
			<view class="model-date-end" @click="show('end')">
				{{endTime}}
			</view>
			<image class="model-date-icon" src="../../static/img/date-icon@2x.png" mode=""></image> -->
      <uni-datetime-picker
        v-model="datetimeValue"
        type="daterange"
        @change="onDateSelectorChange"
      />
    </view>
    <view class="model-select">
      <uni-data-select
        v-model="value"
        :localdata="range"
        @change="change"
        :clear="false"
        type="line"
      >
      </uni-data-select>
    </view>
    <!-- 时间插件 -->
    <xp-picker ref="picker" @confirm="confirm" />
  </view>
</template>

<script>
import DateSelector from "../dengrq-datetime-picker/components/dateSelector/index.vue";
import ccPicker from "@/components/cc-picker/cc-picker.vue";

export default {
  components: {
    DateSelector,
  },
  props: {
    range: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      value: "",
      startTime: "开始日期",
      endTime: "结束日期",
      dateType: "",
      datetimeValue: "",
    };
  },
  methods: {
    onDateSelectorChange(e) {
      console.log(e, "组件日期");

      this.$emit("changeDate", e);
    },
    show(type) {
      this.dateType = type;
      this.$refs.picker.show();
    },
    confirm(e) {
      console.log(e, "选择时间回调");
      if (this.dateType == "start") {
        this.startTime = e.value;
      } else {
        this.endTime = e.value;
      }
      this.$emit("changeDate", e.value, this.dateType);
    },
    change(val) {
      console.log(val, "下拉选");
      this.$emit("changeSecle", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-model {
  ::v-deep .uni-date-editor {
    height: 26px;
  }
  ::v-deep .uni-date-x {
    height: 26px;
  }
  .search-model-date {
    width: 428rpx;
    height: 56rpx;
    // background: #ffffff;
    border-radius: 16rpx;
    // border: 2rpx solid #e3e3e3;
    font-size: 24rpx;
    font-weight: 400;
    color: $uni-secondary-color;

    .model-date-start,
    .model-date-end {
      width: 50%;
      text-align: center;
      // border: 1px solid #E3E3E3;
    }

    .model-date-text {
    }

    .model-date-end {
    }

    .model-date-icon {
      width: 30rpx;
      height: 28rpx;
      margin-right: 42rpx;
    }
  }

  .model-select {
    ::v-deep .uni-stat__select {
      padding: 0;
      background-color: #ffffff;
    }

    ::v-deep .uni-select {
      width: 242rpx;
      height: 56rpx;
      border-radius: $uni-border-radius;
      border: 2rpx solid #e3e3e3;
      text-align: center;
    }

    ::v-deep .uni-stat__actived {
      outline: 1px solid #ffffff;
    }

    ::v-deep .uni-select__input-box {
      width: 132rpx !important;
    }
    ::v-deep .uni-select__selector-item {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 0 10rpx;
    }
  }
}
</style>
