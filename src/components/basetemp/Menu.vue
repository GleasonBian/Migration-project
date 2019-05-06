<template>
  <center-temp :class-name="className">
    <el-menu v-if="menuList.length > 0" :default-active="active" class="el-menu-vertical-demo" :unique-opened=true
             :router=true @select="select" :collapse="isCollapse">
      <div class="text_right">
        <i v-if="!isCollapse" class="icon_menu_btn" @click="iconClick(true)"></i>
        <i v-else class="icon_menu_btn" @click="iconClick(false)"></i>
      </div>
      <template v-for="(moduleMenu, index) in menuList">
        <template v-if="moduleMenu.meta.title && moduleMenu.isModule">
          <el-submenu :index="moduleMenu.index" :key="moduleMenu.index">
            <template slot="title">
              <i class="icon_menu_btn" :class="moduleMenu.meta.icon"></i>
              {{moduleMenu.meta.title}}
            </template>
            <el-menu-item-group>
              <template v-for="(menu, i) in moduleMenu.children">
                <el-menu-item :index="currentMenu.index" :key="currentMenu.index"
                              v-for="(currentMenu, i) in menu.filterData"
                              :route="{name: currentMenu.name}">
                  {{currentMenu.meta.title}}
                </el-menu-item>
              </template>
            </el-menu-item-group>
          </el-submenu>
        </template>
        <template v-else>
          <template v-for="(menu, i) in moduleMenu.children">
            <template v-for="(currentMenu, i) in menu.filterData">
              <el-menu-item class="noGroupMenuItem" :index="currentMenu.index"
                            :route="{name: currentMenu.name}">
                <i :class="moduleMenu.meta.icon"></i>
                {{currentMenu.meta.title}}
              </el-menu-item>
            </template>
          </template>
        </template>
      </template>
    </el-menu>
  </center-temp>
</template>

<script>
  import router from 'common/router'
  import base from 'base'

  export default {
    name: 'v-menu',
    data () {
      return {
        className: 'menuElse',
        active: '0-0',
        menuList: [],
        isCollapse: false
      }
    },
    created () {
      if (base.isLocalMeun) {
        this.addMenuIndex()
      } else {
        this.getUserPermission()
        this.getPageElement()
      }
      this.setDefaultActive()
    },
    methods: {
      iconClick (type) {
        this.isCollapse = type
        this.$emit('getCollapse', this.isCollapse)
      },
      getPageElement () {
        this.$Ajax.post({
          url: this.$Api.login.getPageElement,
          data: {
            systemCode: this.$Consts.PERMISSIONRELATIONS.PROJECTNAME
          },
          cb: res => {
            if (res.data.result) {
              this.$Utils.setSessionStorage('pageElement', res.data.data)
            }
          }
        })
      },
      getUserPermission () {
        this.$Ajax.post({
          url: this.$Api.login.getUserPermission,
          data: {
            systemCode: this.$Consts.PERMISSIONRELATIONS.PROJECTNAME
          },
          cb: res => {
            if (res.data.result) {
              if (Array.isArray(res.data.data) && res.data.data.length > 0) {
                res.data.data.unshift({name: '欢迎访问中台', code: '050010'})
                this.addMenuIndex(res.data.data)
              }
            }
          }
        })
      },
      getMenu () {
        return router.options.routes.filter(item => {
          if (item.meta && item.meta.menu) {
            return true
          }
        })
      },
      addMenuIndex (permissionList) {
        this.getMenu().map(item => {
          this.menuList = item.children.map((ntem, index) => {
            ntem.isModule = false
            ntem.index = index.toString()
            ntem.children.map((ktem, x) => {
              let filterMenus = this.filterMenuListFn(ktem.children, permissionList, index, x)
              if (filterMenus && filterMenus.length > 0) {
                ntem.isModule = true
                ktem.filterData = filterMenus
              }
              return ktem
            })
            return ntem
          })
        })
      },
      filterMenuList (data, index, x) {
        return data.filter(otem => {
          otem.index = index.toString() + '-' + x
          return otem.meta.menu
        })
      },
      filterMenuListFn (data, permissionList, index, x) {
        if (!data) {
          return data
        }
        if (base.isLocalMeun) {
          return this.filterMenuList(data, index, x)
        } else {
          return this.filterMenuList(data, index, x).filter(ftem => {
            permissionList.map(utem => {
              if (utem.code === ftem.code) {
                ftem.filterMenu = ftem
              }
            })
            return ftem.filterMenu
          })
        }
      },
      select (index) {
        this.$Utils.setSessionStorage('menuActive', index)
      },
      setDefaultActive () {
        this.active = this.$Utils.getSessionStorage('menuActive') ? this.$Utils.getSessionStorage('menuActive') : this.active
      },
      pathChangeActive (val) {
        this.menuList.map(item => {
          item.children.map(ntem => {
            ntem.children.map(otem => {
              if (otem.name === val.name) {
                this.$Utils.setSessionStorage('menuActive', otem.index)
              }
            })
          })
        })
      }
    },
    watch: {
      $route (val, oldVal) {
        this.pathChangeActive(val)
        this.setDefaultActive()
      }
    }
  }
</script>
<style scoped>
  .icon_menu_btn {
    width: 24px;
    display: inline-block;
    height: 24px;
    background: url(../static/img/icon_menu.png) no-repeat;
    transform: scale(0.7);
  }
  .icon_menu_btn.icon_menu_visualization_board{
    background-position: 0 -573px;
  }
  .icon_menu_btn.icon_menu_home {
    background-position: 0 -58px;
  }

  .icon_menu_btn.icon_menu_board {
    background-position: 0 -100px;
  }

  .icon_menu_btn.icon_menu_user {
    background-position: 0 -147px;
  }

  .icon_menu_btn.icon_menu_sales {
    background-position: 0 -192px;
  }

  .icon_menu_btn.icon_menu_procurement {
    background-position: 0 -240px;
  }

  .icon_menu_btn.icon_menu_goods {
    background-position: 0 -287px;
  }

  .icon_menu_btn.icon_menu_financial {
    background-position: 0 -335px;
  }

  .icon_menu_btn.icon_menu_system {
    background-position: 0 -376px;
  }

  .icon_menu_btn.icon_menu_operate {
    background-position: 0 -423px;
  }

  .icon_menu_btn.icon_menu_demand {
    background-position: 0 -472px;
  }
  .icon_menu_btn.icon_menu_settlement {
    background-position: 0 -520px;
  }
  .icon_menu_btn.icon_menu_statistics{
    background-position: 0 -617px;
  }
  .text_right {
    text-align: left;
    padding-left: 20px;
  }

  .text_right i {
    cursor: pointer;
    font-size: 20px;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 220px;
  }
</style>
<style>
  .menuElse{
    overflow: hidden;
  }
  .menuElse .el-submenu .el-submenu__title {
    height: 40px !important;
    line-height: 40px !important;
  }

  .menuElse .el-menu-item-group__title {
    padding: 0 !important;
  }

  .menuElse .el-submenu .el-menu-item, .menuElse .el-menu-item {
    height: 40px !important;
    line-height: 40px !important;
  }
</style>
