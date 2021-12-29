import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import CryptoJS from "crypto-js"
import JSEncrypt from "jsencrypt"
import { HTMLAttributes } from "vue"

interface IHttpSecureOption {
  onDisable?(): void
}

export default function createHttpSecureAxios(
  config?: AxiosRequestConfig,
  option: IHttpSecureOption = {}
) {
  let id = 1
  const urlMap = new Map<number, string>()

  // TODO log response data if secure enabled
  const onDisable = option.onDisable ?? (() => {})
  const instance = axios.create(config)

  instance.defaults.httpSecureDisabled = false

  const storage: {
    serverPublicKey?: string
    key: string
  } = {
    key: Math.random().toString(),
  }

  function decryptAES(data: string) {
    return CryptoJS.AES.decrypt(data, storage.key).toString(CryptoJS.enc.Utf8)
  }
  function encryptAES(data: string) {
    return CryptoJS.AES.encrypt(data, storage.key).toString()
  }
  function encryptRSA(data?: string) {
    if (!data) return
    const o = new JSEncrypt()
    o.setPublicKey(storage.serverPublicKey!)
    const res = o.encrypt(data)
    return res
  }

  const prefix = "/secure/"
  instance.interceptors.request.use(async (config) => {
    if (config.httpSecureDisabled) return config

    //#region save url
    config.httpSecureId = id
    urlMap.set(id, config.url || "")
    id++
    //#endregion

    //#region get server public key
    if (!storage.serverPublicKey) {
      const res = await axios
        .get("/publickey", { baseURL: config.baseURL })
        .catch(async (err) => {
          if (err.response) {
            if ((err.response as AxiosResponse).status === 404) {
              console.log("server not support, http-secure has been disabled")
              config.httpSecureDisabled = true
              await onDisable()
              return undefined
            }
          }
          throw err
        })
      if (!res) return config
      storage.serverPublicKey = res.data
    }
    //#endregion

    //#region encrypt
    const key = storage.key
    const url = config.url
    config.url =
      prefix +
      encodeURIComponent(encryptRSA(JSON.stringify({ key, url })) ?? "")
    const content = encryptAES(JSON.stringify(config.data ?? ""))
    config.data = { content }
    //#endregion
    return config
  })

  instance.interceptors.response.use(
    (res) => {
      if (res.config.httpSecureDisabled) return res

      //#region restore url
      if (res.config.httpSecureId !== void 0) {
        res.config.url = urlMap.get(res.config.httpSecureId) || ""
        urlMap.delete(res.config.httpSecureId)
      }
      //#endregion

      //#region decrypt
      const { content } = res.data
      res.data = JSON.parse(decryptAES(content))
      //#endregion

      //#region log because devtools network won't work
      console.groupCollapsed(
        `[${res.status}][${res.config.method?.toUpperCase()}]${res.config.url}`
      )
      console.log("%c[config] %O", "font-weight:bolder", res.config)
      console.log("%c[request] %O", "font-weight:bolder", res.request)
      console.log("%c[data] %O", "font-weight:bolder", res.data)
      console.log("%c[headers] %O", "font-weight:bolder", res.headers)
      console.groupEnd()
      //#endregion
      return res
    },
    (err) => {
      if (err.response) {
        const res = err.response as AxiosResponse
        //#region restore url
        if (res.config.httpSecureId !== void 0) {
          res.config.url = urlMap.get(res.config.httpSecureId) || ""
          urlMap.delete(res.config.httpSecureId)
        }
        //#endregion

        //#region log because devtools network won't work
        // TODO better log
        const style = "color: red"
        console.groupCollapsed(
          `%c[${res.status}][${res.config.method?.toUpperCase()}]${
            res.config.url
          }`,
          style
        )
        console.log("%c[config] %O", "font-weight:bolder", res.config)
        console.log("%c[request] %O", "font-weight:bolder", res.request)
        console.log("%c[data] %O", "font-weight:bolder", res.data)
        console.log("%c[headers] %O", "font-weight:bolder", res.headers)
        console.groupEnd()
        //#endregion
      }
      throw err
    }
  )
  return instance
}

declare module "axios" {
  interface AxiosRequestConfig {
    /**
     * disable http security
     */
    httpSecureDisabled?: boolean
    httpSecureId?: number
  }
}
