// Lib
import {Subject} from 'rxjs/Subject';
import {findIndex} from 'lodash';

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
            .forEach(target => this.updateText(target))
            .map(target => {
                this.target = target;
                return target.value;
            })
            .filter(value => this.validateInput(value))
            .distinctUntilChanged()
            .debounce(500)
            .flatMap(value => this.http.get({
                url: 'https://en.wikipedia.org/w/api.php',
                dataType: 'json',
                data: {
                    action: 'query',
                    format: 'json',
                    search: value
                }
            }).retry(3))
            .map(response => JSON.stringify(response[0]).substr(0, 50))
            .foreach(string => this.updateOutput(this.target, string))
            .catch(err => console.log(err));
    }

    addTextBox() {
        this.textBoxes = this.textBoxes.concat({
            id: this.nextId,
            name: `TextBox ${this.nextId}`,
            value: '',
            output: ''
        });

        // Emit to listeners
        this.emitter$.next(this.textBoxes);

        this.nextId++;
    };

    removeTextBox(id) {
        // Get textBox index
        const index = findIndex(this.textBoxes, function(textBox) { return textBox.id == id });

        // Remove
        this.textBoxes.splice(index, 1);

        // Emit to listeners
        this.emitter$.next(this.textBoxes);
    };

    updateText(target) {

        // Get textBox index
        const index = findIndex(this.textBoxes, function(textBox) { return textBox.id === parseInt(target.id, 10) });

        this.textBoxes[index].value = this.target.value;

        // Emit to listeners
        this.emitter$.next(this.textBoxes);

        return true;
    };

    updateOutput(string) {
        // Get textBox index
        const index = findIndex(this.textBoxes, function(textBox) { return textBox.id === parseInt(this.target.id, 10) });

        this.textBoxes[index].output = string;

        // Emit to listeners
        this.emitter$.next(this.textBoxes);

        return true;
    }

    validateInput(value) {
        return value.length > 2;
    }
}
