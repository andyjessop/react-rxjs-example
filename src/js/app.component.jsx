// Lib
import React, {Component} from 'react';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

// Services
import TextBoxService from './text-box/text-box.service';

// Components
import TextBoxContainer from './text-box/text-box-wrapper.component';

export default class App extends Component {

    constructor() {
        super();

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
        this.services.textBox.addTextBox$.next();
    }

    componentWillMount() {
        // Subscribe to the service - this automatically updates the state
        // when anything changes
        this.services.textBox.emitter$.subscribe(textBoxes =>
            this.setState(prevState => ({
                textBoxes: textBoxes
            }))
        );
    }

    componentWillUnmount() {
        // We need to dispose of RxJS subscriptions
        for (let service of this.services) {
            service.emitter.dispose();
        }
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
