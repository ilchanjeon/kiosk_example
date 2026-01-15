// ============================================
// 메인 페이지
// ============================================
const homeLoad = async () => {
    const app = document.getElementById('app');
    Utils.showLoading(app);

    const data = await Utils.postData('/test2');

    if (!data) {
        Utils.showError(app);
        return;
    }

    app.innerHTML = `
        <div class="container">
            <h3 class="welcome-message">${data.result}</h3>
            <h1>키오스크 테스트</h1>
            <div class="grid">
                <div class="panel">
                    <h2>초음파 센서</h2>
                    <div id="sensorStatus" class="status disconnected">연결 안됨</div>
                    <div class="distance-display">
                        <div class="distance-value" id="distanceValue">---</div>
                        <div class="distance-unit">cm</div>
                    </div>
                    <div class="log-container sensorLog" id="sensorLog"></div>
                </div>
                <div class="panel">
                    <h2>영수증 프린터</h2>
                    <button class="btn-success" onclick="testPrint()" style="width: 100%; margin-bottom: 10px;">테스트 출력</button>
                    <div class="log-container" id="printerLog"></div>
                    <h2>바코드 리더기</h2>
                    <input type="text" id="barcodeInput" placeholder="바코드를 스캔하세요..." autofocus>
                    <div class="log-container" id="barcodeLog"></div>
                </div>
            </div>
            <button class="btn-success" onclick="test()">테스트</button>
            <button class="btn-success" onclick="test2()">테스트2</button>
        </div>
    `;

    Utils.loadScript('/js/pages/home.js', () => {
        // 함수 실행도 댐
    });

};

// ============================================
// Test 페이지
// ============================================
const test = async () => {
    const app = document.getElementById('app');

    Utils.showLoading(app);

    const data = await Utils.postData('/test3');

    if (!data) {
        Utils.showError(app);
        return;
    }

    app.innerHTML = `
        <div class="container">
            <h1>Test 페이지</h1>
            <div class="grid">
                <div class="panel">
                    <h3 class="welcome-message">${data.result}</h3>
                </div>
            </div>
            <button class="btn-success" onclick="homeLoad()">홈</button>
            <button class="btn-success" onclick="test2()">테스트2</button>
        </div>
    `;

    Utils.loadScript('/js/pages/test.js', () => {
        // 함수실행도 댐
    });

};

// ============================================
// Test2 페이지
// ============================================
const test2 = async () => {
    const app = document.getElementById('app');

    Utils.showLoading(app);

    const data = await Utils.postData('/test');

    if (!data) {
        Utils.showError(app);
        return;
    }

    app.innerHTML = `
       <div class="container">
            <h1>Test 페이지</h1>
            <div class="grid">
                <div class="panel">
                    <h3 class="welcome-message">${data.result}</h3>
                </div>
            </div>
            <button class="btn-success" onclick="homeLoad()">홈</button>
            <button class="btn-success" onclick="test()">테스트</button>
        </div>
    `;

};



