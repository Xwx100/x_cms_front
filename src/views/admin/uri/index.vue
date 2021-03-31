<template>
  <div class="app-container">
    <base-page
      :search="input.where"
      :search-configs="searchConfigs"
      :data="childData"
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
      <el-input slot="role_id" v-model="input.where.role_id" slot-scope="scope"
                :placeholder="scope.searchConfig.typeOption.label"/>
      <el-input slot="uri" v-model="input.where.uri" slot-scope="scope"
                :placeholder="scope.searchConfig.typeOption.label"/>
      <el-input slot="uri_id" v-model="input.where.uri_id" slot-scope="scope"
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

      <el-table-column slot="select" type="selection" prop="select"></el-table-column>
      <el-table-column label="拥有角色" prop="role_ids" slot="role_ids" show-overflow-tooltip width="300px">
        <template slot-scope="scope">
          <el-link type="primary" target="_blank" v-for="item in scope.row.role_ids">
            <div style="margin-right: 10px">
              {{ item.name ? item.name : item.id }}
            </div>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" slot="opera" show-overflow-tooltip width="300px">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="buttonUpdate(scope.row.id)">编辑</el-button>
          <el-button type="warning" size="mini" @click="buttonDel([scope.row.id])">删除</el-button>
          <el-button type="success" size="mini">
            <router-link :to="{name: 'role', query: {permission_id: scope.row.id, permission_type: 'uri'}}">拥有角色
            </router-link>
          </el-button>
        </template>
      </el-table-column>
    </base-page>

    <el-dialog :title="row.id ? '编辑' : '新增'" :visible.sync="curConfig.dialogFormVisible">
      <el-form ref="form" :model="row" label-position="left" label-width="80px">
        <el-form-item label="名字">
          <el-input v-model="row.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="网站地址">
          <el-input v-model="row.uri" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="网站父地址">
          <el-input v-model="row.uri_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="initUriFront">配置前端参数</el-button>
        </el-form-item>
        <div v-if="Object.keys(row.front_item).length">
          <el-divider/>
          <el-form-item label="名字(name)">
            <el-input v-model="row.front_item.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="组件地址(component)">
            <el-input v-model="row.front_item.component" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="重定向(redirect)">
            <el-input v-model="row.front_item.redirect" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="元素(meta)">
            <el-form-item label="标题(title)">
              <el-input v-model="row.front_item.meta.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="图标(icon)">
              <el-input v-model="row.front_item.meta.icon" autocomplete="off"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item label="是否隐藏(hidden)">
            <el-input v-model="row.front_item.hidden" autocomplete="off"></el-input>
          </el-form-item>
        </div>
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
import {index as curIndex, create, update, del} from '@/api/uri'
import {index as otherIndex} from '@/api/role'
import {arrayIdsToName} from '@/utils'

export default {
  name: 'uri',
  mixins: [queryMixin],
  props: {
    roleId: {
      default: ''
    },
    // 表格配置
    colConfigs: {
      type: Array,
      default: () => {
        return [
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
          {
            type: 'slot',
            typeName: 'opera',
            typeOption: {width: '260px', label: '操作', 'show-overflow-tooltip': true},
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
    },
    // 开启表格子数据
    childData: function () {
      this.dataAddTree(this.data)
      return this.data
    },
  },
  components: {
    BasePage,
    MyCheckbox,
    MyDate
  },
  data() {
    return {
      // 搜索配置
      searchConfigs: [
        {type: 'slot', typeOption: {prop: 'id', label: 'ID'}},
        {type: 'slot', typeName: 'name1', typeOption: {prop: 'name', label: '名字'}},
        {type: 'slot', typeOption: {prop: 'uri', label: '当前地址'}},
        {type: 'slot', typeOption: {prop: 'uri_id', label: '父地址ID'}},
        {type: 'slot', typeOption: {prop: 'role_id', label: '角色ID'}},
        {type: 'slot', typeOption: {prop: 'create_at', label: '创建时间'}},
        {type: 'slot', typeOption: {prop: 'update_at', label: '更新时间'}},
        {type: 'slot', typeOption: {prop: 'create_by', label: '创建用户'}},
        {type: 'slot', typeOption: {prop: 'update_by', label: '修改用户'}},
        {type: 'slot', typeName: 'search'},
      ],
      // 搜索数据
      input: {
        field: ['id', 'name', 'uri', 'uri_id', 'create_at', 'update_at', 'create_by', 'update_by'],
        where: {
          id: '',
          name: '',
          uri: '',
          uri_id: 0,
          role_id: this.roleId,
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
      tableProp: {
        'row-key': 'id',
        border: true,
        fit: true,
        lazy: true,
        'tree-props': {hasChildren: 'hasChildren'},
        cellStyle: {padding: '1px'},
        'header-row-style': {padding: '1px'},
        'header-cell-style': {padding: '1px'},
        'default-sort': {prop: 'id', order: 'descending'},
        'load': (row, treeNode, resolve) => {
          curIndex({field: this.input.field, where: {uri_id: row.id}, page: {page_limit: false}}).then((res) => {
            this.dataAddTree(res.data.list)
            resolve(res.data.list)
          })
        }
      },
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
      enums: {
        roles: [],
        rolesInput: {
          field: ['id', 'name'],
          // page: {
          //   page_limit: false
          // }
        }
      },
      curConfig: {
        multipleSelection: [],
        dialogFormVisible: false,
        pageTotal: 100,
      },
      row: {
        id: '',
        name: '',
        uri: '',
        uri_id: '',
        level: 0,
        ctl_open_front: false,
        front_item: {}
      }
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
      curIndex({field: this.search.field, where: {id: this.row.id}}).then((res) => {
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
    // 表格数据 增加tree
    dataAddTree(data) {
      data.map((item) => {
        item.hasChildren = true
        return item
      })
    },
    initUriFront() {
      // 未初始化
      if (this.curConfig.dialogFormVisible && !Object.keys(this.row.front_item).length) {
        this.row.front_item = {
          name: '',
          meta: {
            title: '',
            icon: ''
          }
        }
      }
    }
  }
}

</script>

