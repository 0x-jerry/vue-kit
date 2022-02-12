# 全局变量

由 `unplugin-auto-import` 支持的自动引入。

通过 `index.ts` 暴露的变量，会自动引入。

## 例子

例如 `index.ts` 暴露变量 hello

```ts
export const hello = 'hello';
```

再在 `vite/autoImportResolver.ts` 中添加需要自动引入的变量名：

```ts
// 修改这个值
const globalPropNames = [
  ...,
  'hello', // 添加暴露的变量名
]
```

这样，则在其它文件，例如 `main.ts` 文件里，就可以直接使用，而不需要使用

```ts
console.log(hello);
```

## Q & A

Q: IDE 提示报错
A: 启动一次开发服务器，插件才会生成 `/auto-imports.d.ts` 文件。
