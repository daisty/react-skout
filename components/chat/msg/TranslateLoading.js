import React from 'react';
import {View} from 'react-native';

export default class TranslateLoading extends React.Component {

    state = {
        translateLoadingProcess: -1,
        err:false
    };

    translateLoading = null;

    componentWillMount() {
        let $self = this;
        this.translateLoading = setInterval(function () {
            let value = $self.state.translateLoadingProcess;
            if (value > 2) {
                value = -1;
            }
            $self.setState({
                translateLoadingProcess: value + 1
            })
        }.bind(this), 500)
    }

    componentWillUnmount() {
        if (null !== this.translateLoading) {
            clearInterval(this.translateLoading);
        }
    }

    renderView = () => {
        let $self = this;

        return <View
            style={{
                flexDirection: 'row',
                marginLeft: 54,
                marginTop: 2
            }}
        >
            <View
                style={{
                    width: 4,
                    height: 4,
                    backgroundColor: this.state.translateLoadingProcess === 0 ? '#9cf' : '#E0E0E0',
                    borderRadius: 2
                }}
            />
            <View
                style={{
                    width: 4,
                    height: 4,
                    marginLeft: 2,
                    backgroundColor: this.state.translateLoadingProcess === 1 ? '#9cf' : '#E0E0E0',
                    borderRadius: 3
                }}
            />
            <View
                style={{
                    width: 4,
                    height: 4,
                    marginLeft: 2,
                    backgroundColor: this.state.translateLoadingProcess === 2 ? '#9cf' : '#E0E0E0',
                    borderRadius: 2
                }}
            />
        </View>
    };

    render() {
        return (
            this.renderView()
        )

    }
}