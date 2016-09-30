// Lib
import React, {Component} from 'react';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

// Services
import TextBoxService from './text-box/text-box.service';

// Containers
import BaseContainer from './base/base.container';

// Components
import TextBoxContainer from './text-box/text-box.container';

export default class App extends BaseContainer {

    constructor(props) {
        super(props);

        // The state is defined here because it's the highest node where the textBox
        // data is required
        this.state = {
            textBoxes: []
        };

        // Services
        this.services = {
            textBox: new TextBoxService()
        };

        // Bindings
        this.addTextBox = this.addTextBox.bind(this);
    }

    addTextBox() {
        this.services.textBox.addTextBox();
    }

    componentWillMount() {
        // Subscribe to the service - this automatically updates the state
        // when anything changes
        this.services.textBox.emitter.subscribe(textBoxes => {
            this.setState(prevState => ({
                textBoxes: textBoxes
            }));
        });
    }

    render() {
        return (
            <div className="container">
                <h3>A React example with <code>{this.state.textBoxes.length} TextBox</code> components</h3><br/>
                <div className="row">
                    <div className="col-sm-6">
                        <TextBoxContainer textBoxes={this.state.textBoxes} services={this.services}/>
                        <button className="btn btn-primary" onClick={this.addTextBox}>Add Component</button>
                    </div>
                </div>
            </div>
        );
    }
}
