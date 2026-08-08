import { useEffect, useRef } from 'react'
import { getSocket } from '@lib/socket'
import type { Socket } from 'socket.io-client'

type SocketEvent = string
type EventHandler = (...args: unknown[]) => void

export function useWebSocket(
  event: SocketEvent,
  handler: EventHandler,
  deps: unknown[] = [],
) {
  const socket = getSocket()
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    const listener: EventHandler = (...args) => handlerRef.current(...args)
    socket.on(event, listener as Parameters<Socket['on']>[1])
    return () => {
      socket.off(event, listener as Parameters<Socket['off']>[1])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, ...deps])
}
