import httpClient from './httpClient'

const END_POINT = '/weather'
const APP_ID = process.env.API_KEY

/**
 * 通过地理坐标获取天气数据
 * 温度单位使用摄氏度（Celsius）
 */
export const getWeatherByGeoCoord = (lat, lon) => {
  return httpClient.get(`${END_POINT}`, {
    params: { lat, lon, appid: APP_ID, units: 'metric' }
  })
}

/**
 * 通过城市名称获取天气数据
 * 温度单位使用摄氏度（Celsius）
 */
export const getWeatherByCityName = q => {
  return httpClient.get(`${END_POINT}`, {
    params: { q, appid: APP_ID, units: 'metric' }
  })
}
