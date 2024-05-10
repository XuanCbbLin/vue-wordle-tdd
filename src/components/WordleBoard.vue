<script setup lang="ts">
import { DEFEAT_MESSAGE, VICTORY_MESSAGE, WORD_SIZE } from '@/utils/message'
import englishWords from '@/data/englishWordsWith5Letters.json'
import { computed, ref } from 'vue'

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => englishWords.includes(wordGiven)
  }
})

const guessInProgress = ref('')
const guessSubmitted = ref('')

const formattedGuessesInProgress = computed({
  get() {
    return guessInProgress.value
  },
  set(rawValue: string) {
    guessInProgress.value = rawValue
      .slice(0, WORD_SIZE)
      .toLocaleUpperCase()
      .replace(/[^A-Z]+/gi, '')
  }
})

function onSubmit() {
  if (!englishWords.includes(guessInProgress.value)) return

  guessSubmitted.value = guessInProgress.value
}
</script>

<template>
  <input
    type="text"
    v-model="formattedGuessesInProgress"
    @keydown.enter="onSubmit"
    :maxlength="WORD_SIZE"
  />
  <p
    v-if="guessSubmitted.length > 0"
    v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"
  ></p>
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
