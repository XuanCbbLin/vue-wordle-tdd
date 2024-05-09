import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '@/utils/message'

describe('WordleBoard', () => {
  const wordOfTheDay = 'TESTS'
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay: wordOfTheDay } })
  })

  async function playerSubmitsGuess(guess: string) {
    const guessInput = wrapper.find('input[type=text]')
    await guessInput.setValue(guess)
    await guessInput.trigger('keydown.enter')
  }

  describe('End of the game messages', () => {
    it('a victory message appears when the user makes a guess that matches the word of the day', async () => {
      await playerSubmitsGuess(wordOfTheDay)

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    it('a defeat message appears if the user makes a guess that is incorrect', async () => {
      await playerSubmitsGuess('WRONG')

      expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
    })

    it('no end-of-game message appears if the user has not yet made a guess', async () => {
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })
  })

  describe('Rules for defining the word of the day', () => {
    it('If a word of the day provided does not have exactly 5 characters, a warning is emitted', async () => {
      const spy = vi.spyOn(console, 'warn')

      spy.mockImplementation(() => {})

      mount(WordleBoard, { props: { wordOfTheDay: 'FLY' } })

      expect(console.warn).toHaveBeenCalled()

      /* 也可以用 vi.fn() 來 mock console.warn */
      // console.warn = vi.fn()

      // mount(WordleBoard, { props: { wordOfTheDay: 'FLY' } })

      // expect(console.warn).toHaveBeenCalled()
    })

    it('no warning is emitted if the word of the day provided is a real uppercase English word with 5 characters', async () => {
      console.warn = vi.fn()

      mount(WordleBoard, { props: { wordOfTheDay: 'tests' } })

      expect(console.warn).toHaveBeenCalled()
    })

    it('if the word of the day is not a real English word, a warning is emitted', async () => {
      console.warn = vi.fn()

      mount(WordleBoard, { props: { wordOfTheDay: 'QWERT' } })

      expect(console.warn).toHaveBeenCalled()
    })

    it('no warning is emitted if the word of the day provided is a real uppercase English word with 5 characters', async () => {
      console.warn = vi.fn()

      mount(WordleBoard, { props: { wordOfTheDay: 'TESTS' } })

      expect(console.warn).not.toHaveBeenCalled()
    })
  })
})
