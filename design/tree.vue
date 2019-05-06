<template>
  <div>
    <table-list :data-header="dataHeader" :url="tabUrl" :refs="tableRegionList">
      <template slot-scope="scope" slot="operation">
        <tab-but :data="operationBtn" @on-relatedArea="onRelatedArea(scope.row)"></tab-but>
      </template>
    </table-list>
    <v-dialog :dialog="dialogRelatedArea">
      <form-group :data="relatedArea" :clear=true :data-but="dataButArea" @on-cancel="cancelArea"
                  @close-dialog="cancelArea" @ok-area="okArea">
        <template slot-scope="scope" slot="searchArea">
          <v-tree :data="treeData" :refs="treeDataObj" @get-checked-nodes="getCheckedNodes"></v-tree>
        </template>
      </form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataHeader: [{
          type: 'selection'
        }, {
          prop: 'areaName',
          label: '区域名称'
        }, {
          prop: 'createTimeStr',
          label: '创建时间'
        }, {
          prop: 'status',
          label: '是否启用',
          slot: true
        }, {
          label: '操作',
          prop: 'operation',
          slot: true
        }],
        tabUrl: this.$Api.baseGoods.pagerArea,
        tableRegionList: 'table_region_list',
        operationBtn: [{
          text: '关联区域',
          key: 'on-relatedArea',
          type: 'text'
        }],
        dialogRelatedArea: {
          show: false,
          title: '编辑区域',
          width: '30%'
        },
        relatedArea: {
          labelWidth: '120px',
          from: [{
            prop: 'areaName',
            label: '地区名称：',
            text: {
              value: '22'
            }
          }, {
            prop: 'searchArea',
            label: '搜素地区：',
            custom: true
          }]
        },
        dataButArea: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '保存',
          key: 'ok-area'
        }],
        treeData: {
          url: this.$Api.areas.findAreas,
          showCheckbox: true,
          NodeKey: 'id',
          search: true,
          class: 'findAreas',
          props: {
            label: 'areaName'
          },
          nodeKey: 'id',
          searchPlaceholder: '输入关搜索内容',
          defaultCheckedKeys: [],
          baseAreaId: 0
        },
        treeDataObj: 'treeData'
      }
    },
    methods: {
      getData () {
      },
      onRelatedArea (item) {
        this.$bus.emit('update-tree', this.treeDataObj)
        this.baseAreaId = item.id
        this.dialogRelatedArea.show = true
      },
      cancelArea () {
        this.dialogRelatedArea.show = false
      },
      getCheckedNodes (data) {
        this.areaData = data
      },
      okArea () {
        let data = {
          baseAreaId: this.baseAreaId,
          areaIds: this.filterAreaData(this.areaData)
        }
        this.saveList(data)
      },
      filterAreaData (data) {
        let arr = []
        data.map(item => {
          arr.push(item.id)
        })
        return arr
      },
      saveList (data) {
        this.$Ajax.post({
          url: this.$Api.areas.saveList,
          data: data,
          cb: res => {
            if (res.data.result) {
              this.dialogRelatedArea.show = false
            }
          }
        })
      }
    }
  }
</script>

<style>
</style>
