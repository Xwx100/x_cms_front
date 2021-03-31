<template>
  <div>
    <!--  跳至顶端  -->
    <el-backtop ref="el_back_top" :bottom="100">
      <div
        style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
      >
        UP
      </div>
    </el-backtop>

    <!--  搜索栏 + 表格头部  -->
    <el-collapse v-model="collapse.activeName" accordion>
      <el-collapse-item name="opera">
        <template slot="title">
          <el-button type="primary">{{ `${collapse.activeName === 'opera' ? '打开' : '收起'}操作栏` }}</el-button>
        </template>
        <div>
          <!--  搜索栏   -->
          <el-card class="box-card table-card">
            <el-form ref="search" :inline="true" :model="search" class="demo-form-inline">
              <template v-for="(searchConfig, index) in searchConfigs">
                <template v-if="_myCommon.getValue(searchConfig, 'typeElFormItem', true)">
                  <el-form-item :key="index"
                                v-bind="searchConfig.typeOption"
                                :label="searchConfig.hasOwnProperty('typeOption') ? `${searchConfig.typeOption.label}：` : ''">
                    <template v-if="searchConfig.type === 'slot'">
                      <slot :name="searchConfig.typeName ? searchConfig.typeName : searchConfig.typeOption.prop"
                            :search-config="searchConfig"/>
                    </template>
                    <template v-else-if="searchConfig.type === 'component'">
                      <component
                        :is="searchConfig.typeName"
                        v-model="search[searchConfig.typeOption.prop]"
                        v-bind="searchConfig.componentOption"
                        v-on="searchConfig.componentMethod"
                        :col-config="searchConfig"
                      />
                    </template>
                  </el-form-item>
                </template>
                <template v-else>
                  <component
                    :is="searchConfig.typeName"
                    v-bind="searchConfig.componentOption"
                    v-on="searchConfig.componentMethod"
                    v-permission="searchConfig.typePermission"
                    :col-config="searchConfig"
                  >
                    {{ searchConfig.typeContent }}
                  </component>
                </template>
              </template>
            </el-form>
          </el-card>

          <!--  表格头部  -->
          <el-card v-if="pageMiddle" class="box-card table-card">
            <div style="display: flex;justify-content: space-between">
              <div style="display: flex">
                <template v-for="item in pageMiddle.left">
                  <div style="margin-right: 10px">
                    <component
                      :is="item.typeName"
                      v-bind="item.componentOption"
                      v-on="item.componentMethod"
                      v-permission="item.typePermission"
                      :col-config="item"
                    >
                      {{ item.typeContent }}
                    </component>
                  </div>
                </template>
              </div>
              <div style="display: flex">
                <template v-for="item in pageMiddle.right">
                  <div style="margin-right: 10px">
                    <el-button v-if="item.type === 'el-button'" v-bind:="item.prop" v-on:="item.propMethod"></el-button>
                    <slot v-else-if="item.type === 'slot'" v-bind:="item.prop" v-on:="item.propMethod"
                          :name="item.typeName"></slot>
                  </div>
                </template>

                <my-select v-show="curConfig.multipleSelection.length" v-model="tableSelect"
                           :enums="curConfig.multipleSelection" :enums-value-key="[]">
                </my-select>
                <el-button slot="customColumn" type="danger" @click="customColumn.open = true">自定义列</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>

    <!--   表格   -->
    <el-card class="table-card">
      <my-table ref="my_table_1" :data="data" :col-configs="visibleColConfigs" :table-prop="tableProp"
                :table-method="tableMethod">
        <!--   传递插槽     -->
        <slot v-for="colConfig in slotColConfigs" :name="colConfig.typeName" :slot="colConfig.typeName"
              :colConfig="colConfig"></slot>
      </my-table>
    </el-card>

    <!--   页码   -->
    <el-card class="table-card">
      <el-pagination
        background
        :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="page.page_size"
        :total="curConfig.pageTotal"
        :current-page="page.page"
        @size-change="pageChangeSize"
        @current-change="pageChangeCurrent"
      />
    </el-card>

    <!--  表格头部-自定义列  -->
    <el-dialog title="自定义列"
               :visible.sync="customColumn.open"
               width="30%">
      <my-checkbox v-model="customColumn.headers" :enums="colConfigs" :enums-value-key="[]"
                   :enums-label-key="['typeOption.label']"></my-checkbox>
      <span slot="footer" class="dialog-footer">
        <el-button @click="customColumn.open = false">取 消</el-button>
        <el-button type="primary" @click="customColumn.close">确 定</el-button>
      </span>
      <!--      <el-cascader-panel :options="options" :props="{multiple: true, label: 'label', value: 'value', children: 'children'}"></el-cascader-panel>-->
    </el-dialog>
  </div>
</template>

<script>
import MyTable from '@/components/BasePage/MyTable'
import MyCheckbox from '@/components/BasePage/MyCheckbox'
import MyButton from '@/components/BasePage/MyButton'
import MyDropDown from '@/components/BasePage/MyDropDown'
import MySelect from '@/components/BasePage/MySelect'
import MyDate from '@/components/BasePage/MyDate'

export default {
  name: 'BasePage',
  components: {
    MyTable,
    MyCheckbox,
    MyDate,
    MyButton,
    MyDropDown,
    MySelect
  },
  props: {
    // 搜索配置
    searchConfigs: Array,
    // 搜索数据
    search: Object,
    // 表格配置
    colConfigs: Array,
    // 表格属性
    tableProp: Object,
    // 表格方法
    tableMethod: Object,
    // 表格数据
    data: Array,
    // 页码数据
    page: Object,
    // 页码方法
    pageMethod: Object,
    // 父类配置
    curConfig: Object,
    pageMiddle: Object,
    collapseActive: {
      type: String,
      default: 'opera'
    }
  },
  data() {
    return {
      // 表格-自定义数据列
      customColumn: {
        open: false,
        // 自定义数据列-点击确认才发起自定义
        headers: this.colConfigs.filter((item) => this.isVisible(item)),
        close: () => {
          this.customColumn.open = false
          this.visibleColConfigs = this.customColumn.headers
          _myCommon.log('自定义列中', this.colConfigs)
        }
      },
      // 搜索框-操作栏是否展开
      collapse: {
        activeName: this.collapseActive
      },
      // 表格-自定义数据列-控制表格列展示
      visibleColConfigs: this.colConfigs.filter((item) => this.isVisible(item)),
    }
  },
  computed: {
    // 表格-嵌套插槽的传递
    slotColConfigs: function () {
      return this.colConfigs.filter((item) => {
        return item.hasOwnProperty('type') && item.type === 'slot'
      })
    },
    // 表格-多选框触发
    tableSelect: {
      get() {
        return this.curConfig.multipleSelection
      },
      set(val) {
        // todo 算法可以优化 模拟点击
        let tmp1 = this.curConfig.multipleSelection.map((item) => {
          return JSON.stringify(item)
        })
        let tmp2 = val.map((item) => {
          return JSON.stringify(item)
        })
        let tmp = Object.keys(_myCommon.php.array_diff(tmp1, tmp2))
        tmp = _myCommon.getValueMulti(this.curConfig.multipleSelection, tmp)
        this.toggleSelection(tmp, false)
      }
    }
  },
  created() {
    _myCommon.log()
  },
  methods: {
    pageChangeSize: function (pageSize) {
      this.page.page_size = pageSize
      this.clickBackTop()
    },
    pageChangeCurrent: function (page) {
      this.page.page = page
      this.clickBackTop()
    },
    clickBackTop() {
      _myCommon.log('clickBackTop....', this)
      if (this.$refs.hasOwnProperty('el_back_top')) {
        this.$refs.el_back_top.scrollToTop()
      }
    },
    toggleSelection(rows, status = true) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.my_table_1.$refs.my_table.toggleRowSelection(row, status);
        })
      } else {
        this.$refs.my_table_1.$refs.my_table.clearSelection();
      }
    },
    isVisible: function (config) {
      return !config.hasOwnProperty('typeVisible') || config.typeVisible
    },
  },
  mounted() {
    // 多选框-默认选中
    this.toggleSelection(this.curConfig.multipleSelection)
  }
}
</script>

<style scoped>
.el-form-item >>> .el-form-item__content {
  line-height: 0
}

.el-card >>> .el-card__body {
  padding: 5px;
}

.el-collapse-item >>> .el-collapse-item__content {
  padding-bottom: 0
}
</style>
