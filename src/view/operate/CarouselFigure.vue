<template>
  <div>
    <v-search :data="Searchdata" @on-click="searchDataClick"></v-search>
    <TabBut :data="TabButData" @on-add="onAdd"></TabBut>
    <table-list :data-header="TableDataHeader" :url="DataUrl" class="tb_set"
                @selection-change="selectionChange"
                @get-table-data="getTableData"
                :params="page"
                :refs="tablePerformance">
      <template slot-scope="scope" slot="imgUrl">
        <img :src="scope.row.imgUrl" />
      </template>
      <template slot-scope="scope" slot="operation">
        <TabBut :data="tbBut" @on-edit="onEdit(scope.row)" @on-del="onDel(scope.row)" @publish="onPublish(scope.row)"  v-show="scope.row.state !== '发布中'"></TabBut>
        <TabBut :data="tbButDown" @on-edit="onDown(scope.row)" v-show="scope.row.state === '发布中'"></TabBut>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        Searchdata: [
          {label: '标题', value: '', key: 'title'},
          {
            label: '所在区域',
            value: '',
            key: 'infoClassSelect',
            select: []
          }
        ],
        TabButData: [{text: '新增', key: 'add'}],
        TableDataHeader: [
          {type: 'selection', width: '10px'},
          {label: '所在区域', prop: 'type'},
          {label: '标题', prop: 'title'},
          {label: '图片', prop: 'imgUrl', slot: true, width: '160px'},
          {label: '链接', prop: 'url'},
          {label: '状态', prop: 'state'},
          {label: '排序', prop: 'sortOrderNo'},
          {label: '描述', prop: 'description'},
          {label: '操作', prop: 'operation', slot: true, width: '200px'}
        ],
        tbBut: [
          {text: '编辑', key: 'edit', type: 'text'},
          {text: '发布', key: 'publish', type: 'text'},
          {text: '删除', key: 'del', type: 'text'}
        ],
        tbButDown: [
          {text: '下架', key: 'edit', type: 'text'}
        ],
        DataUrl: this.$Api.carousel.indexPage,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_index_list',
          typeCode: 99
        },
        tablePerformance: 'tab_index_list',
        dataSearch: {}
      }
    },
    created () {
      this.getAreaSearch()
    },
    methods: {
      getAreaSearch () {
        this.$Ajax.post({
          url: this.$Api.carousel.getArea,
          cb: res => {
            if (res.data.result) {
              this.Searchdata[1].select = res.data.data
            }
          }
        })
      },
      searchDataClick (res) {
        if (res.infoClassSelect) {
          this.page.typeCode = parseInt(res.infoClassSelect)
        } else {
          this.page.typeCode = 99
        }
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.page.offset = 0
        this.page.currentPage = 1
        this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      selectionChange (selection) {
        this.selection = selection
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
        data.data.rows.map(item => {
          item.imgUrl = this.$ImgPath.imgApi.imgApi + '/' + item.imgUrl
          if (item.state === 'PUBLISHED') {
            item.state = '发布中'
          } else {
            item.state = '下架'
          }
          if (item.type === 'INDEX_BANNER') {
            item.type = '自营商城首页banner'
          } else if (item.type === 'WX_BANNER') {
            item.type = '微信商城首页banner'
          } else if (item.type === 'APP_BANNER') {
            item.type = 'APP商城首页banner'
          }
        })
      },
      onEdit (row) {
        this.$router.push({name: 'carouselFigureEdit', params: {id: row.id}})
      },
      onDel (row) {
        this.$Ajax.post({
          url: this.$Api.carousel.delete,
          data: {id: row.id},
          cb: res => {
            if (res.data.result) {
              this.$message('删除成功！')
              this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          }
        })
      },
      onDown (row) {
        this.setState(row.id, '下架')
      },
      setState (id, type) {
        let stateCode = 0
        if (type === '发布') {
          stateCode = 1
        } else {
          stateCode = 0
        }
        let data = {
          id: id,
          stateCode: stateCode
        }
        this.$Ajax.post({
          url: this.$Api.carousel.update,
          data: data,
          cb: res => {
            if (res.data.result) {
              this.$message(type + '成功！')
              this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          }
        })
      },
      onPublish (row) {
        this.setState(row.id, '发布')
      },
      onAdd () {
        this.$router.push({name: 'carouselFigureAdd'})
      }
    }
  }
</script>

<style>
.tb_set img { width: 160px; height: 60px;}
</style>
