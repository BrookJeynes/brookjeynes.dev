// Fixed animation on Safari by maurycyz
// based on maia's oneko.js https://maia.crimew.gay/
// based on oneko.js from https://github.com/adryd325/oneko.js, licensed under MIT, with art from https://twitter.com/_Anunnery

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function oneko() {
  let nekoPosX = 32;
  let nekoPosY = 32;
  let nekoOrigX = nekoPosX;
  let nekoOrigY = nekoPosY;

  // Run back to the box when clicked.
  let timeout = 0;
  function click() {
    timeout = 200;
  }

  // Animation state
  let mousePosX = nekoPosX - 32;
  let mousePosY = nekoPosY - 32;
  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;
  const nekoSpeed = 10;

  // Sprite atlas cordinates
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
    scratchWallN: [[0, 0], [0, -1]],
    scratchWallS: [[-7, -1], [-6, -2]],
    scratchWallE: [[-2, -2], [-2, -3]],
    scratchWallW: [[-4, 0], [-4, -1]],
    tired: [[-3, -2]],
    sleeping: [[-2, 0], [-2, -1]],
    N: [[-1, -2], [-1, -3]],
    NE: [[0, -2], [0, -3]],
    E: [[-3, 0], [-3, -1]],
    SE: [[-5, -1], [-5, -2]],
    S: [[-6, -3], [-7, -2]],
    SW: [[-5, -3], [-6, -1]],
    W: [[-4, -2], [-4, -3]],
    NW: [[-1, 0], [-1, -1]],
  };

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    neko2.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  // Create the cat
  // Safari breaks background-position on position: fixed elements.
  // as a workaround, I do positioning and graphics in two different elements

  // Positioning element
  const neko = document.createElement("div");
  neko.id = "oneko";
  neko.style.width = "32px";
  neko.style.height = "32px";
  neko.style.position = "fixed";
  neko.style.left = `${nekoPosX}px`;
  neko.style.top = `${nekoPosY}px`;

  // Graphics elements
  const neko2 = document.createElement("div");
  neko2.style.width = "32px";
  neko2.style.height = "32px";
  neko2.id = "oneko2";
  neko2.onclick = click;
  neko2.style.backgroundImage = "url('/oneko.gif')";
  neko2.style.imageRendering = "pixelated";

  neko.appendChild(neko2)

  // Add it at the start of the HTML so it can go under the navbar
  document.body.prepend(neko);

  // Track mouse positions
  document.onmousemove = (event) => {
    mousePosX = event.clientX;
    mousePosY = event.clientY;
  };

  // ... and run the animation!
  window.onekoInterval = setInterval(frame, 100);
  function frame() {
    frameCount += 1;
    var diffX; var diffY;
    if (timeout > 0) {
      diffX = nekoPosX - nekoOrigX;
      diffY = nekoPosY - nekoOrigY;
      timeout--;
    } else {
      diffX = nekoPosX - mousePosX;
      diffY = nekoPosY - mousePosY;
    }
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
    // Idle if cursor is close.
    if (distance < nekoSpeed || distance < 48) {
      idle();
      return;
    }
    idleAnimation = null;
    idleAnimationFrame = 0;
    // ... only reached if cursor is far away:
    // Show alert the cursor moved after idleing
    if (idleTime > 1) {
      setSprite("alert", 0);
      // Count down after being moving, max of 700 ms.
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }
    // ... only reached if we are moving:
    // Select animation
    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);
    // Move cat
    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;
    // Clamp to window
    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);
    // Update HTML
    neko.style.left = `${nekoPosX - 16}px`;
    neko.style.top = `${nekoPosY - 16}px`;
  }

  function idle() {
    // Called every frame if we are close to the cursor.
    // Record that we were idle. Used for the "alert" animation
    idleTime += 1;

    // Start idle animations after two seconds of inactivity
    if (idleTime > 20 && idleAnimation == null) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      // Scratching animations are position dependent
      if (nekoPosX < 32) avalibleIdleAnimations.push("scratchWallW");
      if (nekoPosY < 32) avalibleIdleAnimations.push("scratchWallN");
      if (nekoPosX > window.innerWidth - 32) avalibleIdleAnimations.push("scratchWallE");
      if (nekoPosY > window.innerHeight - 32) avalibleIdleAnimations.push("scratchWallS");
      // Randomly pick one to play
      var idx = Math.floor(Math.random() * avalibleIdleAnimations.length)
      idleAnimation = avalibleIdleAnimations[idx];
      idleAnimationFrame = 0;
    }

    switch (idleAnimation) {
      case "sleeping":
        // Play yawning animation for the first 800 ms
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
        } else {
          setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        }
        // Wake up after 20 seconds.
        if (idleAnimationFrame > 200) idleAnimation = null;
        break;
      case "scratchWallN": case "scratchWallS":
      case "scratchWallE": case "scratchWallW":
      case "scratchSelf":
        // Play animations for 900 ms
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) idleAnimation = null;
        break;
      default:
        // We haven't found anything to do yet.
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }
};

// Currently ignores reduced motion.
const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

oneko();
