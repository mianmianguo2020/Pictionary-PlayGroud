import Vue from 'vue'
import Vuex from 'vuex'
import socket from '@/socket'

Vue.use(Vuex)

const state = {
  connected: false,
  nickname: '',
  nicknames: [],
  holder: '',
  lines: [
    { stroke: '#df4b26', strokeWidth: 5, points: [100, 100, 100, 400] },
    { stroke: '#ff00ff', strokeWidth: 5, points: [100, 100, 300, 300] }
  ], 
  lib: ['Pig', 'Goat', 'Horse', 'Chicken', 'Cow', 'Sheep']
}

const mutations = {
  updateNickname(state, nickname) {
    state.nickname = nickname
  },
  updateNicknames(state, nicknames) {
    state.nicknames = nicknames || []
  },
  updateHolder(state, holder) {
    state.holder = holder || ''
  },
  updateLines(state, lines) {
    state.lines = lines || []
  },
  addToNicknames(state, nickname) {
    if (!state.nicknames.includes(nickname)) {
      state.nicknames.push(nickname)
    }
  },
  updateConnected(state, connected) {
    state.connected = connected
  },
  addHolder(state, holder) {
    state.holder = holder
  },
  drawNewLine(state, newLine) {
    state.lines.push(newLine)
  },
  updateNewLine(state, lastLine) {
    state.lines[state.lines.length - 1].points = lastLine.points
  },
  delFromNicknames(state, nickname) {
    state.nicknames = state.nicknames.filter(item => item !== nickname)
  }

}

const actions = {
  checkUserExist(context, nickname) {
    return new Promise((resolve, reject) => {
      socket.emit('check_user_exist', nickname, isExist => {
        resolve(isExist)
      })
    })
  },
  sendUserEnter(context) {
    const nickname = localStorage.getItem('nickname')
    socket.emit('enter', nickname)
    context.commit('updateNickname', nickname)
  },
  sendStartGame(context, imageName) {
    socket.emit('start_game', imageName)
  },
  sendStopGame(context) {
    socket.emit('stop_game')
  },
  sendDrawNewLine(context, line) {
    socket.emit('new_line', line)
    context.commit('drawNewLine', line)
  },
  sendUpdateNewLine(context, line) {
    socket.emit('update_line', line)
    context.commit('updateNewLine', line)
  },
  sendAnswerGame(context, answer) {
    socket.emit('answer_game', answer)
  },
  sendUserLeave(context) {
    socket.on('leave')
    context.commit('updateNickname', '')
    localStorage.removeItem('nickname')
  }
}

const getters = {
  isGameStarted(state) {
    return !!state.holder
  },
  isGameHolder(state) {
    return state.nickname === state.holder
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
