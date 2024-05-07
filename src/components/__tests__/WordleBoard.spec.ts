import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '@/utils/message'

describe('WordleBoard', () => {
  const wordOfTheDay = 'TESTS'

  it('a victory message appears when the user makes a guess that matches the word of the day', async () => {
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay: wordOfTheDay } })

    const guessInput = wrapper.find('input[type=text]')
    await guessInput.setValue('TESTS')
    await guessInput.trigger('keydown.enter')

    expect(wrapper.text()).toContain(VICTORY_MESSAGE)
  })

  it('a defeat message appears if the user makes a guess that is incorrect', async () => {
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay: wordOfTheDay } })

    const guessInput = wrapper.find('input[type=text]')
    await guessInput.setValue('WRONG')
    await guessInput.trigger('keydown.enter')

    expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
  })

  it('no end-of-game message appears if the user has not yet made a guess', async () => {
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay: wordOfTheDay } })

    expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
    expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
  })
})
