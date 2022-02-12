const $el = document.createElement('input')
$el.style.display = 'none'
$el.type = 'file'
document.body.append($el)

export function chooseFiles(opt: { accept?: string; multiple?: boolean } = {}) {
  $el.accept = opt.accept || ''
  $el.multiple = !!opt.multiple

  return new Promise<File[]>((resolve) => {
    $el.onchange = () => {
      if (!$el.files) {
        resolve([])
        return
      }

      const files: File[] = []

      for (let idx = 0; idx < $el.files.length; idx++) {
        const file = $el.files.item(idx)

        file && files.push(file)
      }

      resolve(files)
    }

    // reset
    $el.value = ''
    $el.click()
  })
}
