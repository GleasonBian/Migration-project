<template>
    <div>
        <v-list :data="data" :data-list="dataList">
            <template v-slot:aa="scope">
                <div>asddjkladabdjl</div>
            </template>
            <template v-slot:bb="scope">
                <div>dfddd</div>
            </template>
        </v-list>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        data: [{
          prop: 'name',
          label: '企业编号1'
        }, {
          prop: 'ooo',
          label: '企业编号2'
        }, {
          prop: 'lll',
          label: '企业编号3'
        }, {
          prop: 'kkk',
          label: '企业编号4'
        }, {
          prop: 'bb',
          label: '企业编号5'
        }, {
          prop: 'yyy',
          label: '企业编号6'
        }],
        dataList: {
          yyy: '215465454',
          kkk: '55546546',
          ooo: '213546454554',
          name: '["daddd", "daddd", "daddd"]'
        }
      }
    },
    created () {

    },
    methods: {},
    mounted () {

    }
  }
</script>

<style scoped>

</style>