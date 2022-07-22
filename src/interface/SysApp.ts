import exp from "constants";
import { SelectOptions } from "./Table";

// `chuxue`.`sys_appl_info` 应用信息  
export interface SysApplInfo{
  applCode?: string,
  applName: string,
  createTime?: Date,
  createUser?: string,
  deleteFlag?: number,
  discription?: string,
  sort?: number,
  updateTime?: Date,
  updateUser?: string,
  uuid: string,
}



// `chuxue`.`sys_appl_type_info` 应用类型  
export interface SysApplTypeInfo{
  applCode?: string,
  checkboxType: string,
  createTime?: Date,
  createUser?: string,
  deleteFlag: number,
  discription?: string,
  sort?: number,
  typeCode?: string,
  typeName?: string,
  updateTime?: Date,
  updateUser?: string,
  uuid: string,
}



// `chuxue`.`sys_appl_type_tabs_column_info` 应用表字段管理  
export interface SysApplTypeTabsColumnInfo{
  colsTypeColor?: string,
  colsType?: string,
  colsUuid: string,
  createTime?: Date,
  createUser?: string,
  deleteFlag?: number,
  discription?: string,
  sort?: number,
  tabsUuid: string,
  typeCode: string,
  updateTime?: Date,
  updateUser?: string,
  uuid: string,
}

export interface SysApplTypeTabsColumnInfoVo extends SysApplTypeTabsColumnInfo{
  colsName?:string,
  colsDesc?:string,
}


export enum ColumnType {
LABEL = 'label',
TITLE = "title",
RELEASE = "RELEASE"
}


// `chuxue`.`sys_appl_type_tabs_info` 应用表关系管理  
export interface SysApplTypeTabsInfo{
  tabsUuid: string,
  updateUser?: string,
  uuid?: string,
  createTime?: Date,
  createUser?: string,
  deleteFlag?: number,
  discription?: string,
  sort?: number,
  typeCode: string,
  updateTime?: Date,
  checkboxType?:string
}

// `chuxue`.`sys_appl_data_type_info` 应用数据类型关系表  
export interface SysApplDataTypeInfo{
  applCode?: string,
  createTime?: Date,
  createUser?: string,
  deleteFlag?: number,
  discription?: string,
  sort?: number,
  typeCode?: string,
  updateTime?: Date,
  updateUser?: string,
  uuid?: string,
  checkboxType?:string,
}


export interface TypeOptions extends SelectOptions{
  checkboxType:string,
  uuid: string,
}

export interface SysApplTypeTabsInfoVo{
  uuid?: string,
  sort?: number,
  applCode?:string,
  typeCode?: string,
  tabsUuid: string,
  tabsName:string,
  tabsDesc?:string,
  checkboxType?:string,
}


export interface SysApplDataTypeInfoVo{
  uuid?: string,
  sort?: number,
  typeCode: string,
  typeName?:string,
  applCode?:string,
  checkboxType?:string,
}