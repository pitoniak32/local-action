import { jest } from '@jest/globals'
import * as core from '../../__fixtures__/core.js'
import { ResetCoreMetadata } from '../../src/stubs/core-stubs.js'
import { EnvMeta, ResetEnvMetadata } from '../../src/stubs/env-stubs.js'

const quibbleEsm = jest.fn().mockImplementation(() => {})
const quibbleDefault = jest.fn().mockImplementation(() => {})

// @ts-expect-error - `quibble` is the default, but we need to mock esm() too
quibbleDefault.esm = quibbleEsm

jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('quibble', () => {
  return { default: quibbleDefault }
})
jest.unstable_mockModule('../../src/utils/output.js', () => {
  return { printTitle: jest.fn() }
})

const { action } = await import('../../src/commands/run.js')

// Prevent output during tests
jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'table').mockImplementation(() => {})

describe('Command: run', () => {
  beforeEach(() => {
    // Reset metadata
    ResetEnvMetadata()
    ResetCoreMetadata()
  })

  afterEach(() => {
    // Reset all spies
    jest.resetAllMocks()
  })

  describe('TypeScript', () => {
    it('Action: success', async () => {
      EnvMeta.actionFile = `./__fixtures__/typescript/success/action.yml`
      EnvMeta.actionPath = `./__fixtures__/typescript/success`
      EnvMeta.dotenvFile = `./__fixtures__/typescript/success/.env.fixture`
      EnvMeta.entrypoint = `./__fixtures__/typescript/success/src/main.ts`

      await expect(action()).resolves.toBeUndefined()
    })

    it('Action: no-import', async () => {
      EnvMeta.actionFile = `./__fixtures__/typescript/no-import/action.yml`
      EnvMeta.actionPath = `./__fixtures__/typescript/no-import`
      EnvMeta.dotenvFile = `./__fixtures__/typescript/no-import/.env.fixture`
      EnvMeta.entrypoint = `./__fixtures__/typescript/no-import/src/main.ts`

      await expect(action()).resolves.toBeUndefined()
    })
  })

  describe('TypeScript ESM', () => {
    it('Action: success', async () => {
      EnvMeta.actionFile = `./__fixtures__/typescript-esm/success/action.yml`
      EnvMeta.actionPath = `./__fixtures__/typescript-esm/success`
      EnvMeta.dotenvFile = `./__fixtures__/typescript-esm/success/.env.fixture`
      EnvMeta.entrypoint = `./__fixtures__/typescript-esm/success/src/main.ts`

      await expect(action()).resolves.toBeUndefined()

      expect(core.setFailed).not.toHaveBeenCalled()
      expect(quibbleEsm).toHaveBeenCalled()
    })

    it('Action: no-import', async () => {
      EnvMeta.actionFile = `./__fixtures__/typescript-esm/no-import/action.yml`
      EnvMeta.actionPath = `./__fixtures__/typescript-esm/no-import`
      EnvMeta.dotenvFile = `./__fixtures__/typescript-esm/no-import/.env.fixture`
      EnvMeta.entrypoint = `./__fixtures__/typescript-esm/no-import/src/main.ts`

      await expect(action()).resolves.toBeUndefined()

      expect(core.setFailed).not.toHaveBeenCalled()
      expect(quibbleEsm).toHaveBeenCalled()
    })
  })

  describe('JavaScript', () => {
    it('Action: success', async () => {
      EnvMeta.actionFile = `./__fixtures__/javascript/success/action.yml`
      EnvMeta.actionPath = `./__fixtures__/javascript/success`
      EnvMeta.dotenvFile = `./__fixtures__/javascript/success/.env.fixture`
      EnvMeta.entrypoint = `./__fixtures__/javascript/success/src/main.js`

      await expect(action()).resolves.toBeUndefined()
    })

    it('Action: no-import', async () => {
      EnvMeta.actionFile = `./__fixtures__/javascript/no-import/action.yml`
      EnvMeta.actionPath = `./__fixtures__/javascript/no-import`
      EnvMeta.dotenvFile = `./__fixtures__/javascript/no-import/.env.fixture`
      EnvMeta.entrypoint = `./__fixtures__/javascript/no-import/src/main.js`

      await expect(action()).resolves.toBeUndefined()
    })
  })

  describe('JavaScript (ESM)', () => {
    it('Action: success', async () => {
      EnvMeta.actionFile = `./__fixtures__/javascript/success/action.yml`
      EnvMeta.actionPath = `./__fixtures__/javascript/success`
      EnvMeta.dotenvFile = `./__fixtures__/javascript/success/.env.fixture`
      EnvMeta.entrypoint = `./__fixtures__/javascript/success/src/main.js`

      await expect(action()).resolves.toBeUndefined()

      expect(quibbleDefault).toHaveBeenCalled()
    })

    it('Action: no-import', async () => {
      EnvMeta.actionFile = `./__fixtures__/javascript/no-import/action.yml`
      EnvMeta.actionPath = `./__fixtures__/javascript/no-import`
      EnvMeta.dotenvFile = `./__fixtures__/javascript/no-import/.env.fixture`
      EnvMeta.entrypoint = `./__fixtures__/javascript/no-import/src/main.js`

      await expect(action()).resolves.toBeUndefined()

      expect(quibbleDefault).toHaveBeenCalled()
    })
  })
})
