<script setup lang="ts">
import { DEFEAT_MESSAGE, MAX_GUESSES_COUNT, VICTORY_MESSAGE } from '@/utils/message'
import englishWords from '@/data/englishWordsWith5Letters.json'
import { ref } from 'vue'
import GuessInput from './GuessInput.vue'

defineProps({
  wordOfTheDay: {
    type: String,
    required: true,
    validator: (wordGiven: string) => englishWords.includes(wordGiven)
  }
})

const guessesSubmitted = ref<string[]>([])

function handleSubmit(guess: string) {
  guessesSubmitted.value.push(guess)
}
</script>

<template>
  <main>
    <GuessInput @guess-submitted="handleSubmit" />
    <p
      class="end-of-game-message"
      v-if="
        guessesSubmitted.length === MAX_GUESSES_COUNT || guessesSubmitted.includes(wordOfTheDay)
      "
    >
      {{ guessesSubmitted.includes(wordOfTheDay) ? VICTORY_MESSAGE : DEFEAT_MESSAGE }}
    </p>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
}
.end-of-game-message {
  font-size: 3rem;
  animation: end-of-game-message-animation 700ms forwards;
  white-space: nowrap;
  text-align: center;
}
@keyframes end-of-game-message-animation {
  0% {
    opacity: 0;
    transform: rotateZ(0);
  }
  100% {
    opacity: 1;
    transform: translateY(2rem);
  }
}
</style>
