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
  <ul class="word">
    <li
      v-for="(letter, index) in formattedGuessesInProgress.padEnd(WORD_SIZE, ' ')"
      :key="`${letter}-${index}`"
      :data-letter="letter"
      class="letter"
    >
      {{ letter }}
    </li>
  </ul>

  <input
    type="text"
    autofocus
    v-model="formattedGuessesInProgress"
    :maxlength="WORD_SIZE"
    @keydown.enter="onSubmit"
    @blur="({ target }) => (target as HTMLInputElement).focus()"
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

input {
  position: absolute;
  opacity: 0;
}
.word {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 0.25rem;
}
.letter {
  background-color: white;
  border: 1px solid hsl(0, 0%, 70%);
  width: 5rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bolder;
}
li:not([data-letter=' ']) {
  animation: pop 100ms;
}
@keyframes pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
}
</style>
