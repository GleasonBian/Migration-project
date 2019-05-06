<!--getCheckedKeys部分==》修改了element-ui.common.js20107行 加半选中node节点-->
<template>
  <el-tree class="tab-tree-list"
           :ref="refData"
           :data="[data.treeData]"
           :props="defaultProps"
           :node-key="data.nodeKey"
           :show-checkbox="data.checkbox"
           :default-checked-keys="data.defaultCheckedKeys"
           :default-expand-all="defaultExpandAll"
           :expand-on-click-node="false"
           :render-content="renderContent"
           :default-expanded-keys="data.defaultExpandedKeys"
           @node-click="nodeClick"
           @check-change="checkChange"
           @current-change="currentChange"
           @node-expand="nodeExpand"
           @node-collapse="nodeCollapse">
  </el-tree>
</template>

<script>
  export default {
    name: 'TabTreeList',
    props: {
      refData: {
        type: String,
        default: 'data'
      },
      data: {
        type: Object,
        default: function () {
          return {
            checkbox: false,
            checked: 'checked'
          }
        }
      },
      nodeKey: [Number, String],
      defaultProps: {
        type: Object,
        default: function () {
          return {
            children: 'children',
            label: 'label'
          }
        }
      },
      defaultExpandAll: {
        type: Boolean,
        default: true
      },
      renderDomLe: {
        type: Function,
        default: function () {
          return function () {
          }
        }
      },
      renderDomRi: {
        type: Function,
        default: function () {
          return function () {
          }
        }
      },
      static: Boolean,
      dataStatic: [Object, Array]
    },
    created () {
      if (this.static) {
        this.filterTreeData(this.dataStatic)
      } else {
        this.getTreeData()
      }
    },
    methods: {
      getTreeData () {
        this.$Ajax.post({
          url: this.data.url,
          data: this.flterParams(this.data.params),
          cb: res => {
            if (res.data.result) {
              this.setDefaultCheckedKeys(res.data.data)
              this.data.treeData[this.defaultProps.children] = res.data.data
            }
          }
        })
      },
      setDefaultCheckedKeys (data) {
        this.$set(this.data, 'defaultCheckedKeys', this.flterDefaultCheckedKeys(data))
      },
      filterTreeData (data) {
        let resultData = Array.isArray(data) === true ? this.data.treeData[this.defaultProps.children] = data : this.data.treeData = data
        this.setDefaultCheckedKeys(resultData)
      },
      flterDefaultCheckedKeys (data) {
        return this.filterChecked(data).length > 0 ? this.filterChecked(data) : []
      },
      flterParams (data) {
        return JSON.stringify(data) !== '{}' ? data : {}
      },
      filterChecked (data) {
        let checkedArr = []
        data.map(item => {
          if (item[this.defaultProps.children] && item[this.defaultProps.children].length > 0) {
            this.forCheckedArrData(item[this.defaultProps.children], checkedArr)
          }
        })
        return checkedArr
      },
      forCheckedArrData (data, checkedArr) {
        data.map(item => {
          for (let s in item) {
            if (this.data.checked === s && item[this.data.checked]) {
              checkedArr.push(item[this.data.checkedName])
            }
          }
          if (item[this.defaultProps.children] && item[this.defaultProps.children].length > 0) {
            this.forCheckedArrData(item[this.defaultProps.children], checkedArr)
          }
          return item
        })
      },
      renderDom (h, { node, data, store }) {
        let le
        let ri
        if (this.$Utils.isObect(this.renderDomLe(h, { node, data, store })) || this.$Utils.isObect(this.renderDomRi(h, { node, data, store }))) {
          le = this.renderDomLe(h, { node, data, store }) === 'undefined' ? '' : this.renderDomLe(h, { node, data, store })
          ri = this.renderDomRi(h, { node, data, store }) === 'undefined' ? '' : this.renderDomRi(h, { node, data, store })
        } else if (this.renderDomLe(h, { node, data, store }) === 'function' || this.renderDomRi(h, { node, data, store }) === 'function') {
          le = this.renderDomLe(h, { node, data, store })() === undefined ? '' : this.renderDomLe(h, { node, data, store })
          ri = this.renderDomRi(h, { node, data, store })() === undefined ? '' : this.renderDomRi(h, { node, data, store })
        }
        if (data.id === 0) {
          return (<div> {le}</div>)
        } else {
          return (<div> {ri}</div>)
        }
      },
      renderNodeName (h, { node, data, store }) {
        return (<div><span>{node.label}</span></div>)
      },
      renderContentData (h, { node, data, store }) {
        return (<div class="tab-tree-cont">{this.renderNodeName(h, { node, data, store })}{this.renderDom(h, { node, data, store })}</div>)
      },
      renderContent (h, { node, data, store }) {
        return (<div class="tab-tree-cont">{this.renderContentData(h, { node, data, store })}</div>)
      },
      nodeClick (val) {
        this.$emit('node-click', val, this.$props, this.data.defaultCheckedKeys)
      },
      checkChange (val, nodes, node) {
        this.$emit('check-change', val, nodes, node, this.$props, this.data.defaultCheckedKeys)
      },
      currentChange (current, nodes) {
        this.$emit('current-change', current, nodes, this.$props, this.data.defaultCheckedKeys)
      },
      nodeExpand (val, nodes, node) {
        this.$emit('node-expand', val, nodes, node, this.$props, this.data.defaultCheckedKeys)
      },
      nodeCollapse (val, nodes, node) {
        this.$emit('node-collapse', val, nodes, node, this.$props, this.data.defaultCheckedKeys)
      },
      getRefs () {
        return this.$refs[this.refData]
      },
      getFilter () {
        return this.getRefs().filter()
      },
      updateKeyChildren () {
        return this.getRefs().updateKeyChildren()
      },
      getCheckedNodes () {
        return this.getRefs().getCheckedNodes()
      },
      setCheckedNodes () {
        return this.getRefs().setCheckedNodes()
      },
      getCheckedKeys () {
        return this.getRefs().getCheckedKeys()
      },
      setCheckedKeys () {
        return this.getRefs().setCheckedKeys()
      },
      setChecked () {
        return this.getRefs().setChecked()
      },
      getCurrentKey () {
        return this.getRefs().getCurrentKey()
      },
      getCurrentNode () {
        return this.getRefs().getCurrentNode()
      },
      setCurrentKey () {
        return this.getRefs().setCurrentKey()
      },
      setCurrentNode () {
        return this.getRefs().setCurrentNode()
      }
    },
    watch: {
      'dataStatic': {
        handler (val, oldVal) {
          this.filterTreeData(val)
        },
        deep: true
      }
    },
    mounted () {
      this.$bus.on('updata-tab-tree-list', () => {
        this.getTreeData()
      })
      this.$bus.on('tree-filter', (res) => {
        let _this = this
        res(function () {
          return _this.getFilter()
        })
      })
      this.$bus.on('tree-updateKeyChildren', (res) => {
        let _this = this
        res(function () {
          return _this.updateKeyChildren()
        })
      })
      this.$bus.on('tree-getCheckedNodes', (res) => {
        let _this = this
        res(function () {
          return _this.getCheckedNodes()
        })
      })
      this.$bus.on('tree-setCheckedNodes', (res) => {
        let _this = this
        res(function () {
          return _this.setCheckedNodes()
        })
      })
      this.$bus.on('tree-getCheckedKeys', (res, refData) => {
        let _this = this
        if (refData) {
          if (refData === this.refData) {
            res(function () {
              return _this.getCheckedKeys()
            })
          }
        } else {
          res(function () {
            return _this.getCheckedKeys()
          })
        }
      })
      this.$bus.on('tree-setCheckedKeys', (res) => {
        let _this = this
        res(function () {
          return _this.setCheckedKeys()
        })
      })
      this.$bus.on('tree-setChecked', (res) => {
        let _this = this
        res(function () {
          return _this.setChecked()
        })
      })
      this.$bus.on('tree-getCurrentKey', (res) => {
        let _this = this
        res(function () {
          return _this.getCurrentKey()
        })
      })
      this.$bus.on('tree-getCurrentNode', (res) => {
        let _this = this
        res(function () {
          return _this.getCurrentNode()
        })
      })
      this.$bus.on('tree-setCurrentKey', (res) => {
        let _this = this
        res(function () {
          return _this.setCurrentKey()
        })
      })
      this.$bus.on('tree-setCurrentNode', (res) => {
        let _this = this
        res(function () {
          return _this.setCurrentNode()
        })
      })
    },
    destroyed () {
      this.$bus.off('updata-tab-tree-list')
      this.$bus.off('tree-filter')
      this.$bus.off('tree-updateKeyChildren')
      this.$bus.off('tree-getCheckedNodes')
      this.$bus.off('tree-setCheckedNodes')
      this.$bus.off('tree-getCheckedKeys')
      this.$bus.off('tree-setCheckedKeys')
      this.$bus.off('tree-setChecked')
      this.$bus.off('tree-getCurrentKey')
      this.$bus.off('tree-getCurrentNode')
      this.$bus.off('tree-setCurrentKey')
      this.$bus.off('tree-setCurrentNode')
    }
  }
</script>
<style>
  .tab-tree-list-ul {
    overflow: hidden;
  }

  .tab-tree-list-ul > li {
    float: left;
  }

  .tab-tree-list {
    border: 1px solid #ccc;
    border-top: 0;
  }

  .el-tree > .el-tree-node:nth-child {
    border-top: none;
  }

  .tab-tree-list .el-tree-node {
    border-top: 1px solid #ccc;
  }

  .tab-tree-cont {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .tab-tree-list > .el-tree-node > .el-tree-node__content {
    cursor: default;
    height:40px;
    background-color: #eef1f6;
  }
  .tab-tree-list > .el-tree-node > .el-tree-node__content > .el-icon-caret-right {
    width: 0;
    height: 0;
    padding: 0;
    cursor: none;
    padding-left: 25px;
  }
  .tab-tree-list > .el-tree-node > .el-tree-node__content > .el-icon-caret-right:before{
    content: ''
  }
  .tab-tree-list > .el-tree-node > .el-tree-node__content .el-checkbox .el-checkbox__inner {
    width: 0;
    height: 0;
  }
  .tab-tree-list > .el-tree-node > .el-tree-node__content .el-checkbox {}
</style>
