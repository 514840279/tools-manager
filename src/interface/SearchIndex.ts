import { PageParam, SelectOptions } from "@interface/Table";
import { SysDbmsTabsCols, SysDbmsTabsTableInfo } from "./SysDbms";

export interface SearchIndexParameters extends SelectOptions {
  indexPlaceholder?: string;
  data?: string | number | boolean | undefined;
}


export interface TabsPageParams extends PageParam<SysDbmsTabsTableInfo> {
  cols?: Array<SysDbmsTabsCols>;
}