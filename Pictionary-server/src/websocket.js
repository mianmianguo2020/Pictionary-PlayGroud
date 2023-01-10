const io = require('socket.io')

module.exports = httpServer => {

    const server = io(httpServer)
    const user2socket = {}
    const socket2user = {}

    let currentGame = null

    server.on('connection', socket => {
        socket.on('check_user_exist', (nickname, callback) => {
            console.log(user2socket)
            callback(!!user2socket[nickname])
        })
        socket.on('enter', (nickname) => {
            const sid = socket.id
            user2socket[nickname] = sid
            socket2user[sid] = nickname
            socket.emit('room_info', {
                nicknames: Object.keys(user2socket),
                holder: currentGame?.holder,
                lines: currentGame?.lines || []
            })

            socket.broadcast.emit('user_enter', nickname)
        })

        socket.on('leave', () => {
            const sid = socket.id
            const nickname = socket2user[sid]

            delete user2socket[nickname]
            delete socket2user[sid]

            if (currentGame && currentGame.holder === nickname) {
                currentGame = null
            }

            socket.broadcast.emit('user_leave', nickname)
        })

        // ------------------------------------------------------------
        socket.on('start_game', (finalAnswer) => {
            if (currentGame) {
                socket.emit('already_started', currentGame.holder)
                return
            }

            currentGame = {
                success: false,
                holder: socket2user[socket.id],
                finalAnswer,
                lines: []
            }

            server.of('/').emit('game_started', currentGame.holder)
        })

        // ------------------------------------------------------------
        socket.on('stop_game', () => {
            const nickname = socket2user[socket.id]

            if (currentGame && nickname === currentGame.holder) {
                currentGame = null
                server.of('/').emit('game_stoped')
            }
        })

        // ------------------------------------------------------------
        socket.on('answer_game', (answer) => {
            if (!currentGame) return

            if (currentGame.success) {
                socket.emit('game_answered', {
                    alreadyDone: true
                })
            } else {
                const success = currentGame.finalAnswer === answer

                if (success) {
                    currentGame.success = true
                }

                server.of('/').emit('game_answered', {
                    alreadyDone: false,
                    success,
                    nickname: socket2user[socket.id],
                    answer
                })
            }
        })

        // ------------------------------------------------------------
        socket.on('new_line', (line) => {
            if (currentGame?.lines) {
                currentGame.lines.push(line)
                socket.broadcast.emit('starting_line', line)
            }
        })

        socket.on('update_line', (line) => {
            if (currentGame?.lines) {
                currentGame.lines[currentGame.lines.length - 1] = line
                socket.broadcast.emit('updating_line', line)
            }
        })

        // ------------------------------------------------------------
        socket.on('disconnect', () => {
            const sid = socket.id
            const nickname = socket2user[sid]

            delete user2socket[nickname]
            delete socket2user[sid]

            if (currentGame && nickname === currentGame.holder) {
                currentGame = null
            }

            socket.broadcast.emit('user_leave', nickname)
        })

        // ------------------------------------------------------------
    })

}