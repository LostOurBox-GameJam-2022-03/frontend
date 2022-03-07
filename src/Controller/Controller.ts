import { ControllerButton } from "./ControllerButton";

export enum ButtonTypes {
    MOVE_BUTTON,
    PUSH_BUTTON
}

interface IButtons {
    [keyboardKey: string]: ControllerButton
}

type functionOrNull = Function | null

/**
 * Controller for detecting inputs.
 * 
 * Can hold several buttons, update what each button does, and update the key that will activate each button
 */
export class Controller {
  private buttons: IButtons = {
    "d": new ControllerButton(ButtonTypes.MOVE_BUTTON),
    "s": new ControllerButton(ButtonTypes.PUSH_BUTTON),
  };

  constructor() {
    this.initialize();
  }

  /**
     * Initializes event listeners to press and unpress buttons.
     */
  private initialize = () => {
    window.onkeydown = ({ key }: KeyboardEvent) => {
      if (key in this.buttons) {
        this.buttons[key].onButtonDown();
      }
    };
    window.onkeyup = ({ key }: KeyboardEvent) => {
      if (key in this.buttons) {
        this.buttons[key].onButtonUp();
      }
    };
    window.blur = () => {
      // Unpress all buttons if the window loses focus
      for (let key in this.buttons) {
        this.buttons[key].onButtonUp();
      }
    };
  };

  /**
     * Updates a given button's actions it performs when pressed.
     * 
     * @param buttonType The type of the button to update
     * @param isPressedFunc The new function. Set as `null` to have no action.
     * @returns 
     * @throws ReferenceError, when no button is found
     */
  updateButtonIsPressedFunction = (buttonType: ButtonTypes, isPressedFunc: functionOrNull) => {
    const buttonToUpdate = Object.values(this.buttons).find((button: ControllerButton) => button.buttonType === buttonType);
    if (!buttonToUpdate) throw ReferenceError(`Button [${buttonType}] not found`);

    buttonToUpdate.isPressedFunc = isPressedFunc;
  };

  /**
     * Updates a given button's actions it performs when held.
     * 
     * @param buttonType The type of the button to update
     * @param isHeldFunc The new function. Set as `null` to have no action.
     * @returns 
     * @throws ReferenceError, when no button is found
     */
  updateButtonIsHeldFunction = (buttonType: ButtonTypes, isHeldFunc: functionOrNull) => {
    const buttonToUpdate = Object.values(this.buttons).find((button: ControllerButton) => button.buttonType === buttonType);
    if (!buttonToUpdate) throw ReferenceError(`Button [${buttonType}] not found`);

    buttonToUpdate.isHeldFunc = isHeldFunc;
  };

  /**
     * Updates a given button's actions it performs when released.
     * 
     * @param buttonType The type of the button to update
     * @param isReleasedFunc The new function. Set as `null` to have no action.
     * @returns 
     * @throws ReferenceError, when no button is found
     */
  updateButtonIsReleasedFunction = (buttonType: ButtonTypes, isReleasedFunc: functionOrNull) => {
    const buttonToUpdate = Object.values(this.buttons).find((button: ControllerButton) => button.buttonType === buttonType);
    if (!buttonToUpdate) throw ReferenceError(`Button [${buttonType}] not found`);

    buttonToUpdate.isReleasedFunc = isReleasedFunc;
  };

  /**
     * Clears all of a button's functions.
     * 
     * @param buttonType The type of the button to reset
     * @returns 
     * @throws ReferenceError, when no button is found
     */
  clearButtonFunctions = (buttonType: ButtonTypes) => {
    const buttonToUpdate = Object.values(this.buttons).find((button: ControllerButton) => button.buttonType === buttonType);
    if (!buttonToUpdate) throw ReferenceError(`Button [${buttonType}] not found`);

    buttonToUpdate.isPressedFunc = null;
    buttonToUpdate.isHeldFunc = null;
    buttonToUpdate.isReleasedFunc = null;
  };

  /**
     * Main update loop for the controller.
     * 
     * Loops through and `.update()`s each button within `this.buttons`
     */
  update = () => {
    Object.values(this.buttons)
      .forEach((button: ControllerButton) => button.update());
  };
}
