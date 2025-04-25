// ゲームの時間制限を設定
const timeLimit = 2; // タイムリミット：2秒
let gameEnded = false; // ゲーム終了フラグ（ゲームが終了したかどうかを管理）

// DOMが完全に読み込まれた後に実行される処理
window.addEventListener("DOMContentLoaded", () => {
    // 各要素の取得
    const sarubobo = document.getElementById('sarubobo'); // さるぼぼ画像
    const goal = document.getElementById('goal'); // ゴール画像
    const timer = document.getElementById('timer'); // タイマー表示
    const message = document.getElementById('message'); // メッセージ表示

    // さるぼぼの画像ファイルのパス
    const saruboboStanding = "img/押しぼぼ前.png"; // 立っている状態の画像
    const saruboboWalking = "img/押しぼぼ前左.png"; // 歩いている状態の画像

    // さるぼぼの初期位置（X座標、Y座標）
    let posX = 400;
    let posY = 350;
    const speed = 13; // さるぼぼの移動速度
    let isWalking = false; // 歩いているかどうかのフラグ
    let direction = 1; // 向き（1: 右向き、-1: 左向き）
    
    // キーの状態を保持するオブジェクト
    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
    };

    // キーダウンイベントリスナー（キーを押した時にキー状態を更新）
    window.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = true;
            e.preventDefault(); // ページのスクロールを防ぐ
        }
    });

    // キーアップイベントリスナー（キーを離した時にキー状態を更新）
    window.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = false;
            e.preventDefault(); // ページのスクロールを防ぐ
        }
    });

    // ゲームの開始時刻
    const startTime = Date.now();
    let animationCounter = 0; // アニメーションのカウンター

    // ゲームループ関数（毎フレーム実行される処理）
    function gameLoop() {
        if (gameEnded) return; // ゲーム終了時はループを終了

        let moved = false; // さるぼぼが移動したかどうかのフラグ

        // 上下左右の移動処理
        if (keys.ArrowUp && posY > 0) {
            posY -= speed; // 上に移動
            moved = true;
        }
        if (keys.ArrowDown && posY < 640) {
            posY += speed; // 下に移動
            moved = true;
        }
        if (keys.ArrowLeft && posX > 0) {
            posX -= speed; // 左に移動
            direction = -1; // 左向きに変更
            moved = true;
        }
        if (keys.ArrowRight && posX < 840) {
            posX += speed; // 右に移動
            direction = 1; // 右向きに変更
            moved = true;
        }

        // アニメーションの切り替え処理（歩いているかどうかを切り替え）
        animationCounter++;
        if (animationCounter % 10 === 0) {
            isWalking = !isWalking; // 10フレームごとに歩いているかどうかを切り替え
            sarubobo.src = isWalking ? saruboboWalking : saruboboStanding; // 画像を切り替え
        }

        // 移動した場合はさるぼぼの向きを更新
        if (moved) {
            sarubobo.style.transform = `scaleX(${direction})`; // 左右反転
        }

        // さるぼぼの位置を更新
        sarubobo.style.top = posY + 'px';
        sarubobo.style.left = posX + 'px';

        // さるぼぼとゴールの位置を取得
        const saruRect = sarubobo.getBoundingClientRect();
        const goalRect = goal.getBoundingClientRect();

        // ゴール判定（さるぼぼがゴールに到達した場合）
        if (
            saruRect.left < goalRect.right &&
            saruRect.right > goalRect.left &&
            saruRect.top < goalRect.bottom &&
            saruRect.bottom > goalRect.top
        ) {
            endGame(true); // ゴール成功
            return;
        }

        // 次のフレームをリクエスト
        requestAnimationFrame(gameLoop);
    }

    // タイマーを更新する関数
    function updateTimer() {
        if (gameEnded) return; // ゲーム終了時はタイマーを更新しない

        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000); // 経過時間（秒）
        const remaining = timeLimit - elapsed; // 残り時間

        timer.textContent = `残り時間: ${remaining}秒`; // タイマー表示を更新

        if (remaining <= 0) {
            endGame(false); // 時間切れ
        } else {
            requestAnimationFrame(updateTimer); // 次のフレームでタイマーを更新
        }
    }

    // ゲーム終了処理
    function endGame(success) {
        gameEnded = true; // ゲーム終了フラグを設定
        if (success) {
            message.textContent = "ともだちを見つけられたね！"; // ゴール成功メッセージ
        } else {
            message.textContent = "ともだち見つかった？"; // 時間切れメッセージ
        }
    }

    // タイマーとゲームループを開始
    updateTimer();
    gameLoop();
});
