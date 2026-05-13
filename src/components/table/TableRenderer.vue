<script setup lang="ts">
defineProps({
  columns: {
    type: Array as () => any[],
    default: () => []
  },
  data: {
    type: Array as () => any[],
    default: () => []
  }
})
</script>

<template>
  <el-table :data="data" border stripe style="width: 100%">
    <el-table-column
      v-for="col in columns"
      :key="col.prop"
      :label="col.label"
      :prop="col.prop"
    />
  </el-table>
</template>
