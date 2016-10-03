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
                this.updateText(target);
            })
            .map(target =>  target.value)
            .filter(value => this.validateInput(value))
            .distinctUntilChanged()
            .debounceTime(500)
            .flatMap(value => ajax({
                url: 'https://en.wikipedia.org/w/api.php',
                responseType: 'json'
                })
                .retry(3)
                .catch(err => console.log(err)))
            .map(response => JSON.stringify(response[0]).substr(0, 50))
            .do(string => this.updateOutput(this.target, string))
            .subscribe();
    }

    addTextBox() {
        this.textBoxes = this.textBoxes.concat({
            id: this.nextId,
            name: `TextBox ${this.nextId}`,
            value: '',
            output: ''
        });

        this.emitter$.next(this.textBoxes);

        this.nextId++;
    };

    removeTextBox(id) {
        const index = findIndex(this.textBoxes, function(textBox) { return textBox.id == id });
        this.textBoxes = cloneDeep(this.textBoxes).splice(index, 1);
        this.emitter$.next(this.textBoxes);
    };

    updateText(target) {
        const index = findIndex(this.textBoxes, function(textBox) { return textBox.id === parseInt(target.id, 10) });
        this.textBoxes = cloneDeep(this.textBoxes);
        this.textBoxes[index].value = this.target.value;
        this.emitter$.next(this.textBoxes);

        return true;
    };

    updateOutput(target, string) {
        const index = findIndex(this.textBoxes, function(textBox) { return textBox.id === parseInt(target.id, 10) });
        this.textBoxes = cloneDeep(this.textBoxes);
        this.textBoxes[index].output = string;
        this.emitter$.next(this.textBoxes);

        return true;
    }

    validateInput(value) {
        return value.length > 2;
    }
}
