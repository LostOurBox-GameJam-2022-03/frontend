import {
  Application as PIXIApplication,
  Graphics as PIXIGraphics,
} from "pixi.js";
import { ButtonTypes, Controller } from "./Controller";
import { Fighter } from "./Fighter";
import { GameTimer } from "./GameTimer";

const APP_CONFIGURATION = {
  width: 1280,
  height: 720,
};

/**
 * Entry point for the PIXI Application.
 *
 * This class stores global logic and properties for the game to function,
 * as well as many containers and sprites used in the app itself.
 */
export class Application {
  public app: PIXIApplication = new PIXIApplication(APP_CONFIGURATION);
  public view: HTMLCanvasElement = this.app.view;
  public player: Fighter;
  public otherFighter: Fighter;

  public timer: GameTimer = new GameTimer();
  public controller: Controller = new Controller();

  constructor() {
    this.app.stage.addChild(
      new PIXIGraphics()
        .beginFill(0xcccccc)
        .drawRect(0, 0, this.app.screen.width, this.app.screen.height)
    );

    this.app.stage.addChild(this.timer.view);

    this.player = new Fighter(this);
    this.player.setFighterPosition(100, 200);
    this.app.stage.addChild(this.player.fighter);

    this.otherFighter = new Fighter(this)
    this.otherFighter.setFighterPosition(600, 500);
    this.app.stage.addChild(this.otherFighter.fighter);

    this.setupController()

    this.app.ticker.add(this.update);
  }

  setupController = () => {
    this.controller.clearButtonFunctions(ButtonTypes.MOVE_BUTTON)
    this.controller.updateButtonIsHeldFunction(
      ButtonTypes.MOVE_BUTTON,
      () => this.player.shouldMove = true
    )

    this.controller.updateButtonIsReleasedFunction(
      ButtonTypes.MOVE_BUTTON,
      () => this.player.shouldMove = false
    )

    this.controller.clearButtonFunctions(ButtonTypes.PUSH_BUTTON)
    this.controller.updateButtonIsPressedFunction(ButtonTypes.PUSH_BUTTON, this.player.tryToPush)
  }

  /**
   * Main Update Loop of the PIXI Application.
   *
   * This method is used to call all other update methods in the application.
   */
  update = (frameDelta: number) => {
    this.timer.update(frameDelta, this.app.ticker.deltaMS);
    this.controller.update(frameDelta);
    this.player.update(frameDelta);
    this.otherFighter.update(frameDelta);
  };
}
