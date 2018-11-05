let ww = window.innerWidth;
let wh = window.innerHeight;
const options = {
  bg: {
    src: "img/water.png",

    ratio: 1080 / 1661
  },
  displacementMap: {
    intensity: 40,
    mouseDelay: 0.05,
    speed: 1,
    size: {
      height: 300,
      width: 300,
    },
    src: "https://res.cloudinary.com/dheeu8pj9/image/upload/v1540179223/filter_NRM.jpg",
    wrapMode: PIXI.WRAP_MODES.REPEAT
  }
};

const renderer = new PIXI.autoDetectRenderer({
  width: window.innerWidth,
  height: window.innerHeight
});

document.querySelector("#root").appendChild(renderer.view);

const stage = new PIXI.Container();

let bgResource = null;
let displacementMapResource = null;

const pixiLoader = new PIXI.loaders.Loader();
pixiLoader.add("bg", options.bg.src);
pixiLoader.add("displacementMap", options.displacementMap.src);
pixiLoader.load((loader, { bg, displacementMap }) => {
  displacementMapResource = new PIXI.Sprite(displacementMap.texture);
  displacementMapResource.width = options.displacementMap.size.width;
  displacementMapResource.height = options.displacementMap.size.height;
  displacementMapResource.texture.baseTexture.wrapMode =
    options.displacementMap.wrapMode;

  bgResource = new PIXI.Sprite(bg.texture);
  bgResource.anchor.x = 0.5;
  bgResource.anchor.y = 0.5;
  bgResource.x = (ww - 50) / 2
  bgResource.y = (wh - 50) / 2;
  bgResource.width = ww + 100;
  bgResource.height = bgResource.width * options.bg.ratio;
  bgResource.interactive = true;
  bgResource.filters = [
    new PIXI.filters.DisplacementFilter(
      displacementMapResource,
      options.displacementMap.intensity
    )
  ];
  stage.addChild(bgResource, displacementMapResource);
});

let oldX = 0;
let oldY = 0;
let currentY = 0;
let currentX = 0;

window.addEventListener("mousemove", e => {
  currentY = e.pageX;
  currentX = e.pageY;
});

const ticker = new PIXI.ticker.Ticker();
ticker.stop();
ticker.add(deltaTime => {
  const diffX = currentY - oldX;
  const diffY = currentX - oldY;

  if (displacementMapResource) {
    displacementMapResource.x =
      displacementMapResource.x +
      options.displacementMap.speed -
      diffX * options.displacementMap.mouseDelay;
    displacementMapResource.y =
      displacementMapResource.y -
      options.displacementMap.speed +
      diffY * options.displacementMap.mouseDelay;
  }

  oldX = oldX + diffX * options.displacementMap.mouseDelay;
  oldY = oldY + diffY * options.displacementMap.mouseDelay;
  renderer.render(stage);
});
ticker.start();

window.addEventListener("resize", e => {
  ww = window.innerWidth;
  wh = window.innerHeight;
  bgResource.width = ww + 100;
  bgResource.height = bgResource.width * options.bg.ratio;
  bgResource.x = (ww - 50) / 2
  bgResource.y = (wh - 50) / 2;
  renderer.resize(ww, wh);
});
