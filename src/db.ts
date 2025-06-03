import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { createTunnel } from 'tunnel-ssh'

dotenv.config()

const localPort = 3307

const tunnelOptions = {
  autoClose: true,
  reconnectOnError: true, // ! or false, depending on your needs
}

const serverOptions = {
  port: localPort,
}

const sshOptions = {
  host: process.env.SSH_HOST,
  port: process.env.SSH_PORT ? Number(process.env.SSH_PORT) : 22,
  username: process.env.SSH_USERNAME,
  password: process.env.SSH_PASSWORD,
}

const forwardOptions = {
  srcAddr: '127.0.0.1',
  srcPort: localPort,
  dstAddr: process.env.MYSQL_HOST || '127.0.0.1',
  dstPort: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
}

async function poolPromise() {
  const [server, conn] = await createTunnel(
    tunnelOptions,
    serverOptions,
    sshOptions,
    forwardOptions
  )

  // ! (Optional) Log setiap koneksi baru ke tunnel
  server.on('connection', (connection) => {
    console.log('new connection through tunnel')
  })

  // ! Buat pool MySQL ke port lokal (tunnel)
  const pool = mysql.createPool({
    host: '127.0.0.1',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: localPort,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })

  return pool
}

export default poolPromise