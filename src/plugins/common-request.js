import {post} from './http'




export default function fetchColumns(id) {
    return  post("/serve/sysDbmsTabsColsInfo/findAllBySysDbmsTabsColsInfo",{tabsUuid:id});
}


