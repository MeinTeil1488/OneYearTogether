// === kaboom init ===
import kaboom from "kaboom"


kaboom({
    width: 1536,
    height: 1024,
    scale: 0.7,
    canvas: document.querySelector("canvas"),
});

setGravity(1600);

// === sprites ===
// loadSprite("player", "/src/assets/sprites/player1.png");
loadSprite("idle", "/src/assets/sprites/boy_idle-1.png");
loadSprite("walk", "/src/assets/sprites/boy_walk-1.png");

loadSprite("chest_closed", "/src/assets/sprites/chest_closed.png");
loadSprite("chest_open", "/src/assets/sprites/chest_open.png");

// loadSprite("photo1", "/src/assets/photos/photo1.jpg");
loadSprite("photo_summer_1", "/src/assets/photos/photo_summer_1.jpg");
loadSprite("photo_summer_2", "/src/assets/photos/photo_summer_2.jpg");
loadSprite("photo_summer_3", "/src/assets/photos/photo_summer_3.jpg");

loadSprite("photo_autumn_1", "/src/assets/photos/photo_autumn_1.jpg");
loadSprite("photo_autumn_2", "/src/assets/photos/photo_autumn_2.jpg");
loadSprite("photo_autumn_3", "/src/assets/photos/photo_autumn_3.jpg");
loadSprite("photo_autumn_4", "/src/assets/photos/photo_autumn_4.jpg");

loadSprite("photo_winter_1", "/src/assets/photos/photo_winter_1.jpg");
loadSprite("photo_winter_2", "/src/assets/photos/photo_winter_2.jpg");
loadSprite("photo_winter_3", "/src/assets/photos/photo_winter_3.jpg");

loadSprite("photo_spring_1", "/src/assets/photos/photo_spring_1.jpg");
loadSprite("photo_spring_2", "/src/assets/photos/photo_spring_2.jpg");
loadSprite("photo_spring_3", "/src/assets/photos/photo_spring_3.jpg");
loadSprite("photo_spring_4", "/src/assets/photos/photo_spring_4.jpg");



loadSprite("background_summer", "/src/assets/backgrounds/background_summer.png");
loadSprite("background_autumn", "/src/assets/backgrounds/background_autumn.png");
loadSprite("background_winter", "/src/assets/backgrounds/background_winter.png");
loadSprite("background_spring", "/src/assets/backgrounds/background_spring.png");
loadSprite("background_final", "/src/assets/backgrounds/background_final.png");
loadSprite("background_final_open", "/src/assets/backgrounds/background_final_open.png");
loadSprite("win-image", "/src/assets/backgrounds/final_win_image.png");
loadSprite("grass", "/src/assets/tiles/tileset_summer.png", { sliceX: 2, sliceY: 1 });
loadSprite("portal", "/src/assets/tiles/tileset_summer.png", { sliceX: 2, sliceY: 1 });

loadSprite("autumn_platform", "/src/assets/tiles/tileset_autumn.png");

loadSprite("winter_platform", "/src/assets/tiles/tileset_winter.png");

loadSprite("spring_platform", "/src/assets/tiles/tileset_spring.png");

loadSound("chestOpen", "src/assets/music/chest-open.mp3");
loadSound("portal", "src/assets/music/portal.mp3");
loadSound("final", "src/assets/music/final.mp3");
loadSound("win", "src/assets/music/win.mp3");



// === helpers ===
// add player
function addPlayer() {
    return add([
        sprite("idle"),
        pos(100, 1100),
        anchor("bot"),
        scale(0.9),
        area(),
        body(),
        {
            isMoving: false,
        },
        z(2),
        "player"
    ]);
}

// boundaries
function applyPlayerBoundaries(player) {
    player.onUpdate(() => {
        player.pos.x = Math.max(0, Math.min(player.pos.x, width() - player.width));
        if (player.pos.y > height() + 200) {
            player.pos = vec2(100, 614); // Start position
        }
    });
}

// add chests
function addChests(positions, photoKeys, onOpen) {
    positions.forEach((chestPos, i) => {
        const chest = add([
            sprite("chest_closed"),
            pos(chestPos),
            scale(0.4),
            area({ shape: new Rect(vec2(55, 40), 90, 120) }),
            z(1),
            "chest",
            { opened: false },
        ]);

        chest.onCollide("player", () => {
            if (chest.opened) return;

            chest.opened = true;
            chest.use(sprite("chest_open"));
            play("chestOpen");
            onOpen(chest);

            const key = photoKeys[i];
            const image = add([
                sprite(key),
                pos(chest.pos.x, chest.pos.y - 50),
                scale(0.2),
                z(5),
                move(DOWN, 40),
                opacity(1),
                "fadingPhoto",
            ]);

            onUpdate("fadingPhoto", () => {
                image.opacity -= dt() / 4;
                if (image.opacity <= 0) destroy(image);
            });
        });
    });
}


// add portal
function addPortal(position) {
    return add([
        sprite("portal", { frame: 1 }),
        pos(position),
        scale(0.6),
        area({ shape: new Rect(vec2(30, 20), 70, 120) }),
        "portal",
        z(2),
    ]);
}
// reset button
function addResetButton(player) {
    add([
        rect(210, 50, { radius: 12 }),
        pos(20, 20),
        color(255, 255, 255),
        area(),
        z(9),
        "resetButtonBg",
    ]);

    const button = add([
        text("Restart Level", { size: 22, font: "sink" }),
        pos(125, 45),
        anchor("center"),
        color(0, 0, 0),
        area(),
        z(10),
        "resetButton",
    ]);

    const resetAction = () => player.pos = vec2(100, 1100);

    button.onClick(resetAction);
    onClick("resetButtonBg", resetAction);
}
// chest counter
function addChestCounter(total) {
    const counter = add([
        text(`Chests: 0 / ${total}`, {
            size: 30,
            font: "sink",
        }),
        pos(center().x, 30),
        anchor("center"),
        z(10),
        { opened: 0, total, updateDisplay() { this.text = `Chests: ${this.opened} / ${total}`; } }
    ]);
    return counter;
}
// add platforms
function addPlatforms(positions) {
    for (const p of positions) {
        add([
            sprite("grass", { frame: 0 }),
            pos(p),
            anchor("topleft"),
            scale(0.5),
            area({ shape: new Rect(vec2(31, 210), 63, 2) }),
            body({ isStatic: true }),
            z(1),
        ]);
    }
}


// === summer scene ===
scene("summer", () => {
    add([sprite("background_summer"), pos(0, 0), z(0)]);
    // ground
    add([
        rect(width(), 10),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        opacity(0),
    ]);

    const player = addPlayer();
    applyPlayerBoundaries(player);

    const chestCounter = addChestCounter(3);

    // "Next level" button
    add([
        rect(210, 50, { radius: 12 }),
        pos(20, 80),
        color(255, 255, 255),
        area(),
        z(9),
        "nextButtonBg",
    ]);

    const nextButton = add([
        text("Next Level", { size: 22, font: "sink" }),
        pos(125, 105),
        anchor("center"),
        color(0, 0, 0),
        area(),
        z(10),
        "nextButton",
    ]);

    const nextLevelAction = () => go("autumn");
    nextButton.onClick(nextLevelAction);
    onClick("nextButtonBg", nextLevelAction);

    addChests(
        [
            vec2(760, 490),
            vec2(1130, 730),
            vec2(1160, 190),
        ],
        [
            "photo_summer_1",
            "photo_summer_2",
            "photo_summer_3",
        ],
        (chest) => {
            chestCounter.opened++;
            chestCounter.updateDisplay();

            // белый фон + текст
            const boxPos = vec2(chest.pos.x - 60, chest.pos.y - 110);
            const boxWidth = 300;
            const boxHeight = 50;

            // Проверка: не выходит ли бокс за пределы экрана
            if (
                boxPos.x >= 0 &&
                boxPos.x + boxWidth <= width() &&
                boxPos.y >= 0 &&
                boxPos.y + boxHeight <= height()
            ) {
                const box = add([
                    rect(boxWidth, boxHeight, { radius: 16 }),
                    pos(boxPos),
                    color(255, 255, 255),
                    z(3),
                    lifespan(2),
                ]);

                add([
                    text("You found a memory!", { size: 26 }),
                    pos(boxPos.add(20, 12)),
                    color(0, 0, 0),
                    z(4),
                    lifespan(2),
                ]);
            }

        }
    );


    addPortal(vec2(1330, 560));
    addResetButton(player);

    addPlatforms([
        vec2(350, 700),
        vec2(500, 650),
        vec2(650, 600),
        vec2(800, 550),
        vec2(950, 500),
        vec2(1350, 700),
        vec2(1200, 250),
    ]);

    player.onCollide("portal", () => {
        if (chestCounter.opened >= chestCounter.total) {
            play("portal");
            go("autumn");   // или "nextScene"  /  "winter"  и т.д.
        } //else {
        //     add([
        //         text("Find all chests first!", { size: 24 }),
        //         pos(player.pos.add(0, -60)),
        //         color(255, 0, 0),
        //         anchor("center"),
        //         lifespan(1.5),
        //         z(11),
        //     ]);
        // }
    });

    let walkTimer = 0;
    let walkFrame = 0;

    onUpdate(() => {
        if (isKeyDown("right")) {
            player.move(120, 0);
            player.scale.x = 0.9;

            walkTimer += dt();
            if (walkTimer > 0.2) {  // скорость чередования (в секундах)
                walkFrame = (walkFrame + 1) % 2;
                player.use(sprite(walkFrame === 0 ? "idle" : "walk"));
                walkTimer = 0;
            }

            player.isMoving = true;

        } else if (isKeyDown("left")) {
            player.move(-120, 0);
            player.scale.x = -0.9;

            walkTimer += dt();
            if (walkTimer > 0.2) {
                walkFrame = (walkFrame + 1) % 2;
                if (walkFrame === 0) {
                    player.use(sprite("idle"));
                } else {
                    player.use(sprite("walk", { width: 227, height: 397 }));
                }

                walkTimer = 0;
            }

            player.isMoving = true;

        } else {
            if (player.isMoving) {
                player.use(sprite("idle"));
                player.isMoving = false;
            }
        }
    });

    onKeyDown("up", () => player.isGrounded() && player.jump(1000));
});
// === autumn scene ===
scene("autumn", () => {
    add([sprite("background_autumn"), pos(0, 0), z(0)]);

    add([
        rect(width(), 10),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        opacity(0),
    ]);

    const player = addPlayer();
    applyPlayerBoundaries(player);

    const chestCounter = addChestCounter(4);
    addResetButton(player);

    // "Go back" button
    add([
        rect(210, 50, { radius: 12 }),
        pos(250, 80),
        color(255, 255, 255),
        area(),
        z(9),
        "backButtonBg",
    ]);

    const backButton = add([
        text("Go Back", { size: 22, font: "sink" }),
        pos(350, 105),
        anchor("center"),
        color(0, 0, 0),
        area(),
        z(10),
        "backButton",
    ]);

    const goBackAction = () => go("summer");
    backButton.onClick(goBackAction);
    onClick("backButtonBg", goBackAction);

    // "Next level" button
    add([
        rect(210, 50, { radius: 12 }),
        pos(20, 80),
        color(255, 255, 255),
        area(),
        z(9),
        "nextButtonBg",
    ]);

    const nextButton = add([
        text("Next Level", { size: 22, font: "sink" }),
        pos(125, 105),
        anchor("center"),
        color(0, 0, 0),
        area(),
        z(10),
        "nextButton",
    ]);

    const nextLevelAction = () => go("winter");
    nextButton.onClick(nextLevelAction);
    onClick("nextButtonBg", nextLevelAction);

    const autumnPlatforms = [
        vec2(200, 700),
        vec2(350, 450),
        vec2(550, 300),
        vec2(750, 400),
        vec2(900, 550),
        vec2(1100, 400),
        vec2(1300, 550),

        vec2(20, 300),

    ];

    for (const p of autumnPlatforms) {
        const platformWidth = 500 * 0.6;
        const platformHeight = 500 * 0.6;

        add([
            sprite("autumn_platform"),
            pos(p),
            anchor("topleft"),
            scale(0.6),
            area({
                shape: new Rect(
                    vec2(150, platformHeight - 12), // хитбокс внизу
                    platformWidth - 150,
                    10
                ),
            }),
            body({ isStatic: true }),
            z(1),
        ]);
    }


    // === сундуки ===
    addChests([
        autumnPlatforms[1].add(vec2(50, -35)), // платформа 2
        autumnPlatforms[3].add(vec2(50, -35)), // платформа 4
        autumnPlatforms[5].add(vec2(50, -35)), // платформа 6
        autumnPlatforms[7].add(vec2(50, -35)), // платформа 8 (vec2(100, 220))
    ],
    [
        "photo_autumn_1",
        "photo_autumn_2",
        "photo_autumn_3",
        "photo_autumn_4",
    ],
    (chest) => {
    chestCounter.opened++;
    chestCounter.updateDisplay();

        const boxPos = vec2(chest.pos.x - 60, chest.pos.y - 110);
        const boxWidth = 300;
        const boxHeight = 50;

        // Проверка: не выходит ли бокс за пределы экрана
        if (
            boxPos.x >= 0 &&
            boxPos.x + boxWidth <= width() &&
            boxPos.y >= 0 &&
            boxPos.y + boxHeight <= height()
        ) {
            const box = add([
                rect(boxWidth, boxHeight, { radius: 16 }),
                pos(boxPos),
                color(255, 255, 255),
                z(3),
                lifespan(2),
            ]);

            add([
                text("You found a memory!", { size: 26 }),
                pos(boxPos.add(20, 12)),
                color(0, 0, 0),
                z(4),
                lifespan(2),
            ]);
        }
});

// === портал ===
    add([
        sprite("portal", { frame: 1 }),
        pos(autumnPlatforms[6].add(vec2(70, -110))),
        scale(0.6),
        area(),
        "portal",
        z(2),
    ]);

    player.onCollide("portal", () => {
        if (chestCounter.opened >= chestCounter.total) {
            play("portal");
            go("winter");   // или "nextScene"  /  "winter"  и т.д.
         } //else {
        //     // короткое уведомление
        //     add([
        //         text("Find all chests first!", { size: 24 }),
        //         pos(player.pos.add(0, -60)),
        //         color(255, 0, 0),
        //         anchor("center"),
        //         lifespan(1.5),
        //         z(11),
        //     ]);
        // }
    });



    let walkTimer = 0;
    let walkFrame = 0;

    onUpdate(() => {
        if (isKeyDown("right")) {
            player.move(120, 0);
            player.scale.x = 0.9;

            walkTimer += dt();
            if (walkTimer > 0.2) {  // скорость чередования (в секундах)
                walkFrame = (walkFrame + 1) % 2;
                player.use(sprite(walkFrame === 0 ? "idle" : "walk"));
                walkTimer = 0;
            }

            player.isMoving = true;

        } else if (isKeyDown("left")) {
            player.move(-120, 0);
            player.scale.x = -0.9;

            walkTimer += dt();
            if (walkTimer > 0.2) {
                walkFrame = (walkFrame + 1) % 2;
                if (walkFrame === 0) {
                    player.use(sprite("idle"));
                } else {
                    player.use(sprite("walk", { width: 227, height: 397 }));
                }

                walkTimer = 0;
            }

            player.isMoving = true;

        } else {
            if (player.isMoving) {
                player.use(sprite("idle"));
                player.isMoving = false;
            }
        }
    });
    onKeyDown("up", () => player.isGrounded() && player.jump(1000));
});

// === winter scene ===
scene("winter", () => {
    add([sprite("background_winter"), pos(0, 0), z(0)]);

    add([
        rect(width(), 10),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        opacity(0),
    ]);

    const player = addPlayer();
    applyPlayerBoundaries(player);

    const chestCounter = addChestCounter(3);
    addResetButton(player);

    // "Go back" button
    add([
        rect(210, 50, { radius: 12 }),
        pos(250, 80),
        color(255, 255, 255),
        area(),
        z(9),
        "backButtonBg",
    ]);

    const backButton = add([
        text("Go Back", { size: 22, font: "sink" }),
        pos(350, 105),
        anchor("center"),
        color(0, 0, 0),
        area(),
        z(10),
        "backButton",
    ]);

    const goBackAction = () => go("autumn");
    backButton.onClick(goBackAction);
    onClick("backButtonBg", goBackAction);

    // "Next level" button
    add([
        rect(210, 50, { radius: 12 }),
        pos(20, 80),
        color(255, 255, 255),
        area(),
        z(9),
        "nextButtonBg",
    ]);

    const nextButton = add([
        text("Next Level", { size: 22, font: "sink" }),
        pos(125, 105),
        anchor("center"),
        color(0, 0, 0),
        area(),
        z(10),
        "nextButton",
    ]);

    const nextLevelAction = () => go("spring");
    nextButton.onClick(nextLevelAction);
    onClick("nextButtonBg", nextLevelAction);

    const winterPlatforms = [
        vec2(300, 780),  // 0 – самая нижняя слева
        vec2(510, 540),  // 1
        // vec2(770, 500),  // 2 – точка стыковки с лифтом
        vec2(1150, 640), // 3 – правая «средняя»
        vec2(1250, 250), // 4 – верхняя справа (под порталом)

        // vec2(150, 100),
    ];

    // статические платформы
    const platformWidth = 1536 * 0.2;
    // const platformHeight = 1024 * 0.2;
    for (const p of winterPlatforms) {
        add([
            sprite("winter_platform"),
            pos(p),
            scale(0.2),
            anchor("topleft"),
            area({
                shape: new Rect(
                    vec2(455, 455),
                    platformWidth + 150,
                    10
                ),
            }),
            body({ isStatic: true }),
            z(1),
        ]);
    }

// ----------------- ДВИЖУЩАЯСЯ ПЛАТФОРМА («лифт») ----------------------------
    const lift1 = add([
        sprite("winter_platform"),
        pos(720, 400),
        scale(0.2),
        anchor("topleft"),
        area({
            shape: new Rect(
                vec2(455, 455),
                platformWidth + 150,
                10
            ),
        }),
        body({ isStatic: true }),
        z(1),
        { dir: 1 },             // 1 => вправо, -1 => влево
        "movingLift",
    ]);
    lift1.onUpdate(() => {
        // скорость ~ 90 px/с, границы хода 580–980
        lift1.move(lift1.dir * 90, 0);
        if (lift1.pos.x < 720 || lift1.pos.x > 980) lift1.dir *= -1;
    });

    const lift2 = add([
        sprite("winter_platform"),
        pos(100, 250),
        scale(0.2),
        anchor("topleft"),
        area({
            shape: new Rect(
                vec2(455, 455),
                platformWidth + 150,
                10
            ),
        }),
        body({ isStatic: true }),
        z(1),
        { dir: 1 },             // 1 => вправо, -1 => влево
        "movingLift2",
    ]);
    const portal = add([
        sprite("portal", { frame: 1 }),
        pos(lift2.pos.add(vec2(70, -150))),   // сразу ставим поверх лифта
        scale(0.6),
        area(),
        "portal",
        z(1),
    ]);

// ---------- Движение лифта + подгон портала --------------------------------
    lift2.onUpdate(() => {
        // движение лифта
        lift2.move(lift2.dir * 90, 0);
        if (lift2.pos.x < 100 || lift2.pos.x > 300) lift2.dir *= -1;

        // «прикрепляем» портал к текущей позиции лифта
        portal.pos = lift2.pos.add(vec2(70, -150));
    });

// ---------- столкновение игрока с порталом ---------------------------------
    player.onCollide("portal", () => {
        if (chestCounter.opened >= chestCounter.total) {
            play("portal");
            go("spring");   // или "nextScene"  /  "winter"  и т.д.
         }// else {
        //     // короткое уведомление
        //     add([
        //         text("Find all chests first!", { size: 24 }),
        //         pos(player.pos.add(0, -60)),
        //         color(255, 0, 0),
        //         anchor("center"),
        //         lifespan(1.5),
        //         z(11),
        //     ]);
        // }
    });


    // === сундуки (winter) ===
    addChests([
        vec2(510 + 50, 540 - 80),   // на платформе vec2(510, 540)
        vec2(1250 + 50, 250 - 80),  // на платформе vec2(1250, 250)
        vec2(width() / 2, 750),     // «на земле» по центру экрана
    ],
    [
        "photo_winter_1",
        "photo_winter_3",
        "photo_winter_2",
    ],
    (chest) => {
        chestCounter.opened++;
        chestCounter.updateDisplay();

        const boxPos = vec2(chest.pos.x - 60, chest.pos.y - 110);
        const boxWidth = 300;
        const boxHeight = 50;

        // Проверка: не выходит ли бокс за пределы экрана
        if (
            boxPos.x >= 0 &&
            boxPos.x + boxWidth <= width() &&
            boxPos.y >= 0 &&
            boxPos.y + boxHeight <= height()
        ) {
            const box = add([
                rect(boxWidth, boxHeight, { radius: 16 }),
                pos(boxPos),
                color(255, 255, 255),
                z(3),
                lifespan(2),
            ]);

            add([
                text("You found a memory!", { size: 26 }),
                pos(boxPos.add(20, 12)),
                color(0, 0, 0),
                z(4),
                lifespan(2),
            ]);
        }
    });


    let walkTimer = 0;
    let walkFrame = 0;

    onUpdate(() => {
        if (isKeyDown("right")) {
            player.move(120, 0);
            player.scale.x = 0.9;

            walkTimer += dt();
            if (walkTimer > 0.2) {  // скорость чередования (в секундах)
                walkFrame = (walkFrame + 1) % 2;
                player.use(sprite(walkFrame === 0 ? "idle" : "walk"));
                walkTimer = 0;
            }

            player.isMoving = true;

        } else if (isKeyDown("left")) {
            player.move(-120, 0);
            player.scale.x = -0.9;

            walkTimer += dt();
            if (walkTimer > 0.2) {
                walkFrame = (walkFrame + 1) % 2;
                if (walkFrame === 0) {
                    player.use(sprite("idle"));
                } else {
                    player.use(sprite("walk", { width: 227, height: 397 }));
                }

                walkTimer = 0;
            }

            player.isMoving = true;

        } else {
            if (player.isMoving) {
                player.use(sprite("idle"));
                player.isMoving = false;
            }
        }
    });
    onKeyDown("up", () => player.isGrounded() && player.jump(1000));
});

// === spring scene ===
scene("spring", () => {
    add([sprite("background_spring"), pos(0, 0), z(0)]);

    add([
        rect(width(), 10),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        opacity(0),
    ]);

    const player = addPlayer();
    applyPlayerBoundaries(player);

    const chestCounter = addChestCounter(4);
    addResetButton(player);

    // "Go back" button
    add([
        rect(210, 50, { radius: 12 }),
        pos(250, 80),
        color(255, 255, 255),
        area(),
        z(9),
        "backButtonBg",
    ]);

    const backButton = add([
        text("Go Back", { size: 22, font: "sink" }),
        pos(350, 105),
        anchor("center"),
        color(0, 0, 0),
        area(),
        z(10),
        "backButton",
    ]);

    backButton.onClick(() => go("winter"));
    onClick("backButtonBg", () => go("winter"));

    // "Next level" button
    add([
        rect(210, 50, { radius: 12 }),
        pos(20, 80),
        color(255, 255, 255),
        area(),
        z(9),
        "nextButtonBg",
    ]);

    const nextButton = add([
        text("Next Level", { size: 22, font: "sink" }),
        pos(125, 105),
        anchor("center"),
        color(0, 0, 0),
        area(),
        z(10),
        "nextButton",
    ]);

    const nextLevelAction = () => go("final");
    nextButton.onClick(nextLevelAction);
    onClick("nextButtonBg", nextLevelAction);

    // ----- платформы -----
    const springPlatforms = [
        vec2(150, 750),
        vec2(650, 580),
        vec2(150, 200),
        vec2(1150, 150),
        vec2(1150, 750),
    ];

    const platformWidth = 1536 * 0.2;

    for (const p of springPlatforms) {
        add([
            sprite("spring_platform"),
            pos(p),
            scale(0.2),
            anchor("topleft"),
            area({
                shape: new Rect(vec2(455, 455), platformWidth + 150, 10),
            }),
            body({ isStatic: true }),
            z(1),
        ]);
    }

    // ----- вертикальный лифт 1 -----
    const vLift = add([
        sprite("spring_platform"),
        pos(400, 750),
        scale(0.2),
        anchor("topleft"),
        area({
            shape: new Rect(vec2(455, 455), platformWidth + 150, 10),
        }),
        body({ isStatic: true }),
        z(1),
        { dir: -1 },
    ]);

    // сундук, который движется вместе с vLift
    const liftChest = add([
        sprite("chest_closed"),
        pos(vLift.pos.add(vec2(50, -80))),
        scale(0.4),
        area({ scale: 0.5 }),
        z(1),
        "chest",
        { opened: false },
    ]);

    liftChest.onCollide("player", () => {
        if (liftChest.opened) return;
        liftChest.opened = true;
        liftChest.use(sprite("chest_open"));
        play("chestOpen");
        chestCounter.opened++;
        chestCounter.updateDisplay();

        // white box
        const box = add([
            rect(300, 50, { radius: 16 }),
            pos(liftChest.pos.x - 60, liftChest.pos.y - 110),
            color(255, 255, 255),
            z(3),
            lifespan(2),
        ]);
        // text
        add([
            text("You found a memory!", { size: 26 }),
            pos(box.pos.add(20, 12)),
            color(0, 0, 0),
            z(4),
            lifespan(2),
        ]);
        const photo = add([
            sprite("photo_spring_4"),
            pos(liftChest.pos.x + 15, liftChest.pos.y - 50),
            scale(0.2),
            z(5),
            move(DOWN, 40),
            opacity(1),
            "fadingPhoto",
        ]);
        onUpdate("fadingPhoto", () => {
            photo.opacity -= dt() / 2;
            if (photo.opacity <= 0) destroy(photo);
        });
    });

    vLift.onUpdate(function () {
        this.move(0, this.dir * 90);
        if (this.pos.y <= 300 && this.dir === -1) this.dir = 1;
        if (this.pos.y >= 750 && this.dir === 1) this.dir = -1;

        // синхронизируем сундук с лифтом
        liftChest.pos = this.pos.add(vec2(50, -80));
    });

    // ----- вертикальный лифт 2 -----
    const vLift2 = add([
        sprite("spring_platform"),
        pos(900, 580),
        scale(0.2),
        anchor("topleft"),
        area({
            shape: new Rect(vec2(455, 455), platformWidth + 150, 10),
        }),
        body({ isStatic: true }),
        z(1),
        { dir: -1 },
    ]);

    vLift2.onUpdate(function () {
        this.move(0, this.dir * 90);
        if (this.pos.y <= 200 && this.dir === -1) this.dir = 1;
        if (this.pos.y >= 750 && this.dir === 1) this.dir = -1;
    });

    // ----- три статичных сундука -----
    addChests([
        vec2(150 + 50, 200 - 80),
        vec2(650 + 50, 580 - 80),
        vec2(1150 + 50, 150 - 80),
    ],
    [
        "photo_spring_1",
        "photo_spring_2",
        "photo_spring_3",
        // "photo_spring_4",
    ],
    (chest) => {
        chestCounter.opened++;
        chestCounter.updateDisplay();

        const boxPos = vec2(chest.pos.x - 60, chest.pos.y - 110);
        const boxWidth = 300;
        const boxHeight = 50;

        // Проверка: не выходит ли бокс за пределы экрана
        if (
            boxPos.x >= 0 &&
            boxPos.x + boxWidth <= width() &&
            boxPos.y >= 0 &&
            boxPos.y + boxHeight <= height()
        ) {
            const box = add([
                rect(boxWidth, boxHeight, { radius: 16 }),
                pos(boxPos),
                color(255, 255, 255),
                z(3),
                lifespan(2),
            ]);

            add([
                text("You found a memory!", { size: 26 }),
                pos(boxPos.add(20, 12)),
                color(0, 0, 0),
                z(4),
                lifespan(2),
            ]);
        }
    });

    // --- портал на платформе vec2(1150, 150) ---
    const springPortal = add([
        sprite("portal", { frame: 1 }),
        pos(vec2(1150, 750).add(vec2(70, -150))), // чуть выше центра плитки
        scale(0.6),
        area(),
        "portal",
        z(1),
    ]);

    player.onCollide("portal", () => {
        if (chestCounter.opened >= chestCounter.total)
        {
            play("portal");
            go("final");
        }
    });


    // ----- управление -----
    let walkTimer = 0;
    let walkFrame = 0;

    onUpdate(() => {
        if (isKeyDown("right")) {
            player.move(120, 0);
            player.scale.x = 0.9;

            walkTimer += dt();
            if (walkTimer > 0.2) {  // скорость чередования (в секундах)
                walkFrame = (walkFrame + 1) % 2;
                player.use(sprite(walkFrame === 0 ? "idle" : "walk"));
                walkTimer = 0;
            }

            player.isMoving = true;

        } else if (isKeyDown("left")) {
            player.move(-120, 0);
            player.scale.x = -0.9;

            walkTimer += dt();
            if (walkTimer > 0.2) {
                walkFrame = (walkFrame + 1) % 2;
                if (walkFrame === 0) {
                    player.use(sprite("idle"));
                } else {
                    player.use(sprite("walk", { width: 227, height: 397 }));
                }

                walkTimer = 0;
            }

            player.isMoving = true;

        } else {
            if (player.isMoving) {
                player.use(sprite("idle"));
                player.isMoving = false;
            }
        }
    });
    onKeyDown("up", () => player.isGrounded() && player.jump(1000));
});

// === final ===
scene("final", () => {
    const music = play("final", {
        loop: true,
    });
    onSceneLeave(() => {
        music.stop();
    });
    const bg = add([sprite("background_final"), pos(0, 0), z(0), "finalBg"]);

    setGravity(0);                       // без гравитации

    const player = addPlayer();
    player.pos = vec2(150, 1100);        // старт

    // параметры дорожки
    const x0 = 100;
    const y0 = 1040;
    const slope = -0.3;

    // масштаб: 1  →  0.6 по мере подъёма
    const minScale = 1;
    const maxScale = 0.6;

    const endX = 1000;                   // координата "входа в дом"
    let doorOpened = false;
    let fading = false;
    let controlsLocked = false;

    // чёрный фейд-оверлей, изначально прозрачный
    const fadeOverlay = add([
        rect(width(), height()),
        pos(0, 0),
        color(0, 0, 0),
        z(10),
        opacity(0),
        "fadeOverlay",
    ]);

    player.onUpdate(() => {
        // «клеим» к линии
        player.pos.y = y0 + slope * (player.pos.x - x0);

        // масштаб
        const endY = y0 + slope * (endX - x0);
        const t = clamp((y0 - player.pos.y) / (y0 - endY), 0, 1);
        const s = minScale + t * (maxScale - minScale);
        const dir = Math.sign(player.scale.x) || 1; // сохранить направление (1 или -1)
        player.scale = vec2(s * dir, s);

        // затемнение экрана
        if (fading) {
            fadeOverlay.opacity += dt() * 0.5;
            if (fadeOverlay.opacity >= 1) {
                go("win");
            }
        }

        // вход в дом
        if (!doorOpened && player.pos.x >= endX) {
            doorOpened = true;
            controlsLocked = true;
            bg.use(sprite("background_final_open"));
            fading = true;
        }
    });

    let walkTimer = 0;
    let walkFrame = 0;

    onUpdate(() => {
        if (isKeyDown("right")) {
            if(!controlsLocked) {
                player.move(140, 0);
                player.scale.x = 0.9;
            }

            walkTimer += dt();
            if (walkTimer > 0.2) {  // скорость чередования (в секундах)
                walkFrame = (walkFrame + 1) % 2;
                player.use(sprite(walkFrame === 0 ? "idle" : "walk"));
                walkTimer = 0;
            }

            player.isMoving = true;

        } else if (isKeyDown("left")) {
            if(!controlsLocked) {
                player.move(-140, 0);
                player.scale.x = -0.9;
            }


            walkTimer += dt();
            if (walkTimer > 0.2) {
                walkFrame = (walkFrame + 1) % 2;
                if (walkFrame === 0) {
                    player.use(sprite("idle"));
                } else {
                    player.use(sprite("walk", { width: 227, height: 397 }));
                }

                walkTimer = 0;
            }

            player.isMoving = true;

        } else {
            if (player.isMoving) {
                player.use(sprite("idle"));
                player.isMoving = false;
            }
        }
    });

});

// Win Scene
scene("win", () => {
    play("win");
    // Цвет фона — тёплый бежевый (можешь заменить на 'black' если хочешь)
    // setBackground(Color.fromHex("#f4e0c8"));
    setBackground(Color.fromHex("#000000"));
    // play("win");


    // Затемнение при входе
    const overlay = add([
        rect(width(), height()),
        pos(0, 0),
        color(0, 0, 0),
        opacity(1),
        z(100),
        "fade"
    ]);

    // Плавное исчезновение затемнения
    tween(1, 0, 1, (val) => overlay.opacity = val).then(() => destroy(overlay));

    // Настройки текста
    const mainLine1 = "✨ Congratulations! ✨";
    const mainLine2 = "You won the game";
    const subLine = "and the life (◕‿◕)♡";

    const sizeMain = 50;
    const sizeSub = 38;
    const centerX = center().x;

    let i = 0;
    let text1 = "", text2 = "", text3 = "";

    const label1 = add([
        text("", { size: sizeMain, font: "sink" }),
        pos(centerX, height() / 2 - 60),
        anchor("center"),
        z(1),
    ]);

    const label2 = add([
        text("", { size: sizeMain, font: "sink" }),
        pos(centerX, height() / 2 + 45),
        anchor("center"),
        z(1),
    ]);

    const label3 = add([
        text("", { size: sizeSub, font: "sink" }),
        pos(centerX, height() / 2 + 110),
        anchor("center"),
        z(1),
    ]);

    const fullText = mainLine1 + "\n" + mainLine2 + "\n" + subLine;

    loop(0.07, () => {
        if (i < mainLine1.length) {
            text1 += mainLine1[i];
            label1.text = text1;
        } else if (i < mainLine1.length + mainLine2.length) {
            text2 += mainLine2[i - mainLine1.length];
            label2.text = text2;
        } else if (i < mainLine1.length + mainLine2.length + subLine.length) {
            text3 += subLine[i - mainLine1.length - mainLine2.length];
            label3.text = text3;
        } else {
            wait(1.5, () => {
                const blackout = add([
                    rect(width(), height()),
                    pos(0, 0),
                    color(0, 0, 0),
                    opacity(0),
                    z(100),
                ]);
                tween(0, 1, 1, (val) => blackout.opacity = val).then(() => {
                    go("finalImage");
                });
            });
            return;
        }
        i++;
    });
});

// Финальная сцена с изображением
scene("finalImage", () => {
    setBackground(Color.fromHex("#000000")); // или "#f4e0c8" — как хочешь

    add([
        sprite("win-image"),
        pos(center()),
        anchor("center"),
        z(0),
        scale(1),
    ]);

    // "Restart game" button
    add([
        rect(210, 50, { radius: 12 }),
        pos(20, 20),
        color(255, 255, 255),
        area(),
        z(9),
        "restartButtonBg",
    ]);

    const restartButton = add([
        text("Restart Game", { size: 22, font: "sink" }),
        pos(125, 45),
        anchor("center"),
        color(0, 0, 0),
        area(),
        z(10),
        "restartButton",
    ]);

    const restartAction = () => location.reload();
    restartButton.onClick(restartAction);
    onClick("restartButtonBg", restartAction);
});


// Start game
go("summer");
