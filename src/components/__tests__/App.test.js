import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../../App.vue'
import { API_URL, API_STATUS_OK, MIN_QUOTA, MAX_QUOTA } from '../../config'

describe('App', () => {
  let wrapper

  beforeEach(() => {
    global.fetch = vi.fn()
    wrapper = mount(App)
  })

  it('renders properly', () => {
    expect(wrapper.find('h1').text()).toBe('Flight Subscription Manager')
  })

  it('shows QuotaManager when edit button is clicked', async () => {
    await wrapper.find('button.primary').trigger('click')
    expect(wrapper.vm.isVisibleQuotaManager).toBe(true)
  })

  it('handles successful quota update', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true })
    const newQuota = 2

    await wrapper.vm.updateQuota(newQuota, 'Test reason')

    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/${API_STATUS_OK}`, {
      method: 'POST',
      body: JSON.stringify({ newQuota, reason: 'Test reason' }),
    })
    expect(wrapper.vm.currentQuota).toBe(newQuota)
    expect(wrapper.vm.systemMessage).toBe('Quota updated successfully')
  })

  it('handles failed quota update', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false })

    await wrapper.vm.updateQuota(2, 'Test reason')

    expect(wrapper.vm.systemMessage).toBe('Error updating quota')
  })

  it('handles network error during quota update', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    await wrapper.vm.updateQuota(2, 'Test reason')

    expect(wrapper.vm.systemMessage).toBe('Error updating quota')
  })

  it('validates quota limits', async () => {
    await wrapper.vm.updateQuota(MAX_QUOTA + 1, 'Test reason')
    expect(wrapper.vm.systemMessage).toBe('Invalid quota value')
    expect(wrapper.vm.currentQuota).not.toBe(MAX_QUOTA + 1)

    await wrapper.vm.updateQuota(MIN_QUOTA - 1, 'Test reason')
    expect(wrapper.vm.systemMessage).toBe('Invalid quota value')
    expect(wrapper.vm.currentQuota).not.toBe(MIN_QUOTA - 1)
  })

  it('closes modal and allows reopening', async () => {
    await wrapper.find('button.primary').trigger('click')
    expect(wrapper.vm.isVisibleQuotaManager).toBe(true)

    await wrapper.vm.closeQuotaManager()
    expect(wrapper.vm.isVisibleQuotaManager).toBe(false)

    await wrapper.find('button.primary').trigger('click')
    expect(wrapper.vm.isVisibleQuotaManager).toBe(true)
  })
})
