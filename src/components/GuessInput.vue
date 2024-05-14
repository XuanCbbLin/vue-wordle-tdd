<script setup lang="ts">
import { WORD_SIZE } from '@/utils/message'
import englishWords from '@/data/englishWordsWith5Letters.json'
import { computed, ref, triggerRef } from 'vue'

const emit = defineEmits<{
  'guess-submitted': [guess: string]
}>()

// 修改前 vue 3.3.X
// const guessInProgress = ref<string | null>(null)

// const formattedGuessesInProgress = computed<string>({
//   get() {
//     return guessInProgress.value ?? ''
//   },
//   set(rawValue: string) {
//     guessInProgress.value = null

//     guessInProgress.value = rawValue
//       .slice(0, WORD_SIZE)
//       .toLocaleUpperCase()
//       .replace(/[^A-Z]+/gi, '')
//   }
// })

// function onSubmit() {
//   if (!englishWords.includes(formattedGuessesInProgress.value)) return

//   guessSubmitted.value = formattedGuessesInProgress.value
// }

// 修改後 vue 3.4.21
const guessInProgress = ref<string | null>(null)

const formattedGuessesInProgress = computed<string>({
  get() {
    return guessInProgress.value ?? ''
  },
  set(rawValue: string) {
    guessInProgress.value = rawValue
      .slice(0, WORD_SIZE)
      .toLocaleUpperCase()
      .replace(/[^A-Z]+/gi, '')

    triggerRef(formattedGuessesInProgress)
  }
})

function onSubmit() {
  if (!englishWords.includes(formattedGuessesInProgress.value)) return

  emit('guess-submitted', formattedGuessesInProgress.value)
}
</script>

<template>
  <input
    type="text"
    v-model="formattedGuessesInProgress"
    @keydown.enter="onSubmit"
    :maxlength="WORD_SIZE"
  />
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
