let circles = [];
let currentOverlay = null; // Track the currently active overlay
let smokeParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 40; i++) {
    circles.push({
      x: random(windowWidth),
      y: random(windowHeight),
      size: random(30, 100),
      color: color(random(255), random(255), random(255)),
      vx: random(-2, 2), // Add horizontal velocity
      vy: random(-2, 2), // Add vertical velocity
    });
  }

  // Add menu functionality
  const menu = document.querySelector('.menu');
  document.addEventListener('mousemove', (e) => {
    if (e.clientX > window.innerWidth / 2 && e.clientY < 300) {
      menu.style.display = 'block';
    } else {
      menu.style.display = 'none';
    }
  });

  // Add modal functionality
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');

  window.openModal = function (url) {
    modalContent.src = url;
    modal.style.display = 'block';
  };

  window.closeModal = function () {
    modal.style.display = 'none';
    modalContent.src = '';
  };

  // Add quiz modal functionality
  const quizModal = document.getElementById('quiz-modal');
  const quizContent = document.getElementById('quiz-content');

  window.openQuiz = function () {
    quizContent.src = 'https://sunyuanting.github.io/0321/';
    quizModal.style.display = 'block';
  };

  window.closeQuiz = function () {
    quizModal.style.display = 'none';
    quizContent.src = ''; // Clear the iframe content
  };

  const tutorialButton = document.createElement('button');
  document.body.appendChild(tutorialButton);

  // Add "自我介紹" click functionality
  const introLink = document.querySelector('a[href="introduction.html"]');
  introLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default navigation

    // Close the current overlay if it exists
    if (currentOverlay) {
      document.body.removeChild(currentOverlay);
      currentOverlay = null;
    }

    // Draw white box with "文案" text
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '50%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.width = '1000px';
    overlay.style.height = '500px';
    overlay.style.backgroundColor = 'white';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    overlay.style.zIndex = '1000';

    const text = document.createElement('div');
    text.textContent = '我的名字是孫圓婷，目前是淡江大學教科系的大三學生';
    text.style.fontSize = '30px';
    text.style.color = 'black';

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.fontSize = '20px';
    closeButton.style.background = 'red';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '50%'; // Make the button circular
    closeButton.style.width = '30px';
    closeButton.style.height = '30px';
    closeButton.style.cursor = 'pointer';

    closeButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
      currentOverlay = null;
    });

    overlay.appendChild(text);
    overlay.appendChild(closeButton);
    document.body.appendChild(overlay);

    // Set the current overlay
    currentOverlay = overlay;
  });

  // Close "自我介紹" overlay when other menu items are clicked
  const menuLinks = document.querySelectorAll('.menu a');
  menuLinks.forEach((link) => {
    if (link !== introLink) {
      link.addEventListener('click', () => {
        if (currentOverlay) {
          document.body.removeChild(currentOverlay);
          currentOverlay = null;
        }
      });
    }
  });
}

class SmokeParticle {
  constructor(x, y) {
    this.x = x + random(-5, 5);
    this.y = y + random(-5, 5);
    this.alpha = 180;
    this.size = random(10, 20);
    this.growth = random(0.05, 0.15); // 微擴張
    this.fade = random(1.5, 5.5);     // 消失速度
    this.c = color('#84a59d');
    this.offsetX = random(-0.3, 0.3); // 微小橫向漂移
    this.offsetY = random(-0.3, -0.1); // 微小上升
  }

  update() {
    this.x += this.offsetX;
    this.y += this.offsetY;
    this.size += this.growth;
    this.alpha -= this.fade;
    this.alpha = max(this.alpha, 0);
  }

  display() {
    noStroke();
    this.c.setAlpha(this.alpha);

    // 模糊邊緣效果
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = this.c;

    fill(this.c);
    ellipse(this.x, this.y, this.size);

    // 重設 shadowBlur，避免影響其他繪圖
    drawingContext.shadowBlur = 0;
  }

  isFinished() {
    return this.alpha <= 0;
  }
}


function mouseMoved() {
  for (let i = 0; i < 3; i++) {
    smokeParticles.push(new SmokeParticle(mouseX, mouseY));
  }
}

function draw() {
  background('#ffe5d9');
  for (let circle of circles) {
    fill(circle.color);
    noStroke();
    ellipse(circle.x, circle.y, circle.size * (mouseX / windowWidth), circle.size * (mouseX / windowWidth));

    // Update position
    circle.x += circle.vx;
    circle.y += circle.vy;

    // Bounce off edges
    if (circle.x < 0 || circle.x > windowWidth) circle.vx *= -1;
    if (circle.y < 0 || circle.y > windowHeight) circle.vy *= -1;
  }
  for (let i = smokeParticles.length - 1; i >= 0; i--) {
    smokeParticles[i].update();
    smokeParticles[i].display();
  
    if (smokeParticles[i].isFinished()) {
      smokeParticles.splice(i, 1);
    }
  }
}

// function draw() {
//   resizeCanvas(windowWidth, windowHeight);
//   // Add smoke effect at mouse position
//   noStroke();
//   fill(0, 255, 0, 100); // Semi-transparent green
//   ellipse(mouseX, mouseY, random(20, 50), random(20, 50));
// }