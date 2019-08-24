
import * as React from 'react';
import './common.css';

import DataListComponent from './DataListComponent';

interface IAutoCompleteProps {
    dataSource: any[];
}




export default class AutoComplete extends React.Component<IAutoCompleteProps, any> {
    public static defaultProperty = {
        dataSource: []
    };
    constructor(props: IAutoCompleteProps) {
        super(props);
        this.state = {
            activeData: 0,
            filteredDatas: [],
            showDatas: false,
            userInput: ''
        };
    }

    public handleOnChange = (e: any) => {
        // console.log(e);
        const { dataSource } = this.props;
        const userInput = e.currentTarget.value;

        const filteredDatas = dataSource.filter(
            (item) =>
                item.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        this.setState({
            activeData: 0,
            filteredDatas,
            showDatas: true,
            userInput: e.currentTarget.value
        });
    }

    public handleOnClick = (e: any) => {
        this.setState({
            activeData: 0,
            filteredDatas: [],
            showDatas: false,
            userInput: e.currentTarget.innerText
        });
    }

    public handleKeyDown = (e: any) => {
        const { activeData, filteredDatas } = this.state;

        if (e.keyCode === 13) {
            this.setState({
                activeData: 0,
                showDatas: false,
                userInput: filteredDatas[activeData]
            });
        }
        else if (e.keyCode === 38) {
            if (activeData === 0) {
                return;
            }

            this.setState({ activeSuggestion: activeData - 1 });
        }
        else if (e.keyCode === 40) {
            if (activeData - 1 === filteredDatas.length) {
                return;
            }

            this.setState({ activeData: activeData + 1 });
        }
    }



    public render() {
        const { userInput, filteredDatas, showDatas, activeData } = this.state;
        return (
            <React.Fragment>
                <input
                    className="inputStyle"
                    type="text"
                    onChange={this.handleOnChange}
                    onKeyDown={this.handleKeyDown}
                    value={userInput}
                />
                <DataListComponent showDatas={showDatas} filteredDatas={filteredDatas} userInput={userInput} onClick={this.handleOnClick} activeData={activeData}/>
            </React.Fragment>
        );
    }
}
