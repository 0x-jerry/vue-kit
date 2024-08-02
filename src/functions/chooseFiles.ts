export interface ChooseFilesOption {
  extensions?: string[]

  /**
   * @default false
   */
  multiple?: boolean
}

export function chooseFiles(opt: ChooseFilesOption = {}): Promise<File[]> {
  return new Promise((resolve, reject) => {
    const input = createInputElement()

    input.accept = opt.extensions?.map((n) => `.${n}`).join(',') ?? ''
    input.multiple = opt.multiple ?? false

    input.onchange = () => {
      const files = [...(input?.files || [])]

      resolve(files)
      input.remove()
    }

    input.onerror = (e) => {
      reject(e)
      input.remove()
    }

    input.click()
  })
}

export enum InvalidFileType {
  Size = 'size',
  Extension = 'extension',
}

export interface ValidateFileOption {
  /**
   * Size in bytes
   */
  size?: number
  extensions?: string[]
}

export interface InvalidFile {
  file: File
  type: InvalidFileType
}

/**
 * Filter the invalid files
 *
 * @param files
 * @param option
 * @returns
 */
export function validateFiles(files: File[], option: ValidateFileOption = {}) {
  const invalidFiles: InvalidFile[] = []

  const validFiles = files.filter((file) => {
    if (option.size && file.size > option.size) {
      invalidFiles.push({
        file,
        type: InvalidFileType.Size,
      })
      return false
    }

    const suffix = file.name.split('.')[1]

    if (option.extensions?.length && !option.extensions.includes(suffix)) {
      invalidFiles.push({
        file,
        type: InvalidFileType.Extension,
      })

      return false
    }

    return true
  })

  return {
    validFiles,
    invalidFiles,
  }
}

function createInputElement() {
  const input = document.createElement('input')

  input.type = 'file'
  input.style.display = 'none'
  input.setAttribute('data-choose-file', '')

  document.body.appendChild(input)

  return input
}
