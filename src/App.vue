<script setup lang="ts">
import { ref } from 'vue'
import AboutView from './views/AboutView.vue'
import Steps from './components/Steps.vue'

const searchParams = new URLSearchParams(window.location.search)
let from = ref(searchParams.get('from') || '')
let to = ref(searchParams.get('to') || '')
let isReturn = ref(searchParams.get('isReturn') || true)

const stage = searchParams.get('stage')
const activeComponent = ref(Number(stage) !== 1 ? Steps : AboutView)
const handleCompletedForm = (data: { from: string; to: string; isReturn: boolean }) => {
  searchParams.set('from', data.from)
  searchParams.set('to', data.to)
  searchParams.set('isReturn', data.isReturn.toString())
  window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`)

  from.value = data.from
  to.value = data.to
  isReturn.value = data.isReturn
  activeComponent.value = AboutView
}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <h1>Car Pricing Comparison</h1>
      <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <keep-alive>
      <component
        :is="activeComponent"
        @complete="handleCompletedForm"
        :from="from"
        :to="to"
        :isReturn="isReturn"
      />
    </keep-alive>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
