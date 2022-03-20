export function useGlobalClickEvent(listener: (e: MouseEvent) => any) {
  onMounted(() => {
    window.addEventListener('click', listener)

    return () => {
      window.removeEventListener('click', listener)
    }
  })
}
