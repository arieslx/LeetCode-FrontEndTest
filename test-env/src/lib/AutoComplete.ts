import { interval, Observable, Subject, Subscriber, Subscription, } from 'rxjs';
import { debounce } from 'rxjs/operators';

const generateMockResult = (str: string): IUser[] => {
  const result: IUser[] = [];
  for (let i = 0; i < str.length; i++) {
    result.push({
      id: i,
      name: `${str}_${i}`,
    });
  }
  return result;
};

export interface IUser {
  id: number;
  name: string;
}

interface IAutoCompleteProps {
  text: Subject<string>;
  response: Subject<IUser[]>;
  warning: Subject<boolean>;
  loading: Subject<boolean>;
}

class AutocompleteController {
  /**
   * 每次用户输入任意值，都会从 payload$ 流中获得
   * 比如，用户依次输入 a, b, c
   * 那么 payload$ 流会获得三个值："a", "ab", "abc"
   */
  public payload$: Subject<string>;

  public subscription: Subscription;
  public text: Subject<string>;
  public response: Subject<IUser[]>;
  public warning: Subject<boolean>;
  public loading: Subject<boolean>;

  constructor({ text, response, warning, loading }: IAutoCompleteProps) {
    this.payload$ = new Subject();
    this.subscription = this.getAutoSearch().subscribe();
    this.text = text;
    this.response = response;
    this.warning = warning;
    this.loading = loading;
  }

  // 更新 Input 框中的搜索词
  public setSearchStr(str: string): void {
    console.log('setSearchStr', str);
    this.text.next(str);
  }
  // 更新搜索状态
  public setLoading(isLoading: boolean): void {
    console.log('isLoading:', isLoading);
    this.loading.next(isLoading);
  }
  // 显示或隐藏警告信息
  public toggleWarning(isShown?: boolean): void {
    if (isShown) {
      console.log('warning');
    }
    this.warning.next(isShown);
  }
  // 发送请求，获取搜索结果
  public searchQuery(str: string): Observable<IUser[]> {
    const search$: Observable<IUser[]> = new Observable(subscriber => {
      console.log('fetching network result');
      setTimeout(() => {
        subscriber.next(generateMockResult(str));
        subscriber.complete();
      }, 2000);
    });

    return search$;
  }
  // 更新搜索结果列表
  public setSearchResults(users: IUser[]): void {
    console.log('get search result', users);
    this.response.next(users);
  }

  // 你要实现的方法
  public getAutoSearch(): Observable<string> {
    const search$: Observable<string> = Observable.create(
      (observer: Subscriber<string>) => {
        let requestSubscription: Subscription | undefined;
        let stopQuery: boolean | undefined;

        const cancelPendingRequest = () => {
          if (requestSubscription) {
            console.log('cancel pending request!');
            requestSubscription.unsubscribe();
            requestSubscription = undefined;
            this.setLoading(false);
          }
        };

        // 不能因为搜索而影响用户正常输入新的字符；
        this.payload$.subscribe({
          next: (v: string) => {
            // 如果用户输入超过 30 个字符，取消所有请求，并显示提示：您输入的字符数过多。
            if (v.length > 30) {
              stopQuery = true;
              this.toggleWarning(true);
              cancelPendingRequest();
            } else {
              stopQuery = false;
              this.toggleWarning();
            }
            this.setSearchStr(v);
          },
        });

        // 用户停止输入 500ms 后，再发送请求；
        this.payload$.pipe(debounce(() => interval(500))).subscribe({
          next: (v: string) => {
            if (stopQuery) {
              return;
            }
            // 如果请求没有返回时，用户就再次输入，要取消之前的请求；
            cancelPendingRequest();
            this.setLoading(true);

            const result = this.searchQuery(v);

            requestSubscription = result.subscribe({
              next: users => this.setSearchResults(users),
              error(err) {
                console.error('something wrong occurred: ' + err);
              },
              // tslint:disable-next-line:object-literal-sort-keys
              complete: () => {
                this.setLoading(false);
              },
            });
          },
          // tslint:disable-next-line:object-literal-sort-keys
          error: (err: Error) => observer.error(err),
          complete: () => observer.complete(),
        });
      },
    );

    return search$;
  }
}
export default AutocompleteController;
