import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import QuotaManager from '../QuotaManager.vue'

describe('QuotaManager', () => {
  const defaultProps = {
    maxQuota: 10,
    minQuota: 0,
    quota: 5,
    show: true,
    isLoading: false,
  }

  let wrapper

  beforeEach(() => {
    wrapper = mount(QuotaManager, {
      props: defaultProps,
    })
  })

  it('renders properly', () => {
    expect(wrapper.find('dialog').exists()).toBe(true)
    expect(wrapper.find('h3').text()).toBe('Edit flights')
  })

  it('shows add reasons when increasing quota', async () => {
    await wrapper.find('#quota').setValue(6)
    const options = wrapper.find('select').findAll('option')
    expect(options[1].text()).toBe('Subscriber canceled flight')
  })

  it('shows reduce reasons when decreasing quota', async () => {
    await wrapper.find('#quota').setValue(4)
    const options = wrapper.find('select').findAll('option')
    expect(options[1].text()).toBe('Flight not redeposited after a flight cancellation')
  })

  it('validates quota limits', async () => {
    await wrapper.find('#quota').setValue(15)
    await wrapper.find('select').setValue('Other')
    const saveButton = wrapper.find('button[type="button"]')
    expect(saveButton.attributes('disabled')).toBeDefined()
  })

  it('emits save event with correct values', async () => {
    const newQuota = 7
    const reason = 'Other'

    await wrapper.find('#quota').setValue(newQuota)
    await wrapper.find('select').setValue(reason)

    await wrapper.find('button[type="button"]').trigger('click')

    expect(wrapper.emitted('save')).toBeTruthy()
    expect(wrapper.emitted('save')[0]).toEqual([newQuota, reason])
  })

  it('emits close event when close button is clicked', async () => {
    await wrapper.find('.close-button').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close event when dialog is closed', async () => {
    await wrapper.find('dialog').trigger('close')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('resets form when dialog is closed', async () => {
    await wrapper.find('#quota').setValue(7)
    await wrapper.find('select').setValue('Other')
    await wrapper.find('.close-button').trigger('click')

    expect(wrapper.vm.currentQuota).toBe(defaultProps.quota)
    expect(wrapper.vm.selectedReason).toBe('')
  })

  it('handles show prop changes', async () => {
    const showModalSpy = vi.spyOn(HTMLDialogElement.prototype, 'showModal')
    const closeSpy = vi.spyOn(HTMLDialogElement.prototype, 'close')

    await wrapper.setProps({ show: false })
    expect(closeSpy).toHaveBeenCalled()

    await wrapper.setProps({ show: true })
    expect(showModalSpy).toHaveBeenCalled()
  })
})
