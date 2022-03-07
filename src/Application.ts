import {
  Application as PIXIApplication,
  Graphics as PIXIGraphics,
} from "pixi.js";
import { ButtonTypes, Controller } from "./Controller";
import { Fighter } from "./Fighter/Fighter";
import { GameTimer } from "./GameTimer";
import { trianglesIntersect } from "./utilityFunctions";

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
  public fighters: {[key: string]: Fighter} = {};
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

    this.fighters["fighter1"] = new Fighter(this);
    this.player = this.fighters["fighter1"];
    this.player.setFighterPosition(100, 200);
    this.app.stage.addChild(this.player.fighter);

    this.fighters["fighter2"] = new Fighter(this);
    this.fighters["fighter2"].setFighterPosition(600, 500);
    this.app.stage.addChild(this.fighters["fighter2"].fighter);

    this.setupController();

    this.app.ticker.add(this.update);
  }

  setupController = () => {
    this.controller.clearButtonFunctions(ButtonTypes.MOVE_BUTTON);
    this.controller.updateButtonIsHeldFunction(
      ButtonTypes.MOVE_BUTTON,
      () => this.player.shouldMove = true
    );

    this.controller.updateButtonIsReleasedFunction(
      ButtonTypes.MOVE_BUTTON,
      () => this.player.shouldMove = false
    );

    this.controller.clearButtonFunctions(ButtonTypes.PUSH_BUTTON);
    this.controller.updateButtonIsPressedFunction(ButtonTypes.PUSH_BUTTON, this.player.tryToPush);
  };

  checkForCollisions = () => {
    const listOfFighters: Fighter[] = Object.values(this.fighters);
    for (let index1 = 0; index1 < listOfFighters.length; ++index1) {
      for (let index2 = index1 + 1; index2 < listOfFighters.length; ++index2) {
        const fighter = listOfFighters[index1];
        const otherFighter = listOfFighters[index2];
        const isColliding = trianglesIntersect(fighter.getTrianglePoints(), otherFighter.getTrianglePoints());

        if (isColliding) {
          fighter.handleCollision(otherFighter);
          otherFighter.handleCollision(fighter);
        }
      }
    }
  };

  /**
   * Main Update Loop of the PIXI Application.
   *
   * This method is used to call all other update methods in the application.
   */
  update = (frameDelta: number) => {
    this.checkForCollisions();

    this.timer.update(frameDelta, this.app.ticker.deltaMS);
    this.controller.update();
    for (let fighterKey in this.fighters) {
      this.fighters[fighterKey].update(frameDelta);
    }
  };
}
