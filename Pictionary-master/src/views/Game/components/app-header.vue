<template>
  <div class="app-header">
    <el-tag v-if="connected" type="success">Connected Server</el-tag>
    <el-tag v-else type="danger">Connecting Server</el-tag>

    <el-tag v-if="isGameStarted" type="success">Gaming</el-tag>
    <el-tag v-else type="info">The game has not yet started</el-tag>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState(['connected']),
    ...mapGetters(['isGameStarted'])
  }
}
</script>

<style scoped>
.el-tag {
  margin-right: 10px;
}
</style>
