import { initData } from '@/api/data'

export default {
  data() {
    return {
      /* table加载状态 */
      loading: true,
      data: [], page: 0, size: 10, total: 0, url: '', params: {}, query: {}, time: 50, isAdd: false, downloadLoading: false,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus: false,
      /* 高级查询条件生效状态 */
      superQueryFlag: false,
      /* 高级查询条件 */
      superQueryParams: ''
    }
  },
  methods: {
    async init() {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        initData(this.url, this.params).then(res => {
          // const { result } = res
          this.total = res.totalElements || 0
          this.data = res.content
          setTimeout(() => {
            this.loading = false
          }, this.time)
          resolve(res)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    beforeInit() {
      return true
    },
    pageChange(e) {
      this.page = e - 1
      this.init()
    },
    sizeChange(e) {
      this.page = 0
      this.size = e
      this.init()
    },
    // 预防删除第二页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
    dleChangePage(size) {
      if (size === undefined) {
        size = 1
      }
      if (this.data.length === size && this.page !== 0) {
        this.page = this.page - 1
      }
    },
    toQuery() {
      this.page = 0
      this.init()
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    // 清空选择的内容
    onClearSelected() {
      this.selectedRowKeys = []
      this.selectionRows = []
      this.$refs.standardTable.clearSelection()
    }
  }
}
