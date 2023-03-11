import React, { FC, useCallback, useState, useRef, useEffect } from 'react'
import cx from 'classnames'

import EyeSvg from '../svg/eye.svg'
import EyeOffSvg from '../svg/eye-off.svg'
import MoonSvg from '../svg/moon.svg'
import QuestionSvg from '../svg/question.svg'
import RefreshSvg from '../svg/refresh.svg'
import SunSvg from '../svg/sun.svg'
import XSvg from '../svg/x.svg'

enum Timer {
  pingInterval = 1000,
  pingMaxCount = 10,
  pingTimeout = 10000,
  waitInputTimeout = 3000,
}

const Client: FC<{
  client: Client
  updateClients: () => void
}> = ({ client, updateClients }) => {
  const waitTimeout = useRef<NodeJS.Timeout | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<Status>(
    !('isActive' in client) ? 'unknown' : client.isActive ? 'on' : 'off'
  )

  useEffect(() => {
    if (!('isActive' in client)) setCurrentStatus('unknown')
    else if (client.isActive) setCurrentStatus('on')
    else if (!client.isActive) setCurrentStatus('off')
  }, [client])

  const handleAskInput = useCallback(
    (status: Status) => {
      if (status === 'on' && !client.canSus) return
      if (status === 'off' && !client.canWake) return
      const clean = () => setCurrentStatus(currentStatus)
      setCurrentStatus('waiting-input')
      waitTimeout.current = setTimeout(clean, Timer.waitInputTimeout)
      return () => {
        clearTimeout(waitTimeout.current!)
      }
    },
    [client.canSus, client.canWake, currentStatus]
  )

  const handleClick = useCallback(() => {
    const { host, isActive } = client
    // Clean ask input timer
    clearTimeout(waitTimeout.current!)
    setIsLoading(true)

    if (isActive) {
      fetch('/api/suspend', {
        method: 'POST',
        body: JSON.stringify({ host }),
      })
        .then(r => r.json())
        .then(({ sent }) => {
          if (!sent) setCurrentStatus('error')
          else setCurrentStatus('off')
          setIsLoading(false)
          updateClients()
        })
    } else {
      fetch('/api/wol', { method: 'POST', body: JSON.stringify({ mac: client.mac }) })
        .then(r => r.json())
        .then(({ sent }) => {
          // Wol is always sent
          if (!sent) {
            setCurrentStatus('error')
            setIsLoading(false)
            updateClients()
            return
          }

          let hasConnection = false

          // Ping failure
          let pingCounter = 0
          const pingTimeoutError = () => {
            setIsLoading(false)
            setCurrentStatus('error')
          }
          const pingTimeout = setTimeout(pingTimeoutError, Timer.pingTimeout)

          const pingHost = () => {
            if (hasConnection || pingCounter >= Timer.pingMaxCount) return
            pingCounter++
            fetch('/api/pingClient', { method: 'POST', body: JSON.stringify({ host }) })
              .then(r => r.json())
              .then(({ isActive }) => {
                if (!isActive) {
                  pingHost()
                  setTimeout(pingHost, Timer.pingInterval)
                } else {
                  hasConnection = true
                  clearTimeout(pingTimeout)
                  setIsLoading(false)
                  setCurrentStatus('on')
                  updateClients()
                }
              })
          }

          pingHost()
        })
    }
  }, [client, updateClients])

  return (
    <div
      className={cx('card', `--${currentStatus}`)}
      onClick={() => {
        const fns = {
          'waiting-input': handleClick,
          on: () => handleAskInput('on'),
          off: () => handleAskInput('off'),
        } as Record<Status, any>
        if (currentStatus in fns) fns?.[currentStatus]?.()
      }}
    >
      <div className="card__icons">
        <div
          className={cx('icon-unknown card__icon', {
            '--visible': currentStatus === 'unknown',
          })}
        >
          <QuestionSvg />
        </div>
        <div
          className={cx('card__icon', {
            '--visible': currentStatus === 'error',
          })}
        >
          <XSvg />
        </div>
        <div
          className={cx('card__icon', {
            '--visible': currentStatus === 'on',
          })}
        >
          <SunSvg />
        </div>
        <div
          className={cx('card__icon', {
            '--visible': currentStatus === 'off',
          })}
        >
          <MoonSvg />
        </div>
        <div
          className={cx('icon-power card__icon', {
            '--visible': currentStatus === 'waiting-input' && !client.isActive,
          })}
        >
          <EyeSvg />
        </div>
        <div
          className={cx('icon-power-off card__icon', {
            '--visible': currentStatus === 'waiting-input' && client.isActive,
          })}
        >
          <EyeOffSvg />
        </div>
      </div>
      <div className={cx('card__name', { '--loading': isLoading })}>
        {isLoading ? (
          <div>
            <RefreshSvg />
          </div>
        ) : (
          <div>{client.name}</div>
        )}
      </div>
    </div>
  )
}

const ClientList: FC<{
  clients: Client[]
  updateClients: () => void
  updateClient: (client: Client, patch: Partial<Client>) => void
}> = ({ clients, updateClients }) => {
  return (
    <section id="client-list">
      {clients.length === 0 && <div className="cl__empty">No clients available</div>}
      {clients.map(c => (
        <Client key={c.host} client={c} updateClients={updateClients} />
      ))}
    </section>
  )
}

export default ClientList
