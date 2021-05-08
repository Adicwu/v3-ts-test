type SortProps = 'date' | 'num'
interface SortPropInfo {
  list: any[];
  order: 'desc' | 'asc'
}
const sort: Record<SortProps, SortPropInfo> = {
  date: {
    list: [],
    order: 'desc'
  },
  num: {
    list: [],
    order: 'desc'
  }
  // ...此处不能定义非SortProps属性且不能少定义
}
console.log(sort)
