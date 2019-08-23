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
  
  type AsyncMethod<T, U> = (input: Promise<T>) => Promise<Action<U>>
  type SyncMethod<T, U> = (action: Action<T>) => Action<U>
  
  type AllowedKeys<T, P> = {
    [K in keyof T]: T[K] extends P ? K : never
  }[keyof T]
  
  type Filter<T, P> = Pick<T, AllowedKeys<T, P>>
  
  type Method<T> = Filter<T, Function>
  
  type ConnectedModule<M> = {
    [K in keyof Method<M>]:
      Method<M>[K] extends AsyncMethod<infer T, infer U>
      ? (input: T) => Action<U>
      : Method<M>[K] extends SyncMethod<infer T, infer U>
        ? (action: T) => Action<U>
        : never
  }
  
  type Connect = (module: EffectModule) => ConnectedModule<EffectModule>
  
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