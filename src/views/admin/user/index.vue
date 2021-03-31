<template>
  <div class="app-container">
    <base-page
      :search="input.where"
      :search-configs="searchConfigs"
      :data="data"
      :col-configs="colConfigs"
      :page-middle="pageMiddle"
      :table-prop="tableProp"
      :table-method="tableMethod"
      :page="input.page"
      :cur-config="curConfig"
    >
      <el-table-column slot="opera" slot-scope="scope1" v-bind="scope1.colConfig.typeOption">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="buttonUpdate(scope.row.id)" v-permission="['admin/user/edit']">
            编辑
          </el-button>
          <el-button type="warning" size="mini" @click="buttonDel([scope.row.id])" v-permission="['admin/user/del']">
            删除
          </el-button>
          <el-button type="success" size="mini">
            <router-link :to="{name: 'role', query: {user_id: scope.row.id}}" v-permission="['admin/role/index']">拥有角色
            </router-link>
          </el-button>
        </template>
      </el-table-column>
    </base-page>
    <!--  编辑  -->
    <el-dialog :title="row.id ? '编辑' : '新增'" :visible.sync="curConfig.dialogFormVisible">
      <el-form ref="form" :model="row" label-position="left" label-width="80px">
        <el-form-item label="名字">
          <el-input v-model="row.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="拥有角色">
          <el-button type="primary" @click="curConfig.openMyNextIndex = !curConfig.openMyNextIndex">打开角色列表</el-button>
          <MyOtherIndex v-if="curConfig.openMyNextIndex && curConfig.dialogFormVisible"
                        :col-configs="curConfig.role.colConfigs"
                        :page-middle="curConfig.role.pageMiddle"
                        collapse-active="''"
                        v-model="row.role_ids"
                        :user-id="row.id ? row.id : ''"
          ></MyOtherIndex>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openRowDialog(false)">取 消</el-button>
        <el-button type="primary" @click="confirmRowDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BasePage from '@/components/BasePage'
import MyCheckbox from '@/components/BasePage/MyCheckbox'
import MyDate from '@/components/BasePage/MyDate'
import MyOtherIndex from '../role'
import {queryMixin} from '@/utils/vue/mixin'
import {index as curIndex, create, update, del} from '@/api/c_user'
import {index as otherIndex} from '@/api/role'
import {arrayIdsToName} from '@/utils'

export default {
  name: 'user',
  mixins: [queryMixin],
  props: {},
  components: {
    BasePage,
    MyCheckbox,
    MyDate,
    MyOtherIndex
  },
  data() {
    return {
      // 搜索配置
      searchConfigs: [
        {
          type: 'component',
          typeName: 'el-input',
          typeOption: {prop: 'id', label: 'ID'},
          componentOption: {clearable: true, placeholder: 'ID'}
        },
        {
          type: 'component',
          typeName: 'el-input',
          typeOption: {prop: 'name', label: '名字'},
          componentOption: {clearable: true, placeholder: '名字'}
        },
        {
          type: 'component',
          typeName: 'el-input',
          typeOption: {prop: 'role_id', label: '角色ID'},
          componentOption: {clearable: true, placeholder: '角色ID'}
        },
        {
          type: 'component',
          typeName: 'my-date',
          typeOption: {prop: 'create_at', label: '创建时间'},
          componentOption: {clearable: true, placeholder: '创建时间'}
        },
        {
          type: 'component',
          typeName: 'my-date',
          typeOption: {prop: 'update_at', label: '更新时间'},
          componentOption: {clearable: true, placeholder: '更新时间'}
        },
        {
          type: 'component',
          typeName: 'el-button',
          typeElFormItem: false,
          typePermission: [],
          componentOption: {
            type: 'primary'
          },
          componentMethod: {
            'click': () => {
              this.search(1)
            }
          },
          typeContent: '查询',
        },
      ],
      // 搜索数据
      input: {
        field: ['id', 'name', 'create_at', 'update_at'],
        where: {
          id: '',
          name: '',
          role_id: '',
          create_at: [],
          update_at: [],
        },
        order: [
          {sort_field: 'id', sort_type: 'desc'}
        ],
        page: {
          page: 1,
          page_size: 20,
        }
      },
      // 表格数据
      data: [],
      // 表格配置
      colConfigs: [
        {
          typeOption: {
            type: 'selection', prop: 'select', label: '多选框', width: '60px', 'reserve-selection': true
          }
        },
        {
          typeOption: {
            prop: 'id', label: 'ID', sortable: 'custom', width: '100px', 'show-overflow-tooltip': true
          }
        },
        {
          typeOption: {width: '210px', label: '名字', prop: 'name', 'show-overflow-tooltip': true}
        },
        {
          typeOption: {
            prop: 'create_at',
            label: '创建时间',
            sortable: 'custom',
            width: '220px',
            'show-overflow-tooltip': true,
          },
        },
        {
          typeOption: {
            prop: 'update_at',
            label: '更新时间',
            sortable: 'custom',
            width: '220px',
            'show-overflow-tooltip': true,
          },
        },
        {
          type: 'slot',
          typeName: 'opera',
          typeOption: {width: '260px', label: '操作', 'show-overflow-tooltip': true},
        },
      ],
      // 表格头部
      pageMiddle: {
        left: [
          {
            type: 'component',
            typeName: 'my-drop-down',
            typePermission: [],
            componentOption: {
              handleCommandFunc: (c) => {
                this.handleCommand(c)
              },
              commands: [
                {
                  command: 'selectDelete',
                  label: '删除'
                }
              ]
            },
          },
          {
            type: 'component',
            typeName: 'el-button',
            typePermission: [],
            componentOption: {
              type: 'success'
            },
            componentMethod: {
              'click': () => {
                this.buttonCreate(null)
              }
            },
            typeContent: '新增',
          },

          // {type: 'slot', typeName: 'batch'},
          // {type: 'slot', typeName: 'add'}
        ],
        right: [
          {
            type: 'recordTableRows'
          },
          {
            type: 'customColumn'
          }
        ]
      },
      // 表格属性
      tableProp: {
        'row-key': 'id',
        border: true,
        cellStyle: {padding: '1px'},
        'header-row-style': {padding: '1px'},
        'header-cell-style': {padding: '1px'},
        'default-sort': {prop: 'id', order: 'descending'},
        'max-height': '700px'
      },
      // 表格方法
      tableMethod: {
        'selection-change': (val) => {
          this.curConfig.multipleSelection = val;
        },
        'sort-change': ({column, prop, order}) => {
          let maps = {
            ascending: 'asc',
            descending: 'desc'
          }
          this.input.order = [{sort_field: prop, sort_type: order ? maps[order] : 'asc'}]
          this.search()
        }
      },
      // 枚举
      enums: {
        roles: [],
        rolesInput: {
          field: ['id', 'name'],
          // page: {
          //   page_limit: false
          // }
        }
      },
      // 当前配置
      curConfig: {
        multipleSelection: [
          {"id": 6765, "name": "测试", "create_at": "2021-02-20 15:23:35", "update_at": "2021-03-06 13:15:24"}
        ],
        dialogFormVisible: false,
        pageTotal: 100,

        openMyNextIndex: false,
        openCustomColumn: false,
        role: {
          colConfigs: [
            {
              type: 'slot',
              typeName: 'select',
              typeOption: {type: 'selection', prop: 'select', label: '多选框', 'reserve-selection': true}
            },
            {
              typeOption: {
                prop: 'id', label: 'ID', sortable: 'custom', width: '100px', 'show-overflow-tooltip': true
              }
            },
            {
              typeOption: {width: '210px', label: '名字', prop: 'name', 'show-overflow-tooltip': true}
            },
            {
              typeOption: {
                prop: 'create_at',
                label: '创建时间',
                sortable: 'custom',
                width: '220px',
                'show-overflow-tooltip': true,
              },
            },
            {
              typeOption: {
                prop: 'update_at',
                label: '更新时间',
                sortable: 'custom',
                width: '220px',
                'show-overflow-tooltip': true,
              },
            },
          ],
          pageMiddle: {}
        }
      },
      // 表单数据
      row: {
        id: '',
        name: '',
        role_ids: []
      },
    }
  },
  computed: {},
  created() {
    _myCommon.log(444444, this.aaaa)
  },
  methods: {
    // 查询api
    apiIndex: function (values = []) {
      if (!values.hasOwnProperty(1) && !this.enums.roles.length) {
        values.push(otherIndex(this.enums.rolesInput));
      }
      Promise.all(values).then((...args) => {
        let userData = args[0][0].data
        let userResList = userData.list
        let userResPage = userData.page
        if (args[0].hasOwnProperty(1)) {
          let roleData = args[0][1].data
          this.enums.roles = roleData.list
        }
        arrayIdsToName(userResList, {role_ids: this.enums.roles})
        this.data = userResList
        this.curConfig.pageTotal = userResPage.total
      })
    },
    // 创建按钮
    buttonCreate: function (id = '') {
      _myCommon.log('新增：', id)
      this.beforeButtonAddEdit(...arguments)
    },
    // 更新按钮
    buttonUpdate: function (id) {
      _myCommon.log('编辑：', id, this.row)
      this.row.id = id
      curIndex({field: ['id', 'name', 'role_ids'], where: {id: this.row.id}}).then((res) => {
        if (!_myCommon.resIsOk(res)) {
          this.$message.error(res.msg)
        } else {
          Object.assign(this.row, res.data.list[0])
          this.beforeButtonAddEdit(...arguments)
        }
      })
    },
    // 删除按钮
    buttonDel: function (ids) {
      _myCommon.log('删除：', ids)
      ids = _myCommon.toArray(ids)
      del({id: ids}).then(() => {
        // 局部更新
        this.data = this.data.filter((row) => {
          return !ids.includes(row.id)
        })
      })
    },
    // 查询
    search: function (page = null) {
      _myCommon.log('查询：', this.input)
      this.apiIndex([curIndex({...this.input})])
      if (page) {
        this.input.page.page = page
      }
    },
    // 批量操作 调用函数
    handleCommand: function (c) {
      this[c]()
    },
    // 批量 删除
    selectDelete: function () {
      _myCommon.log('批量删除：', this.curConfig.multipleSelection)
      this.buttonDel(this.curConfig.multipleSelection.map((item) => {
        return item.id
      }))
    },
    // 表单对话框 确定
    confirmRowDialog: function () {
      _myCommon.log(this.row.id)
      if (!this.row.id) {
        create(this.row).then((res) => {
          this.$message({
            message: res.msg,
            type: res.code ? 'error' : 'success'
          })
          if (_myCommon.resIsOk(res)) {
            this.afterConfirmRowDialog()
          }
        })
      } else {
        update(this.row).then((res) => {
          this.$message({
            message: res.msg,
            type: res.code ? 'error' : 'success'
          })
          this.afterConfirmRowDialog()
        })
      }
    },
  }
}

</script>

