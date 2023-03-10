import { exec } from 'child_process'

const run = (cmd: string, params?: string[]) => {
  return new Promise((res, rej) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) rej(err)
      res(stdout)
    })
  })
}

export const pingClient = (host: string): Promise<boolean> => {
  return run(`./src/scripts/ping-client.sh ${host}`)
    .then(sent => true)
    .catch(() => false)
}
export const pingUrl = (url: string): Promise<boolean> => {
  return run(`./src/scripts/ping-url.sh ${url}`)
    .then(sent => true)
    .catch(() => false)
}

export const suspend = (host: string): Promise<boolean> => {
  return run(`./src/scripts/suspend.sh ${host}`)
    .then(sent => true)
    .catch(() => false)
}

export const wol = (mac: string): Promise<boolean> => {
  return run(`./src/scripts/wol.sh ${mac}`)
    .then(sent => true)
    .catch(() => false)
}
