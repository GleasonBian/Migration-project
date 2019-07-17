<!-- 现场实施 项目部绩效考核 -->
<template>
  <div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <tab-but :data="btnData" @to-export="exportIns" @to-import="importIns" @to-download="download"></tab-but>
    <el-table :data="dataList" style="width: 100%">
      <el-table-column type="index" label="序号" align='center'></el-table-column>
      <el-table-column prop="month" label="月份" align='center'></el-table-column>
      <el-table-column prop="projectName" label="梁场名称" align='center'></el-table-column>
      <el-table-column prop="retainedProfit" label="净利润" align='center'></el-table-column>
      <el-table-column prop="number" label="人数" align='center'></el-table-column>
      <el-table-column prop="personPer" label="人均净利润" align='center'></el-table-column>
      <el-table-column prop="grade" label="等级" align='center'></el-table-column>
      <el-table-column prop="personnel" label="人员名单" align='center'></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageNo"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--批量导入-->
    <v-dialog :dialog="initTabData" :dialog-footer="dialogEditFooter" @on-cancel="initWareouseCancel" @on-ok="initWareouseOk">
      <div style="margin-top: 20px; width: 100%">
        <el-row>
          <el-col :span="25">
            <div class="monthClass">
              <div style="margin-top: 8px;">选择月份：</div>
              <el-date-picker
                v-model="uploadData.data.month"
                type="month"
                value-format='yyyyMM'
                format="yyyyMM"
                placeholder="选择月">
              </el-date-picker>
            </div>

            <div class="monthClass">
              <div style="margin-top: 8px;">选择文件：</div>
              <div>
                <v-upload :data="uploadData" :customBeforeUpload=true @on-success="uploadSuccess">
                  <div>
                    <el-button size="small" type="primary">点击上传</el-button>
                  </div>
                </v-upload>
                <ul>
                      <li v-for="(i,index) in fileList" :key="index">{{i.name}}</li>
                    </ul>
              </div>
            </div>

            
          </el-col>
        </el-row>
      </div>
    </v-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchData:[{
            label: '选择月份：',
            value: '',
            key: 'month',
            date: {
              type: 'month',
              valueFormat:'yyyyMM',
              placeholder:"请选择",
            }
          }],
        dataSearch:{},
        dataList:[],
        btnData: [
          {
            text: '导出考核',
            key: 'to-export',
            disabled: false
          },
          {
            text: '导入考核',
            key: 'to-import',
            disabled: false
          },
          {
            text: '下载考核模板',
            key: 'to-download',
            disabled: false
          },
        ],
        page:{
          limit:10,
          pageNo:1
        },
        total:0,

        initTabData: {width: '600px', show: false,title:"导入考核"},
        dialogEditFooter: [{text: '取消', key: 'cancel'},{text: '保存', key: 'ok'}],
        uploadData: {
          url: this.$Api.board.importPerformanceProject,
          listType: 'text',
          showFileList: false,
          name: 'file',
          data: {
            month:''
          },
          custom: true
        },
        fileList:[]
      };
    },
    created() {
      this.searchBoxDefaultTime()
      this.getData()

    },
    methods: {
      searchBoxDefaultTime(){
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth()+1;
      month < 10 ? month = '0' + month : month = month
      this.dataSearch.month = year + month
    },
      getData(){
        let json;
        if (JSON.stringify(this.dataSearch) == '{}') {
          json = Object.assign(this.page) 
        }else{
          json = Object.assign(this.dataSearch,this.page)
        }
        this.$Ajax.post({
          url: this.$Api.board.findPerformanceProjectDate,
          data: json,
          cb: res => {
            this.dataList = res.data.rows
            this.total = res.data.total
          }
        })
      },
      

      search (res) {
        this.dataSearch = res
        this.page.pageNo = 1
        this.getData()
      },
      handleSizeChange(val) {
        this.page.limit = val
        this.page.pageNo = 1
        this.getData()
      },
      handleCurrentChange(val) {
        this.page.pageNo = val
        this.getData()
      },




      exportIns(){
        if (JSON.stringify(this.dataSearch) == '{}') {
          location.href = this.$Api.board.exportPerformanceProjectList
        }else{
          location.href = this.$Api.board.exportPerformanceProjectList + '?month=' + this.dataSearch.month
        }

      },
      importIns(){
        console.log('导入考核')
        this.initTabData.show = true
      },
      exportSub(val){
        console.log('导出明细',val)
      },

      download(val){
        console.log('下载模板',val)
        location.href = this.$Api.board.downloadTemplate
      },
      initWareouseCancel () {
        this.initTabData.show = false
        this.$bus.emit('clear-files')
      },
      initWareouseOk(){
        this.initTabData.show = false
        this.$bus.emit('clear-files')
      },
      uploadSuccess (res, file, fileList) {
        console.log(fileList)
        if (res.result) {
          this.fileList = fileList
          this.$message('上传文件成功')
          this.getData();
        } else {
          this.$message.error(res.message)
        }
      }
    },
  }
</script>
<style scoped>
  .monthClass{
    display: flex;margin-bottom: 20px;
  }
  .monthClass >>> .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 200px;
  }
</style>