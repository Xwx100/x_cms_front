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
      :collapse-active="collapseActive"
    >
            <el-input slot="id" v-model="input.where.id" slot-scope="scope"
                      :placeholder="scope.searchConfig.typeOption.label"/>
            <el-input slot="name1" v-model="input.where.name" slot-scope="scope"
                      :placeholder="scope.searchConfig.typeOption.label"/>
            <el-input slot="user_id" v-model="input.where.user_id" slot-scope="scope"
                      :placeholder="scope.searchConfig.typeOption.label"/>
            <el-input slot="permission_id" v-model="input.where.permission_id" slot-scope="scope"
                      :placeholder="scope.searchConfig.typeOption.label"/>
            <el-input slot="permission_type" v-model="input.where.permission_type" slot-scope="scope"
                      :placeholder="scope.searchConfig.typeOption.label"/>
            <my-date slot="create_at" v-model="input.where.create_at"></my-date>
            <my-date slot="update_at" v-model="input.where.update_at"></my-date>
            <el-input slot="create_by" v-model="input.where.create_by" slot-scope="scope"
                      :placeholder="scope.searchConfig.typeOption.label"/>
            <el-input slot="update_by" v-model="input.where.update_by" slot-scope="scope"
                      :placeholder="scope.searchConfig.typeOption.label"/>
      <el-button slot="search" type="primary" @click="search(1)">查询</el-button>

      <el-dropdown slot="batch" style="line-height: normal" @command="handleCommand">
        <el-button type="success">
          批量操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="selectDelete">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button slot="add" type="primary" @click="buttonCreate(null)">新增</el-button>

      <el-table-column slot="select" slot-scope="scope1" v-bind="scope1.colConfig.typeOption"></el-table-column>
      <el-table-column slot="opera" slot-scope="scope1" v-bind="scope1.colConfig.typeOption">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="buttonUpdate(scope.row.id)">编辑</el-button>
          <el-button type="warning" size="mini" @click="buttonDel([scope.row.id])">删除</el-button>
          <el-button type="success" size="mini">
            <router-link :to="{name: 'user', query: {role_id: scope.row.id}}">拥有用户</router-link>
          </el-button>
          <el-button type="success" size="mini">
            <router-link :to="{name: 'uri', query: {role_id: scope.row.id}}">拥有权限</router-link>
          </el-button>
        </template>
      </el-table-column>
    </base-page>

    <el-dialog :title="row.id ? '编辑' : '新增'" :visible.sync="curConfig.dialogFormVisible">
      <el-form ref="form" :model="row" label-position="left" label-width="80px">
        <el-form-item label="名字">
          <el-input v-model="row.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="拥有权限">
          <el-button type="primary" @click="curConfig.openMyNextIndex = !curConfig.openMyNextIndex">打开权限列表</el-button>
          <MyOtherIndex v-if="curConfig.openMyNextIndex && curConfig.dialogFormVisible"
                        :col-configs="curConfig.uri.colConfigs"
                        :page-middle="curConfig.uri.pageMiddle"
                        v-model="row.uri_ids"
                        :role-id="row.id ? row.id : ''"
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
import {queryMixin} from '@/utils/vue/mixin'
import {index as curIndex, create, update, del} from '@/api/role'
import {index as otherIndex} from '@/api/c_user'
import {arrayIdsToName} from '@/utils'
import MyOtherIndex from '../uri'

export default {
  name: 'role',
  mixins: [queryMixin],
  props: {
    userId: {
      default: ''
    },
    // 表格配置
    colConfigs: {
      type: Array,
      default: () => {
        return [
          {type: 'slot', typeName: 'select', typeOption: {type: 'selection', prop: 'select', label: '多选框', 'reserve-selection': true}},
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
            typeOption: {width: '340px', label: '操作', 'show-overflow-tooltip': true},
          },
        ]
      }
    },
    // 表格头部
    pageMiddle: {
      type: Object,
      default: () => {
        return {
          left: [
            {type: 'slot', typeName: 'batch'},
            {type: 'slot', typeName: 'add'}
          ]
        }
      }
    },
    // 多选框
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否激活操作栏
    collapseActive: {
      type: String,
      default: 'opera'
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  watch: {
    // 多选框-组件
    'curConfig.multipleSelection': function (val) {
      let ids = val.map((item) => {
        return item.id
      })
      _myCommon.log('角色组件 输出值', ids)
      this.$emit('input', ids)
    },
  },
  computed: {
    // 多选框-默认值
    defaultMulti() {
      return this.value.map((item) => {
        return [item.id]
      })
    }
  },
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
        {type: 'slot', typeOption: {prop: 'id', label: 'ID'}},
        {type: 'slot', typeName: 'name1', typeOption: {prop: 'name', label: '名字'}},
        {type: 'slot', typeOption: {prop: 'user_id', label: '用户ID'}},
        {type: 'slot', typeOption: {prop: 'permission_id', label: '权限id'}},
        {type: 'slot', typeOption: {prop: 'permission_type', label: '权限类型'}},
        {type: 'slot', typeOption: {prop: 'create_at', label: '创建时间'}},
        {type: 'slot', typeOption: {prop: 'update_at', label: '更新时间'}},
        {type: 'slot', typeOption: {prop: 'create_by', label: '创建用户'}},
        {type: 'slot', typeOption: {prop: 'update_by', label: '修改用户'}},
        {type: 'slot', typeName: 'search'},
      ],
      // 搜索数据
      input: {
        field: ['id', 'name', 'create_at', 'update_at', 'create_by', 'update_by'],
        where: {
          id: '',
          user_id: this.userId,
          permission_id: '',
          permission_type: '',
          name: '',
          create_at: [],
          update_at: [],
          create_by: '',
          update_by: ''
        },
        order: [
          {sort_field: 'id', sort_type: 'desc'}
        ],
        page: {
          page: 1,
          page_size: 20
        }
      },
      // 表格数据
      data: [],
      // 表格属性
      tableProp: {
        'row-key': 'id',
        border: true,
        cellStyle: {padding: '1px'},
        'header-row-style': {padding: '1px'},
        'header-cell-style': {padding: '1px'},
        'default-sort': {prop: 'id', order: 'descending'}
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
        multipleSelection: this.value.map((id) => {
          return {id: String(id)}
        }),
        dialogFormVisible: false,
        pageTotal: 100,

        openMyNextIndex: false,
        openCustomColumn: false,
        uri: {
          colConfigs: [
            {type: 'slot', typeName: 'select', typeOption: {type: 'selection', prop: 'select', label: '多选框'}},
            {
              typeOption: {
                prop: 'id', label: 'ID', sortable: 'custom', width: '100px', 'show-overflow-tooltip': true
              }
            },
            {typeOption: {width: '210px', label: '名字', prop: 'name', 'show-overflow-tooltip': true}},
            {typeOption: {prop: 'uri', label: '当前地址', sortable: 'custom', width: '100px', 'show-overflow-tooltip': true}},
            {
              typeOption: {
                prop: 'uri_id',
                label: '父地址ID',
                sortable: 'custom',
                width: '100px',
                'show-overflow-tooltip': true
              }
            },
            {
              typeOption: {
                prop: 'create_at',
                label: '创建时间',
                sortable: 'custom',
                width: '220px',
                'show-overflow-tooltip': true
              }
            },
            {
              typeOption: {
                prop: 'update_at',
                label: '更新时间',
                sortable: 'custom',
                width: '220px',
                'show-overflow-tooltip': true
              }
            },
            {
              typeOption: {
                prop: 'create_by',
                label: '创建用户',
                sortable: 'custom',
                width: '220px',
                'show-overflow-tooltip': true
              }
            },
            {
              typeOption: {
                prop: 'update_by',
                label: '修改用户',
                sortable: 'custom',
                width: '220px',
                'show-overflow-tooltip': true
              }
            },
          ],
          pageMiddle: {}
        },
      },
      // 表单数据
      row: {
        id: '',
        name: '',
        user_ids: [],
        uri_ids: [],
        data_ids: []
      },
    }
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
      this.row.id = id
      this.beforeButtonAddEdit(...arguments)
    },
    // 更新按钮
    buttonUpdate: function (id) {
      _myCommon.log('编辑：', id, this.enums)
      this.row.id = id
      curIndex({field: ['id', 'name', 'user_ids', 'uri_ids'],where: {id: this.row.id}}).then((res) => {
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
      _myCommon.log('查询：', this.input, this.value)
      if (page) {
        this.input.page.page = page
      }
      this.apiIndex([curIndex({...this.input})])
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
      _myCommon.log('表单对话框 确定', this.row.id)

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

