import WeChat from "../../index"
declare module '../../index' {
    namespace cloud {
        /** 云函数通用返回 */
        interface CallFunctionResult extends WeChatGeneral.CallbackResult {
            /** 云函数返回的结果 */
            result: WeChatGeneral.IAnyObject | string | undefined
            /** 调用结果 */
            errMsg: string
        }

        /** 云函数通用参数 */
        interface IApiParam<T = any> {
            /** 配置 */
            config?: IConfig
            /** 接口调用成功的回调函数 */
            success?: (res: T) => void
            /** 接口调用失败的回调函数 */
            fail?: (err: WeChatGeneral.CallbackResult) => void
            /** 接口调用结束的回调函数（调用成功、失败都会执行） */
            complete?: (val: T | WeChatGeneral.CallbackResult) => void
        }

        // type IApiFunction<T, P extends IApiParam<T>> = (param?: P) => Promise<T>

        /** 初始化配置 */
        interface IInitConfig {
            /** 默认环境配置，传入字符串形式的环境 ID 可以指定所有服务的默认环境，传入对象可以分别指定各个服务的默认环境 */
            env?:
            | string
            | {
                /** 数据库 API 默认环境配置 */
                database?: string
                /** 存储 API 默认环境配置 */
                functions?: string
                /** 云函数 API 默认环境配置 */
                storage?: string,
            }
            /** 是否在将用户访问记录到用户管理中，在控制台中可见 */
            traceUser?: boolean
        }

        /** 配置 */
        interface IConfig {
            /** 使用的环境 ID，填写后忽略 init 指定的环境 */
            env?: string
            /** 是否在将用户访问记录到用户管理中，在控制台中可见 */
            traceUser?: boolean
        }

        /** 云函数 API 通用参数 */
        interface ICloudAPIParam<T = any> extends IApiParam<T> {
            /** 配置 */
            config?: IConfig
        }

        // interface IICloudAPI {
        //   init: (config?: cloud.IInitConfig) => void
        //   [api: string]: (...args: any[]) => any | cloud.IApiFunction<any, any>
        // }
        // interface ICloudService {
        //   name: string

        //   getAPIs: () => { [name: string]: cloud.IApiFunction<any, any> }
        // }
        // interface ICloudServices {
        //   [serviceName: string]: ICloudService
        // }
        // interface ICloudMetaData {
        //   session_id: string
        // }

        interface CallFunctionParam extends ICloudAPIParam<CallFunctionResult> {
            /** 云函数名 */
            name: string
            /** 传递给云函数的参数，在云函数中可通过 event 参数获取 */
            data?: WeChatGeneral.IAnyObject
            slow?: boolean
            /** 配置 */
            config?: IConfig
            /** 接口调用结束的回调函数（调用成功、失败都会执行） */
            complete?: (res: CallFunctionResult | WeChatGeneral.CallbackResult) => void
            /** 接口调用失败的回调函数 */
            fail?: (res: WeChatGeneral.CallbackResult) => void
            /** 接口调用成功的回调函数 */
            success?: (res: CallFunctionResult) => void
        }


        /** 新建云开发操作实例 */
        interface IOptions {
            /** 资源方 AppID, 不填则表示已登录的当前账号（如小程序中） */
            resourceAppid?: string
            /** 资源方云环境 ID */
            resourceEnv: string
        }

        /** 调用云托管参数 */
        interface CallContainerParam<P extends string | WeChatGeneral.IAnyObject | ArrayBuffer = any | any> {
            /** 服务路径 */
            path: string
            /** HTTP请求方法，默认 GET */
            method?: keyof request.method
            /** 请求数据 */
            data?: P
            /** 设置请求的 header，header 中不能设置 Referer。content-type 默认为 application/json */
            header?: WeChatGeneral.IAnyObject
            /** 超时时间，单位为毫秒 */
            timeout?: number
            /** 返回的数据格式 */
            dataType?: request.dataType
            /** 响应的数据类型 */
            responseType?: keyof {
                text
                arraybuffer
            }
            /** 接口调用结束的回调函数（调用成功、失败都会执行） */
            complete?: (res: CallFunctionResult | WeChatGeneral.CallbackResult) => void
            /** 接口调用失败的回调函数 */
            fail?: (res: WeChatGeneral.CallbackResult) => void
            /** 接口调用成功的回调函数 */
            success?: (res: CallFunctionResult) => void
        }

        /** 调用云托管返回值 */
        interface CallContainerResult<R extends string | WeChatGeneral.IAnyObject | ArrayBuffer = any | any> {
            /** 开发者云托管服务返回的数据 */
            data: R
            /** 开发者云托管返回的 HTTP Response Header */
            header: WeChatGeneral.IAnyObject
            /** 开发者云托管服务返回的 HTTP 状态码 */
            statusCode: number
            /** 开发者云托管返回的 cookies，格式为字符串数组，仅小程序端有此字段 */
            cookies?: WeChatGeneral.IAnyObject
        }
    }

    /** 云开发 SDK 实例
     * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/Cloud.html
     */
    interface cloud {
        /** 在调用云开发各 API 前，需先调用初始化方法 init 一次（全局只需一次，多次调用时只有第一次生效）
         * @supported weapp
         * @example
         * ```tsx
         * WeChat.cloud.init({
         *   env: 'test-x1dzi'
         * })
         * ```
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/init/client.init.html
         */
        init(config?: cloud.IInitConfig): void

        /** 声明字符串为 CloudID（开放数据 ID），该接口传入一个字符串，返回一个 CloudID 特殊对象，将该对象传至云函数可以获取其对应的开放数据。
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/open/Cloud.CloudID.html
         */
        CloudID(cloudID: string): void
        /** 调用云函数
         * @supported weapp
         * @example
         * 假设已有一个云函数 add，在小程序端发起对云函数 add 的调用：
         *
         * ```tsx
         * WeChat.cloud.callFunction({
         * // 要调用的云函数名称
         * name: 'add',
         *   // 传递给云函数的event参数
         *   data: {
         *     x: 1,
         *     y: 2,
         *   }
         * }).then(res => {
         *   // output: res.result === 3
         * }).catch(err => {
         *   // handle error
         * })
         * ```
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/functions/Cloud.callFunction.html
         */
        callFunction(param: OQ<cloud.CallFunctionParam>): void
        callFunction(param: RQ<cloud.CallFunctionParam>): Promise<cloud.CallFunctionResult>


        Cloud: new (options: cloud.IOptions) => Cloud

        /** 调用云托管服务
        * @supported weapp
        * @example
        * 假设已经初始化了一个叫c1的云开发实例，并发起云托管调用
        *
        * ``` tsx
        * const r = await c1.callContainer({
        *   path: '/path/to/container', // 填入容器的访问路径
        *   method: 'POST',
        * })
        * ```
        * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/container/Cloud.callContainer.html
        */
        callContainer<R = any, P = any>(params: cloud.CallContainerParam<P>): Promise<cloud.CallContainerResult<R>>
    }

    interface WeChatStatic {
        cloud: cloud & Cloud
    }
    type Optional<T> = { [K in keyof T]+?: T[K] }

    type OQ<
        T extends Optional<
            Record<'complete' | 'success' | 'fail', (...args: any[]) => any>
        >
        > =
        | (RQ<T> & Required<Pick<T, 'success'>>)
        | (RQ<T> & Required<Pick<T, 'fail'>>)
        | (RQ<T> & Required<Pick<T, 'complete'>>)
        | (RQ<T> & Required<Pick<T, 'success' | 'fail'>>)
        | (RQ<T> & Required<Pick<T, 'success' | 'complete'>>)
        | (RQ<T> & Required<Pick<T, 'fail' | 'complete'>>)
        | (RQ<T> & Required<Pick<T, 'fail' | 'complete' | 'success'>>)

    type RQ<
        T extends Optional<
            Record<'complete' | 'success' | 'fail', (...args: any[]) => any>
        >
        > = Pick<T, Exclude<keyof T, 'complete' | 'success' | 'fail'>>

    interface Cloud {
        /** 在调用云开发各 API 前，需先调用初始化方法 init 一次（全局只需一次，多次调用时只有第一次生效）
        * @supported weapp
        * @example
        * ```tsx
        * WeChat.cloud.init({
        *   env: 'test-x1dzi'
        * })
        * ```
        * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/init/client.init.html
        */
        init(config?: cloud.IInitConfig): Promise<void>

        /** 声明字符串为 CloudID（开放数据 ID），该接口传入一个字符串，返回一个 CloudID 特殊对象，将该对象传至云函数可以获取其对应的开放数据。
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/open/Cloud.CloudID.html
         */
        CloudID(cloudID: string): void
    }

}