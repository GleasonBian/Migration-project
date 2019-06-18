<template>
  <el-table :data="data"
            ref="refs"
            :border="tabStyle.border"
            :height="tabStyle.height"
            :max-height="tabStyle.maxHeight"
            :stripe="tabStyle.stripe"
            :size="tabStyle.size"
            :fit="tabStyle.fit"
            :show-header="tabStyle.showHeader"
            :highlight-current-row="tabStyle.highlightCurrentRow"
            :current-row-key="tabStyle.currentRowKey"
            :row-class-name="tabStyle.rowClassName"
            :row-style="tabStyle.rowStyle"
            :cell-class-name="tabStyle.cellClassName"
            :cell-style="cellStyle"
            :header-row-class-name="tabStyle.headerRowClassCame"
            :header-row-style="tabStyle.headerRowStyle"
            :header-cell-class-name="tabStyle.headerCellClassName"
            :header-cell-style="tabStyle.headerCellStyle"
            :row-key="tabStyle.rowKey"
            :empty-text="tabStyle.emptyText"
            :default-expand-all="tabStyle.defaultExpandAll"
            :expand-row-keys="tabStyle.expandRowKeys"
            :default-sort="tabStyle.defaultSort"
            :tooltip-effect="tabStyle.tooltipEffect"
            :show-summary="tabStyle.showSummary"
            :sum-text="tabStyle.sumText"
            :summary-method="tabStyle.summaryMethod"
            :span-method="tabStyle.spanMethod"
            @select="select"
            @select-all="selectAll"
            @selection-change="selectionChange"
            @cell-mouse-enter="cellMouseEnter"
            @cell-mouse-leave="cellMouseLeave"
            @cell-click="cellClick"
            @cell-dblclick="cellDblclick"
            @row-click="rowClick"
            @row-contextmenu="rowContextmenu"
            @row-dblclick="rowDblclick"
            @header-click="headerClick"
            @sort-change="sortChange"
            @filter-change="filterChange"
            @current-chang="currentChange"
            @header-dragend="headerDragend"
            @expand-change="expandChange">
    <template v-for="(header, i) in dataHeader" >
      <el-table-column v-if="!header.slot && !header.children"
                       :fixed="header.fixed"
                       :prop="header.prop"
                       :label="header.label"
                       :width="header.width"
                       :min-width="header.minWidth"
                       :type="header.type"
                       :index="header.index"
                       :column-key="header.columnKey"
                       :render-header="header.renderHeader"
                       :sortable="header.sortable"
                       :sort-method="header.sortMethod"
                       :sort-by="header.sortby"
                       :resizable="header.resizable ? header.resizable : true"
                       :formatter="header.formatter"
                       :show-overflow-tooltip="header.showOverflowTooltip"
                       :align="header.align ? header.align : 'center'"
                       :header-align="header.headerAlign ? header.headerAlign: 'center'"
                       :class-name="header.className"
                       :label-class-name="header.labelClassName"
                       :selectable="header.selectable"
                       :reserve-selection="header.reserveSelection ? header.reserveSelection : false"
                       :filters="header.filters"
                       :filter-placement="header.filterPlacement"
                       :filter-multipl="header.filterMultiple ? header.filterMultiple : true"
                       :filter-method="header.filterMethod"
                       :filtered-value="header.filteredValue">
      </el-table-column>
      <el-table-column v-if="header.slot"
                       :fixed="header.fixed"
                       :prop="header.prop"
                       :label="header.label"
                       :width="header.width"
                       :min-width="header.minWidth"
                       :type="header.type"
                       :index="header.index"
                       :column-key="header.columnKey"
                       :render-header="header.renderHeader"
                       :sortable="header.sortable"
                       :sort-method="header.sortMethod"
                       :sort-by="header.sortby"
                       :resizable="header.resizable ? header.resizable : true"
                       :formatter="header.formatter"
                       :show-overflow-tooltip="header.showOverflowTooltip"
                       :align="header.align ? header.align : 'center'"
                       :header-align="header.headerAlign ? header.headerAlign: 'center'"
                       :class-name="header.className"
                       :label-class-name="header.labelClassName"
                       :selectable="header.selectable"
                       :reserve-selection="header.reserveSelection ? header.reserveSelection : false"
                       :filters="header.filters"
                       :filter-placement="header.filterPlacement"
                       :filter-multipl="header.filterMultiple ? header.filterMultiple : true"
                       :filter-method="header.filterMethod"
                       :filtered-value="header.filteredValue">
        <template slot-scope="scope" v-if="header.slot">
          <slot :column="dataHeader" :rows="data" :row="scope.row" :index="scope.$index" :name="header.prop"></slot>
        </template>
      </el-table-column>

      <el-table-column v-if="header.children" :prop="header.prop" :label="header.label">
        <el-table-column v-if="header.children" v-for="ntem in header.children" :key="ntem.prop" :prop="ntem.prop"
                         :label="ntem.label">
          <el-table-column v-if="ntem.children" v-for="stem in ntem.children" :key="stem.prop" :prop="stem.prop"
                           :label="stem.label">
            <el-table-column v-if="stem.children" v-for="otem in stem.children" :key="otem.prop" :prop="otem.prop"
                             :label="otem.label">
              <el-table-column v-if="otem.children" v-for="ktem in otem.children" :key="ktem.prop" :prop="ktem.prop"
                               :label="ktem.label">
                <el-table-column v-if="ktem.children" v-for="ptem in ktem.children" :key="ptem.prop" :prop="ptem.prop"
                                 :label="ptem.label"></el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
  export default {
    name: 'TableList',
    data () {
      return {
        selection: [],
        data: []
      }
    },
    props: {
      dataHeader: Array,
      tabStyle: {
        type: Object,
        default: function () {
          return {
            stripe: false,
            border: false,
            fit: true,
            showHeader: true,
            highlightCurrentRow: false,
            emptyText: '暂无数据',
            defaultExpandAll: false,
            showSummary: false,
            sumText: '合计'
          }
        }
      },
      url: String,
      params: {
        type: Object,
        default: function () {
          return {}
        }
      },
      refs: String,
      static: Boolean,
      dataStatic: Array,
      cellStyleData: {
        type: Object,
        default: function () {
          return {
            label: '实际值',
            actualKey: 'real_',
            referenceKey: 'standard_'
          }
        }
      },
      isCellStyle: Boolean,
      creatNoLoading: false,
      index: Number
    },
    created () {
      this.$Utils.setSessionStorage('selection-change-data', [])
      if (!this.creatNoLoading) {
        this.getTabData()
      }
    },
    methods: {
      getTabData () {
        if (!this.static) {
          this.getData(this.params)
        }
        this.data = this.static ? this.dataStatic : this.data
      },
      getData (data) {
        this.$Ajax.post({
          url: this.url,
          data: data,
          cb: res => {
            if (res.status === 200) {
              this.data = res.data.rows
              this.$emit('get-table-data', res)
              if (res.data && res.data.result === false) {
                this.$message(res.data.message)
              }
            }
          }
        })
      },
      del (data) {
        this.$Ajax.post({
          url: data.url,
          data: data.data,
          cb: res => {
            if (res.status === 200) {
              this.getData()
            }
          }
        })
      },
      select (selection, row) {
        this.$emit('select', selection, row)
      },
      selectAll (selection) {
        this.$emit('select-all', selection)
      },
      selectionChange (selection) {
        this.$Utils.setSessionStorage('selection-change-data', selection)
        this.selection = selection
        this.$emit('selection-change', selection, this.index)
      },
      cellMouseEnter (row, column, cell, event) {
        this.$emit('cell-mouse-enter', row, column, cell, event)
      },
      cellMouseLeave (row, column, cell, event) {
        this.$emit('cell-mouse-leave', row, column, cell, event)
      },
      cellClick (row, column, cell, event) {
        this.$emit('cell-click', row, column, cell, event)
      },
      cellDblclick (row, column, cell, event) {
        this.$emit('cell-dblclick', row, column, cell, event)
      },
      rowClick (row, event, column) {
        this.$emit('row-click', row, event, column)
      },
      rowContextmenu (row, event) {
        this.$emit('row-contextmenu', row, event)
      },
      rowDblclick (row, event) {
        this.$emit('row-dblclick', row, event)
      },
      headerClick (column, event) {
        this.$emit('header-click', column, event)
      },
      sortChange ({column, prop, order}) {
        this.$emit('sort-change', {column, prop, order})
      },
      filterChange (filters) {
        this.$emit('filter-change', filters)
      },
      currentChange (currentRow, oldCurrentRow) {
        this.$emit('current-change', currentRow, oldCurrentRow)
      },
      headerDragend (newWidth, oldWidth, column, event) {
        this.$emit('header-dragend', newWidth, oldWidth, column, event)
      },
      expandChange (row, expandedRows) {
        this.$emit('expand-change', row, expandedRows)
      },
      cellStyle ({row, column, rowIndex, columnIndex}) {
        if (this.isCellStyle) {
          if (column.label === this.cellStyleData.label) {
            let real = column.property
            let num = real.replace(this.cellStyleData.actualKey, '')
            let standard = this.cellStyleData.referenceKey + num
            let realVlaue = row[real]
            let standardVlaue = row[standard]
            if (realVlaue >= standardVlaue) {
              return {
                color: 'green'
              }
            } else {
              return {
                color: 'red'
              }
            }
          }
        }
      },
      getTableData (res, objDom) {
        if (this.refs) {
          if (objDom === this.refs) {
            this.getData(res)
          }
        } else {
          console.log('请添加传入refs')
        }
      },
      toggleSelection (rows, obj) {
        if (rows) {
          rows.forEach(row => {
            if (obj !== undefined) {
              obj.toggleRowSelection(row)
            }
          })
        } else {
          obj.clearSelection()
        }
      }
    },
    mounted () {
      // 更新表格数据
      this.$bus.on('get-table-data', (res, objDom) => {
        this.getTableData(res, objDom)
      })
      // 表格选中行，有单选、全选之分
      this.$bus.on('selection-change', (res) => {
        let data = this.selection
        res(function () {
          return data
        })
      })
      // 删除表单行，有多删和单删
      this.$bus.on('del-table', (res) => {
        this.del(res)
      })
      // 获取格格的数据，有静态数据有动态数据之分
      this.$bus.on('get-data', (res) => {
        let props = this.$props
        let data = this.data
        res(function () {
          return {
            prop: props,
            data: data
          }
        })
      })
      // 添加默认选项
      this.$bus.on('set-tab-default-data', (res, refs) => {
        console.log(refs === this.refs)
        if (refs === this.refs) {
          this.toggleSelection(res, this.$refs.refs)
        }
      })
    },
    destroyed () {
      this.$bus.off('get-table-data')
      this.$bus.off('selection-change')
      this.$bus.off('del-table')
      this.$bus.off('get-data')
      this.$bus.off('set-tab-default-data')
    },
    watch: {
      'dataStatic': {
        handler (val, oldVal) {
          this.data = Array.isArray(val) && val.length > 0 ? val : this.dataStatic
        },
        deep: true
      }
    }
  }
</script>
