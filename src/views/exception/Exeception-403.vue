<template>
  <el-row>
    <el-col>
      <el-result icon="warning" title="Error" sub-title="Your are not allowed to visit this page">
        <template #extra>
          <el-button type="primary" @click="goBack">Back</el-button>
        </template>
      </el-result>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
const router = useRouter();
const goBack = () => {
  router.push({
    name: 'home',
  });
};
</script>
