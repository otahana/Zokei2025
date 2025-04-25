// さるぼぼの画像のURL
// 実際のゲームでは、ここに実際の画像URLを設定してください
const saruboboStanding = "img/押しぼぼ前.png"; // 立ち姿の画像
const saruboboWalking = "img/押しぼぼ前左.png";  // 歩いている姿の画像

// さるぼぼの要素
const sarubobo = document.getElementById('sarubobo');

// 現在の位置
let posX = 260;
let posY = 160;

// 移動速度
const speed = 5;

// アニメーションフラグ
let isWalking = false;

// 向き（1: 右向き、-1: 左向き）
let direction = 1;

// キーの状態
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// キーダウンイベントリスナー
window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
        e.preventDefault(); // ページのスクロールを防止
    }
});

// キーアップイベントリスナー
window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
        e.preventDefault(); // ページのスクロールを防止
    }
});

// アニメーションカウンター
let animationCounter = 0;

// ゲームループ
function gameLoop() {
    let moved = false;
    
    // 上下左右の移動
    if (keys.ArrowUp && posY > 0) {
        posY -= speed;
        moved = true;
    }
    if (keys.ArrowDown && posY < 320) {
        posY += speed;
        moved = true;
    }
    if (keys.ArrowLeft && posX > 0) {
        posX -= speed;
        direction = -1;
        moved = true;
    }
    if (keys.ArrowRight && posX < 520) {
        posX += speed;
        direction = 1;
        moved = true;
    }
    
    // アニメーションカウンターを更新
    animationCounter++;
    
    // 10フレームごとにアニメーションを切り替え（移動中でも停止中でも）
    if (animationCounter % 10 === 0) {
        isWalking = !isWalking;
        sarubobo.src = isWalking ? saruboboWalking : saruboboStanding;
    }
    
    // 移動中は向きを更新
    if (moved) {
        sarubobo.style.transform = `scaleX(${direction})`;
    }
    
    // 位置を更新
    sarubobo.style.top = posY + 'px';
    sarubobo.style.left = posX + 'px';
    
    // 次のフレームをリクエスト
    requestAnimationFrame(gameLoop);
}
// ゲーム開始
gameLoop();
