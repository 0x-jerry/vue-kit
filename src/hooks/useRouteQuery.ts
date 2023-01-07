export function useRouteQuery<T extends string | string[]>(
  name: string,
  defaultValue?: T,
  opt?: { replace?: boolean },
) {
  const router = useRouter()
  const route = useRoute()

  const value = ref<T>()

  watch(route, () => (value.value = (route.query[name] || defaultValue) as T), {
    immediate: true,
  })

  watch(value, () => {
    const history = router.options.history

    const base = 'http://xxx.com'
    const fake = new URL(route.fullPath, base)
    fake.searchParams.set(name, String(value.value))

    const to = fake.toString().slice(base.length)

    if (opt?.replace) {
      history.replace(to)
    } else {
      history.push(to)
    }
  })

  return value
}
