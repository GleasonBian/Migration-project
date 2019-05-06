<template>
  <div class="base_btn_group">
    <el-button v-for="(item, index) in data" :key="index" :type="item.type ? item.type : 'primary'"
               :size="item.size ? item.size : 'mini'"
               :plain="item.plain ? item.plain : false"
               :loading="item.loading ? item.loading : false"
               :round="item.round ? item.round : false"
               :disabled="item.disabled ? item.disabled : false"
               :icon="item.icon ? item.icon : ''"
               :autofocus="item.autofocus ? item.autofocus : false"
               :native-type="item.nativeType ? item.nativeType : 'button'" @click="butFn(item, itemsData)">{{item.text}}
    </el-button>
  </div>
</template>

<script>
  export default {
    name: 'TabBut',
    data () {
      return {}
    },
    props: {
      data: Array,
      itemsData: [Object, Array],
      dataFn: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getSelectionChangeData () {
        return JSON.parse(this.$Utils.getSessionStorage('selection-change-data'))
      },
      post (url, data, call) {
        this.$Ajax.post({
          url: url,
          data: data,
          cb: call
        })
      },
      get (data) {
        this.$Ajax.get({
          url: data.url,
          data: {
            params: data.data
          },
          cb: (res) => {
          }
        })
      },
      butFn (item, itemsData) {
        switch (item.key) {
          case 'add':
            this.add(item, itemsData)
            break
          case 'del':
            this.del(item, itemsData)
            break
          case 'edit':
            this.edit(item, itemsData)
            break
          case 'search':
            this.search(item)
            break
          case 'reset':
            this.reset(item, itemsData)
            break
          case 'exports':
            this.exports(item, itemsData)
            break
          case 'imports':
            this.imports(item, itemsData)
            break
          default:
            this.other(item, itemsData)
        }
      },
      add (item, itemsData) {
        this.$emit('on-add', item, itemsData)
      },
      del (item, itemsData) {
        if (this.getSelectionChangeData()) {
          if (this.getSelectionChangeData().length > 0) {
            this.isAlter(() => {
              if (JSON.stringify(this.getDelData(item)) !== '{}') {
                if (item.selection && item.selection.length > 0) {
                  this.post(item.url, this.getDelData(item), (res) => {
                    if (res.data.result) {
                      this.$Utils.pageUpdateTable(item.dataArr, item.refs, this)
                    } else {
                      if (res.data.message) {
                        this.$message(res.data.message)
                      }
                    }
                  })
                } else {
                  this.$emit('on-del', item, itemsData)
                }
              }
            })
          } else {
            if (!item.dataArr) {
              this.$emit('on-del', item, itemsData)
            } else {
              this.$message.error('您还为选择数据')
            }
          }
        } else {
          this.$emit('on-del', item, itemsData)
        }
      },
      isAlter (cb) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          cb()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      getDelData (item, itemsData) {
        return this.delFilter(item, this.getSelectionChangeData())
      },
      delFilter (item, callRes) {
        let resultObj = {}
        resultObj[item.filterName] = []
        callRes.map(ntem => {
          for (let s in ntem) {
            if (s === item.filterkey) {
              resultObj[item.filterName].push(ntem[s])
            }
          }
        })
        return resultObj
      },
      edit (item, itemsData) {
        this.$emit('on-edit', item, itemsData)
      },
      search (item, itemsData) {
        this.$emit('on-search', item, itemsData)
      },
      reset (item, itemsData) {
        this.$emit('on-reset', item, itemsData)
      },
      exports (item, itemsData) {
        this.$emit('on-exports', item, itemsData)
      },
      imports (item, itemsData) {
        this.$emit('on-imports', item, itemsData)
      },
      other (item, itemsData) {
        this.$nextTick(() => {
          if (this.dataFn) {
            item.other(item, itemsData)
          } else {
            this.$emit(item.key, item, itemsData)
          }
        })
      }
    }
  }
</script>
