declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

type Client = {
  name: string
  host: string
  mac: string
  isActive?: boolean
}

type Status = 'unknown' | 'waiting-input' | 'on' | 'off' | 'error'
