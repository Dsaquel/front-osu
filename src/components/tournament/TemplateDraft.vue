<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    details: string | null;
    rangePlayerMax: number | null;
    rangePlayerMin: number | null;
    numbersPlayers: number | null;
    estimateStartDate: string | null;
    type: 'standard ' | 'taiko';
  }>(),
  {
    type: 'standard ',
  },
);
defineEmits([
  'update:name',
  'update:details',
  'update:rangePlayerMax',
  'update:rangePlayerMin',
  'update:numbersPlayers',
  'update:estimateStartDate',
  'update:type',
]);
</script>

<template>
  <div m="x-auto" class="card sm:max-w-1200px">
    <div p="10" grid="~ rows-1 cols-2 gap-6">
      <div>
        <span display="block" text="sm"> Name </span>
        <el-input :value="name" size="large" @input="$emit('update:name', $event.target.value)" />
      </div>

      <div text="right">
        <span display="block" text="sm"> Number of players max </span>
        <el-select
          :value="numbersPlayers"
          size="large"
          w="full"
          @input="$emit('update:numbersPlayers', $event.target.value)"
        >
          <el-option :value="4" />
          <el-option :value="16" />
          <el-option :value="32" />
        </el-select>
      </div>
      <div grid="col-span-2">
        <span text="sm">details</span>
        <MarkdownTextarea :value="details" @input="$emit('update:details', $event.target.value)" />
      </div>
      <CommonDatepicker
        :value="estimateStartDate"
        :title="'Estimation start'"
        :type="'month'"
        @input="$emit('update:estimateStartDate', $event.target.value)"
      />
      <slot name="last" />
    </div>
  </div>
</template>
