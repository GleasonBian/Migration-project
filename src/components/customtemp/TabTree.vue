<template>
    <table-list :data-header="headerData" :url="url" :params="params" :refs="refs" @get-table-data="getTableData" @expand-change="expandChange">
       <template v-for="slotName in slotArr" slot-scope="scope" :slot="slotName">
            <slot :column="headerData" :rows="scope.rows" :row="scope.row" :index="scope.index" :name="slotName"></slot>
        </template>
        <template slot-scope="scope" slot="expand">
            <div class="table_tree_sub">
                <tab-tree-node :refs="'tab_name_' + scope.row.id" :header-data="headerData" :url="subUrl" :params="parentId" :no-expand="noExpand" :slot-arr="slotArr">
                    <template v-for="slotName in slotArr" slot-scope="scope" :slot="slotName">
                        <slot :column="headerData" :rows="scope.rows" :row="scope.row" :index="scope.index" :name="slotName"></slot>
                    </template>
                </tab-tree-node>
            </div>
        </template>
    </table-list>
</template>

<script>
  export default {
    name: 'TabTree',
    data () {
      return {
        parentId: 0,
        subRefs: ''
      }
    },
    props: {
      headerData: Array,
      url: String,
      subUrl: String,
      params: Object,
      refs: String,
      noExpand: Number,
      slotArr: Array,
      static: Boolean
    },
    methods: {
      getTableData (res) {
        this.$emit('get-table-data', res)
      },
      expandChange (row, expandedRows) {
        this.parentId = row.id
      }
    }
  }
</script>

<style>
    .table_tree_sub {
        padding: 2px 2px 2px 36px;
    }
</style>
