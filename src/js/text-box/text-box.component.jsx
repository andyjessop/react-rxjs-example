// Lib
import React, {Component} from 'react';
import lodash from 'lodash';

export default class TextBox extends Component {

    constructor() {
        super();
        this.remove = this.remove.bind(this);
        this.update = this.update.bind(this);
    }

    update(event) {
        this.props.services.textBox.updateText(event.target);
    }

    remove() {
        this.props.services.textBox.removeTextBox(this.props.id);
    }

    render() {
        return (
            <div id={this.props.id} className="row form-group">
                <div className="col-sm-9">
                    <input
                        className="form-control"
                        type="text"
                        id={this.props.id}
                        value={this.props.value}
                        placeholder={this.props.name}
                        onChange={this.update}
                    />
                    <span className="help-block">{this.props.value}</span>
                </div>
                <div className="col-sm-1">
                    <button className="close" onClick={this.remove}><span>&times; </span></button>
                </div>
            </div>
        );

    }
}
