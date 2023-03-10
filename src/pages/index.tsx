import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'

import clientsData from '../../public/clients.json'

import ClientList from '../components/ClientList'

const Home: NextPage<{
  initialClients: Client[]
}> = ({ initialClients, ...props }) => {
  const updateClientsInterval = useRef<NodeJS.Timeout | null>(null)
  const [clients, setClients] = useState<Client[]>(initialClients || [])

  const updateClients = useCallback(() => {
    Promise.all(
      clients.map((client: Client) => {
        const { host } = client
        return fetch('/api/ping', { method: 'POST', body: JSON.stringify({ host }) })
          .then(r => r.json())
          .then(({ isActive }) => {
            client.isActive = isActive
            return { ...client }
          })
      })
    ).then(setClients)
  }, [clients])

  const updateClient = useCallback(
    (client: Client, patch: Partial<Client>) => {
      const newClients = clients.reduce((acc, c) => {
        if (c.mac === client.mac) c = { ...c, ...patch }
        acc.push(c)
        return acc
      }, [] as Client[])
      setClients(newClients)
    },
    [clients]
  )

  useEffect(() => {
    updateClients()
    updateClientsInterval.current = setInterval(updateClients, 60 * 1000)
    return () => {
      clearInterval(updateClientsInterval.current!)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Wake-On-LAN</title>
        <meta name="description" content="Wake-On-LAN" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ClientList clients={clients} updateClient={updateClient} updateClients={updateClients} />
      </main>
    </>
  )
}

export const getStaticProps = () => {
  return { props: { initialClients: clientsData } }
}

export default Home
