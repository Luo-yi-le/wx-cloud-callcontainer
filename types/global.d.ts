declare namespace WeChatGeneral {
    type IAnyObject = Record<string, any>
    type Optional<F> = F extends (arg: infer P) => infer R ? (arg?: P) => R : F;

    type OptionalInterface<T> = { [K in keyof T]: Optional<T[K]> }

    /** 事件监听函数 */
    type EventCallback = (/** 触发事件参数 */ ...args: any) => void
    /** 通用错误 */
    interface CallbackResult { /** 错误信息 */  errMsg: string }

    type CommonEventFunction<T = any> = (event: BaseEventOrig<T>) => any

    interface BaseEventOrig<T> { }
}

