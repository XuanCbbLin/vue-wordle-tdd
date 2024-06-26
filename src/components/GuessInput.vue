<script setup lang="ts">
import { WORD_SIZE } from '@/utils/message'
import englishWords from '@/data/englishWordsWith5Letters.json'
import { computed, ref, triggerRef } from 'vue'
import GuessView from './GuessView.vue'

withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false })

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
const hasFailedValidation = ref<boolean>(false)

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
  if (!englishWords.includes(formattedGuessesInProgress.value)) {
    hasFailedValidation.value = true
    setTimeout(() => (hasFailedValidation.value = false), 500)

    return
  }

  emit('guess-submitted', formattedGuessesInProgress.value)

  guessInProgress.value = null
}
</script>

<template>
  <GuessView
    :guess="formattedGuessesInProgress"
    :class="{ shake: hasFailedValidation }"
    v-if="!disabled"
  />

  <input
    type="text"
    autofocus
    v-model="formattedGuessesInProgress"
    :maxlength="WORD_SIZE"
    :disabled="disabled"
    aria-label="Make your guess for the word of the day!"
    @keydown.enter="onSubmit"
    @blur="({ target }) => (target as HTMLInputElement).focus()"
  />
</template>

<style scoped>
input {
  position: absolute;
  opacity: 0;
}

.shake {
  animation: shake;
  animation-duration: 100ms;
  animation-iteration-count: 2;
}
@keyframes shake {
  0% {
    transform: translateX(-2%);
  }
  25% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(2%);
  }
  75% {
    transform: translateX(0);
  }
}
</style>
