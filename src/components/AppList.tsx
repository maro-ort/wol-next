import React, { FC, useCallback, useEffect, useState } from 'react'
import cx from 'classnames'

import MoonSvg from '../svg/moon.svg'
import QuestionSvg from '../svg/question.svg'
import SunSvg from '../svg/sun.svg'

enum Timer {
  pingInterval = 60 * 1000,
}

const App: FC<{ app: App }> = ({ app }) => {
  const [currentStatus, setCurrentStatus] = useState<Status>('unknown')

  const updateStatus = useCallback(() => {
    fetch('/api/pingUrl', { method: 'POST', body: JSON.stringify({ host: app.url }) })
      .then(r => r.json())
      .then(({ isActive }) => {
        setCurrentStatus(isActive ? 'on' : 'off')
      })
  }, [app.url])

  const open = useCallback(() => currentStatus === 'on' && window.open(app.url, '__blank'), [app.url, currentStatus])

  useEffect(() => {
    updateStatus()
    const updateStatusInterval = setInterval(updateStatus, Timer.pingInterval)
    return () => {
      clearInterval(updateStatusInterval)
    }
  }, [updateStatus])

  return (
    <div className={cx('card', `--${currentStatus}`)} onClick={open}>
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
      </div>
      <div className="card__name">
        <div>{app.name}</div>
      </div>
    </div>
  )
}

const AppList: FC<{ apps: App[] }> = ({ apps }) => {
  return (
    <section id="app-list">
      {apps.map((app, i) => (
        <App key={i} app={app} />
      ))}
    </section>
  )
}

export default AppList
