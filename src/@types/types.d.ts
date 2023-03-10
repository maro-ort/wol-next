declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

type App = {
  name: string
  url: string
  client: string
}

type Client = {
  name: string
  host: string
  mac: string
  isActive?: boolean
  canWake?: boolean
  canSus?: boolean
}

type Status = 'unknown' | 'waiting-input' | 'on' | 'off' | 'error'
