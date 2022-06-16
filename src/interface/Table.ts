export interface PageParam{
    pageNumber: number,
    sizes: Array<number>,
    pageSize: number,
    totalElements: number,
    info?: Object,
    sortList?: Array<SortColumn>,
    searchList?: Array<SearchParamters>
}
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
    searchType?:string,
    searchDataFormatter?: string,
    searchDataDefault?: string,
    searchDataArray?:string,
    search?: boolean
}

export interface SortColumn{
    sortIndex: number,
    sortTitle: string,
    sortOrder: string,
    sortName: string,
}
export interface SearchColumn{
    searchName: string,
    searchTitle: string,
    searchType: string,
    searchDataFormatter?: string,
    searchDataDefault?:string,
    searchDataArray?:string,
    searchPlaceholder?: string,

}
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

export interface SearchParamters{
    operator: string,
    column: string,
    title: string,
    symbol: string,
    data: string,
    searchPlaceholder?: string,
    showdata: boolean
}

export interface TableProps{
    rootUrl?:string,
    page?: PageParam,
    columns?: Array<Column>,
    optionBtn?:Object
}

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

