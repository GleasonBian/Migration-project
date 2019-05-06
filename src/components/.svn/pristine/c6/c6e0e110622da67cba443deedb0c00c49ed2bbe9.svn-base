<template>
    <div class="base_search_box">
        <el-row>
            <el-col :span="24">
                <el-form :model="{data}" ref="{data}" :label-width="width" class="demo-dynamic">
                    <el-row>
                        <el-col :span="8" v-for="(item, index) in data" :key="index">
                            <el-form-item :label="item.label" :key="item.key"
                                          :prop="'data.' + index + '.value'">
                                <el-input
                                        v-if="!item.date && !item.select && !item.custom && !item.autocomplete"
                                        v-model="item.value"
                                        :type="item.type"
                                        :value="item.value"
                                        :maxlength="item.maxlength"
                                        :minlength="item.minlength"
                                        :placeholder="item.placeholder"
                                        :disabled="item.disabled"
                                        :size="item.size"
                                        :prefix-icon="item.prefixIcon"
                                        :suffix-icon="item.suffixIcon"
                                        :rows="item.rows"
                                        :autosize="item.autosize"
                                        :auto-complete="item.autoComplete"
                                        :readonly="item.readonly"
                                        :max="item.max"
                                        :min="item.min"
                                        :step="item.step"
                                        :resize="item.resize"
                                        :autofocus="item.autofocus"
                                        :form="item.form"
                                        :label="item.label"
                                        @blur="inputBlur"
                                        @focus="inputFocus"
                                        @change="inputChange">
                                    <template :class="item.prefixClass" v-if="item.prefix" slot="prefix">
                                        <slot :name="item.prefix" :items="data.from" :index="i" :rows="item"></slot>
                                    </template>
                                    <template :class="item.suffixClass" v-if="item.suffix" slot="suffix">
                                        <slot :name="item.suffix" :items="data.from" :index="i" :rows="item"></slot>
                                    </template>
                                    <template :class="item.prependClass" v-if="item.prepend" slot="prepend">
                                        <slot :name="item.prepend" :items="data.from" :index="i" :rows="item"></slot>
                                    </template>
                                    <template :class="item.appendClass" v-if="item.append" slot="append">
                                        <slot :name="item.append" :items="data.from" :index="i" :rows="item"></slot>
                                    </template>
                                </el-input>

                                <el-autocomplete v-if="item.autocomplete" v-model="item.value" class="inline-input"
                                                 :placeholder="item.placeholder"
                                                 :disabled="item.disabled"
                                                 :valueKey="item.valueKey"
                                                 :debounce="item.debounce"
                                                 :popper-class="item.popperClass"
                                                 :trigger-on-focus="item.triggerOnFocus"
                                                 :name="item.name"
                                                 :select-when-unmatched="item.selectWhenUnmatched"
                                                 :label="item.label"
                                                 :prefix-icon="item.prefixIcon"
                                                 :suffix-icon="item.suffixIcon"
                                                 :fetch-suggestions="querySearch"
                                                 @select="autocompleteSelect">
                                    <template :class="item.prefixClass" v-if="item.prefix" slot="prefix">
                                        <slot :name="item.prefix" :items="data.from" :index="i" :rows="item"></slot>
                                    </template>
                                    <template :class="item.suffixClass" v-if="item.suffix" slot="suffix">
                                        <slot :name="item.suffix" :items="data.from" :index="i" :rows="item"></slot>
                                    </template>
                                    <template :class="item.prependClass" v-if="item.prepend" slot="prepend">
                                        <slot :name="item.prepend" :items="data.from" :index="i" :rows="item"></slot>
                                    </template>
                                    <template :class="item.appendClass" v-if="item.append" slot="append">
                                        <slot :name="item.append" :items="data.from" :index="i" :rows="item"></slot>
                                    </template>
                                </el-autocomplete>

                                <el-select v-if="item.select" v-model="item.value" :placeholder="item.placeholder"
                                           :multiple="item.multiple"
                                           :disabled="item.disabled"
                                           :value-key="item.valueKey"
                                           :size="item.size"
                                           :clearable="item.clearable"
                                           :collapse-tags="item.collapseTags"
                                           :multiple-limit="item.multipleLimit"
                                           :name="item.name"
                                           :filterable="item.filterable"
                                           :allow-create="item.allowCreate"
                                           :filter-method="item.filterMethod"
                                           :remote="item.remote"
                                           :remote-method="item.remoteMethod"
                                           :loading="item.loading"
                                           :loading-text="item.loadingText"
                                           :no-match-text="item.noMatchText"
                                           :no-data-text="item.noDataText"
                                           :popper-class="item.popperClass"
                                           :reserve-keyword="item.reserveKeyword"
                                           :default-first-option="item.defaultFirstOption"
                                           @change="selectChange"
                                           @visible-change="selectVisibleChange"
                                           @remove-tag="selectRemoveTag"
                                           @clear="selectClear"
                                           @blur="selectBlur"
                                           @focus="selectFocus">
                                    <el-option v-if="!item.optionGroup" v-for="option in item.select"
                                               :key="option.label"
                                               :label="option.label"
                                               :value="option.value"
                                               :disabled="option.disabled" @click="optionClick(option)"></el-option>
                                    <el-option-group v-if="item.optionGroup" v-for="group in item.select"
                                                     :key="group.label"
                                                     :label="group.label"
                                                     :disabled="group.disabled" @click="optionGroupClick(group)">
                                        <el-option
                                                v-for="option in group.options"
                                                :key="option.value"
                                                :label="option.label"
                                                :value="option.value" @click="optionClick(option)">
                                        </el-option>
                                    </el-option-group>
                                </el-select>

                                <el-date-picker v-if="item.date" v-model="item.value"
                                                :readonly="item.date.readonly"
                                                :disabled="item.date.disabled"
                                                :editable="item.date.editable"
                                                :clearable="item.date.clearable"
                                                :size="item.date.size"
                                                :placeholder="item.date.placeholder"
                                                :start-placeholder="item.date.startPlaceholder"
                                                :end-placeholder="item.date.endPlaceholder"
                                                :type="item.date.type"
                                                :format="item.date.format"
                                                :align="item.date.align"
                                                :popper-class="item.date.popperClass"
                                                :picker-options="item.date.pickerOptions"
                                                :range-separator="item.date.rangeSeparator"
                                                :default-value="item.date.defaultValue"
                                                :value-format="item.date.valueFormat"
                                                :name="item.date.name"
                                                :unlink-panels="item.date.unlinkPanels"
                                                @change="dateChange(item.value, item)"
                                                @blur="dateBlur"
                                                @focus="dateFocus"></el-date-picker>

                                <slot v-if="item.custom" :name="item.prop" :items="data.from" :index="index"
                                      :rows="item"></slot>

                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="base_search_button">
                            <el-form-item>
                                <el-button @click="submit('{data}')" type="primary">{{searchText}}</el-button>
                                <el-button @click="reset('{data}')">{{resetText}}</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  export default {
    name: 'v-search',
    data () {
      return {
        input: ''
      }
    },
    props: {
      width: {
        type: String,
        default: '120px'
      },
      searchText: {
        type: String,
        default: '查询'
      },
      resetText: {
        type: String,
        default: '重置'
      },
      data: Array,
      filterParams: Array,
      resetOk: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      search () {
        this.$emit('on-click', this.filterData(), this.$props)
      },
      filterData () {
        let propData = []
        this.$props.data.map(item => {
          propData.push(item)
          if (item.date) {
            if (item.value !== null) {
              if (item.value && item.value.length === undefined) {
                item.value = this.$Date.dateFormat(item.value, this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
              } else if (item.value.length === 2) {
                propData.push({
                  key: item.key,
                  value: this.$Date.dateFormat(item.value[0], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
                })
                propData.push({
                  key: 'endTime',
                  value: this.$Date.dateFormat(item.value[1], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
                })
              }
            }
          }
        })
        return this.filteruselessData(propData)
      },
      isEmpty (data) {
        let obj = {}
        data.map(item => {
          if (item.value && !Array.isArray(item.value)) {
            obj[item.key] = item.value
          } else if (Array.isArray(item.value) && (item.value !== '[]' && item.value.length > 0)) {
            obj[item.key] = item.value
          }
        })
        return obj
      },
      filteruselessData (propData) {
        if (this.filterParams && this.filterParams.length > 0) {
          let obj = {}
          for (let s in this.isEmpty(propData)) {
            this.filterParams.map(item => {
              if (s !== item) {
                obj[s] = this.isEmpty(propData)[s]
              }
            })
          }
          return obj
        } else {
          return this.isEmpty(propData)
        }
      },
      submit (formName) {
        this.search()
      },
      reset (formName) {
        // resetOk 只用于历史价模态框部分
        if (this.resetOk) {
          this.data.map(item => {
            if (item.key !== 'goodsName') {
              item.value = ''
            }
          })
          this.$emit('on-search-reset', this.filterData(), this.$props)
        } else {
          this.$refs[formName].resetFields()
          this.search()
        }
      },
      inputBlur (event) {
        this.$emit('input-blur', event)
      },
      inputFocus (event) {
        this.$emit('input-focus', event)
      },
      inputChange (value) {
        this.$emit('input-change', value)
      },
      autocompleteSelect (item) {
        this.$emit('autocomplete-select', item)
      },
      querySearch (queryString, cb) {
        this.$emit('query-search', queryString, cb)
      },
      selectChange (val) {
        this.$emit('select-change', val)
      },
      selectVisibleChange (val) {
        this.$emit('select-visible-change', val)
      },
      selectRemoveTag (val) {
        this.$emit('select-remove-tag', val)
      },
      selectClear (val) {
        this.$emit('select-clear', val)
      },
      selectBlur (event) {
        this.$emit('select-blur', event)
      },
      selectFocus (event) {
        this.$emit('select-focus', event)
      },
      optionClick (option) {
        this.$emit('select-option-click', option)
      },
      optionGroupClick (group) {
        this.$emit('select-option-group-click', group)
      },
      dateChange (item, items) {
        this.$emit('date-change', item, items)
      },
      dateBlur (event) {
        this.$emit('date-blur', event)
      },
      dateFocus (event) {
        this.$emit('date-focus', event)
      }
    },
    mounted () {
      this.$bus.on('on-search', () => {
        this.search()
      })
    },
    destroyed () {
      this.$bus.off('on-search')
    }
  }
</script>

<style scoped>

</style>
