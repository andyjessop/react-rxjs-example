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
        this.emitter = new Subject();
        this.textBoxes = [];
        this.nextId = 1;

        // Bindings
        this.addTextBox = this.addTextBox.bind(this);
    }

    addTextBox() {
        this.textBoxes = this.textBoxes.concat({
            id: this.nextId,
            name: `TextBox ${this.nextId}`,
            value: ''
        });

        // Emit to listeners
        this.emitter.next(this.textBoxes);

        this.nextId++;
    };

    removeTextBox(id) {
        // Get textBox index
        const index = findIndex(this.textBoxes, function(textBox) { return textBox.id == id });

        // Remove
        this.textBoxes.splice(index, 1);

        // Emit to listeners
        this.emitter.next(this.textBoxes);
    };

    updateText(target) {
        // Get textBox index
        const index = findIndex(this.textBoxes, function(textBox) { return textBox.id === parseInt(target.id, 10) });

        this.textBoxes[index].value = target.value;

        // Emit to listeners
        this.emitter.next(this.textBoxes);
    };
}
