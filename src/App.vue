<script setup lang="ts"></script>

<template>
  <k-conf-provider>
    <router-view></router-view>
  </k-conf-provider>
</template>

<style lang="less">
@import './theme/index.less';

html,
body {
  font-size: 14px;
  --uno: font-sans;
  color: @c-text;
}
</style>
