<template>
  <el-card ref="wrapper" :body-style="{ padding: 0 }">
    <v-stage
      :config="stageConfig"
      @mousedown="mousedownHandler"
      @mouseup="mouseupHandler"
      @mousemove="mousemoveHandler"
    >
      <v-layer>
        <v-line
          v-for="(line, index) in lines"
          :key="index"
          :config="line"
        />
      </v-layer>
    </v-stage>
  </el-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  props: { 'color': { type: String, default: '' }},
  data() {
    return {
      stageConfig: {
        width: 800,
        height: 700
      },
      painting: false,
      strokeWidth: 5
    }
  },

  computed: {
    ...mapState(['lines']),
    ...mapGetters(['isGameStarted', 'isGameHolder'])
  },

  mounted() {
    this.stageConfig.width = document.documentElement.clientWidth
    const that = this
    window.onresize = function temp() {
      that.stageConfig.width = document.documentElement.clientWidth
    }
  },

  methods: {
    mousedownHandler(e) {
      if (!this.isGameStarted || !this.isGameHolder) return
      this.painting = true
      const newLine = {
        stroke: this.color,
        strokeWidth: this.strokeWidth,
        points: [e.evt.layerX, e.evt.layerY]
      }
      this.$store.dispatch('sendDrawNewLine', newLine)
    },

    mousemoveHandler(e) {
      if (this.painting) {
        const lastLine = this.lines[this.lines.length - 1]
        lastLine.points = lastLine.points.concat([e.evt.layerX, e.evt.layerY])
        this.$store.dispatch('sendUpdateNewLine', lastLine)
      }
    },

    mouseupHandler() {
      this.painting = false
    }
  }
}
</script>
