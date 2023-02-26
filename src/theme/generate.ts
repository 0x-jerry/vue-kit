import { writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const r = (...args: string[]) => join(__dirname, ...args)

const config = {
  color: {
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },
    text: '#000000',
    'text-reverse': '#ffffff',
    disabled: '@c-gray-400',
  },
  size: {
    base: '30px',
    sm: '24px',
  },
  var: {
    prefix: 'k-',
    'c-primary': '@c-primary-500',
  },
  radius: {
    sm: '2px',
    base: '4px',
  },
}

main()

async function main() {
  const lines: string[] = [
    '// This file is auto generated by src/theme/generate.ts',
    '// So, do not edit it directly.',
  ]

  addVar(config.color, 'c-')
  addVar(config.size, 's-')
  addVar(config.radius, 'r-')
  addVar(config.var)

  await writeFile(r('./basic-vars.less'), lines.join('\n'))

  function addVar(obj: Record<string, string | Record<string, string>>, prefix = '') {
    Object.entries(obj).map(([k, v]) => {
      if (typeof v === 'string') {
        lines.push(`@${prefix}${k}: ${v};`)
      } else {
        addVar(v, prefix ? `${prefix}${k}-` : `${k}-`)
      }
    })
  }
}
