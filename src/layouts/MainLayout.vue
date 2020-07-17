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
        const weatherType = this.weather.weather[0].main.toLowerCase()

        if (weatherType.includes('clear')) {
          return 'clear'
        }

        if (weatherType.includes('rain')) {
          return 'rain'
        }

        if (weatherType.includes('clouds')) {
          return 'clouds'
        }

        if (weatherType.includes('fog')) {
          return 'fog'
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
  &.clear
    background: #51A4DB  /* fallback for old browsers */
    background: -webkit-linear-gradient(to bottom, #51A4DB, #66B1DF, #73BAE1)  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to bottom, #51A4DB, #66B1DF, #73BAE1) /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    .q-page
      background-image: unset
  &.fog
    background: #BB8CB7  /* fallback for old browsers */
    background: -webkit-linear-gradient(to bottom, #BB8CB7, #A685B8, #5E5E90)  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to bottom, #BB8CB7, #A685B8, #5E5E90) /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    .q-page
      background-image: unset
  &.clouds
    background: #5393B2  /* fallback for old browsers */
    background: -webkit-linear-gradient(to bottom, #5393B2, #7BA7BE, #A6BDCA)  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to bottom, #5393B2, #7BA7BE, #A6BDCA) /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    .q-page
      background-image: unset
  &.rain
    background: #3F65A4  /* fallback for old browsers */
    background: -webkit-linear-gradient(to bottom, #3F65A4, #887FA5, #CFAEA7)  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to bottom, #3F65A4, #887FA5, #CFAEA7) /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    .q-page
      background-image: unset
  &.night
    background-image: url('../assets/night-bg.jpg')
</style>
