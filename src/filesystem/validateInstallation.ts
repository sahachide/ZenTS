import { fs } from './FS'

/**
 * Validates that all needed directories are existing inside a ZenTS application.
 * This function is called on bootup and will throw an fatal error when a needed directory
 * doesn't exist.
 */
export async function validateInstallation(): Promise<void> {
  const checkDirs = [fs.resolveZenPath('controller'), fs.resolveZenPath('view')]

  for (const checkDir of checkDirs) {
    if (!(await fs.exists(checkDir))) {
      throw new Error(`Fatal Error: Dir "${checkDir}" doesn't exists!`)
    }
  }
}
