
import * as React from 'react';
import './common.css';

interface IDataListProps {
  showDatas: boolean;
  filteredDatas: any[];
  userInput: string;
  onClick: any;
  activeData: number;
}



export default class DataList extends React.Component<IDataListProps, any> {

  constructor(props: IDataListProps) {
    super(props);

  }

  public render() {
    const { showDatas, filteredDatas, userInput, onClick, activeData } = this.props;
    if (showDatas && userInput) {
      if (filteredDatas.length) {
        return (
          <ul className="suggestions">
            {filteredDatas.map((item, index) => {
              return (
                <li key={item} onClick={onClick} className={activeData === index ? 'blue' : 'none'}>
                  {item}
                </li>
              );
            })}
          </ul>
        );
      } else {
        return (
          <div className="no-suggestions">
            <em>找不到你想要的数据哟！</em>
          </div>
        );
      }
    }
    return null;
  }
}
