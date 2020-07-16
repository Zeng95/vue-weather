<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container :class="bgClass">
      <router-view @getWeather="setWeather" />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',

  data() {
    return {
      leftDrawerOpen: false,
      weather: null
    }
  },

  computed: {
    bgClass() {
      if (this.weather) {
        if (this.weather.weather[0].icon.endsWith('n')) {
          return 'night'
        }

        if (this.weather.main.temp > 16) {
          return 'warm'
        }
      }

      return ''
    }
  },

  methods: {
    setWeather(data) {
      this.weather = data
    }
  }
}
</script>

<style lang="sass" scoped>
.q-page-container
  background-image: url('../assets/cold-bg.jpg')
  background-position: bottom
  background-size: cover
  transition: all .4s ease-in-out
  &.warm
    background-image: url('../assets/warm-bg.jpg')
  &.night
    background-image: url('../assets/night-bg.jpg')
</style>
