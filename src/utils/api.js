import baseUrl from "@/utils/config.js"
let api = "/"
export default {
	// 
	login: api + "oauth/login", //登录
	PatrolInfoCtrGet: api + "PatrolInfoCtr/getPage", //巡查记录查询
	PatrolInfoCtrdetails: api + "PatrolInfoCtr/details", //巡查记录详情
	PatrolInfoCtrAdd: api + "PatrolInfoCtr/add", //巡查添加
	PatrolgetXjCount: api + "bigscreenCtr/getXjCount", //巡查统计
	viewLastValue: api + "PatrolInfoCtr/viewLastValue", //查看上次剂量率
	// enterpriseInfoGet: api + "enterpriseManage/enterpriseInfo/getPage", //企业信息
	enterpriseInfoGet: api + "common/curEnterpriseInfo", //当前企业信息
	getSourceEquipPageByMobile: api + "fsy/getSourceEquipPageByMobile", //企业设备
	sourceEquipInfo: api + "fsy/sourceEquipInfo", //企业设备详情
	sourceGet: api + "fsy/getPage", //放射源查询
	sourceInfo: api + "fsy/sourceInfo", //放射源详情
	getSourceEquipPage: api + "fsy/getSourceEquipPage", //设备列表查询
	earlyWarningList: api + "warn/warnInfoCtr/getCheckPage", //预警自查分页表
	earlyWarningDetail: api + "warn/warnInfoCtr/getCheckInfo", //预警自查详情
	saveCheckAdd: api + "warn/warnInfoCtr/saveCheck", //预警自查添加
	getWorkPage: api + "work/workCtr/getWorkPage", //作业列表
	getWorkInfo: api + "work/workCtr/getWorkInfo", //作业详情
	saveEndWork: api + "work/workCtr/saveEndWork", //保存结束作业
	saveStartWork: api + "work/workCtr/saveStartWork", //保存开始作业
	getStoragePage: api + "storage/storageCtr/getStoragePage", //出入库列表
	getStorageInfo: api + "storage/storageCtr/getStorageInfo", //出入库详情
	saveStorageOut: api + "storage/storageCtr/saveStorageOut", //保存出库
	saveStorageIn: api + "storage/storageCtr/saveStorageIn", //保存入库
	patrolReportCtrGet: api + "PatrolReportCtr/getPage", //报备列表
	patrolReportCtrAdd: api + "PatrolReportCtr/add", //报备添加
	getPatrolReportToalInfo: api + "PatrolReportCtr/getPatrolReportToalInfo", //报备详情
	getRectifyPage: api + "rectify/rectifyCtr/getRectifyPage", //整改记录
	getRectifyInfo: api + "rectify/rectifyCtr/getRectifyInfo", //整改详情
	saveRectifyFeek: api + "rectify/rectifyCtr/saveRectifyFeek", //整改反馈
	warnCofigCtrList: api + "warn/warnCofigCtr/getPage", //预警配置项查询
	storageOutSoucesList: api + "work/workCtr/storageOutSouces", //作业管理使用源列表

}
