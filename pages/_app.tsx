import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'
import { FC, useEffect, useState } from 'react'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import 'swiper/css/bundle'
import Cookies from 'js-cookie'
import { v4 as uuid_v4 } from 'uuid'
import {
  SessionIdCookieKey,
  DeviceIdKey,
  NEXT_INFRA_ENDPOINT,
} from '@components/utils/constants'
import DataLayerInstance from '@components/utils/dataLayer'
import { postData } from '@components/utils/clientFetcher'
import geoData from '@components/utils/geographicService'

const DEVELOPMENT_ADDRESS_INFO = {
  City: 'Bucharest',
  CityCode: 'B',
  Country: 'Romania',
  CountryCode: 'RO',
  DetailJson: null,
  Ip: '81.196.3.147',
  IsValid: false,
  Message: null,
}
const Noop: FC = ({ children }) => <>{children}</>

const setSessionIdCookie = (isCalledByTimeout: boolean = false) => {
  if (!Cookies.get(SessionIdCookieKey) || isCalledByTimeout) {
    const expiryTime: any = new Date(new Date().getTime() + 30 * 60 * 1000)
    const sessionIdGenerator: string = uuid_v4()
    Cookies.set(SessionIdCookieKey, sessionIdGenerator, {
      expires: expiryTime,
    })
    DataLayerInstance.setItemInDataLayer(SessionIdCookieKey, sessionIdGenerator)
    setTimeout(() => {
      setSessionIdCookie(true)
    }, 1800000)
  }
}

const setDeviceIdCookie = () => {
  if (!Cookies.get(DeviceIdKey)) {
    const deviceId = uuid_v4()
    Cookies.set(DeviceIdKey, deviceId)
    DataLayerInstance.setItemInDataLayer(DeviceIdKey, deviceId)
  }
}

function MyApp({ Component, pageProps, nav, footer }: any) {
  const [appConfig, setAppConfig] = useState({})
  const [location, setUserLocation] = useState({})
  const Layout = (Component as any).Layout || Noop

  const fetchAppConfig = async () => {
    try {
      const response: any = await postData(NEXT_INFRA_ENDPOINT, {
        setHeader: true,
      })
      setAppConfig(response)
    } catch (error) {
      console.log(error, 'error')
    }
  }

  useEffect(() => {
    DataLayerInstance.setDataLayer()
    if (!process.env.DEVELOPMENT) {
      geoData()
        .then((response) => {
          setUserLocation(response)
          DataLayerInstance.setItemInDataLayer('ipAddress', response.Ip)
        })
        .catch((err) =>
          DataLayerInstance.setItemInDataLayer('ipAddress', '8.8.8.8')
        )
    } else setUserLocation(DEVELOPMENT_ADDRESS_INFO)
    DataLayerInstance.setItemInDataLayer(
      'ipAddress',
      DEVELOPMENT_ADDRESS_INFO.Ip
    )

    setSessionIdCookie()
    setDeviceIdCookie()
    document.body.classList?.remove('loading')
    fetchAppConfig()
    return function cleanup() {
      Cookies.remove(SessionIdCookieKey)
    }
  }, [])

  return (
    <>
      <Head />
      <ManagedUIContext>
        <Layout
          nav={nav}
          footer={footer}
          config={appConfig}
          pageProps={pageProps}
        >
          <Component {...pageProps} location={location} config={appConfig} />
        </Layout>
      </ManagedUIContext>
    </>
  )
}

export default MyApp
