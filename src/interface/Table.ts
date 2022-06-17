// 表格分页信息
export interface PageParam{
    pageNumber: number,
    sizes: Array<number>,
    pageSize: number,
    totalElements: number,
    info?: Object,
    sortList?: Array<SortColumn>,
    searchList?: Array<SearchParamters>
}
// 表格的字段信息和控制条件
export interface Column{
    name: string,
    title: string,
    width?: number,
    resizable?: boolean,
    align?:string,
    show?: boolean,
    type?:string,
    sort?: boolean,
    sortOrder?: string,
    searchPlaceholder?: string,
    searchDataFormatter?: string,
    searchDataDefault?: string,
    searchDataArray?:Array<SelectOptions>,
    search?: boolean
}

// 字段排序条件 数据格式
export interface SortColumn{
    sortIndex: number,
    sortTitle: string,
    sortOrder: string,
    sortName: string,
}
// 字段查询条件 
export interface SearchColumn{
    searchName: string,
    searchTitle: string,
    searchType: string,
    searchDataFormatter?: string,
    searchDataDefault?:string,
    searchDataArray?:Array<SelectOptions>,
    searchPlaceholder?: string,

}

// 控制字段类型的类型
export enum SearchType{
    TEXT = 'text',
    INTEGER = 'integer',
    INTEGER_RANGE = 'integerrange',
    ICON = 'icon',
    COLOR = 'color',
    DATE = 'date',
    DATETIME = 'datetime',
    DATERANGE = 'daterange',
    SELECT = 'select',
    REDIO = 'redio',
    CHECKBOX = 'checkbox'
}

// 查询参数数据 数据格式
export interface SearchParamters{
    operator: string,
    column: string,
    title: string,
    symbol: string,
    data?: string|number|undefined,
    searchPlaceholder?: string,
    showdata: boolean,
    searchDataArray?: Array<SelectOptions>,
    searchType: string
}

// 控件条件
export interface TableProps{
    rootUrl:string,
    columns: Array<Column>,
    page?: PageParam,
    optionBtn?:Object
}

// 控件各个按钮组件的控制显示隐藏
export interface OptionBtn{
    search?: boolean, // 开启查询功能
    searchParam?: boolean, // 开启查询功能
    sort?: boolean, // 开启排序功能
    add?: boolean, // 添加
    page?: boolean, // 翻页
    opt?: boolean, // 每条数据后端操作搭配optbtn使用
    optbtn?: Optbtn
}
interface Optbtn{
    info?: boolean, // 详细 暂时无用
    upd?: boolean, // 修改
    state?: boolean, // 修改表中应有固定字段 delete_flag 默认值为0 逻辑删除字段 执行update 
    del?: boolean, // 删除 执行delete sql
}

// 下拉列表信息数据格式 value返回值，label显示
export interface SelectOptions{
    value: string|number,
    label: string,
} 
