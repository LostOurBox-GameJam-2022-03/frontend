import { Graphics, Loader, Sprite } from "pixi.js";
import { Application } from "./Application";

export enum FighterStates {
  DEFAULT_STATE,
  PUSHING_STATE,
}

export class Fighter {
  public application: Application;
  public fighter: Sprite;
  public currentState: FighterStates = FighterStates.DEFAULT_STATE

  public shouldrotateClockwise: boolean = true
  public rotationSpeed: number = 0.05
  
  public shouldMove: boolean = false;
  public movementSpeed: number = 5
  
  public timeSpentAttacking: number = 0;

  constructor(app: Application) {
    const resourceAccessor = Loader.shared.resources;
    const textures = resourceAccessor["sprites/spritesheet.json"].textures!;
    this.application = app;

    this.fighter = new Sprite(textures["PlayerFighter.png"]);
    this.fighter.anchor.set(0.5, 0.5);
    this.fighter.position.set(
      this.application.app.screen.width / 2,
      this.application.app.screen.height / 2
    );
  }

  /**
   * Updates the position of the fighter based on given X and Y values.
   */
  setFighterPosition = (x: number, y: number) => {
    this.fighter.x = x;
    this.fighter.y = y;
  };

  rotate = (frameDelta) => {
    if (this.shouldrotateClockwise) {
      this.fighter.rotation = (this.fighter.rotation + this.rotationSpeed * frameDelta) % (Math.PI * 2);
    } else {
      this.fighter.rotation = (this.fighter.rotation - this.rotationSpeed * frameDelta) % (Math.PI * 2);
    }
  };

  update = (frameDelta: number) => {
    if (this.currentState == FighterStates.DEFAULT_STATE) {
      this.move(frameDelta);
    }
    else if (this.currentState == FighterStates.PUSHING_STATE) {
      this.attack(frameDelta)
    }
  };

  tryToPush = () => {
    this.currentState = FighterStates.PUSHING_STATE
  }

  /**
   * The routine used when pushing.
   * 
   * @param frameDelta how many frames have passed since the last tick
   */
  attack = (frameDelta) => {
    this.timeSpentAttacking += frameDelta

    if (this.timeSpentAttacking <= 2) {
      this.fighter.scale.set(
        1 + this.timeSpentAttacking / 2,
        1 + this.timeSpentAttacking / 2
      )

      this.fighter.y -= Math.cos(this.fighter.rotation) * this.movementSpeed * 3 * frameDelta;
      this.fighter.x += Math.sin(this.fighter.rotation) * this.movementSpeed * 3 * frameDelta;

      return
    }
    if (2 < this.timeSpentAttacking && this.timeSpentAttacking <= 8) {
      this.fighter.scale.set(2, 2)
      return
    }

    if (8 < this.timeSpentAttacking && this.timeSpentAttacking <= 15) {
      this.fighter.scale.set(
        1 + (15 - this.timeSpentAttacking) / 7,
        1 + (15 - this.timeSpentAttacking) / 7
      )

      this.fighter.y -= Math.cos(this.fighter.rotation) * this.movementSpeed * -1 * frameDelta;
      this.fighter.x += Math.sin(this.fighter.rotation) * this.movementSpeed * -1 * frameDelta;

    }

    if (this.timeSpentAttacking > 20) {
      this.fighter.scale.set(1, 1)
      this.timeSpentAttacking = 0
      this.shouldrotateClockwise = !this.shouldrotateClockwise
      this.currentState = FighterStates.DEFAULT_STATE
      return
    }
  }

  move = (frameDelta: number) => {
    this.rotate(frameDelta)
    if (this.shouldMove) {
      console.log("MOVING")
      this.fighter.y -= Math.cos(this.fighter.rotation) * this.movementSpeed * frameDelta;
      this.fighter.x += Math.sin(this.fighter.rotation) * this.movementSpeed * frameDelta;
    }
  };
}
