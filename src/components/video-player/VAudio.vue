<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import IconSkipNext from '~icons/mdi/skip-next'
import IconSkipPrevious from '~icons/mdi/skip-previous'
import IconMenu from '~icons/mdi/menu'
import { AudioOption } from './types'
import VProgress from './VProgress.vue'
import VCover from './VCover.vue'
import VPlayIcon from './VPlayIcon.vue'
import VVolume from './VVolume.vue'

const props = defineProps<{
  audios: AudioOption[]
  currentPlayIndex?: number
}>()

const emit = defineEmits<{
  (event: 'update:currentPlayIndex', val: number): void
}>()

const audio = ref<HTMLAudioElement>()

const status = reactive({
  idx: props.currentPlayIndex ?? 0,
  paused: true,
  duration: 0,
  current: 0,
  loadedRanges: [] as { start: number; end: number }[],
  theme: '#d679a2',
  volume: 1,
})

const currentAudio = computed(() => props.audios[status.idx])

const percent = computed(() => (status.duration > 0 ? status.current / status.duration : 0))

const actions = {
  switch(index: number) {
    if (index === status.idx) return false

    if (index < 0 || index >= props.audios.length) return false

    status.idx = index

    emit('update:currentPlayIndex', index)

    return true
  },
  next() {
    return actions.switch(status.idx + 1)
  },
  previous() {
    return actions.switch(status.idx - 1)
  },

  seek(time: number) {
    if (!audio.value) {
      return
    }

    audio.value.currentTime = time
    status.current = time
  },
  async play() {
    if (!audio.value) return

    status.paused = false

    try {
      await audio.value.play()
    } catch (error) {
      //
    }
  },
  pause() {
    if (!audio.value) return

    if (audio.value.paused) return

    status.paused = true

    audio.value.pause()
  },
  async toggle() {
    if (status.paused) {
      await actions.play()
    } else {
      actions.pause()
    }
  },
  volume(val: number) {
    if (!audio.value) return

    audio.value.volume = val
  },
  rate(val: number) {
    if (!audio.value) return

    audio.value.playbackRate = val
  },
}

function initAudio() {
  if (!audio.value) return
  status.duration = audio.value.duration
  status.current = 0
  status.volume = audio.value.volume

  if (!status.paused) {
    actions.play()
  }

  updateProgress()
}

function updateCurrent() {
  if (!audio.value) return

  status.current = audio.value.currentTime
}

function updateProgress() {
  if (!audio.value) return

  status.loadedRanges = []

  const duration = audio.value.duration

  for (let idx = 0; idx < audio.value.seekable.length; idx++) {
    const start = audio.value.seekable.start(idx)
    const end = audio.value.seekable.end(idx)

    status.loadedRanges.push({
      start: start / duration,
      end: end / duration,
    })
  }
}

function onEnded() {
  status.paused = !actions.next()
}

watch(
  () => props.currentPlayIndex,
  () => {
    const idx = props.currentPlayIndex ?? 0
    actions.switch(idx)
  }
)

defineExpose(actions)
</script>

<template>
  <div class="v-audio" :class="{ playing: !status.paused }">
    <audio
      ref="audio"
      :src="currentAudio.url"
      style="display: none"
      @loadeddata="initAudio"
      @timeupdate="updateCurrent"
      @progress="updateProgress"
      @ended="onEnded"
    ></audio>

    <div class="v-audio-cover">
      <v-cover :src="currentAudio.cover" :paused="status.paused" :reset="status.idx" />
      <div class="v-audio-play-icon">
        <v-play-icon @click="actions.toggle" :paused="status.paused" style="font-size: 1.5em" />
      </div>
    </div>

    <div class="v-audio-box" flex="~ row" align="items-center">
      <span class="v-controls-btn v-controls-previous" @click="actions.previous">
        <icon-skip-previous />
      </span>

      <span class="v-controls-btn v-controls-next" @click="actions.next">
        <icon-skip-next />
      </span>

      <v-progress
        class="v-audio-progress"
        :theme="status.theme"
        :value="percent"
        :ranges="status.loadedRanges"
        :change-on-up="true"
        @update:value="(p) => actions.seek(p * status.duration)"
      />

      <span class="v-controls-btn">
        <v-volume :value="status.volume" @update:value="(v) => actions.volume(v)" />
      </span>

      <span class="v-controls-btn" v-if="audios.length > 1">
        <icon-menu />
      </span>
    </div>
  </div>
</template>

<style lang="less">
.v-audio {
  --height: 30px;

  --cover-pad-size: 10px;
  --size: calc(var(--height) + var(--cover-pad-size) * 2);

  margin: var(--cover-pad-size);

  box-sizing: border-box;

  position: relative;
  font-size: 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  height: var(--height);
  text-align: left;

  * {
    box-sizing: border-box;
    -webkit-user-drag: none;
  }

  &-cover {
    position: absolute;
    left: 0;
    width: var(--size);
    height: var(--size);
    top: 50%;
    transform: translateY(-50%);
    box-shadow: 0 0 10px rgba(237, 237, 237, 0.761);
    border-radius: 100%;
    overflow: hidden;
  }

  &-play-icon {
    @apply absolute top-0 left-0 w-full h-full;
    @apply flex justify-center items-center;
    background: rgba(207, 207, 207, 0.774);
    opacity: 0;
    transition: opacity ease 0.4s;

    &:hover {
      opacity: 1;
    }
  }

  &-box {
    padding-left: calc(var(--size) / 2);
    padding-right: 3px;
    margin-left: calc(var(--size) / 2);

    border: 1px solid #ebebeb;
    border-radius: 5px;

    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &-title {
    word-break: keep-all;
    white-space: pre;
  }

  &-progress {
    margin: 0 10px;
  }

  &-controls {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.v-controls {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &-btn {
    cursor: pointer;
    color: rgb(172, 172, 172);
    transition: colors 0.4s ease;
    display: inline-flex;

    &:hover {
      color: rgb(95, 95, 95);
    }
  }

  &-play {
    font-size: large;
  }
}
</style>
