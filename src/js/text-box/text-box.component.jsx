// Lib
import React, {Component} from 'react';
import lodash from 'lodash';

export default class TextBox extends Component {

    constructor() {
        super();

        // Event bindings
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        // Services
        this.textBox = this.props.services.textBox;
    }

    update(event) {
        this.textBox.updateText$.next(event.target);
    }

    remove() {
        this.textBox.removeTextBox$.next(this.props.id);
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
                    {
                        this.props.loading ?
                        <span>Loading</span> :
                        <span className="help-block">{this.props.output}</span>
                    }
                </div>
                <div className="col-sm-1">
                    <button className="close" onClick={this.remove}><span>&times; </span></button>
                </div>
            </div>
        );
    }
}
