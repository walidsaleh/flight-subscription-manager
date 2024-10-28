# Flight Subscription Manager

A Vue.js component for managing flight quotas in a subscription-based system.

## Demo

You can check out a live demo of Flight Subscription Manager here: https://flight-subscription-manager.netlify.app/

## Features

- Edit the number of flights left in a subscription
- Provide reasons for increasing or decreasing the quota
- Form validation to ensure quota changes are within allowed limits
- Reactive UI updates based on user input
- Modal dialog interface for a smooth user experience

## Props

- `maxQuota`: Maximum allowed quota (Number, required)
- `minQuota`: Minimum allowed quota (Number, required)
- `quota`: Current quota (Number, required)
- `show`: Controls dialog visibility (Boolean, default: false)
- `isLoading`: Indicates loading state (Boolean, default: false)

## Events

- `save`: Emitted when the user saves changes (payload: new quota and reason)
- `close`: Emitted when the dialog is closed

## Usage

```vue
<template>
  <QuotaManager
    :maxQuota="100"
    :minQuota="0"
    :quota="50"
    :show="showDialog"
    :isLoading="isLoading"
    @save="handleSave"
    @close="handleClose"
  />
</template>
