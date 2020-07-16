<template>
  <q-page class="flex column">
    <!-- Search Bar -->
    <div class="col q-pt-lg q-px-md">
      <q-form @submit.prevent="getWeatherBySearch" autocomplete="off">
        <q-input dark standout v-model="search" label="Search">
          <!-- Location Icon -->
          <template v-slot:prepend>
            <q-icon name="my_location" @click="getLocation" />
          </template>

          <!-- Search Icon -->
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-form>
    </div>

    <!-- It has weather data -->
    <template v-if="weatherData">
      <!-- Information -->
      <div class="col text-white text-center">
        <!-- Location -->
        <div class="location text-h4">
          {{ weatherData.name }}
        </div>

        <!-- Full Date -->
        <div class="date text-h6 text-weight-light">
          {{ `${day}, ${hours}:${minutes} ${period}` }}
        </div>

        <!-- Temperature -->
        <div class="temperature text-h1 text-weight-bolder q-my-lg q-pa-lg">
          <span>{{ Math.round(weatherData.main.temp) }}</span>
          <span class="degree text-h4 relative-position">&deg;C</span>
        </div>

        <!-- Weather -->
        <div class="weather flex justify-center items-center">
          <!-- Weather Icon -->
          <img
            :src="weatherIconUrl"
            :alt="weatherData.weather[0].description"
          />

          <!-- Weather Type -->
          <span class="text-h4 text-weight-bold">{{
            weatherData.weather[0].main
          }}</span>
        </div>
      </div>
    </template>

    <!-- It does not have weather data -->
    <template v-else>
      <div class="col column text-white text-center">
        <!-- App Title -->
        <div class="col text-h2 text-weight-thin">Quasar<br />Weather</div>

        <!-- Button -->
        <q-btn class="col" flat @click="getLocation">
          <q-icon left size="3em" name="my_location" />
          <div>Find my location</div>
        </q-btn>
      </div>
    </template>

    <!-- Hidden Div -->
    <div class="col hide"></div>
  </q-page>
</template>

<script>
import { getWeatherByGeoCoord, getWeatherByCityName } from '../api/weather'

export default {
  name: 'PageIndex',

  data() {
    return {
      search: '',

      weatherData: null, // 天气相关的数据
      weatherIconUrl: null,
      latitude: null, // 纬度
      longitude: null, // 经度

      period: '',
      day: '',
      hours: 0,
      minutes: 0
    }
  },

  methods: {
    async getWeatherBySearch() {
      this.$q.loading.show()

      try {
        const response = await getWeatherByCityName(this.search)

        this.weatherData = response.data
        this.weatherIconUrl = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`

        this.$emit('getWeather', response.data)
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.$q.loading.hide()
        this.search = null
      }
    },
    getLocation() {
      this.$q.loading.show()

      window.navigator.geolocation.getCurrentPosition(
        async position => {
          try {
            const { latitude, longitude } = position.coords
            const response = await getWeatherByGeoCoord(latitude, longitude)

            this.weatherData = response.data
            this.weatherIconUrl = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`

            this.$emit('getWeather', response.data)
          } catch (error) {
            console.log('error: ', error)
          } finally {
            this.$q.loading.hide()
          }
        },
        error => {
          this.$q.loading.hide()
          console.log('error: ', error)
        }
      )
    },
    updateDateAndTime() {
      const now = new Date()
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ]

      this.day = days[now.getDay()]
      this.minutes = now.getMinutes()

      this.hours = now.getHours() % 12 || 12
      this.period = now.getHours() >= 12 ? 'pm' : 'am'
    }
  },

  created() {
    this.interval = setInterval(this.updateDateAndTime, 1000)
  },

  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<style lang="sass" scoped>
.q-page
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.75))
  .location
    text-shadow: 1px 3px rgba(0, 0, 0, 0.25)
  .temperature
    display: inline-block
    border-radius: 16px
    background-color: rgba(255, 255, 255, 0.25)
    box-shadow: 3px 6px rgba(0, 0, 0, 0.25)
  .degree
    top: -44px
  .hide
    flex: 0 0 110px
</style>
