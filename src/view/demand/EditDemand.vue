<template>
  <div>
    <div class="box_form_purchase">
      <form-group :data="dataForm" :data-but="dataBut" @on-ok="saveAll" @return-page="returnListPage" :custom=true>
        <template v-slot:buyUserName="scope">
          <span ref="buyer">{{buyUserName ? buyUserName : ''}}</span>
          <el-button type="text" @click="choiceBuyer"><i class="el-icon-plus"></i>选择采购员</el-button>
        </template>
        <template v-slot:areaExpressIds="scope">
          <v-cites @on-change="citesChange" :value="citesValues"></v-cites>
        </template>
        <template v-slot:uploadFile="scope">
          <div class="uploadBox">
            <v-upload :data="uploadData" :customBeforeUpload=true @on-success="uploadSuccess" @on-remove="onRemove">
              <div><el-button size="small" type="" icon="el-icon-upload2">选择文件</el-button></div>
            </v-upload>
          </div>
        </template>
        <template v-slot:boxTable="scope">
          <tab-but :data="btnAddGoodsData" @on-add="addGoods" @del-goods="delGoods"></tab-but>
          <table-list :data-header="dataHeaderGoodsAll" :static=true :dataStatic="dataTableGoodsAll"
                      @selection-change="selectionChangeGoodsAll" :refs="tableDemandGoodsAll" >
            <template v-slot:goodsCode="scope">
              <div v-if="scope.row.type !== 2">{{scope.row.goodsId}}</div>
            </template>
            <template v-slot:goodsName="scope">
              <div>
                <el-input v-model="scope.row.goodsName" placeholder="商品名称" style="width:150px"></el-input>
              </div>
            </template>
            <template v-slot:typeModel="scope">
              <div>
                <el-input v-model="scope.row.typeModel" placeholder="规格型号" style="width:150px"></el-input>
              </div>
            </template>
            <template v-slot:brandName="scope">
              <div>
                <el-input v-model="scope.row.brandName" placeholder="品牌名称" style="width:150px"></el-input>
              </div>
            </template>
            <template v-slot:unit="scope">
              <div>
                <el-input v-model="scope.row.unit" placeholder="单位" style="width:150px"></el-input>
              </div>
            </template>
            <template v-slot:goodsCount="scope">
              <el-input v-model="scope.row.goodsCount" type="number" size="small" placeholder="0"
                        min="0" style="width:150px"></el-input>
            </template>
            <template v-slot:totalGoodsPrice="scope"><div>{{scope.row | getSubtotal}}</div></template>
            <template v-slot:remark="scope">
              <el-input v-model="scope.row.remark" size="small" placeholder="备注"
                        style="width:150px"></el-input>
            </template>
          </table-list>
          <div style="margin-top: 10px;">
            <el-button @click="addGoodsManual()">手动添加</el-button>
          </div>
        </template>
      </form-group>
      <v-dialog :dialog="dialogGoods">
        <form-group :data="goodsDialogData" :dataBut="dataGoodsBut" :custom=true
                    @on-ok="saveGoodsData" @on-cancel="cancelGoods" @close-dialog="closeDialogGoods">
          <template v-slot:searchGoodsData="scope">
            <v-search :data="searchGoodsData" @on-click="searchGoods"></v-search>
          </template>
          <template v-slot:selectedGoods="scope">
            <table-list :data-header="dataHeaderGoods" :url="tabGoodsUrl" :params="pageGoods"
                        @selection-change="selectionChange" @get-table-data="getTableGoodsData" :refs="tableDemandGoods">
            </table-list>
            <v-page :data="pageGoods" :dataArr="[dataSearchGoods]"></v-page>
          </template>
        </form-group>
      </v-dialog>
      <v-dialog :dialog="dialogBuyer">
        <form-group :data="buyerDialogData" :dataBut="dataBuyerBut" :custom=true
                    @on-ok="saveBuyerData" @on-cancel="cancelBuyer" @close-dialog="closeDialogBuyer">
          <template v-slot:searchBuyerData="scope">
            <v-search :data="searchBuyerData" @on-click="searchBuyer"></v-search>
          </template>
          <template v-slot:selectedBuyer="scope">
            <table-list :data-header="dataHeaderBuyer" :url="tabBuyerUrl" :params="pageBuyer"
                        @get-table-data="getTableBuyerData" :refs="tableDemandBuyer">
              <template v-slot:radioSelect="scope">
                <el-radio v-model="radioChooseBuyer" :label="scope.row">&nbsp;</el-radio>
              </template>
            </table-list>
            <v-page :data="pageBuyer" :dataArr="[dataSearchBuyer]"></v-page>
          </template>
        </form-group>
      </v-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          from: [ {
            prop: 'type',
            label: '采购类型：',
            defaultVal: 1,
            labelWidth: '150px',
            required: true,
            radio: [{
              label: 1,
              text: '物资采购'
            }, {
              label: 2,
              text: '设备采购'
            }]
          }, {
            prop: 'buyUserName',
            label: '选择采购员：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{ required: true, message: '请选择仓库', trigger: 'blur,change' }],
            custom: true
          }, {
            prop: 'projectName',
            label: '梁场名称：',
            labelWidth: '150px',
            value: '',
            disabled: true
          }, {
            prop: 'buyLinkManPhone',
            label: '联系方式：',
            labelWidth: '150px',
            value: '',
            disabled: true
          }, {
            prop: 'expressLinkMan',
            label: '收货人：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{ required: true, message: '请输入收货人', trigger: 'blur,change' }]
          }, {
            prop: 'expressLinkManPhone',
            label: '收货人联系电话：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{ trigger: 'blur,change' }]
          }, {
            prop: 'areaExpressIds',
            label: '所在区域：',
            labelWidth: '150px',
            value: [],
            custom: true,
            rules: [{required: true, message: '所在区域不能为空', trigger: 'blur,change'}]
          }, {
            prop: 'expressAddress',
            label: '详细地址：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{required: true, message: '详细地址不能为空', trigger: 'blur,change'}]
          }, {
            prop: 'expectedDeliveryTime',
            label: '期望到货时间：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{ required: true, message: '请选择期望到货时间', trigger: 'blur,change' }],
            date: {
              type: 'date'
            }
          }, {
            prop: 'remark',
            label: '备注：',
            labelWidth: '150px',
            value: '',
            type: 'textarea',
            rows: 3
          }, {
            prop: 'uploadFile',
            label: '上传文件：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'boxTable',
            label: '',
            labelWidth: '0',
            value: '',
            custom: true
          }],
          class: 'form_purchase'
        },
        dataBut: [{
          text: '取消',
          key: 'return-page'
        }, {
          text: '确定',
          key: 'ok',
          type: 'primary'
        }],
        uploadData: {
          url: this.$Api.demand.uploadFilePurchaser,
          listType: 'text',
          name: 'file',
          data: {},
          fileList: [],
          custom: true
        },
        dialogBuyer: {
          show: false,
          title: '选择采购员列表',
          width: '900px'
        },
        buyerDialogData: {
          from: [
            {
              prop: 'searchBuyerData',
              custom: true
            }, {
              prop: 'selectedBuyer',
              custom: true
            }
          ]
        },
        dataBuyerBut: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '确定',
          type: 'primary',
          key: 'ok'
        }],
        searchBuyerData: [{
          key: 'userName',
          label: '采购员名称：',
          value: '',
          type: 'text'
        }, {
          key: 'projectId',
          label: '梁场名称：',
          value: '',
          select: []
        }],
        pageBuyer: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_demand_buyer'
        },
        dataHeaderBuyer: [{
          prop: 'radioSelect',
          label: '',
          slot: true,
          width: 50
        }, {
          prop: 'userName',
          label: '采购员名称'
        }, {
          prop: 'projectName',
          label: '梁场名称'
        }],
        tabBuyerUrl: this.$Api.demand.loadPurchaseUserInfoByPage,
        tableDemandBuyer: 'table_demand_buyer',
        radioChooseBuyer: {},
        urlBeamField: this.$Api.orderManger.getProjectList,
        arrBeamData: [],
        initPurchaseRequestId: '',
        buyUserId: '',
        buyUserName: '',
        projectId: '',
        arrBeamName: [],
        saveUrl: this.$Api.demand.updatePurchaseRequest,
        dataSearchGoods: [],
        btnAddGoodsData: [{
          text: '新增商品',
          key: 'add'
        }, {
          text: '删除',
          key: 'del-goods'
        }],
        selection: [],
        dataFormEnterprise: {},
        tableDemandGoodsAll: 'table_demand_goods_all',
        dataTableGoodsAll: [],
        goodsArr: [],
        dataHeaderGoodsAll: [{
          type: 'selection'
        }, {
          prop: 'goodsCode',
          label: '商品编号',
          slot: true
        }, {
          prop: 'goodsName',
          label: '商品名称',
          slot: true
        }, {
          prop: 'typeModel',
          label: '规格型号',
          slot: true
        }, {
          prop: 'brandName',
          label: '品牌',
          slot: true
        }, {
          prop: 'unit',
          label: '单位',
          slot: true
        }, {
          prop: 'unitPrice',
          label: '单价'
        }, {
          prop: 'goodsCount',
          label: '数量',
          slot: true
        }, {
          prop: 'remark',
          label: '其他要求',
          slot: true
        }],
        dialogGoods: {
          show: false,
          title: '选择商品',
          width: '900px'
        },
        goodsDialogData: {
          from: [
            {
              prop: 'searchGoodsData',
              custom: true
            }, {
              prop: 'selectedGoods',
              custom: true
            }
          ]
        },
        dataGoodsBut: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '确定',
          type: 'primary',
          key: 'ok'
        }],
        searchGoodsData: [{
          key: 'name',
          label: '商品名称：',
          value: '',
          type: 'text'
        }, {
          key: 'brand',
          label: '品牌：',
          value: '',
          type: 'text'
        }],
        dataHeaderGoods: [{
          type: 'selection'
        }, {
          prop: 'id',
          label: '商品编号'
        }, {
          prop: 'goodsName',
          label: '商品名称'
        }, {
          prop: 'goodsSpec',
          label: '规格型号'
        }, {
          prop: 'className',
          label: '三级类目'
        }, {
          prop: 'brandName',
          label: '品牌'
        }, {
          prop: 'unit',
          label: '单位'
        }, {
          prop: 'price',
          label: '单价'
        }],
        tabGoodsUrl: this.$Api.demand.findGoodsGroupByNameAndBrand,
        tableDemandGoods: 'table_demand_goods',
        pageGoods: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_demand_goods'
        },
        selectionDataMiddle: [],
        selectionGoodsAll: [],
        urlDeleteFile: this.$Api.demand.deletedFile,
        dataSearchBuyer: {},
        urlDataAll: this.$Api.demand.getPurchaseRequestById,
        dataFormAll: {},
        citesValues: [],
        addGoodsManualId: new Date(),
        dataTableGoodsAllArr: []
      }
    },
    filters: {
      getSubtotal: function (res) {
        res.mtotal = Number(res.unitPrice) * Number(res.goodsCount)
        if (!res.unitPrice || !res.goodsCount) {
          res.mtotal = ''
        }
        return res.mtotal
      }
    },
    created () {
      this.getCheck()
      let id = this.$route.params.id
      this.initPurchaseRequestId = id
      this.uploadData.data.id = id
      this.getDataAll(id)
    },
    computed: {
      getCheckPhone () {
        return (rule, value, callback) => {
          if (!value) {
            callback(new Error('手机号不能为空'))
          } else {
            if (!this.$Validate.mobilephone(value)) {
              callback(new Error('请输入正确的手机号'))
            } else {
              callback()
            }
          }
        }
      }
    },
    methods: {
      checkFn (formName, i, n, checkRule) {
        formName.from[i].rules[n].validator = checkRule
      },
      getCheck () {
        this.checkFn(this.dataForm, 5, 0, this.getCheckPhone)
      },
      showHideDialog (name, b) {
        name.show = b
      },
      jumpPage (nameR) {
        this.$router.push({
          name: nameR
        })
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      getDataAll (id) {
        this.$Ajax.post({
          url: this.urlDataAll,
          data: {
            id: id
          },
          cb: res => {
            if (res.data.result) {
              this.dataFormAll = res.data.data
              this.showDataAll(this.dataFormAll)
              this.buyUserId = this.dataFormAll.buyUserId
              this.projectId = this.dataFormAll.projectId
            }
          }
        })
      },
      showDataAll (res) {
        this.buyUserName = this.dataFormAll.buyUserName
        let fileNameList = this.dataFormAll.relatedFileVOList
        fileNameList.map(item => {
          item.name = item.fileOldName
        })
        this.uploadData.fileList = fileNameList
        this.dataTableGoodsAll = this.dataFormAll.purchaseRequestGoodsVOList
        this.selection = this.dataFormAll.purchaseRequestGoodsVOList
        this.dataForm.from.map(item => {
          if (item.prop === 'type') {
            item.defaultVal = this.dataFormAll.type
          } else if (item.prop === 'areaExpressIds') {
            let string = []
            if (this.dataFormAll.areaExpressIds) {
              string = this.dataFormAll.areaExpressIds.split(',')
            }
            string.map(i => {
              this.citesValues.push(i)
            })
            item.value = this.citesValues
          } else {
            item.value = this.dataFormAll[item.prop]
          }
        })
      },
      ajaxPost (url, data, cb) {
        this.$Ajax.post({
          url: url,
          data: data,
          cb: cb
        })
      },
      fliterSelectBeam (res) {
        let arrBeam = []
        if (res.length) {
          res.map(item => {
            arrBeam.push({label: item.projectName, value: item.id})
          })
        }
        return arrBeam
      },
      getBeamField () {
        this.$Ajax.post({
          url: this.urlBeamField,
          data: {},
          cb: res => {
            if (res.data.result) {
              this.arrBeamData = res.data.data
              this.searchBuyerData.map(item => {
                if (item.key === 'projectId') {
                  item.select = this.fliterSelectBeam(this.arrBeamData)
                }
              })
            }
          }
        })
      },
      uploadSuccess (res) {
        if (res.result) {
          this.dataForm.from[10].value = res.data.imgUrl
          this.$message('上传文件成功')
        } else {
          this.$message.error(res.message)
        }
      },
      onRemove (file) {
        let id = file.id
        this.ajaxPost(this.urlDeleteFile, {id: id}, (res) => {
          if (res.data.result) {
            this.$message('删除文件成功')
          } else {
            this.$message.error(res.message)
          }
        })
      },
      citesChange (val) {
        this.cites(this.dataForm, val)
      },
      cites (obj, val) {
        obj.from[6].value = val.label
        this.arrBeamName = val.value
      },
      choiceBuyer () {
        this.dataSearchBuyer = []
        this.pageUpdateTable([this.dataSearchBuyer, this.pageBuyer], this.tableDemandBuyer, this)
        this.getBeamField()
        this.showHideDialog(this.dialogBuyer, true)
      },
      cancelBuyer () {
        this.showHideDialog(this.dialogBuyer, false)
      },
      closeDialogBuyer () {
        this.showHideDialog(this.dialogBuyer, false)
      },
      getTableBuyerData (data) {
        this.pageBuyer.totalNum = data.data.total
      },
      dataFormData (res) {
        this.dataForm.from.map(item => {
          if (item.prop === 'buyUserName') {
            item.value = res.userName
          }
          if (item.prop === 'projectName') {
            item.value = res.projectName
          }
          if (item.prop === 'buyLinkManPhone') {
            item.value = res.userId
          }
        })
      },
      saveBuyerData () {
        this.buyUserId = this.radioChooseBuyer.id
        this.projectId = this.radioChooseBuyer.projectId
        if (JSON.stringify(this.radioChooseBuyer) === '{}') {
          this.$message('请选择采购员')
        } else {
          this.buyUserName = this.radioChooseBuyer.userName
          this.dataForm.from[0].value = this.buyUserName
          this.dataFormData(this.radioChooseBuyer)
          this.showHideDialog(this.dialogBuyer, false)
        }
      },
      getTableGoodsData (data) {
        this.pageGoods.totalNum = data.data.total
      },
      addGoods () {
        this.dataSearchGoods = []
        this.pageUpdateTable([this.dataSearchGoods, this.pageGoods], this.tableDemandGoods, this)
        this.showHideDialog(this.dialogGoods, true)
      },
      delGoods () {
        let allData = Object.assign([], this.dataTableGoodsAll)
        if (this.selectionGoodsAll.length) {
          this.dataTableGoodsAll = allData.filter((item, i) => {
            let bBut = true
            this.selectionGoodsAll.map(ntem => {
              if (item.id === ntem.id) {
                bBut = false
              }
            })
            return bBut
          })
        } else {
          this.showAlert('请选择数据', () => {})
        }
      },
      addGoodsManual () {
        this.dataTableGoodsAll.push({
          type: 2,
          id: this.addGoodsManualId.valueOf()
        })
        this.addGoodsManualId++
      },
      selectionChange (selection) {
        this.selectionDataMiddle = selection
      },
      selectionChangeGoodsAll (selection) {
        this.selectionGoodsAll = selection
      },
      saveGoodsData (res) {
        if (this.selectionDataMiddle && this.selectionDataMiddle.length > 0) {
          this.showHideDialog(this.dialogGoods, false)
          this.pageUpdateTable([this.searchGoodsData, this.pageGoods], this.tableDemandGoods, this)
          if (this.dataTableGoodsAll && this.dataTableGoodsAll.length > 0) {
            this.dataTableGoodsAll.map(otem => {
              this.dataTableGoodsAllArr.push(otem.id)
              this.dataTableGoodsAllArr.push(otem.goodsId)
            })
            this.selectionDataMiddle.map(item => {
              let _index = this.dataTableGoodsAllArr.indexOf(item.id)
              if (_index === -1) {
                item.goodsId = item.id
                item.unitPrice = item.price
                item.typeModel = item.goodsSpec
                item.type = 1
                this.dataTableGoodsAll.push(item)
              }
            })
          } else {
            this.selectionDataMiddle.map(item => {
              item.type = 1
            })
            this.dataTableGoodsAll = this.selectionDataMiddle
          }
        } else {
          this.$message('请选择商品')
        }
      },
      cancelGoods () {
        this.showHideDialog(this.dialogGoods, false)
      },
      closeDialogGoods () {
        this.showHideDialog(this.dialogGoods, false)
      },
      searchGoods (res) {
        this.dataSearchGoods = res
        if (JSON.stringify(this.dataSearchGoods) === '{}') {
          this.pageGoods.offset = 0
          this.pageGoods.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearchGoods, this.pageGoods], this.tableDemandGoods, this)
      },
      searchBuyer (res) {
        this.dataSearchBuyer = res
        if (JSON.stringify(this.dataSearchBuyer) === '{}') {
          this.pageBuyer.offset = 0
          this.pageBuyer.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearchBuyer, this.pageBuyer], this.tableDemandBuyer, this)
      },
      ajaxDataAll (res) {
        this.$Ajax.post({
          url: this.saveUrl,
          data: {
            json: JSON.stringify(this.dataFormEnterprise)
          },
          cb: res => {
            if (res.data.result) {
              this.jumpPage('demandScene')
            }
          }
        })
      },
      showAlert (msg, myCallback) {
        this.$alert(msg, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            myCallback()
          }
        })
      },
      saveAll (res) {
        res.id = this.initPurchaseRequestId
        res.buyUserId = this.buyUserId
        res.projectId = this.projectId
        res.areaExpressIds = res.areaExpressIds.join(',')
        res.areaExpressId = res.areaExpressIds[res.areaExpressIds.length - 1]
        res.areaName = this.arrBeamName.join(' ')
        this.goodsArr = []
        this.dataTableGoodsAll.map(item => {
          if (item.id) {
            item.id = item.id
          } else {
            item.id = null
          }
          this.goodsArr.push({
            purchaseRequestId: this.initPurchaseRequestId,
            type: item.type,
            id: item.id,
            goodsId: item.goodsId,
            goodsName: item.goodsName,
            typeModel: item.typeModel,
            brandName: item.brandName,
            goodsCount: item.goodsCount,
            unitPrice: item.unitPrice,
            totalGoodsPrice: item.totalGoodsPrice,
            unit: item.unit,
            remark: item.remark

          })
        })
        let flag = true
        this.goodsArr.map(item => {
          if (!item.goodsCount) {
            flag = false
            this.showAlert('请正确填写数量', () => {})
          } else if (Number(item.goodsCount) <= 0) {
            flag = false
            this.showAlert('请正确填写数量', () => {})
          }
        })
        if (flag) {
          res.purchaseRequestGoodsVOList = this.goodsArr
          this.dataFormEnterprise = res
          if (!this.goodsArr.length) {
            this.$message('请选择商品')
          } else {
            this.ajaxDataAll()
          }
        }
      },
      returnListPage () {
        this.jumpPage('demandScene')
      }
    },
    watch: {
      'buyUserName': function (val, oldVal) {
        if (val) {
          this.$refs.buyer.parentNode.lastChild.innerHTML = ''
        }
      }
    }
  }
</script>

<style>
  .form_purchase .el-form-item .el-input__inner,
  .form_purchase .el-form-item .el-textarea,
  .form_purchase .el-form-item .el-upload-list__item{
    width:400px !important;
  }
  .form_purchase .el-form-item .el-table__body .el-input__inner,
  .form_purchase .el-form-item .el-table__body .el-textarea,
  .form_purchase .el-form-item .el-table__body .el-upload-list__item{
    width:100% !important;
  }
  .uploadBox .avatar-uploader .el-upload{border:none}
  .box_form_purchase .el-form-item.dataBut{text-align: center}
</style>
