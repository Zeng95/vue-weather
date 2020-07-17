import httpClient from './httpClient'

const END_POINT_WEATHER = '/weather'
const END_POINT_ONE_CALL = '/onecall'

const APP_ID = process.env.API_KEY

/**
 * Access hourly forecast with a specific location for 48 hours by geographic coordinates
 * 通过地理坐标获取当天的完整天气数据
 * 温度单位使用摄氏度（Celsius）
 */
export const getHourlyForecastByCoord = (lat, lon) => {
  return httpClient.get(`${END_POINT_ONE_CALL}`, {
    params: {
      lat,
      lon,
      appid: APP_ID,
      exclude: 'current,minutely,daily',
      units: 'metric'
    }
  })
}

/**
 * Access current weather data for a specific location by geographic coordinates
 * 通过地理坐标获取当天的天气数据
 * 温度单位使用摄氏度（Celsius）
 */
export const getCurrentWeatherByCoord = (lat, lon) => {
  return httpClient.get(`${END_POINT_WEATHER}`, {
    params: { lat, lon, appid: APP_ID, units: 'metric' }
  })
}

/**
 * Access current weather data for a specific location by city name
 * 通过城市名称获取当天的天气数据
 * 温度单位使用摄氏度（Celsius）
 */
export const getCurrentWeatherByCityName = name => {
  return httpClient.get(`${END_POINT_WEATHER}`, {
    params: { q: name, appid: APP_ID, units: 'metric' }
  })
}
