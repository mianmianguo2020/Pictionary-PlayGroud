<template>
  <el-card>
    <div class="panel-area">
      <ul class="participants">
        <li v-for="item in nicknames" :key="item">
          <span>{{ item }}<span v-if="item===nickname"> Me </span></span>
          <el-tag v-if="item===holder" size="mini">Host</el-tag>
        </li>

      </ul>
    </div>

    <div class="panel-area button-area">
      <el-button
        v-if="!isGameStarted"
        type="primary"
        size="small"
        icon="el-icon-edit"
        @click="resultDialogVisible=true"
      >Host Game</el-button>

      <el-button
        v-if="isGameStarted && nickname === holder"
        type="warning"
        size="small"
        icon="el-icon-delete"
        @click="stopGameHandler"
      >Stop</el-button>

      <el-button
        v-if="isGameStarted && nickname !== holder"
        type="success"
        size="small"
        icon="el-icon-magic-stick"
        @click="answerDialogVisible=true"
      >Guess</el-button>

      <el-button
        type="danger"
        size="small"
        icon="el-icon-switch-button"
        @click="exitHandle"
      >Exit</el-button>
    </div>

    <el-dialog
      title="PLease confirm the question"
      :visible.sync="resultDialogVisible"
      width="30%"
    >
      <el-input v-model="expectImageName" placeholder="Please enter your answer" readonly="readonly" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="resultDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveDialogHandler">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Please fill in answer"
      :visible.sync="answerDialogVisible"
      width="30%"
    >
      <el-input v-model="inputImageName" placeholder="Please enter your answer" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="answerDialogVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="saveAnswerDialogHandler"
        >Confirm</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      resultDialogVisible: false,
      expectImageName: '',
      answerDialogVisible: false,
      inputImageName: ''
    }
  },
  computed: {
    ...mapState(['nickname', 'nicknames', 'holder', 'lib']),
    ...mapGetters(['isGameStarted'])
  },
  beforeUpdate() {
    const num = Math.floor(Math.random() * this.lib.length)
    if (this.resultDialogVisible) this.expectImageName = this.lib[num]
  },
  methods: {
    saveDialogHandler() {
      this.$store.dispatch('sendStartGame', this.expectImageName)
      this.expectImageName = ''
      this.resultDialogVisible = false
    },
    stopGameHandler() {
      this.$confirm('Are you sure to stop the game?', 'Reminder').then(() => {
        this.$store.dispatch('sendStopGame')
      }).catch(e => {
        console.log(e)
      })
    },
    saveAnswerDialogHandler() {
      if (!this.inputImageName) {
        this.$message.error('Input cannot be empty')
        return
      }
      this.$store.dispatch('sendAnswerGame', this.inputImageName)
      this.inputImageName = ''
      this.answerDialogVisible = false
    },
    exitHandle() {
      this.$confirm('exit the game', 'confirm?').then(() => {
        this.$store.dispatch('sendUserLeave')
        this.$router.replace('/login')
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-area {
  margin: 10px 0;
}
</style>
