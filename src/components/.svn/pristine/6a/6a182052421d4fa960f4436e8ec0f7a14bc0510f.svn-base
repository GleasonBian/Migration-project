<template>
  <div>
    <el-input :placeholder="data.searchPlaceholder" v-model="filterText" v-if="data.search"></el-input>
    <el-input :placeholder="data.placeholder" v-model="showValue" v-if="data.show"></el-input>
    <el-tree class="filter-tree"
             :class="data.class"
             :data="treeData"
             ref="treeData"
             :empty-text="data.emptyText"
             :node-key="data.nodeKey"
             :props="data.props"
             :render-after-expand="data.renderAfterExpand"
             :load="data.load"
             :render-content="data.renderContent"
             :highlight-current="data.highlightCurrent"
             :default-expand-all="data.defaultExpandAll"
             :expand-on-click-node="data.expandOnClickNode"
             :auto-expand-parent="data.autoExpandParent"
             :default-expanded-keys="data.defaultExpandedKeys"
             :show-checkbox="data.showCheckbox"
             :check-strictly="data.checkStrictly"
             :default-checked-keys="data.defaultCheckedKeys"
             :filter-node-method="filterNodeMethod"
             :accordion="data.accordion"
             :indent="data.indent"
             @node-click="nodeClick"
             @check="check"
             @check-change="checkChange"
             @current-change="currentChange"
             @node-expand="nodeExpand"
             @node-collapse="nodeCollapse"></el-tree>
  </div>
</template>

<script>
  export default {
    name: 'v-tree',
    data () {
      return {
        treeData: [],
        showValue: '',
        filterText: '',
        checkedNodes: []
      }
    },
    props: {
      data: {
        type: Object,
        default: function () {
          return {}
        }
      },
      refs: String
    },
    created () {
      this.getData(this.data)
    },
    methods: {
      getData (data) {
        this.$Ajax.post({
          url: data.url,
          data: data.params ? data.params : {},
          cb: res => {
            if (res.status === 200) {
              this.treeData = res.data.data
            }
          }
        })
      },
      nodeClick (val) {
        let values = {}
        if (val.level === 3) {
          this.showValue = val.baseClassName
          values = val
        } else {
          this.showValue = ''
          values = ''
        }
        this.$emit('node-click', this.showValue, values)
      },
      filterNodeMethod (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      checkChange (val, nodes, node) {
        this.$emit('check-change', val, nodes, node)
        this.$emit('get-checked-nodes', this.$refs.treeData.getCheckedNodes(), this.$refs.treeData)
      },
      currentChange (current, nodes) {
        this.$emit('current-change', current, nodes)
      },
      nodeExpand (val, nodes, node) {
        this.$emit('node-expand', val, nodes, node)
      },
      nodeCollapse (val, nodes, node) {
        this.$emit('node-collapse', val, nodes, node)
      },
      check (value, data) {
        this.$emit('check', value, data, this.$refs.treeData.getCheckedNodes(), this.$refs.treeData)
      }
    },
    mounted () {
      this.$bus.on('update-tree', (refs) => {
        if (refs === this.refs) {
          this.treeData = []
          this.filterText = ''
          this.getData(this.data)
        }
      })
    },
    watch: {
      filterText (val) {
        this.$refs.treeData.filter(val)
      }
    },
    destroyed () {
      this.$bus.off('update-tree')
    }
  }
</script>