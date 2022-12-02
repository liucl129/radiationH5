<template>
  <view class="add-reporting">
    <view class="details-head">
      <p class="d-flex-item d-flex-center">基本信息</p>
      <view class="example">
        <!-- 基础用法，不包含校验规则 -->
        <uni-forms
          ref="baseForm"
          :rules="rules"
          :modelValue="baseFormData"
          :label-align="labelAlign"
          :label-width="labelWidth"
        >
          <uni-forms-item label="开始时间:" required>
            <uni-datetime-picker
              type="date"
              :clear-icon="false"
              v-model="baseFormData.bbkssj"
              name="bbkssj"
              :start="newDate"
              @maskClick="maskClick"
            />
          </uni-forms-item>
          <uni-forms-item label="结束时间:" required>
            <uni-datetime-picker
              type="date"
              :clear-icon="false"
              v-model="baseFormData.bbjssj"
              name="bbjssj"
              :start="newDate"
              @maskClick="maskClick"
            />
          </uni-forms-item>
          <uni-forms-item label="报备说明">
            <uni-easyinput
              type="textarea"
              v-model="baseFormData.bbsm"
              name="bbsm"
              placeholder="请输入"
              :clearable="false"
            />
          </uni-forms-item>
        </uni-forms>
      </view>
    </view>
    <view class="example"> </view>
    <view class="add-btn d-flex-item d-flex-end">
      <view class="add-btn-conter d-flex-item d-space-evenly" @click="add">
        <image src="../../static/img/add-icon@2x.png"></image>
        添加源
      </view>
    </view>
    <!-- 表格 -->
    <view class="">
      <tableModel
        :title="taskTitle"
        :table="taskTable"
        operation="删除"
        @delChange="delChange"
      />
    </view>
    <view
      class="ok-btn d-flex-item d-flex-center"
      @click="startClick('baseForm')"
    >
      确认
    </view>
    <!-- 时间插件 -->
    <xp-picker ref="picker" @confirm="confirm" />
    <!-- 弹出层 -->
    <uni-popup ref="popup" background-color="#fff" @change="popupchange">
      <view class="pop-model-conter">
        <uni-forms
          ref="baseForm"
          :modelValue="sourceForm"
          :label-align="labelAlign"
          :label-width="labelWidth"
        >
          <uni-forms-item label="源编码:">
            <uni-easyinput
              :clearable="false"
              v-model="sourceForm.radioactiveSourceNo"
              placeholder="请选择"
              suffixIcon="search"
              @iconClick="iconClick"
            />
          </uni-forms-item>
          <uni-forms-item label="设备名称:">
            <uni-data-select
              v-model="sourceForm.sbbh"
              :localdata="range"
              @change="change"
            >
            </uni-data-select>
          </uni-forms-item>
        </uni-forms>
        <view class="pop-table-model">
          <popupModel
            :tableData="tableData"
            @getSource="getSource"
            @selectionChange="selectionChange"
            :totalNum="totalNum"
          ></popupModel>
        </view>
        <view class="add-btns d-flex-item d-space-between">
          <view
            class="add-cancel add-btn d-flex-item d-flex-center"
            @click="cancelClick"
          >
            取消
          </view>
          <view
            class="add-confirm add-btn d-flex-item d-flex-center"
            @click="confirmClick"
          >
            确认
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import tableModel from "./components/table.vue";
import popupModel from "./components/popupModel.vue";
export default {
  components: {
    tableModel,
    popupModel,
  },
  data() {
    return {
      labelAlign: "right",
      labelWidth: "80",
      // 基础表单数据
      baseFormData: {
        bbkssj: "",
        bbjssj: "",
        bbsm: "",
        fsyxhs: [],
      },
      newDate: "",
      taskTitle: [
        {
          key: "源编码",
          value: "fsybm",
          width: "90",
        },
        {
          key: "类别",
          value: "fsylb",
          width: "70",
        },
        {
          key: "源类型",
          value: "sfkyd",
          width: "90",
        },
        {
          key: "状态",
          value: "zt",
          width: "70",
        },
      ],
      taskTable: [],
      range: [],
      equipmentForm: {
        pageNo: 1,
        pageSize: 10,
        ssyqbh: "",
      },
      sourceForm: {
        pageNo: 1,
        pageSize: 5,
        ssyqbh: "",
        radioactiveSourceNo: "",
        sbbh: "",
      },
      tableData: [],
      totalNum: 0,
      indexArr: [],
      // 校验规则
      rules: {
        bbkssj: {
          rules: [
            {
              required: true,
              errorMessage: "开始时间不能为空",
            },
          ],
        },
        bbjssj: {
          rules: [
            {
              required: true,
              errorMessage: "结束时间不能为空",
            },
          ],
        },
      },
    };
  },
  created() {
    this.newDate = this.$Common.getDate();
    console.log(this.newDate, "-------");
    let code = this.$DataStore.localGet("enterpriseCode");
    this.equipmentForm.ssyqbh = code;
    this.sourceForm.ssyqbh = code;
  },
  methods: {
    getSource(num) {
      if (num) {
        this.sourceForm.pageNo = num;
      }
      this.$Net.post(this.$api.sourceGet, {...this.sourceForm,sfbb:1}, 1).then((res) => {
        let resArr = res.data.list;
        console.log(resArr, "源列表");
        this.tableData = resArr;
        this.totalNum = res.data.total;
      });
    },
    getEquipment() {
      this.$Net
        .post(this.$api.getSourceEquipPage, this.equipmentForm, 1)
        .then((res) => {
          let resArr = res.data.records;
          console.log(resArr, "公司设备");
          resArr.forEach((element) => {
            this.range.push({ text: element.sbmc, value: element.sbbh });
          });
        });
    },
    startClick(ref) {
      this.taskTable.forEach((item) => {
        this.baseFormData.fsyxhs.push(item.fsyxh);
      });
      var set = new Set(this.baseFormData.fsyxhs);
      // 将set转换为数组
      this.baseFormData.fsyxhs = Array.from(set);
      this.$Net
        .post(this.$api.patrolReportCtrAdd, this.baseFormData, 1)
        .then((res) => {
          console.log(res, "成功");
          this.$Jump.Back(1);
        });
      return;
      this.$refs[ref]
        .validate()
        .then((res) => {
          console.log("success", res);

          this.taskTable.forEach((item) => {
            this.fsyxhs.push(item.fsyxh);
          });
          this.$Net
            .post(this.$api.patrolReportCtrAdd, this.baseFormData, 1)
            .then((res) => {
              console.log(res, "成功");
            });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    show() {
      this.$refs.picker.show();
    },
    confirm(e) {
      console.log(e, "选择时间回调");
    },
    maskClick(e) {
      console.log("maskClick事件:", e);
    },
    cancelClick() {
      this.$refs.popup.close();
    },
    confirmClick() {
      let newList = [];
      this.indexArr.forEach((item) => {
        this.tableData.forEach((res, i) => {
          if (item == i) {
            newList.push(res);
          }
        });
      });
      let arr = newList.concat(this.taskTable);
      var set = new Set(arr);
      // 将set转换为数组
      this.taskTable = this.$Common.newSet(arr,"fsybm");
      console.log(this.taskTable, " 将set转换为数组");

      this.$refs.popup.close();
    },
    add() {
      this.getEquipment();
      this.getSource();
      this.$refs.popup.open("conter");
    },
    popupchange(value) {
      console.log(value, "组件状态发生变化触发");
    },
    delChange(row) {
      console.log(row, "当前行");
      let _this = this;
      uni.showModal({
        // title: '提示',
        content: "是否要删除当前内容！",
        confirmText: "确认删除",
        cancelText: "取消操作",
        confirmColor: "#F8421D",
        success: function (res) {
          if (res.confirm) {
            console.log("用户点击确定");
            _this.taskTable.forEach((item, i) => {
              if (item.fsyxh == row.fsyxh) {
                _this.taskTable.splice(i, 1);
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
    iconClick(e) {
      console.log("点击图标");
      this.getSource();
    },
    change() {
      this.getSource();
    },
    selectionChange(value) {
      console.log(value, "999");
      this.indexArr = value;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/static/css/addReporting.scss";
 ::v-deep .uni-popup .uni-popup__wrapper{
  display: block;
    position: relative;
    top: 40px;
}
</style>
