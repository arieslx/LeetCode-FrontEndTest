interface Action<T> {
    payload?: T;
    type: string;
}

class EffectModule {
    count = 1;
    message = "hello!";

    delay(input: Promise<number>) {
        return input.then(i => ({
            payload: `hello ${i}!`,
            type: 'delay'
        }))
    }

    setMessage(action: Action<Date>) {
        return {
            payload: action.payload!.getMilliseconds(),
            type: "set-message"
        };
    }
}

// 1. 过滤非函数属性
type FuncFilter<T> = {
    [P in keyof T]: T[P] extends Function ? P : never;
}[keyof T];

type EffectModuleFunc = FuncFilter<EffectModule>;


// 2. 方法映射
type resolveEffectModuleFunc<T> =
    T extends (input: Promise<infer U>) => Promise<Action<infer V>>
    ? (input: U) => Action<V>
    : T extends (action: Action<infer U>) => Action<infer V>
    ? (action: U) => Action<V>
    : never;

// 3. 修改Connect类型
type Connect = (module: EffectModule) => {
    [T in EffectModuleFunc]: resolveEffectModuleFunc<EffectModule[T]>
}

const connect: Connect = m => ({
    delay: (input: number) => ({
        type: "delay",
        payload: `hello 2`
    }),
    setMessage: (input: Date) => ({
        type: "set-message",
        payload: input.getMilliseconds()
    })
});

type Connected = {
    delay(input: number): Action<string>;
    setMessage(action: Date): Action<number>;
};

export const connected: Connected = connect(new EffectModule());