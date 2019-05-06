/**
 * Created by tim on 2017/10/25.
 */
import Vue from 'vue'

import Api from 'api'
import ImgPath from 'api/imgPath'
import Ajax from 'components/common/httpUtils'
import ValidateUtils from 'components/common/validatorUtils'
import Cache from 'components/common/cacheUtils'
import Consts from 'common/consts'
import Date from 'components/common/date'
import Utils from 'components/common/utils'
import CitesUtils from 'customtemp/cites'

import vHeader from 'components/basetemp/Header'
import vMenu from 'components/basetemp/Menu'
import vContent from 'components/basetemp/Content'
import CenterTemp from 'components/basetemp/CenterTemp'

import BizHeader from 'bizcomponents/BizHeader'

import Search from 'customtemp/Search'
import Page from 'customtemp/Page'
import Dialog from 'customtemp/Dialog'
import TabBut from 'customtemp/TabBut'
import TableList from 'customtemp/TableList'
import FormGroup from 'customtemp/FormGroup'
import Breadcrumb from 'customtemp/Breadcrumb'
import Editor from 'customtemp/Editor'
import Upload from 'customtemp/Upload'
import Tree from 'customtemp/Tree'
import TabTree from 'customtemp/TabTree'
import TabTreeNode from 'customtemp/TabTreeNode'
import VCategory from 'customtemp/Category'
import TabTreeList from 'customtemp/TabTreeList'
import List from 'customtemp/List'
import Steps from 'customtemp/Steps'
import Cites from 'customtemp/cites/Cites'
import SelectBut from 'customtemp/SelectBut'

const components = [
  vHeader,
  vMenu,
  vContent,
  CenterTemp,
  BizHeader,
  Search,
  Page,
  Dialog,
  TabBut,
  TableList,
  FormGroup,
  Breadcrumb,
  Editor,
  Upload,
  TabTreeList,
  Tree,
  TabTree,
  TabTreeNode,
  VCategory,
  List,
  Steps,
  Cites,
  SelectBut
]

const install = function (Vue) {
  components.map(component => {
    Vue.component(component.name, component)
  })
  // use this.$xxx
  Vue.prototype.$Api = Api
  Vue.prototype.$Ajax = Ajax
  Vue.prototype.$Validate = ValidateUtils
  Vue.prototype.$Cache = Cache
  Vue.prototype.$Consts = Consts
  Vue.prototype.$ImgPath = ImgPath
  Vue.prototype.$Date = Date
  Vue.prototype.$Utils = Utils
  Vue.prototype.$CitesUtils = CitesUtils
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
} else {
  install(Vue)
}

export default {
  version: '1.0.0',
  vHeader,
  vMenu,
  vContent,
  CenterTemp,
  BizHeader,
  Search,
  Page,
  Dialog,
  TabBut,
  TableList,
  FormGroup,
  Breadcrumb,
  Editor,
  Upload,
  TabTreeList,
  Tree,
  TabTree,
  TabTreeNode,
  VCategory,
  List,
  Steps,
  Cites,
  SelectBut
}
