import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import GuessView from '../GuessView.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE, MAX_GUESSES_COUNT } from '@/utils/message'

describe('WordleBoard', () => {
  const wordOfTheDay = 'TESTS'
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay: wordOfTheDay } })
  })

  async function playerTypesGuess(guess: string) {
    await wrapper.find('input[type=text]').setValue(guess)
  }

  async function playerPressesEnter() {
    await wrapper.find('input[type=text]').trigger('keydown.enter')
  }

  async function playerTypesAndSubmitsGuess(guess: string) {
    await playerTypesGuess(guess)
    await playerPressesEnter()
  }

  describe('End of the game messages', () => {
    it('a victory message appears when the user makes a guess that matches the word of the day', async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay)

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    describe.each(
      Array.from({ length: MAX_GUESSES_COUNT + 1 }, (_, numberOfGuesses) => ({
        numberOfGuesses,
        shouldSeeDefeatMessage: numberOfGuesses === MAX_GUESSES_COUNT
      }))
    )(
      `a defeat message should appear if the player makes incorrect guesses ${MAX_GUESSES_COUNT} times in a row`,
      ({ numberOfGuesses, shouldSeeDefeatMessage }) => {
        it(`therefore for ${numberOfGuesses} guess(es) a defeat message should ${shouldSeeDefeatMessage ? '' : 'not'} appear`, async () => {
          for (let i = 0; i < numberOfGuesses; i++) {
            await playerTypesAndSubmitsGuess('WRONG')
          }

          if (shouldSeeDefeatMessage) {
            expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
          } else {
            expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
          }
        })
      }
    )

    it('no end-of-game message appears if the user has not yet made a guess', async () => {
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })
  })

  describe('Rules for defining the word of the day', () => {
    beforeEach(() => {
      console.warn = vi.fn()
    })

    it.each([
      { wordOfTheDay: 'FLY', reason: 'word-of-the-day must have 5 characters' },
      { wordOfTheDay: 'tests', reason: 'word-of-the-day must be all in uppercase' },
      { wordOfTheDay: 'QWERT', reason: 'word-of-the-day must be a valid English word' }
    ])(
      'Since $reason: $wordOfTheDay is invalid, therefore a warning must be emitted',
      async ({ wordOfTheDay }) => {
        mount(WordleBoard, { props: { wordOfTheDay } })

        expect(console.warn).toHaveBeenCalled()

        /* 也可以用 vi.fn() 來 mock console.warn */
        // console.warn = vi.fn()

        // mount(WordleBoard, { props: { wordOfTheDay: 'FLY' } })

        // expect(console.warn).toHaveBeenCalled()
      }
    )

    it('no warning is emitted if the word of the day provided is a real uppercase English word with 5 characters', async () => {
      mount(WordleBoard, { props: { wordOfTheDay: 'TESTS' } })

      expect(console.warn).not.toHaveBeenCalled()
    })
  })

  describe('Player input', () => {
    it('remains in focus the entire time', async () => {
      document.body.innerHTML = `<div id="app"></div>`
      wrapper = mount(WordleBoard, {
        props: { wordOfTheDay },
        attachTo: '#app'
      })

      expect(wrapper.find('input[type=text]').attributes('autofocus')).not.toBeUndefined()

      await wrapper.find('input[type=text]').trigger('blur')
      expect(document.activeElement).toBe(wrapper.find('input[type=text]').element)
    })

    it('the input gets cleared after each submission', async () => {
      await playerTypesAndSubmitsGuess('WRONG')

      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('')
    })

    it(`player guesses are limited to ${WORD_SIZE} letters`, async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay + 'EXTRA')

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    it('player guesses can only be submitted if they are real words', async () => {
      await playerTypesAndSubmitsGuess('QWERT')

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })

    it('player guesses are not case-sensitive', async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay.toLowerCase())

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    it('player guesses can only contain letters', async () => {
      await playerTypesAndSubmitsGuess('H3!RT')

      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('HRT')
    })

    it('non-letter characters do not render on the screen while being typed', async () => {
      await playerTypesAndSubmitsGuess('12')
      await playerTypesAndSubmitsGuess('123')

      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('')
    })
  })

  it('the player loses control after the max amount of guesses have been sent', async () => {
    const guesses = ['WRONG', 'GUESS', 'HELLO', 'WORLD', 'HAPPY', 'CODER']

    for (const guess of guesses) {
      await playerTypesAndSubmitsGuess(guess)
    }

    expect(wrapper.find('input[type=text]').attributes('disabled')).not.toBeUndefined()
  })

  it('the player loses control after the correct guess has been given', async () => {
    await playerTypesAndSubmitsGuess(wordOfTheDay)

    expect(wrapper.find('input[type=text]').attributes('disabled')).not.toBeUndefined()
  })

  it('all previous guesses done by the player are visible in the page', async () => {
    const guesses = ['WRONG', 'GUESS', 'HELLO', 'HAPPY', 'CODER']

    for (const guess of guesses) {
      await playerTypesAndSubmitsGuess(guess)
    }

    for (const guess of guesses) {
      expect(wrapper.text()).toContain(guess)
    }
  })

  describe(`there should always be exactly ${MAX_GUESSES_COUNT} guess-views in the board`, async () => {
    it(`${MAX_GUESSES_COUNT} guess-views are present at the start of the game`, async () => {
      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT)
    })

    it(`${MAX_GUESSES_COUNT} guess-views are present when the player wins the game`, async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay)

      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT)
    })

    it(`${MAX_GUESSES_COUNT} guess-views are present as the player loses the game`, async () => {
      const guesses = ['WRONG', 'GUESS', 'HELLO', 'WORLD', 'HAPPY', 'CODER']

      for (const guess of guesses) {
        await playerTypesAndSubmitsGuess(guess)
        expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT)
      }
    })
  })
})
