<template>
  <el-container>
    <el-header height="30">
      <app-header />
    </el-header>

    <el-container>
      <el-aside width="400px" class="left-panel">
        <app-side-panel />
        <div class="color">
          <span class="demonstration">Choose pen color:</span>
          <el-color-picker v-model="color" />
        </div>
      </el-aside>

      <el-main>
        <app-stage :color="color" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppHeader from './components/app-header'
import AppStage from './components/app-stage'
import AppSidePanel from './components/app-side-panel'
export default {
  components: {
    AppHeader,
    AppStage,
    AppSidePanel
  },
  data() {
    return {
      color: '#df4b26'
    }
  },
  created() {
    this.$store.dispatch('sendUserEnter')
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.left-panel {
  padding: 20px;
}
.color{
  margin-top: 20px;
}
.demonstration{
  margin-right: 15px;
}
</style>
