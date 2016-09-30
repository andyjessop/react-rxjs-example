import {Component} from 'react';

export default class BaseContainer extends Component {

    componentWillUnmount() {
        for (let service of this.services) {
            service.dispose();
        }
    }
}
