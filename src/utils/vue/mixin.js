export const queryMixin = {
  data() {
    return {
      aaaa: 11111
    }
  },
  watch: {
    'input.page': {
      handler: function () {
        _myCommon.log('mixin: 页码变化 触发查询')
        this.search()
      },
      deep: true
    }
  },
  beforeRouteEnter(to, f, next) {
    next((vm) => {
      if (Object.keys(to.query).length) {
        _myCommon.log('mixin: url.query变化 重置查询')
        vm.renewWhere()
        _myCommon.assignIn(vm.input.where, to.query).then(() => {
          _myCommon.log('mixin: url.query变化 触发查询')
          vm.search()
        })
      }
    })
  },
  created() {
    _myCommon.log('mixin: 默认 触发查询', this.input.where)
    _myCommon.notInQuery().then(() => {
      this.search()
    })
  },
  methods: {
    // 初始化 where
    renewWhere: function () {
      this.renewObj(this.input.where)
    },
    // 重置对象
    renewObj: function (obj) {
      for (let k in obj) {
        let v = obj[k]
        if (_myCommon.isObject(v)) {
          this.renewObj(obj)
        } else if (_myCommon.isArray(v)) {
          obj[k] = []
        } else{
          obj[k] = ''
        }
      }
    },
    beforeButtonAddEdit: function (id) {
      this.openRowDialog(true)
    },
    openRowDialog: function (open = true) {
      this.curConfig.dialogFormVisible = open
    },
    afterConfirmRowDialog: function () {
      this.openRowDialog(false)
      this.search()
    },
  }
}
