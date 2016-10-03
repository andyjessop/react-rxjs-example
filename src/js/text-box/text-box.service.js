// Lib
import {Subject} from 'rxjs/Subject';
import {findIndex, cloneDeep} from 'lodash';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/retry';
import {ajax} from 'rxjs/observable/dom/ajax';

export default class TextBoxService {

    /**
     * The service is the distinct source of truth for the state
     * of all text boxes defined in the container where it is instantiated.
     *
     * It ensures uni-directional flow by using an emitter to emit
     * the entire state of the text boxes on each change.
     */
    constructor() {
        // State
        this.textBoxes = [];
        this.nextId = 1;
        this.target = {};

        // Emitter
        this.emitter$ = new Subject();

        // Actions
        this.addTextBox$ = new Subject();
        this.updateText$ = new Subject();
        this.removeTextBox$ = new Subject();

        // Action subscriptions
        this.addTextBox$.subscribe(() => this.addTextBox());
        this.removeTextBox$.subscribe(id => this.removeTextBox(id));

        this.updateText$
            .do(target => {
                this.target = target;
                this.updateProperty(target, 'value', target.value);
            })
            .map(target =>  target.value)
            .filter(value => value.length > 2)
            .distinctUntilChanged()
            .debounceTime(500)
            .do(value => this.updateProperty(this.target, 'loading', true))
            .flatMap(value => ajax({
                url: 'http://jsonplaceholder.typicode.com/posts',
                responseType: 'json'
                })
                .retry(3)
                .catch(err => console.log(err)))
            .map(response => response.response[0].body.substr(0,50))
            .do(string => {
                this.updateProperty(this.target, 'output', string);
                this.updateProperty(this.target, 'loading', false)
            })
            .subscribe();
    }

    addTextBox() {
        this.textBoxes = this.textBoxes.concat({
            id: this.nextId,
            name: `TextBox ${this.nextId}`,
            value: '',
            output: '',
            loading: false
        });
        this.emitter$.next(this.textBoxes);
        this.nextId++;
    };

    removeTextBox(id) {
        const index = findIndex(this.textBoxes, function(textBox) { return textBox.id === id });
        this.textBoxes = this.textBoxes.splice(index, 1);
        this.emitter$.next(this.textBoxes);
    };

    updateProperty(target, property, value) {
        this.textBoxes = cloneDeep(this.textBoxes);
        const index = findIndex(this.textBoxes, function(textBox) { return textBox.id === parseInt(target.id, 10) });
        this.textBoxes[index][property] = value;
        this.emitter$.next(this.textBoxes);
    }
}
