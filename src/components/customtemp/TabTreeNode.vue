<template>
    <el-table :data="data"
              ref="refs"
              :refs="refs"
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
              @expand-change="expandChange">
        <template v-for="(header, i) in headerData">
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
                             :filtered-value="header.filteredValue"></el-table-column>
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
                    <slot :column="headerData" :rows="data" :row="scope.row" :index="scope.$index" :name="header.prop">
                        <div class="table_tree_sub">
                            <tab-tree-node :refs="'tab_name_' + scope.row.id" :data="data" :header-data="headerData" :url="url" :params="parentId"
                                           :no-expand="noExpand" :slot-arr="slotArr">
                                <template v-for="slotName in slotArr" slot-scope="scope" :slot="slotName">
                                    <slot :column="headerData" :rows="scope.rows" :row="scope.row" :index="scope.index"
                                          :name="slotName"></slot>
                                </template>
                            </tab-tree-node>
                        </div>
                    </slot>
                </template>
            </el-table-column>
        </template>
    </el-table>
</template>

<script>
  export default {
    name: 'TabTreeNode',
    data () {
      return {
        parentId: 0,
        data: [],
        tabData: [],
        subRefs: '',
        tabDataHeader: this.headerData
      }
    },
    props: {
      refs: String,
      url: String,
      headerData: Array,
      params: [Number, String],
      noExpand: Number,
      slotArr: Array,
      static: Boolean,
      tabStyle: {
        type: Object,
        default: function () {
          return {
            stripe: false,
            border: false,
            fit: true,
            showHeader: false,
            highlightCurrentRow: false,
            emptyText: '暂无数据',
            defaultExpandAll: false,
            showSummary: false,
            sumText: '合计'
          }
        }
      }
    },
    created () {
      this.getData(this.params)
    },
    methods: {
      getTableData (res) {
        this.$emit('get-table-data', res)
      },
      expandChange (row, expandedRows) {
        this.parentId = row.id
      },
      getData (id) {
        this.$Ajax.post({
          url: this.url,
          data: {
            parentId: id
          },
          cb: res => {
            if (res.status === 200) {
              this.data = res.data.rows
            }
          }
        })
      }
    }
  }
</script>

<style>
    .table_tree_sub {
        padding: 5px 5px 5px 36px;
    }
</style>
