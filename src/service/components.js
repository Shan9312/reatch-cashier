import Vue from 'vue'
import {
  Button,
  Cell,
  Swipe,
  SwipeItem,
  Indicator,
  InfiniteScroll,
  MessageBox,
  Toast,
  Popup
} from 'mint-ui' // 按需加载，配置.babelrc
// import AlertModal from '@/components/alert'

Vue.component(Popup.name, Popup)
// Vue.component('alert-modal', AlertModal)

Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.prototype.$Indicator = Indicator
Vue.prototype.$Toast = Toast
Vue.prototype.$MessageBox = MessageBox
Vue.use(InfiniteScroll)
