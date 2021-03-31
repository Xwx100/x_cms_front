<template>
  <div>
    <el-table ref="my_table" :data="data" v-bind="tableProp" v-on="tableMethod">
      <template v-for="(colConfig, index) in colConfigs">
        <!--   数据体   -->
        <template>
          <template v-if="colConfig.type === 'slot'">
            <slot :name="colConfig.typeName" :col-config="colConfig"/>
          </template>
          <template v-else-if="colConfig.type === 'component'">
            <component
              :is="colConfig.typeName"
              :col-config="colConfig"
            />
          </template>
          <template v-else>
            <el-table-column v-if="colConfig.hasOwnProperty('typeOption')" v-bind="colConfig.typeOption">
              <template slot="header" v-if="colConfig.typeOption.hasOwnProperty('headerTip')">
                {{ colConfig.typeOption.label }}
                <el-tooltip class="item" effect="dark" :content="colConfig.typeOption.headerTip" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </template>
              <template slot="header" v-else>{{ colConfig.typeOption.label }}</template>
            </el-table-column>
          </template>
        </template>
      </template>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'MyTable',
  props: ['colConfigs', 'data', 'tableProp', 'tableMethod', 'tableHeader'],
}
</script>
