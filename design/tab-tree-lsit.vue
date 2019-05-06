<!--
<template>
  <div>
    <tab-tree-list :data="treeData" :data-static="tabTreeData" :static=true :render-dom-le="renderDomLe" :render-dom-ri="renderDomRi"></tab-tree-list>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        treeData: {
          checkbox: true
        },
        tabTreeData: [{
          id: 0,
          label: '部门名称',
          children: [{
            id: 1,
            label: '一级 1',
            children: [{
              id: 4,
              label: '二级 1-1',
              children: [{
                id: 9,
                label: '三级 1-1-1'
              }, {
                id: 10,
                label: '三级 1-1-2'
              }]
            }]
          }, {
            id: 2,
            label: '一级 2',
            children: [{
              id: 5,
              label: '二级 2-1'
            }, {
              id: 6,
              label: '二级 2-2'
            }]
          }, {
            id: 3,
            label: '一级 3',
            children: [{
              id: 7,
              label: '二级 3-1'
            }, {
              id: 8,
              label: '二级 3-2'
            }]
          }]
        }]
      }
    },
    methods: {
      renderDomLe () {
        return (
          <div>
            2121545454
          </div>)
      },
      renderDomRi () {
        return (
          <div>
          00000
          </div>)
      }
    }
  }
</script>
-->
<template>
  <div>
    <tab-tree-list :data="treeData" :render-dom-le="renderDomLe" :render-dom-ri="renderDomRi"></tab-tree-list>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        treeData: {
          checkbox: true,
          url: this.$Api.user.treeListData,
          treeData: {
            id: 0,
            label: '部门名称',
            children: []
          }
        },
        tabTreeData: {
          id: 0,
          label: '部门名称',
          children: [{
            id: 1,
            label: '一级 1',
            children: [{
              id: 4,
              label: '二级 1-1',
              children: [{
                id: 9,
                label: '三级 1-1-1'
              }, {
                id: 10,
                label: '三级 1-1-2'
              }]
            }]
          }, {
            id: 2,
            label: '一级 2',
            children: [{
              id: 5,
              label: '二级 2-1'
            }, {
              id: 6,
              label: '二级 2-2'
            }]
          }, {
            id: 3,
            label: '一级 3',
            children: [{
              id: 7,
              label: '二级 3-1'
            }, {
              id: 8,
              label: '二级 3-2'
            }]
          }]
        }
      }
    },
    methods: {
      renderDomLe () {
        return (
            <div>
            2121545454
            </div>)
      },
      renderDomRi () {
        return (
            <div>
            00000
            </div>)
      }
    }
  }
</script>
