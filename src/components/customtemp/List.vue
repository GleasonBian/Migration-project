<template>
    <ul :class="listStyle.class" class="v_list">
        <li class="v_list_li" v-for="(item, index) in currenData(data, dataList)">
            <template v-if="!item.slots">
                <span :style="{width: listStyle.listwidth, minWidth: listStyle.listwidth}">{{item.label}}：</span>
                <div class="v_list_cont" :style="{left: listStyle.listwidth}">
                    <template v-if="!item.slot">
                        <template v-if="!isArr(item)">
                            {{item.value ? item.value : "暂无信息"}}
                        </template>
                        <template v-else>
                            <span v-for="ntem in item.value">{{ntem}}</span>
                        </template>
                    </template>
                    <template v-else>
                        <slot :rows="data" :row="item" :index="index" :name="item.prop"></slot>
                    </template>
                </div>
            </template>
            <template v-else>
                <slot :rows="data" :row="item" :index="index" :name="item.prop"></slot>
            </template>
        </li>
    </ul>
</template>

<script>
  export default {
    name: 'v-list',
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      listStyle: {
        type: Object,
        default: function () {
          return {
            class: '',
            listwidth: '80px'
          }
        }
      },
      dataList: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    methods: {
      isArr (item) {
        return Array.isArray(item.value)
      },
      currenData (data, currentVal) {
        return data.map(item => {
          for (let s in currentVal) {
            if (s === item.prop) {
              item.value = currentVal[s]
            }
          }
          return item
        })
      }
    }
  }
</script>

<style scoped>
    .v_list {
        display: inline-block;
        width: 100%;
    }

    .v_list_li {
        position: relative;
        width: 100%;
        display: flex;
        margin: 6px 0;
    }

    .v_list_li > span {
        text-align: right;
        padding-right: 5px;
    }

    .v_list_li, .v_list_li > span, .v_list_li > div {
        line-height: 24px;
        font-size: 14px;
        color: #000000;
    }
    .v_list_li,.v_list_li > div {
      text-align: left;
    }
    .v_list_li > div {
        margin: 0;
    }
</style>
