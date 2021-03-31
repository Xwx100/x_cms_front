<template>
  <el-button v-on="options.methods" v-bind="options">{{options.label}}</el-button>
</template>

<script>
export default {
  name: "index",
  props: {
    options: Object,
  },
  created() {
    _myCommon.log(111111,this.options)
  }
}
</script>

<style scoped>

</style>
