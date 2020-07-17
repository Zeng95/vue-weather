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
    <template v-if="currentWeatherData">
      <div class="col text-white text-center">
        <!-- Location -->
        <div class="location text-h4">
          {{ currentWeatherData.name }}
        </div>

        <!-- Full Date -->
        <div class="date text-h6 text-weight-light">
          {{ `${day}, ${hour}:${minutes} ${period}` }}
        </div>

        <div class="flex justify-center items-center">
          <div class="q-mr-xl">
            <!-- Weather -->
            <div class="weather flex justify-center items-center">
              <!-- Weather Icon -->
              <img
                :src="weatherIconUrl"
                :alt="currentWeatherData.weather[0].description"
              />

              <!-- Weather Type -->
              <span class="text-h4 text-weight-bold">
                {{ currentWeatherData.weather[0].main }}
              </span>
            </div>

            <!-- Temperature -->
            <div class="temperature text-h1 text-weight-bolder q-pa-lg">
              <span>{{ Math.round(currentWeatherData.main.temp) }}</span>

              <!-- Symbol -->
              <span class="degree text-h4 relative-position">&deg;C</span>
            </div>
          </div>

          <div class="text-h5 flex column">
            <!-- Low Temperature -->
            <span class="low-temp q-pb-sm">
              {{ Math.round(currentWeatherData.main.temp_min) }}&deg;&nbsp;C
            </span>
            <!-- High Temperature -->
            <span class="high-temp q-mt-sm">
              {{ Math.round(currentWeatherData.main.temp_max) }}&deg;&nbsp;C
            </span>
          </div>
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
    <div class="col chart-container">
      <canvas v-show="hourlyForecastData" ref="chart"></canvas>
    </div>
  </q-page>
</template>

<script>
import Chart from 'chart.js'
import {
  getHourlyForecastByCoord,
  getCurrentWeatherByCoord,
  getCurrentWeatherByCityName
} from '../api/weather'

export default {
  name: 'PageIndex',

  data() {
    return {
      search: '',

      hourlyForecastData: null,
      currentWeatherData: null, // 天气相关的数据
      weatherIconUrl: null,

      period: '',
      day: '',
      hour: 0,
      minutes: 0,

      hours: [],
      temps: []
    }
  },

  methods: {
    async getWeatherBySearch() {
      this.$q.loading.show()

      try {
        const res1 = await getCurrentWeatherByCityName(this.search)
        const res2 = await getHourlyForecastByCoord(
          res1.data.coord.lat,
          res1.data.coord.lon
        )

        // 过滤小时
        const result = res2.data.hourly.filter((item, index) => {
          if (index < 6) return item
        })

        this.weatherIconUrl = `http://openweathermap.org/img/wn/${res1.data.weather[0].icon}@2x.png`
        this.currentWeatherData = res1.data
        this.hourlyForecastData = result

        this.getHours(this.hourlyForecastData)
        this.getTemps(this.hourlyForecastData)
        this.createChart()

        this.$emit('getWeather', this.currentWeatherData)
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
            const { latitude: lat, longitude: lon } = position.coords
            const res1 = await getHourlyForecastByCoord(lat, lon)
            const res2 = await getCurrentWeatherByCoord(lat, lon)

            // 过滤小时
            const result = res1.data.hourly.filter((item, index) => {
              if (index < 6) return item
            })

            this.weatherIconUrl = `http://openweathermap.org/img/wn/${res2.data.weather[0].icon}@2x.png`
            this.currentWeatherData = res2.data
            this.hourlyForecastData = result

            this.getHours(this.hourlyForecastData)
            this.getTemps(this.hourlyForecastData)
            this.createChart()

            this.$emit('getWeather', this.currentWeatherData)
          } catch (error) {
            console.error(error)
          } finally {
            this.$q.loading.hide()
          }
        },
        error => {
          this.$q.loading.hide()
          console.error(error)
        }
      )
    },
    // 获取用于 Chat.js 的小时数组
    getHours(data) {
      this.hours = data.map(item => {
        const hour = new Date(item.dt * 1000).getHours() % 12 || 12

        if (hour === this.hour) return 'NOW'

        return hour + this.period
      })
    },
    // 获取用于 Chat.js 的温度数组
    getTemps(data) {
      this.temps = data.map(item => Math.round(item.temp))
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

      const currentMinutes = now.getMinutes()
      const currentHours = now.getHours()

      this.day = days[now.getDay()]
      this.minutes = currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes

      this.hour = currentHours % 12 || 12
      this.period = currentHours >= 12 ? 'pm' : 'am'
    },
    createChart() {
      const ctx = this.$refs.chart.getContext('2d')
      const myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.hours,
          datasets: [
            {
              backgroundColor: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              borderDash: [8, 4],
              fill: false,
              data: this.temps
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  color: 'rgba(255, 255, 255, 0.2)',
                  drawBorder: false
                },
                ticks: {
                  fontColor: 'white'
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  display: false
                },
                ticks: {
                  display: false
                }
              }
            ]
          }
        }
      })
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
  .low-temp
    border-bottom: 1px solid rgba(255, 255, 255, 0.25)
  .chart-container
    position: relative
</style>
