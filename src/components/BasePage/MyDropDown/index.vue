<template>
  <el-dropdown style="line-height: normal" @command="handleCommandFunc">
    <el-button type="primary">
      批量操作<i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <el-dropdown-menu v-for="(item, index) in commands" :key="index" :slot="item.slot">
      <el-dropdown-item :command="item.command">{{ item.label }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "index",
  props: {
    handleCommandFunc: Function,
    commands: Array
  }
}
</script>

<style scoped>

</style>
