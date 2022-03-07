import { Loader } from "pixi.js";
import { Application } from "./Application";

Loader.shared.add("sprites/spritesheet.json").load(() => {
  const application = new Application();
  document.body.appendChild(application.view);
});
