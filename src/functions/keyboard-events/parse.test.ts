import { parseKeyOption } from './parse'

describe('parse key option', () => {
  it('should parse single key', () => {
    expect(parseKeyOption('a')).toEqual({
      key: 'a',
    })
  })

  it('should parse combo keys', () => {
    expect(parseKeyOption('meta + a')).toEqual({
      key: 'a',
      meta: true,
    })

    expect(parseKeyOption('meta + shift + a')).toEqual({
      key: 'a',
      meta: true,
      shift: true,
    })
  })

  it('should parse failed', () => {
    expect(() => parseKeyOption('v + meta a')).to.throw(
      'Parse `v + meta a` failed! Please check key string.'
    )
  })

  it('should work with built-in key map', () => {
    expect(parseKeyOption('meta + left')).toEqual({
      key: 'ArrowLeft',
      meta: true,
    })
  })
})
