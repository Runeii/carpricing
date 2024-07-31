<script setup lang="ts">
import { calculateJourneyPrice, fetchDrivingDistance } from '../utils/calculator'
import { getGreenwheelsRates, getMyWheelsRates, getShareNowRates } from '../utils/rates'
import { defineProps, ref } from 'vue'

const props = defineProps<{
  from: string
  to: string
}>()

const journeys = ref([])
const calculate = async () => {
  const greenwheels = await getGreenwheelsRates()
  const mywheels = await getMyWheelsRates()
  const shareNow = await getShareNowRates()

  const { distance, duration } = await fetchDrivingDistance(props.from, props.to)

  journeys.value = [...greenwheels, ...mywheels, ...shareNow]
    .flatMap((rate) => {
      const { hourlyPrice, dailyPrice } = calculateJourneyPrice(distance, duration, rate)

      return [
        {
          ...rate,
          type: 'hourly',
          price: hourlyPrice
        },
        {
          ...rate,
          type: 'daily',
          price: dailyPrice
        }
      ]
    })
    .filter((journey) => journey.price)
    .filter((journey) => !journey.maxHours || journey.maxHours >= duration / 60 / 60)
    .sort((a, b) => a.price - b.price)
}
calculate()
</script>
<template>
  <div class="about">
    <h1 v-if="!journeys">Getting results...</h1>
    <div v-else>
      <h1>Results</h1>
      <p>From: {{ props.from }}</p>
      <p>To: {{ props.to }}</p>
      <ul>
        <li v-for="journey in journeys" :key="journey.name">
          <h2>{{ journey.brand }} – {{ journey.name }}</h2>
          <p>Price: {{ Number(journey.price).toFixed(2) }} ({{ journey.type }})</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
