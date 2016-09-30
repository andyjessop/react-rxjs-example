// Lib
import React, {Component, PropTypes} from 'react';
import {each} from 'lodash';

// Components
import TextBox from './text-box.component.jsx';

export default class TextBoxWrapper extends Component {

    render() {
        if (this.props.textBoxes.length) {
            const boxes = [];
            each(this.props.textBoxes, (box) =>
                boxes.push(
                    <TextBox
                        key={box.id}
                        name={box.name}
                        id={box.id}
                        value={box.value}
                        services={this.props.services}
                    />
            ));
            return (<div>{boxes}</div>);
        } else {
            return null;
        }
    }
}
