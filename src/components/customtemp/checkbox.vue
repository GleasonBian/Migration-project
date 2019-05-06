<template>
  <div :class="className">
    <div class="check_box_all">
      <label>
        <input type="checkbox" :checked="isChecked(data)" @change="handleChange(data)"/>
        {{checkedText}}
      </label>
    </div>
    <div class="check_box_group">
      <div v-for="(item, index) in data">
        <div class="check_box_group_title" v-if="item.status">
          <slot :items="data" :$index="index" :$row="item" :name="item.status">{{item.status}}</slot>
        </div>
        <div class="check_box">
          <label>
            <input type="checkbox" :value="item.value" :checked="isChecked(item)" @change="handleChange(item)"/>{{item.value}}
          </label>
          <span v-for="items in item.children">
            <label>
              <input type="checkbox" :value="items.key" v-model="item.checkedArr"/>
              {{items.value}}
            </label>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      checkedText: {
        type: String,
        default: '全选'
      },
      className: {
        type: String,
        default: 'check_box_wrap'
      },
      data: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    methods: {
      allCheckedMap (obj) {
        if (event.target.checked) {
          obj.children.map(ntem => {
            obj.checkedArr.indexOf(ntem.key) === -1 && obj.checkedArr.push(ntem.key)
          })
        } else {
          obj.checkedArr = []
        }
      },
      // 上一级选择方法
      handleChange (data) {
        if (Array.isArray(data)) {
          data.map(item => {
            this.allCheckedMap(item)
          })
        } else {
          this.allCheckedMap(data)
        }
      },
      isChecked (data) {
        if (data.children) {
          return data.children.every(function (items) {
            return data.checkedArr.indexOf(items.key) !== -1
          })
        } else {
          return data.every(function (item) {
            return item.checkedArr.length === item.children.length
          })
        }
      }
    }
  }
</script>

<style scoped>
  .check_box_wrap {
    display: flex;
  }
  .check_box_all {
    flex: 0 1 5%;
  }
  .check_box_group {
    flex: 0 1 95%;
  }
  .check_box_group_title {
    width: 100px;
    text-align: left;
    font-weight: bold;
  }
  .check_box_grou > div {
    width: 100%;
    float: left;
  }
  .check_box > label {
    float: left;
    width: 20%;
    margin: 0 20px;
  }
  .check_box > span{
    float: left;
    width: 20%;
    margin: 0 20px;
  }
</style>
