<template>
  <div>
    <el-card
      class="login-card"
      :body-style="{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px'}"
    >
      <el-form ref="loginForm" inline :model="formData" :rules="rules">
        <el-form-item prop="nickname">
          <el-input v-model="formData.nickname" placeholder="Please enter your nickname" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="enterGame">Enter Game</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
export default {
  data() {
    return {
      formData: {
        nickname: ''
      },

      rules: {
        nickname: [{ required: true, message: 'Please enter your nickname' }]
      }
    }
  },

  methods: {
    enterGame() {
      this.$refs.loginForm.validate(async flag => {
        if (!flag) return
        const nickname = this.formData.nickname
        const isExist = await this.$store.dispatch('checkUserExist', nickname)
        console.log(isExist)
        if (isExist) {
          MessageBox.alert('This nickname is already in use')
        } else {
          localStorage.setItem('nickname', nickname)
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style scoped>
.login-card {
  width: 50%;
  margin: 0 auto;
  margin-top: 200px;
}
</style>
