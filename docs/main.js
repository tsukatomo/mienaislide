// phina.jsをグローバル領域に展開
phina.globalize();

//const SCREEN_WIDTH = 960;
//const SCREEN_HEIGHT = 600;

const MYSCENES = [
    {
        className: 'Title',
        label: 'title',
        nextLabel: 'game'
    },
    {
        className: 'Game',
        label: 'game',
        nextLabel: 'title'
    },
];

const FONT_FAMILY = "'Monaco', 'MS ゴシック' ";

const PIECE_SIZE = 128;

const MAX_TIME = 999000;
const MAX_MOVE = 9999;
const MAX_CHEAT = 9999;


//-------------
// Title scene
//-------------
phina.define('Title',{
    superClass: 'DisplayScene',
    init: function(){
        this.superInit({
            //width: SCREEN_WIDTH,
            //height: SCREEN_HEIGHT
        });
        this.backgroundColor = 'yellowgreen'
        let isDarkSide = false;
        let self = this;
        // タイトル
        let titleLabel = Label({
            text: "見えない\nスライドパズル",
            fill: 'white',
            stroke: 'darkslateblue',
            strokeWidth: 12,
            fontSize: 72,
            fontFamily: FONT_FAMILY
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-2));
        titleLabel.tweener
            .moveBy(0, -48, 2000, 'easeInOutCubic')
            .moveBy(0,  48, 2000, 'easeInOutCubic')
            .setLoop(true)
            .play();
        // 遊び方ボタン
        let howToButton = RectangleShape({
            width: (PIECE_SIZE - 16) * 2,
            height: 72,
            fill: 'slateblue',
            stroke: 'darkslateblue',
            strokeWidth: 12,
            cornerRadius: 10
        }).addChildTo(this);
        howToButton.setInteractive(true);
        howToButton.onpointstart = function() {
            self.app.pushScene(HowToPlay());
        };
        Label({
            text: "遊び方",
            fill: 'white',
            fontSize: 32,
            fontFamily: FONT_FAMILY
        }).addChildTo(howToButton);
        // ウラボタン(onpointstartは下部に記載)
        let darkSideButton = RectangleShape({
            width: (PIECE_SIZE - 16) * 2,
            height: 72,
            fill: 'brown',
            stroke: 'darkred',
            strokeWidth: 12,
            cornerRadius: 10
        }).addChildTo(this);
        darkSideButton.setInteractive(true);
        let darkSideLabel = Label({
            text: "裏へ",
            fill: 'white',
            fontSize: 32,
            fontFamily: FONT_FAMILY
        }).addChildTo(darkSideButton);
        // スタートボタン(8)
        let start8Button = RectangleShape({
            width: (PIECE_SIZE - 16) * 2,
            height: 96,
            fill: 'darkorange',
            stroke: 'chocolate',
            strokeWidth: 12,
            cornerRadius: 10
        }).addChildTo(this);
        start8Button.setInteractive(true);
        start8Button.onpointstart = function() {
            self.exit({ puzzleSize: 3, isDarkSide: isDarkSide });
        };
        let start8Label = Label({
            text: "８パズル",
            fill: 'white',
            fontSize: 32,
            fontFamily: FONT_FAMILY
        }).addChildTo(start8Button);
        // スタートボタン(15)
        let start15Button = RectangleShape({
            width: (PIECE_SIZE - 16) * 2,
            height: 96,
            fill: 'darkorange',
            stroke: 'chocolate',
            strokeWidth: 12,
            cornerRadius: 10
        }).addChildTo(this);
        start15Button.setInteractive(true);
        start15Button.onpointstart = function() {
            self.exit({ puzzleSize: 4, isDarkSide: isDarkSide });
        };
        let start15Label = Label({
            text: "１５パズル",
            fill: 'white',
            fontSize: 32,
            fontFamily: FONT_FAMILY
        }).addChildTo(start15Button);
        // わんど様作・Dualバージョンへの移行ボタン
        let dualButton = RectangleShape({
            width: (PIECE_SIZE - 16) * 3,
            height: 48,
            fill: '#0C3310',
            stroke: 'black',
            strokeWidth: 12,
            cornerRadius: 10
        }).addChildTo(this);
        dualButton.setInteractive(true);
        dualButton.onpointstart = function() {
            window.location.href = "https://wand125.github.io/mienaislide/?v=2"
        };
        Label({
            text: "→ Dualへ（作・わんど様）",
            fill: 'white',
            fontSize: 24,
            fontFamily: FONT_FAMILY
        }).addChildTo(dualButton);
        // ウラボタンを押したときの反応
        darkSideButton.onpointstart = function() {
            if (!isDarkSide) {
                start8Label.text = "裏８";
                start15Label.text = "裏１５";
                darkSideLabel.text = "表へ";
                start8Button.fill = 'brown';
                start15Button.fill = 'brown';
                start8Button.stroke = 'darkred';
                start15Button.stroke = 'darkred';
                darkSideButton.fill = 'darkorange';
                darkSideButton.stroke = 'chocolate';
                self.backgroundColor = 'plum';
            }
            else {
                start8Label.text = "８パズル";
                start15Label.text = "１５パズル";
                darkSideLabel.text = "裏へ";
                start8Button.fill = 'darkorange';
                start15Button.fill = 'darkorange';
                start8Button.stroke = 'chocolate';
                start15Button.stroke = 'chocolate';
                darkSideButton.fill = 'brown';
                darkSideButton.stroke = 'darkred';
                self.backgroundColor = 'yellowgreen';
            }
            isDarkSide = !isDarkSide;
            darkSideButton.tweener
                .scaleTo(0.90, 50)
                .scaleTo(1.00, 50)
                .play();
        };
        // ボタン配置
        start8Button.setPosition(this.gridX.center(-4), this.gridY.center(3));
        start15Button.setPosition(this.gridX.center(4), this.gridY.center(3));
        howToButton.setPosition(this.gridX.center(-4), this.gridY.center(6));
        darkSideButton.setPosition(this.gridX.center(4), this.gridY.center(6));
        dualButton.setPosition(this.gridX.center(3), this.gridY.center(-7));        
    },
    update: function(app){
        /*
        var key = app.keyboard;
        if (key.getKeyDown('space')){
            this.exit();
        }
        */
    }
});

//-------------
// HowTo scene
//-------------
phina.define('HowToPlay',{
    superClass: 'DisplayScene',
    init: function(){
        this.superInit({
            //width: SCREEN_WIDTH,
            //height: SCREEN_HEIGHT
        });
        this.backgroundColor = 'rgba(0, 0, 0, 0.9)'
        let self = this;
        // 遊び方
        Label({
            text: "●遊び方●\n\n\nスライドパズルを完成させましょう。\n\nただし、ピースを動かした瞬間に\n書かれている数字が全て見えなくなります。\n\n最初の配置をよく覚えてから動かしましょう。\n\n数字を確認できるボタンもありますが、\nできるだけ使わずに解いてみましょう。\n\n\n\n●裏モード●\n\n\n数字を確認するボタンはありません。\n\nピース配置を記憶する時間も計測されます。",
            fill: 'white',
            fontSize: 24,
            fontFamily: FONT_FAMILY
        }).addChildTo(this).setPosition(this.gridX.center(0), this.gridY.center(-2));
        // 戻るボタン
        let backButton = RectangleShape({
            width: (PIECE_SIZE - 16) * 2,
            height: 72,
            fill: 'slateblue',
            stroke: 'darkslateblue',
            strokeWidth: 12,
            cornerRadius: 10
        }).addChildTo(this).setPosition(this.gridX.center(-4), this.gridY.center(6));
        backButton.setInteractive(true);
        backButton.onpointstart = function() {
            self.exit();
        };
        Label({
            text: "戻る",
            fill: 'white',
            fontSize: 32,
            fontFamily: FONT_FAMILY
        }).addChildTo(backButton);
    },
    update: function(app){
        /*
        var key = app.keyboard;
        if (key.getKeyDown('space')){
            this.exit();
        }
        */
    }
});

//-------------
// Game scene
//-------------
phina.define('Game',{
    superClass: 'DisplayScene',
    init: function(param){
        this.superInit({
            //width: SCREEN_WIDTH,
            //height: SCREEN_HEIGHT
        });
        // オモテウラ情報を前シーンから受け取る
        let isDarkSide = param.isDarkSide;
        // 背景色
        this.backgroundColor = isDarkSide ? 'plum' : 'yellowgreen';
        // this退避
        let self = this;
        // パズルサイズを前シーンから受け取る
        let puzzleSize = param.puzzleSize;
        // ピース配置の配列
        let piecePos = Array(puzzleSize * puzzleSize);
        // 変数
        let moves = 0; // 手数
        let time = 0;  // 経過時間
        let lookTime = 0; // ピースを見ている時間（ウラ限定）
        let cheating = 0; // カンニング回数
        let isTimeCounting = false; // タイム計測中か否か
        let isLookTimeCounting = false; // 記憶時間の計測中か否か
        let isCheating = false; // カンニング中か否か
        // sprites
        let piece = Array(puzzleSize * puzzleSize - 1);
        let numLabel = Array(puzzleSize * puzzleSize - 1);
        let cheatingButton;
        let quitButton;
        // ピース配置グリッド
        let pieceGridX = Grid({
            width: puzzleSize * PIECE_SIZE,
            columns: puzzleSize,
            offset: self.gridX.center() - (puzzleSize * PIECE_SIZE) / 2 + (PIECE_SIZE) / 2
        }); 
        let pieceGridY = Grid({
            width: puzzleSize * PIECE_SIZE,
            columns: puzzleSize,
            offset: self.gridY.center() - (puzzleSize * PIECE_SIZE) / 2 + (PIECE_SIZE) / 2
        });
        // -------------------------------- function --------------------------------------//
        // ピース位置をシャッフルする
        let shufflePiece = function() {
            for (let i = 0; i < piecePos.length; i++) {
                let j = Random.randint(i, piecePos.length - 1);
                [piecePos[i], piecePos[j]] = [piecePos[j], piecePos[i]];
            }
        };
        // パリティチェックを行い，解答不能なら修正する
        let parityCheckAndModify = function(puzzleSize) {
            let numSwap = 0;
            let distBlank;
            // ピース配置をコピー
            let copy = piecePos.concat();
            // ソートを行い，入れ替え回数を計算する … numSwap
            for (let i = 0; i < copy.length; i++) {
                if (copy[i] != i) {
                    let j = copy.indexOf(i);
                    [copy[i], copy[j]] = [copy[j], copy[i]];
                    numSwap++;
                }
            }
            //console.log("numSwap = ", numSwap);
            // 空白マス（ピース配置配列の中で値が最大の要素）が右下から何マス離れているかを数える … distBlank
            let distX = (puzzleSize - 1) - piecePos.indexOf(puzzleSize * puzzleSize - 1) % puzzleSize;
            let distY = (puzzleSize - 1) - Math.floor(piecePos.indexOf(puzzleSize * puzzleSize - 1) / puzzleSize);
            distBlank = distX + distY;
            //console.log("distBlank = ", distBlank);
            // numSwap と distBlank の偶奇が一致するなら解答可能．修正せずに終了
            if ((numSwap + distBlank) % 2 === 0) return;
            // 解答不可能なら"1"と"2"の位置を交換
            let index1 = piecePos.indexOf(1);
            let index2 = piecePos.indexOf(2);
            [piecePos[index1], piecePos[index2]] = [piecePos[index2], piecePos[index1]];
            return;
        };
        // ピース位置を示す数値からピーズの座標を求める
        let getPositionByNumber = function(puzzleSize, num) {
            return {
                x: pieceGridX.span(num % puzzleSize),
                y: pieceGridY.span(Math.floor(num / puzzleSize)),
            };
        };
        // ピースをスライドする
        let slide = function(puzzleSize, num) {
            let blankIndex = piecePos.indexOf(puzzleSize * puzzleSize - 1);
            let pieceIndex = piecePos.indexOf(num);
            //console.log(blankIndex, pieceIndex);
            // 横移動
            if (Math.floor(blankIndex / puzzleSize) === Math.floor(pieceIndex / puzzleSize)) {
                // 左へ
                if (blankIndex < pieceIndex) {
                    for (let i = blankIndex; i < pieceIndex; i++) {
                        [piecePos[i], piecePos[i+1]] = [piecePos[i+1], piecePos[i]];
                        if (moves < MAX_MOVE) moves++;
                    }
                }
                // 右へ
                else {
                    for (let i = blankIndex; i > pieceIndex; i--) {
                        [piecePos[i], piecePos[i-1]] = [piecePos[i-1], piecePos[i]];
                        if (moves < MAX_MOVE) moves++;
                    }
                }
                return true;
            }
            // 縦移動
            else if ((blankIndex % puzzleSize) === (pieceIndex % puzzleSize)) {
                // 上へ
                if (blankIndex < pieceIndex) {
                    for (let i = blankIndex; i < pieceIndex; i+= puzzleSize) {
                        [piecePos[i], piecePos[i+puzzleSize]] = [piecePos[i+puzzleSize], piecePos[i]];
                        if (moves < MAX_MOVE) moves++;
                    }
                }
                // 下へ
                else {
                    for (let i = blankIndex; i > pieceIndex; i-= puzzleSize) {
                        [piecePos[i], piecePos[i-puzzleSize]] = [piecePos[i-puzzleSize], piecePos[i]];
                        if (moves < MAX_MOVE) moves++;
                    }
                }
                return true;
            }
            return false;
        };
        // ピースが揃っているかどうかチェック
        let clearCheck = function() {
            for (let i = 0; i < piecePos.length - 1; i++) {
                if (piecePos[i] != i) return false;
            }
            // 数字を表示
            showNum();
            // ピースを移動不能にして，色を変更
            setPieceInteractive(false);
            for (let i = 0; i < piece.length; i++){
                piece[i].fill = "darkorange";
                piece[i].stroke = "chocolate";
            }
            // カンニングボタンを使用不能にし，下げる
            cheatingButton.setInteractive(false);
            cheatingButton.tweener
                .moveBy(0, 999, 400)
                .play();
            // ギブアップボタンを使用不能に
            giveUpButton.setInteractive(false);
            // 時間計測を停止
            isTimeCounting = false;
            isLookTimeCounting = false;
            // おめでとうラベル
            let cong = Label({
                text: "Congratulations!!",
                fill: 'white',
                stroke: 'darkslateblue',
                fontSize: 48,
                strokeWidth: 12,
                fontFamily: FONT_FAMILY,
            }).addChildTo(self).setPosition(self.gridX.center(), self.gridY.center());
            // 見た回数が０なら特別な表示に変更
            if (cheating === 0) {
                cong.text = "PERFECT!!!";
                cong.stroke = 'darkred';
            }
            cong.tweener
                .set({alpha: 0.0})
                .wait(500)
                .set({alpha: 1.0})
                .wait(50)
                .set({alpha: 0.0})
                .wait(50)
                .set({alpha: 1.0})
                .wait(300)
                .moveTo(self.gridX.center(), self.gridY.center(-4), 600, 'easeOutCubic')
                .play();
            // ツイートボタンとタイトルに戻るボタンを表示
            tweetButton.tweener
                .wait(1000)
                .moveTo(self.gridX.center(-4), self.gridY.center(6), 1000, 'easeOutCubic')
                .call(() => { tweetButton.setInteractive(true); })
                .play();
            titleButton.tweener
                .wait(1000)
                .moveTo(self.gridX.center(4), self.gridY.center(6), 1000, 'easeOutCubic')
                .call(() => { titleButton.setInteractive(true); })
                .play();
            return true;
        };
        // ギブアップ処理
        let giveUp = function() {
            // 数字を表示
            showNum();
            // ピースを移動不能にして，色を変更
            setPieceInteractive(false);
            // カンニングボタンを使用不能にし，下げる
            cheatingButton.setInteractive(false);
            cheatingButton.tweener
                .moveBy(0, 999, 400)
                .play();
            // 時間計測を停止
            isTimeCounting = false;
            isLookTimeCounting = false;
            // 失敗ラベル
            let fail = Label({
                text: "Failed...",
                fill: 'white',
                stroke: '#333333',
                fontSize: 48,
                strokeWidth: 12,
                fontFamily: FONT_FAMILY,
            }).addChildTo(self).setPosition(self.gridX.center(), self.gridY.center(-16));
            fail.tweener
                .moveTo(self.gridX.center(), self.gridY.center(-4), 1000, 'easeOutBounce')
                .play();
            // タイトルへ戻るボタンを表示
            titleButton.tweener
                .wait(1000)
                .set({x: self.gridX.center(0)})
                .moveTo(self.gridX.center(0), self.gridY.center(6), 1000, 'easeOutCubic')
                .call(() => { titleButton.setInteractive(true); })
                .play();
            return true;
        };
        // ピースの数字を”？”にする
        let hideNum = function() {
            for (let i = 0; i < numLabel.length; i++) {
                numLabel[i].text = "?";
            }
            return;
        };
        // ピースの数字を表示する
        let showNum = function() {
            for (let i = 0; i < numLabel.length; i++) {
                numLabel[i].text = i + 1;
            }
            return;
        };
        // ピースのクリックイベントのオンオフを切り替え
        let setPieceInteractive = function(bool) {
            for (let i = 0; i < piece.length; i++) {
                piece[i].setInteractive(bool);
            }
            return;
        }
        // ツイート文,URLを生成
        let makeTweet = function() {
            let text;
            if (!isDarkSide) {
                text = (cheating === 0) ? "一度も数字を見ずに" : cheating + "回数字を見て";
            }
            else {
                text = "裏モードで";
            }
            text += (puzzleSize === 3) ? "8" : "15";
            text += "パズルをクリア！\n"
            if (isDarkSide) {
                text += "記憶時間：" + (Math.floor(lookTime / 10) / 100).toFixed(2) + "秒\n";
            }
            text += "クリアタイム：" + (Math.floor(time / 10) / 100).toFixed(2) + "秒\n";
            text += "手数：" + moves;
            let url = phina.social.Twitter.createURL({
                text: text,
                hashtags: '見えないスライドパズル'
            });
            return url;
        };
        // ------------------------------------------------------------------------------------//
        // ピース配置の配列を初期化
        for (let i = 0; i < piecePos.length; i++) {
            piecePos[i] = i;
        }
        // シャッフル
        shufflePiece();
        //console.log(piecePos);
        // パリティチェック
        parityCheckAndModify(puzzleSize);
        //console.log(piecePos);
        // スプライトの設定
        for (let i = 0; i < piece.length; i++){
            piece[i] = RectangleShape({
                width: PIECE_SIZE - 16,
                height: PIECE_SIZE - 16,
                fill: 'slateblue',
                stroke: 'darkslateblue',
                strokeWidth: 12,
                //cornerRadius: 10
            }).addChildTo(this).setPosition(0,0);
            piece[i].x = getPositionByNumber(puzzleSize, piecePos.indexOf(i)).x;
            piece[i].y = getPositionByNumber(puzzleSize, piecePos.indexOf(i)).y;
            piece[i].setInteractive(!isDarkSide); // ウラモードのときはカウントが終わるまで移動不可にする
            // クリックイベント
            piece[i].onpointstart = function() {
                // ピースをスライド（スライド失敗ならreturn）
                if (!slide(puzzleSize, i)) return;
                //console.log(piecePos);
                //　数字を隠す
                hideNum();
                isCheating = false;
                cheatingLabel.fill = 'white';
                // 記憶時間計測終了，時間計測開始
                isLookTimeCounting = false;
                isTimeCounting = true;
                // ピースの位置を更新
                for (let j = 0; j < piece.length; j++) {
                    let moveToX = getPositionByNumber(puzzleSize, piecePos.indexOf(j)).x;
                    let moveToY = getPositionByNumber(puzzleSize, piecePos.indexOf(j)).y;
                    //piece[j].x = getPositionByNumber(3, piecePos.indexOf(j), self).x;
                    //piece[j].y = getPositionByNumber(3, piecePos.indexOf(j), self).y;
                    piece[j].tweener
                        .call(()=>{
                            // クリック不可に
                            setPieceInteractive(false);
                            cheatingButton.setInteractive(false);
                        })
                        .moveTo(moveToX, moveToY, 100, 'easeInOutCubic') // 移動アニメーション
                        .call(()=>{
                            // 再びクリック可能に
                            setPieceInteractive(true);
                            cheatingButton.setInteractive(!isDarkSide); // ウラモード時はクリック不可
                        })
                        .call(()=>{ clearCheck(); }) // 成功判定
                        .play();
                }
            }
            numLabel[i] = Label({
                text: (isDarkSide) ? "?" : i + 1,
                fill: 'white',
                fontSize: 48,
                fontFamily: FONT_FAMILY 
            }).addChildTo(piece[i]);
        }
        // カンニングボタン
        cheatingButton = RectangleShape({
            width: (PIECE_SIZE - 16) * 4,
            height: PIECE_SIZE - 16,
            fill: 'brown',
            stroke: 'darkred',
            strokeWidth: 12,
            cornerRadius: 10
        }).addChildTo(this)
        cheatingButton.setPosition(this.gridX.center(), isDarkSide ? 9999 : this.gridY.center(6));
        let cheatingLabel = Label({
            text: "数字を見る",
            fill: 'gray',
            fontSize: 36,
            fontFamily: FONT_FAMILY
        }).addChildTo(cheatingButton);
        cheatingButton.setInteractive(false);
        cheatingButton.onpointstart = function() {
            if (isCheating) {
                hideNum();
                isCheating = false;
            }
            else{
                if (cheating < MAX_CHEAT) cheating++;
                showNum();
                isCheating = true;
            }
            cheatingButton.tweener
                .scaleTo(0.90, 50)
                .scaleTo(1.00, 50)
                .play();
        }
        // 中断してタイトルに戻るボタン
        quitButton = RectangleShape({
            width: 48,
            height: 48,
            fill: 'brown',
            stroke: 'darkred',
            strokeWidth: 12,
        }).addChildTo(this).setPosition(48, 48);
        quitButton.setInteractive(true);
        quitButton.onpointstart = function() {
            self.exit();
        }
        Label({
            text: "←",
            fill: 'white',
            fontSize: 24,
            fontFamily: FONT_FAMILY
        }).addChildTo(quitButton);
        // ギブアップボタン
        giveUpButton = RectangleShape({
            width: 144,
            height: 48,
            fill: '#505050',
            stroke: '#333333',
            strokeWidth: 12,
        }).addChildTo(this).setPosition(this.width - 96, 48);
        giveUpButton.setInteractive(!isDarkSide);
        giveUpButton.one('pointstart', function() {
            giveUp();
        });
        Label({
            text: "ギブアップ",
            fill: 'white',
            fontSize: 24,
            fontFamily: FONT_FAMILY
        }).addChildTo(giveUpButton);
        // カウントダウン（ウラモード）
        if (isDarkSide) {
            let countLabel = Label({
                text: "3",
                fill: 'white',
                stroke: 'darkslateblue',
                strokeWidth: 12,
                fontSize: 96,
                fontFamily: FONT_FAMILY
            }).addChildTo(this).setPosition(this.gridX.center(-24), this.gridY.center(6));
            // カウントダウンアニメーション
            countLabel.tweener
                .moveTo(this.gridX.center(), this.gridY.center(6), 500, 'easeOutCubic')
                .wait(500)
                .set({text: "2"})
                .wait(1000)
                .set({text: "1"})
                .wait(1000)
                .set({text: "START!", stroke: 'darkred'})
                .call(()=>{
                    showNum();
                    setPieceInteractive(true);
                    isLookTimeCounting = true;
                    giveUpButton.setInteractive(true);
                })
                .wait(1000)
                .moveTo(this.gridX.center(24), this.gridY.center(6), 500, 'easeInCubic')
                .play();
        }
        // 経過時間表示ラベル
        let timeLabel = Label({
            text: "時間\n" + (Math.floor(time / 10) / 100).toFixed(2) + "s",
            fill: 'darkslateblue',
            fontSize: 36,
            fontFamily: FONT_FAMILY
        }).addChildTo(this).setPosition(this.gridX.center(-5), this.gridY.center(-5.5));
        // 手数表示ラベル
        let movesLabel = Label({
            text: "手数\n" + moves,
            fill: 'darkslateblue',
            fontSize: 36,
            fontFamily: FONT_FAMILY
        }).addChildTo(this).setPosition(this.gridX.center(0), this.gridY.center(-5.5));
        // カンニング数表示ラベル
        let cheatNumLabel = Label({
            text: "見た回数\n" + cheating,
            fill: 'darkred',
            fontSize: 36,
            fontFamily: FONT_FAMILY
        }).addChildTo(this).setPosition(this.gridX.center(5), this.gridY.center(-5.5));
        if (isDarkSide) cheatNumLabel.hide();
        // 記憶時間表示ラベル
        let lookTimeLabel = Label({
            text: "記憶\n" + (Math.floor(time / 10) / 100).toFixed(2) + "s",
            fill: 'darkslateblue',
            fontSize: 36,
            fontFamily: FONT_FAMILY
        }).addChildTo(this).setPosition(this.gridX.center(5), this.gridY.center(-5.5));
        if (!isDarkSide) lookTimeLabel.hide();
        // ツイートボタン
        let tweetButton = RectangleShape({
            width: (PIECE_SIZE - 16) * 2,
            height: PIECE_SIZE - 16,
            fill: '#00acee',
            stroke: 'white',
            strokeWidth: 12,
            cornerRadius: 10
        }).addChildTo(this).setPosition(this.gridX.center(-4), 1200);
        tweetButton.setInteractive(false);
        tweetButton.onpointstart = function() {
            window.open(makeTweet(), 'share window', 'width=480, height=320');
        };
        Label({
            text: "ツイート",
            fill: 'white',
            fontSize: 24,
            fontFamily: FONT_FAMILY
        }).addChildTo(tweetButton);
        // タイトルへ戻るボタン
        let titleButton = RectangleShape({
            width: (PIECE_SIZE - 16) * 2,
            height: PIECE_SIZE - 16,
            fill: 'slateblue',
            stroke: 'darkslateblue',
            strokeWidth: 12,
            cornerRadius: 10
        }).addChildTo(this).setPosition(this.gridX.center(4), 1200);
        titleButton.setInteractive(false);
        titleButton.onpointstart = function() {
            self.exit();
        };
        Label({
            text: "タイトルへ戻る",
            fill: 'white',
            fontSize: 24,
            fontFamily: FONT_FAMILY
        }).addChildTo(titleButton);


        // 毎フレーム更新
        this.update = function(app){
            // 経過時間表示
            if (isTimeCounting) {
                time += app.deltaTime;
                if (time > MAX_TIME) time = MAX_TIME;
            }
            // 記憶時間表示
            if (isLookTimeCounting) {
                lookTime += app.deltaTime;
                if (lookTime > MAX_TIME) lookTime = MAX_TIME;
            }
            if (isCheating) {
                cheatingButton.fill = "darkorange";
                cheatingButton.stroke = "chocolate";
            }
            else {
                cheatingButton.fill = "brown";
                cheatingButton.stroke = "darkred";
            }
            timeLabel.text = "時間\n" + (Math.floor(time / 10) / 100).toFixed(2) + "s";
            lookTimeLabel.text = "記憶\n" + (Math.floor(lookTime / 10) / 100).toFixed(2) + "s";
            movesLabel.text = "手数\n" + moves;
            cheatNumLabel.text = "見た回数\n" + cheating;
            // キーボード
            /*
            var key = app.keyboard;
            if (key.getKeyDown('space')){
                this.exit();
            }
            */
        }
    }
});


//-------------------------
// M A I N
//-------------------------
phina.main(function(){
    var app = GameApp({
        startLabel: 'title',
        //assets: ASSETS,
        //width: SCREEN_WIDTH,
        //height: SCREEN_HEIGHT,
        fit: true,
        scenes: MYSCENES,
        fps: 30
    });
    //app.enableStats();
    app.run();
})
