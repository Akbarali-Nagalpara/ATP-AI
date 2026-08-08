import { io, Socket } from 'socket.io-client'
import { env } from '@config/env'
import { useAuthStore } from '@store/auth.store'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(env.wsUrl, {
      autoConnect: false,
      transports: ['websocket'],
      auth: (cb) => {
        cb({ token: useAuthStore.getState().accessToken })
      },
    })
  }
  return socket
}

export const connectSocket = () => getSocket().connect()
export const disconnectSocket = () => socket?.disconnect()
