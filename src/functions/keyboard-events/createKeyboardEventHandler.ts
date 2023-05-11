import { type Arrayable, isString, toArray } from '@0x-jerry/utils'
import { type KeyOption, parseKeyOption, type SpecialKey, specialKeys } from './parse'

type KeyboardEventListener = (e: KeyOption) => unknown

/**
 *
 */
export const createKeyboardEventHandler = (
  keyOptions: Arrayable<string | KeyOption>,
  listener: KeyboardEventListener,
) => {
  const options = toArray(keyOptions).map((item) => (isString(item) ? parseKeyOption(item) : item))

  return (e: KeyboardEvent) => {
    for (const keyOption of options) {
      if (isMatch(e, keyOption)) {
        listener(keyOption)
        break
      }
    }
  }
}

function isMatch(evt: KeyboardEvent, opt: KeyOption) {
  const keys = specialKeys.filter((key) => opt[key])

  const hitAllSpecialKeys = keys.every((item) => {
    const key = (item + 'Key') as `${SpecialKey}Key`

    return evt[key]
  })

  return hitAllSpecialKeys && opt.key === evt.key
}
