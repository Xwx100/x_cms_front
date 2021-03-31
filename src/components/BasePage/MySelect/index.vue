<!-- 基本与 MyCheckbox 一致 -->
<template>
  <div>
    <el-select
      v-model="value2"
      v-bind="options">
      <el-option
        v-for="(item, index) in enums"
        :key="index"
        :label="getLabel(item)"
        :value="getValue(item)">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    enums: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 支持 对象值 比较
    enumsValueKey: {
      default: 'id'
    },
    // 支持 对象值 渲染
    enumsLabelKey: {
      default: 'name'
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    options: {
      type: Object,
      default: () => {
        return {
          multiple: true,
          collapseTags: true,
          clearable: true,
          placeholder: '多选框'
        }
      }
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  computed: {
    value2: {
      get() {
        return this.value.map((item) => {
          return this.getValue(item)
        })
      },
      set(newV) {
        let v = newV.map((item) => {
          if (_myCommon.isArray(this.enumsValueKey)) {
            return this.ouputValue(item)
          }
          return item
        })
        _myCommon.log('my-select-output', v)
        this.$emit('input', v)
      }
    }
  },

  watch: {
    // value2: function (newV, oldV) {
    //   let v = newV.map((item) => {
    //     if (_myCommon.isArray(this.enumsValueKey)) {
    //       return this.ouputValue(item)
    //     }
    //     return item
    //   })
    //   _myCommon.log('my-select-output', v)
    //   this.$emit('input', v)
    // }
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: true
    };
  },
  created() {
    _myCommon.log('my-select', this.enums, this.value2)
  },
  methods: {
    getValue(item) {
      let key = this.enumsValueKey;
      if (_myCommon.isArray(key)) {
        return JSON.stringify(_myCommon.getValueMulti(item, key, (v) => String(v)))
      } else {
        return String(item[key])
      }
    },
    getLabel(item) {
      let key = this.enumsLabelKey;
      if (_myCommon.isArray(key)) {
        return _myCommon.getValueMulti(item, key, (v) => String(v)).join('_')
      } else {
        return item[key]
      }
    },
    ouputValue(item) {
      return JSON.parse(item)
    },
  }
};
</script>

<style scoped>

</style>
