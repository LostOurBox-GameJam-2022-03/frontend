import { Loader, Sprite } from "pixi.js";
import { Application } from "../Application";
import { calculateRealPointBasedOnRelativePointAndRotation, IPoint, ITrianglePoints } from "../utilityFunctions";

export enum FighterStates {
  DEFAULT_STATE,
  PUSHING_STATE,
  KNOCKED_BACK_STATE,
  BUMPED_STATE
}

export class Fighter {
  public application: Application;
  public fighter: Sprite;
  public currentState: FighterStates;
  public enemyKey: string;

  public shouldrotateClockwise: boolean = true;
  public rotationSpeed: number = 0.05;

  public shouldMove: boolean = false;
  public movementSpeed: number = 5;
  get centerPoint(): IPoint {
    return {
      x: this.fighter.x + (this.fighter.width / 2),
      y: this.fighter.y + (this.fighter.height / 2),
    };
  }

  public isAttacking: boolean = false;
  public timeSpentAttacking: number = 0;

  public knockBackRotation: number;
  public decelerationFromKnockBack: number = 0.3;
  public knockBackVelocity: number = 0;

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

    this.currentState = FighterStates.DEFAULT_STATE;
  }

  getTrianglePoints = (): ITrianglePoints => {
    // Calculating point A (the tip of the triangle)
    const pointAUnrotated = {
      x: this.fighter.x + (this.fighter.width / 2),
      y: this.fighter.y
    };

    const realPointA = calculateRealPointBasedOnRelativePointAndRotation(pointAUnrotated, this.centerPoint, this.fighter.rotation);

    // Calculating point B (the bottom left of the triangle)
    const pointBUnrotated = {
      x: this.fighter.x + 5,
      y: this.fighter.y + this.fighter.height
    };
    const realPointB = calculateRealPointBasedOnRelativePointAndRotation(pointBUnrotated, this.centerPoint, this.fighter.rotation);

    // calculating point C (the bottom right of the triangle)
    const pointCUnrotated = {
      x: this.fighter.x + (this.fighter.width - 5),
      y: this.fighter.y + this.fighter.height
    };
    const realPointC = calculateRealPointBasedOnRelativePointAndRotation(pointCUnrotated, this.centerPoint, this.fighter.rotation);

    return {
      a: realPointA,
      b: realPointB,
      c: realPointC
    };
  };

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
      this.rotate(frameDelta);
      if (this.shouldMove) {
        this.move(frameDelta);
      }
    }

    else if (this.isAttacking) {
      this.attack(frameDelta);
    }
    else if (this.currentState == FighterStates.KNOCKED_BACK_STATE) {
      this.knockBack(frameDelta);
    }
  };

  /**
 * Big 'ol switch statement to handle what happens on collision
 * 
 * @param otherFighter 
 */
  handleCollision = (otherFighter: Fighter) => {
    console.log("Collide");
    if (this.currentState === otherFighter.currentState) {
      // this.bump()
      // otherFighter.bump()
    }
    else if (otherFighter.currentState === FighterStates.PUSHING_STATE && ![FighterStates.KNOCKED_BACK_STATE, FighterStates.BUMPED_STATE].includes(this.currentState)) {
      this.startKnockBack(otherFighter.fighter.rotation);
    }
  };

  startKnockBack = (rotationFromAttacker: number) => {
    console.log("KOCKBACK");
    this.currentState = FighterStates.KNOCKED_BACK_STATE;
    this.knockBackRotation = rotationFromAttacker;
    this.knockBackVelocity = this.movementSpeed * 1.7;
  };

  knockBack = (frameDelta) => {
    this.knockBackVelocity -= this.decelerationFromKnockBack * frameDelta;
    if (this.knockBackVelocity > 0) {
      this.fighter.y -= Math.cos(this.knockBackRotation) * this.knockBackVelocity * frameDelta;
      this.fighter.x += Math.sin(this.knockBackRotation) * this.knockBackVelocity * frameDelta;
    } else {
      this.knockBackRotation = 0;
      this.knockBackVelocity = 0;
      this.currentState = FighterStates.DEFAULT_STATE;
    }
  };

  tryToPush = () => {
    if ([FighterStates.KNOCKED_BACK_STATE, FighterStates.BUMPED_STATE].includes(this.currentState)) return;
    this.currentState = FighterStates.PUSHING_STATE;
    this.isAttacking = true;
  };

  /**
   * The routine used when pushing.
   * 
   * @param frameDelta how many frames have passed since the last tick
   */
  attack = (frameDelta: number) => {
    this.timeSpentAttacking += frameDelta;

    if (this.timeSpentAttacking <= 2) {
      this.fighter.scale.set(
        1 + this.timeSpentAttacking / 2,
        1 + this.timeSpentAttacking / 2
      );

      this.fighter.y -= Math.cos(this.fighter.rotation) * this.movementSpeed * 3 * frameDelta;
      this.fighter.x += Math.sin(this.fighter.rotation) * this.movementSpeed * 3 * frameDelta;

      return;
    }
    if (2 < this.timeSpentAttacking && this.timeSpentAttacking <= 8) {
      this.fighter.scale.set(2, 2);
      return;
    }

    if (8 < this.timeSpentAttacking && this.timeSpentAttacking <= 15) {
      this.fighter.scale.set(
        1 + (15 - this.timeSpentAttacking) / 7,
        1 + (15 - this.timeSpentAttacking) / 7
      );

      this.fighter.y -= Math.cos(this.fighter.rotation) * this.movementSpeed * -1 * frameDelta;
      this.fighter.x += Math.sin(this.fighter.rotation) * this.movementSpeed * -1 * frameDelta;

    }

    if (this.timeSpentAttacking > 20) {
      this.fighter.scale.set(1, 1);
      this.isAttacking = false;
      this.timeSpentAttacking = 0;
      this.shouldrotateClockwise = !this.shouldrotateClockwise;
      this.currentState = FighterStates.DEFAULT_STATE;
      return;
    }
  };

  move = (frameDelta: number) => {
    this.fighter.y -= Math.cos(this.fighter.rotation) * this.movementSpeed * frameDelta;
    this.fighter.x += Math.sin(this.fighter.rotation) * this.movementSpeed * frameDelta;
  };
}
