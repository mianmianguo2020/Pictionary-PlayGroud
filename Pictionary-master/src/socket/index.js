import io from 'socket.io-client'
import store from '../store'
import { MessageBox, Notification } from 'element-ui'
const socket = io()

socket.on('connect', () => {
  console.log('connect sucess')
  store.commit('updateConnected', true)
})
socket.on('disconnect', () => {
  console.log('connect fail')
  store.commit('updateConnected', false)
})

socket.on('room_info', ({ nicknames, holder, lines }) => {
  console.log(store)
  store.commit('updateNicknames', nicknames)
  store.commit('updateHolder', holder)
  store.commit('updateLines', lines)
})

socket.on('user_enter', (nickname) => {
  store.commit('addToNicknames', nickname)
})

socket.on('already_started', (holder) => {
  MessageBox.alert('There is already a game in progress, and the host is..' + holder)
})
socket.on('game_started', (holder) => {
  store.commit('addHolder', holder)
  Notification.success(`${holder} As the host, I have started a new game. Everyone can start guessing the answers now！`)
})

socket.on('game_stoped', () => {
  store.commit('updateHolder', '')
  store.commit('updateLines', [])
  Notification.warning('The host has terminated the current game.')
})

socket.on('starting_line', (line) => {
  store.commit('drawNewLine', line)
})
socket.on('updating_line', (line) => {
  store.commit('updateNewLine', line)
})

socket.on('game_answered', ({ alreadyDone, success, nickname, answer }) => {
  if (alreadyDone) {
    MessageBox.alert('The answer to the current game has already been guessed, so you cannot continue guessing！')
    return
  }
  if (!success) {
    Notification.error(`Player ${nickname} Wrong Answers：${answer}`)
    return
  }

  MessageBox.alert(`PLayer ${nickname} "Correct answer guessed: ${answer}`, {
    title: 'Congratulation',
    type: 'success'
  })
})

socket.on('user_leave', (nickname) => {
  store.commit('delFromNicknames', nickname)

  if (nickname === store.state.holder) {
    store.commit('updateHolder', '')
    store.commit('updateLines', [])
    Notification.error('Host Left the game！')
  }
})
export default socket
