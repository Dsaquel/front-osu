<script lang="ts" setup>
withDefaults(
  defineProps<{
    title: string;
    type: 'year' | 'month' | 'date' | 'dates' | 'week' | 'datetime' | 'datetimerange' | 'daterange' | 'monthrange';
  }>(),
  {
    title: 'Month',
    type: 'month',
  },
);
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now();
};
</script>

<template>
  <div>
    <span display="block" text="xs">{{ title }}</span>
    <el-date-picker v-bind="useAttrs()" :type="type" :disabled-date="disabledDate" />
  </div>
</template>
