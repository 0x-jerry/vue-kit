<script lang="ts" setup>
export interface CommandItemProps {
  id: number
  name: string
  icon?: string
  category?: string
  isActive?: boolean
}

const props = defineProps<CommandItemProps>()
</script>

<template>
  <div class="command-item" :class="{ 'is-active': isActive }">
    <i class="icon" v-if="icon" :class="props.icon"></i>
    <span class="name">{{ props.name }}</span>
    <span class="category"> {{ props.category }}</span>
    <div class="item-content"></div>
  </div>
</template>

<style lang="less" scoped>
.command-item {
  display: flex;
  align-items: flex-end;
  position: relative;
  z-index: 1;
  cursor: pointer;
  gap: 4px;

  .icon {
    --uno: size-6 mr-2 text-gray-5;
  }

  .item-content {
    width: 0;
    flex: 1;
  }

  .category {
    --uno: text-gray-4 text-sm;
  }

  &.is-active {
    &::before {
      content: '';
      position: absolute;
      z-index: -1;
      --padding-x: 6px;
      --padding-y: 4px;

      --uno: rounded-lg;

      top: calc(var(--padding-y) * -1);
      left: calc(var(--padding-x) * -1);
      width: calc(100% + var(--padding-x) * 2);
      height: calc(100% + var(--padding-y) * 2);
      background: #d9d9d6;
    }
  }
}
</style>
