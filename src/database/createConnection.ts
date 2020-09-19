import type { Connection, ConnectionOptions } from 'typeorm'

import { config } from '../config/config'
import { fs } from '../filesystem/FS'
import { join } from 'path'
import { createConnection as typeormCreateConnection } from 'typeorm'

export async function createConnection(): Promise<Connection | null> {
  if (!config.database.enable) {
    return null
  }

  let connection: Connection

  try {
    const options = Object.assign({}, config.database, {
      entities: [join(fs.resolveZenPath('entity'), `*${fs.resolveZenFileExtension()}`)],
    }) as ConnectionOptions

    connection = await typeormCreateConnection(options)
  } catch (e) {
    throw new Error(e)
  }

  return connection
}
