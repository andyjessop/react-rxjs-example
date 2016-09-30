// Lib
import React, {Component, PropTypes} from 'react';
import {each} from 'lodash';

// Containers
import BaseContainer from '../base/base.container';
// Components
import TextBox from './text-box.component.jsx';


export default class TextBoxContainer extends BaseContainer {

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
