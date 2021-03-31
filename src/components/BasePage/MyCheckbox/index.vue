<!-- label 必须强类型  -->
<!-- v-model：传入已选值；enums：数组枚举 -->
<!-- 支持 对象值 -->
<template>
  <div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="value2" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="(item, i) in enums" :label="getValue(item)" :key="i">{{ getLabel(item) }}</el-checkbox>
    </el-checkbox-group>
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
      set(val) {
        let v = val.map((item) => {
          if (_myCommon.isArray(this.enumsValueKey)) {
            return this.ouputValue(item)
          }
          return item
        })
        _myCommon.log('my-checkbox-output', v)
        this.$emit('input', v)
      }
    }
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: true
    };
  },
  created() {
    _myCommon.log('my-checkbox', this.enums, this.value2)
  },
  methods: {
    handleCheckAllChange(val) {
      this.value2 = val ? this.enums.map((item) => {
        return this.getValue(item)
      }) : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.enums.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.enums.length;
    },
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
