const reloadPage = async (pageName) => {
    sessionStorage.setItem('pageName', pageName);
    if (pageName === "monthMember" || pageName === "memberVisit") {
        barcodeInputEnabled = true;
        showAlert("바코드를 스캔해 주세요.");

        const barcode = await waitForBarcode();
        if (barcode === "event_cancelled") {
            return false;
        }
        sessionStorage.setItem('barcode', barcode);
    }

    location.reload();
}

// ============================================
// 메인 페이지
// ============================================
const homeLoad = async () => {
    const app = document.getElementById('app');

    Utils.showLoading(app);

    app.innerHTML = `
        <div class="main-box">
            <div class="main-box_in">
                <div class="logo-box">
                    <h1 class="logo"><i><img src="/resources_kio/images/cont/msports-kio-logo.png" alt=""></i>영통복합체육센터</h1>
                </div>
                <div class="cont-box">
                    <div class="item">
                        <a href="#" onclick="reloadPage('monthMember'); return false;">
                            <div class="ico"><img src="/resources_kio/images/cont/ico-1.png" alt="수강재등록 아이콘"></div>
                            <div class="txt">
                                <strong>월회원등록</strong>
                                <span>Monthly membership</span>
                            </div>
                        </a>
                    </div>
                    <div class="item">
                        <a href="#" onclick="reloadPage('memberVisit'); return false;">
                            <div class="ico"><img src="/resources_kio/images/cont/ico-2.png" alt="회원방문 아이콘"></div>
                            <div class="txt">
                                <strong>회원방문</strong>
                                <span>Members visit</span>
                            </div>
                        </a>
                    </div>
                    <div class="item">
                        <a href="#" onclick="reloadPage('onedayClass'); return false;">
                            <div class="ico"><img src="/resources_kio/images/cont/ico-3.png" alt="일일상품구매 아이콘"></div>
                            <div class="txt">
                                <strong>일일 상품 구매</strong>
                                <span>Oneday classes</span>
                            </div>
                        </a>
                    </div>
                    <div class="item type2">
                        <a href="#" onclick="reloadPage('cancel1'); return false;">
                            <div class="ico"><img src="/resources_kio/images/cont/ico-4.png" alt="당일결제취소 아이콘"></div>
                            <div class="txt">
                                <strong>당일 결제 취소</strong>
                                <span>Cancel the payment</span>
                            </div>
                        </a>
                    </div>
                </div>
                <p class="capyright">COPYRIGHT © 영통복합체육센터. ALL RIGHTS RESERVED.</p>     
                <input type="text" id="barcodeInput" value="">          
            </div>
	    </div>
    `;

    Utils.loadScript('/js/pages/home.js', () => {
        // 함수 실행도 댐
        pageCheck = "home";
    });

};

// ============================================
// 월회원등록 페이지
// ============================================
const monthMemberSumbmit = async () => {
    const app = document.getElementById('app');

    Utils.showLoading(app);

    const barcode = sessionStorage.getItem('barcode');
    const data = await Utils.postData('/findMonthlyRegist', { barcode: barcode });

    if (!data) {
        Utils.showError(app);
        return;
    }

    let pingpong = false;
    let badminton = false;
    let educationList = [];
    let ticketList = [];
    let esntlId = "";

    if(data.result === "No Content") {
        showAlert2("오류가 발생하였습니다.");
        setTimeout(() => {
            closeAlert2();
            homeLoad();
        }, 1000);
        return;
    }
    else if(data.result === "noMember") {
        showAlert2("일치하는 회원이 없습니다.");
        setTimeout(() => {
            closeAlert2();
            homeLoad();
        }, 1000);
        return;
    }
    else if(data.result === "usedTicket_all"){
        showAlert2("갱신할 교육이 없습니다.");
        setTimeout(() => {
            closeAlert2();
            homeLoad();
        }, 1000);
        return;
    } else {
        let resultArray = JSON.parse(data.result);

        esntlId = resultArray.esntlId;

        if(resultArray.result === 'noList') {
            // 배드민턴, 탁구 추가
            pingpong = true;
            badminton = true;
        } else if (resultArray.result === "find") {
            if(resultArray.usedTicket === "usedTicket_T"){
                // 배드민턴 추가
                badminton = true;
            } else {
                // 탁구 추가
                pingpong = true;
            }
        } else {
            educationList = resultArray.educationList || [];
            ticketList = resultArray.ticketList || [];

            if (resultArray.usedTicket === 'T') badminton = true;
            else if (resultArray.usedTicket === 'B') pingpong = true;
            else if (resultArray.usedTicket === 'none') {
                badminton = true;
                pingpong = true;
            }
        }
    }

    const now = new Date();

    // 현재 년월일
    const today = now.toISOString().slice(0, 10); // "2026-02-24"

    // 한달 뒤
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthDate = nextMonth.toISOString().slice(0, 10); // "2026-03-24"

    console.log(data.result);
    console.log("pingpong", pingpong);
    console.log("badminton", badminton);

    app.innerHTML = `
        <div class="sub-box">
            <div class="logo-box">
                <h1 class="logo"><i><img src="/resources_kio/images/cont/msports-kio-logo.png" alt=""></i>영통복합체육센터</h1>
            </div>
            <div class="sub-box_in">
                <div class="cont-box page2">
                    <h2>수강등록</h2>
                    <div class="text-box">
                        <strong>재등록 하실 종목을 선택해 주세요.</strong>
                    </div>
                    <div class="lesson-box">
                        <div class="lesson-list">
                            <div class="top">
                                <div class="item-box">
                                    <p class="item1">수강반 명</p>
                                    <p class="item2">시작일자</p>
                                    <p class="item3">종료일자</p>
                                    <p class="item4">금액</p>
                                </div>
                            </div>
                            <div class="bottom js-list-box">
                                ${educationList.length > 0 ? educationList.map(item => {
                                    const numericAmount = parseInt(item.EDUCATION_TUITION || "0", 10);
                                    const formattedAmount = numericAmount.toLocaleString("ko-KR");
                                    return `
                                            <button class="item-box" data-educationNo="${item.EDUCATION_INFO_NO}" data-price="${item.EDUCATION_TUITION}" data-useEndDate="" data-type="education" data-esntlId="${esntlId}">
                                                <p class="item1">${item.EDUCATION_NAME}</p>
                                                <p class="item2">${item.EDUCATION_START_DATE}</p>
                                                <p class="item3">${item.EDUCATION_END_DATE}</p>
                                                <p class="item4">${formattedAmount}</p>
                                            </button>
                                        `;
                                }).join('') : ''}
                                
                                ${ticketList.length > 0 ? ticketList.map(item => {
                                    return `
                                            <button class="item-box" data-educationNo="${item.TICKET_NO}" data-price="30000" data-useEndDate="${item.TICKET_END_DATE}" data-type="ticket" data-esntlId="${esntlId}">
                                                <p class="item1">${item.TICKET_TYPE === 'T' ? '탁구(월권 재등록)' : '배드민턴(월권 재등록)'}</p>
                                                <p class="item2">${item.TICKET_START_DATE}</p>
                                                <p class="item3">${item.TICKET_END_DATE}</p>
                                                <p class="item4">30,000</p>
                                            </button>
                                        `;
                                }).join('') : ''}
                                
                                ${pingpong ? `
                                    <button class="item-box" data-educationNo="new" data-price="30000" data-useEndDate="" data-type="ticket_t" data-esntlId="${esntlId}">
                                        <p class="item1">탁구(월권 신규)</p>
                                        <p class="item2">${today}</p>
                                        <p class="item3">${nextMonthDate}</p>
                                        <p class="item4">30,000</p>
                                    </button>
                                ` : ''}

                                ${badminton ? `
                                    <button class="item-box" data-educationNo="new" data-price="30000" data-useEndDate="" data-type="ticket_b" data-esntlId="${esntlId}">
                                        <p class="item1">배드민턴(월권 신규)</p>
                                        <p class="item2">${today}</p>
                                        <p class="item3">${nextMonthDate}</p>
                                        <p class="item4">30,000</p>
                                    </button>
                                ` : ''}
                            </div>
                            <div class="right">
                                <button type="button" class="up"><i><img src="/resources_kio/images/cont/up.png" alt="위로 이동 아이콘"></i></button>
                                <button type="button" class="down"><i><img src="/resources_kio/images/cont/down.png" alt="아래로 이동 아이콘"></i></button>
                            </div>
                        </div>
                    </div>
    
                    <div class="lesson-choose">
                            <div class="item item1">
                                <div class="tit">
                                    <h5>종목</h5>
                                </div>
                                <div class="con">
                                    <p></p>
                                </div>
                            </div>
                            
                            <div class="item item2">
                                <div class="tit">
                                    <h5>이용기간</h5>
                                </div>
                                <div class="con">
                                    <div class="startDate"><p></p></div>
                                    <div class="mid"><p>~</p></div>
                                    <div class="endDate"><p></p></div>
                                </div>
                            </div>
                            
                            <div class="item item3">
                                <div class="tit">
                                    <h5>결제금액</h5>
                                </div>
                                <div class="con">
                                    <em></em>
                                </div>
                            </div>
                    </div>
    
                    <div class="bottom-btn">
                        <a href="#" onclick="reloadPage('home'); return false;" class="back">취소</a>
                        <a href="#" onclick="Transaction(1); return false;" class="check">등록</a>
                    </div>
                </div>
            </div>
	    </div>
    `;

    Utils.loadScript('/js/pages/monthMember.js', () => {
        // 함수실행
        pageCheck = "monthMember";
    });

};

// ============================================
// 회원방문 페이지
// ============================================
const memberVisit = async () => {
    const app = document.getElementById('app');

    Utils.showLoading(app);

    const barcode = sessionStorage.getItem('barcode');
    const data = await Utils.postData('/findMemberEducation', { barcode: barcode });

    if (!data) {
        Utils.showError(app);
        return;
    }

    if(data.result === "No Content") {
        showAlert2("오류가 발생하였습니다.");
        setTimeout(() => {
            closeAlert2();
            homeLoad();
        }, 2000);
        return;
    }
    else if(data.result === "noMember") {
        showAlert2("일치하는 회원이 없습니다.");
        setTimeout(() => {
            closeAlert2();
            homeLoad();
        }, 2000);
        return;
    }
    else if(data.result === "noEducation"){
        showAlert2("수강중인 교육 또는 월 이용권이 없습니다.");
        setTimeout(() => {
            closeAlert2();
            homeLoad();
        }, 2000);
        return;
    }
    else if(data.result === "already"){
        showAlert2("이미 출석체크를 하였습니다.");
        setTimeout(() => {
            closeAlert2();
            homeLoad();
        }, 2000);
        return;
    }
    else if(data.result === "success"){
        showAlert2("출석체크 완료");
        setTimeout(() => {
            closeAlert2();
            homeLoad();
        }, 2000);
        return;
    }
    else if(data.result.startsWith("ticket_")){
        const enterMemberprint = await Utils.postData('/findMemberEducation', { name: data.result });
        showAlert2("출석체크 완료");
        setTimeout(() => {
            closeAlert2();
            homeLoad();
        }, 2000);
        return;
    }
    let resultArray = JSON.parse(data.result);

    const educationList = resultArray.availableEducationList || [];
    const ticketList = resultArray.availableticketList || [];

    console.log(ticketList);

    app.innerHTML = `
        <div class="sub-box">
            <div class="logo-box">
                <h1 class="logo"><i><img src="/resources_kio/images/cont/msports-kio-logo.png" alt=""></i>영통복합체육센터</h1>
            </div>
            <div class="sub-box_in">
                <div class="cont-box page3">
                    <div class="mem-box">
                        <div class="mem-list">
                            <div class="top">
                                <div class="item-box">
                                    <p class="item1">강좌/정기권</p>
                                    <p class="item2">교육기간/이용기간</p>
                                    <p class="item3">시간</p>
                                    <p class="item4">선택</p>
                                </div>
                            </div>
                            <div class="bottom js-list-box">
                                ${educationList.map(item => `
                                    <button class="item-box">
                                        <p class="item1">${item.EDUCATION_NAME}</p>
                                        <p class="item2">${item.EDUCATION_START_DATE} ~ ${item.EDUCATION_END_DATE}</p>
                                        <p class="item3">${item.EDUCATION_START_TIME} ~ ${item.EDUCATION_END_TIME}</p>
                                        <p class="item4"><input type="radio" name="select_no" value="${item.EDUCATION_NO}" data-type="education"></p>
                                    </button>
                                `).join('')}

                                ${ticketList.map(item => `
                                    <button class="item-box">
                                        <p class="item1">${item.TICKET_TYPE === 'T' ? '탁구' : '배드민턴'}</p>
                                        <p class="item2">${item.TICKET_START_DATE} ~ ${item.TICKET_END_DATE}</p>
                                        <p class="item3">정기권</p>
                                        <p class="item4"><input type="radio" name="select_no" value="${item.TICKET_NO}" data-type="ticket"></p>
                                    </button>
                                `).join('')}
                            </div>
                            <div class="right">
                                <button type="button" class="up"><i><img src="/resources_kio/images/cont/up.png" alt="위로 이동 아이콘"></i></button>
                                <button type="button" class="down"><i><img src="/resources_kio/images/cont/down.png" alt="아래로 이동 아이콘"></i></button>
                            </div>
                        </div>
                    </div>
    
                    <div class="bottom-btn">
                        <a href="#" onclick="attendance(); return false;" class="memberCheck">확인</a>
                        <a href="#" onclick="reloadPage('home'); return false;" class="back">취소</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    Utils.loadScript('/js/pages/memberVisit.js', () => {
        // 함수 실행
        pageCheck = "memberVisit";
    });

};

// ============================================
// 일일상품구매 페이지
// ============================================
const onedayClassBuying = async () => {
    const app = document.getElementById('app');

    Utils.showLoading(app);

    const data = await Utils.postData('/holidayCheck');

    if (!data) {
        Utils.showError(app);
        return;
    }

    const hour = new Date().getHours();
    const isNight = hour >= 18 && hour < 24;
    const isWeekend = data.result === "holiyday"; // 주말/공휴일

    app.innerHTML = `
        <div class="sub-box">
            <div class="logo-box">
                <h1 class="logo"><i><img src="/resources_kio/images/cont/msports-kio-logo.png" alt=""></i>영통복합체육센터</h1>
            </div>
            <div class="sub-box_in">
                <div class="cont-box page4">
                    <h2>상품구매</h2>
                    <div class="product-tab js-tab-box--2">
                        <ul class="js-nav">
                            <li class="js-nav__list on"><a href="#" onclick="javascript:void(0); return false;" class="tab-btn">탁구</a></li>
                            <li class="js-nav__list"><a href="#" onclick="javascript:void(0); return false;" class="tab-btn">배드민턴</a></li>
                        </ul>
                        <div class="js-box on">
                            <article class="product-box">
                                <div class="product-box__cont js-product-box--1">
                                    <div class="product-box__cont__item">
                                        <div>
                                            <button type="button" class="event1">
                                                <p>탁구 야간<br>(일반)</p>
                                                <span>1,800원</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button type="button" class="event2">
                                                <p>탁구 야간<br>(할인)</p>
                                                <span>900원</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="slide-nav">
                                    <span class="s_prev"><a href="#"
                                            onclick="jQuery('.js-product-box--1').slick('slickPrev'); return false;">이전</a></span>
                                    <span class="s_next"><a href="#"
                                            onclick="jQuery('.js-product-box--1').slick('slickNext'); return false;">다음</a></span>
                                </div>
                            </article>
                        </div>
                        <div class="js-box">
                            <article class="product-box">
                                <div class="product-box__cont js-product-box--2">
                                    <div class="product-box__cont__item">
                                        <div>
                                            <button type="button" class="event1">
                                                <p>배드민턴 야간<br>(일반)</p>
                                                <span>1,800원</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button type="button" class="event2">
                                                <p>배드민턴 야간<br>(할인)</p>
                                                <span>900원</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="slide-nav">
                                    <span class="s_prev"><a href="#"
                                            onclick="jQuery('.js-product-box--2').slick('slickPrev'); return false;">이전</a></span>
                                    <span class="s_next"><a href="#"
                                            onclick="jQuery('.js-product-box--2').slick('slickNext'); return false;">다음</a></span>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sub-box_in2">
                <div class="cont-box page4">
                    <div class="payment-top">
                        <div class="payment-top-left">
                            <div class="tit">
                                <h5>결제금액</h5>
                            </div>
                            <div class="con">
                                <em id="finalAmount" >0 원</em>
                            </div>
                        </div>
                        <div class="payment-top-right">
                            <button class="add">
                                <p>수량+</p><span>Quantity+</span>
                            </button>
                            <button class="min">
                                <p>수량-</p><span>Quantity-</span>
                            </button>
                            <button class="del">
                                <p>선택삭제</p><span>Delete<br>Selection</span>
                            </button>
                        </div>
                    </div>
                    <div class="payment-bottom">
                        <div class="payment-bottom-left">
                            <div class="pay-list">
                                <div class="top">
                                    <div class="item-box">
                                        <p class="item1">상품명<span>Goods name</span></p>
                                        <p class="item2">수량<span>Quantity</span></p>
                                        <p class="item3">금액<span>Amount</span></p>
                                    </div>
                                </div>
                                <div class="bottom" id="paymentList">
                                </div>
                            </div>
                        </div>
                        <div class="payment-bottom-right">
                            <div class="check">
                                <a href="#" onclick="Transaction(1); return false;">
                                    <p>결제하기</p>
                                    <span>Card payment</span>
                                </a>
                            </div>
                            <div class="back">
                                <a href="#" onclick="reloadPage('home'); return false;">
                                    <p>취소</p>
                                    <span>Cancel</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
	    </div>
    `;

    // 4가지 조건 조합
    let dayType = "";
    if (!isWeekend && !isNight)      dayType = "NOMAL_DAY";      // 평일 주간
    else if (!isWeekend && isNight)  dayType = "NOMAL_NIGHT";    // 평일 야간
    else if (isWeekend && !isNight)  dayType = "HOLIY_DAY";      // 주말 주간
    else if (isWeekend && isNight)   dayType = "HOLIY_NIGHT";    // 주말 야간

    const products = {
        NOMAL_DAY: {
            pingpong:  [{ label: "탁구 주간 (일반)",    price: 1200 }, { label: "탁구 주간 (할인)",    price: 600 }],
            badminton: [{ label: "배드민턴 주간 (일반)", price: 1200 }, { label: "배드민턴 주간 (할인)", price: 600 }]
        },
        NOMAL_NIGHT: {
            pingpong:  [{ label: "탁구 야간 (일반)",    price: 1800 }, { label: "탁구 야간 (할인)",    price: 900 }],
            badminton: [{ label: "배드민턴 야간 (일반)", price: 1800 }, { label: "배드민턴 야간 (할인)", price: 900 }]
        },
        HOLIY_DAY: {
            pingpong:  [{ label: "탁구 주간 (일반)",    price: 1800 }, { label: "탁구 주간 (할인)",    price: 900 }],
            badminton: [{ label: "배드민턴 주간 (일반)", price: 1800 }, { label: "배드민턴 주간 (할인)", price: 900 }]
        },
        HOLIY_NIGHT: {
            pingpong:  [{ label: "탁구 야간 (일반)",    price: 2400 }, { label: "탁구 야간 (할인)",    price: 1200 }],
            badminton: [{ label: "배드민턴 야간 (일반)", price: 2400 }, { label: "배드민턴 야간 (할인)", price: 1200 }]
        }
    };

    // js-product-box--1(탁구), js-product-box--2(배드민턴) 안의 item 교체
    function renderButtons(sport, selector) {
        const items = products[dayType][sport];
        const container = document.querySelector(selector + " .product-box__cont__item");
        container.innerHTML = items.map((item, idx) => `
            <div>
                <button type="button" class="event${idx + 1}" onclick="addPaymentList('${item.label}', ${item.price})">
                    <p>${item.label.replace(" (", "<br>(")}</p>
                    <span>${item.price.toLocaleString()}원</span>
                </button>
            </div>
        `).join("");
    }

    renderButtons("pingpong",  ".js-product-box--1");
    renderButtons("badminton", ".js-product-box--2");



    Utils.loadScript('/js/pages/onedayClass.js', () => {
        // 함수 실행
        pageCheck = "onedayClass";
    });
};

// ============================================
// 당일결제취소1 페이지
// ============================================
const payCancel1 = async () => {
    const app = document.getElementById('app');

    Utils.showLoading(app);

    // const data = await Utils.postData('/test');
    //
    // if (!data) {
    //     Utils.showError(app);
    //     return;
    // }

    app.innerHTML = `
        <div class="sub-box">
            <div class="logo-box">
                <h1 class="logo"><i><img src="/resources_kio/images/cont/msports-kio-logo.png" alt=""></i>영통복합체육센터</h1>
            </div>
            <div class="sub-box_in">
                <div class="cont-box page5">
                    
                    <h2><span>현장취소를 위해</span>비밀번호를 입력해주세요</h2>
    
                    <div class="num-box">
                        <div class="numbers-box_txt">
    
                            <div class="numbers-box_num">
                                <input type="text" name="first" id="first" maxlength="1" min="0" max="9" onlyNumber
                                    placeholder="*">
                                <input type="text" name="second" id="second" maxlength="1" min="0" max="9" onlyNumber
                                    placeholder="*">
                                <input type="text" name="third" id="third" maxlength="1" min="0" max="9" onlyNumber
                                    placeholder="*">
                                <input type="text" name="fourth" id="fourth" maxlength="1" min="0" max="9" onlyNumber
                                    placeholder="*">
                            </div>
                        </div>
                        <div class="numbers-box_item">
                            <input type="button" class="item-btn number" value="1">
                            <input type="button" class="item-btn number" value="2">
                            <input type="button" class="item-btn number" value="3">
                            <input type="button" class="item-btn number" value="4">
                            <input type="button" class="item-btn number" value="5">
                            <input type="button" class="item-btn number" value="6">
                            <input type="button" class="item-btn number" value="7">
                            <input type="button" class="item-btn number" value="8">
                            <input type="button" class="item-btn number" value="9">
                            <button type="button" class="item-btn initi">재입력</button>
                            <input type="button" class="item-btn number" value="0">
                            <button type="button" class="item-btn delete"><i><img
                                        src="/resources_kio/images/cont/delete.png" alt="정정 아이콘"></i></button>
                        </div>
                    </div>
                    
                    <div class="bottom-btn">
                        <a href="#" onclick="reloadPage('home'); return false;" class="back"><i></i>취소</a>
                        <a href="#" onclick="cancelPasswordCheck(); return false;" class="check"><i></i>확인</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    Utils.loadScript('/js/pages/cancel1.js', () => {
        // 함수 실행
        pageCheck = "cancel1";
    });
};

// ============================================
// 당일결제취소2 페이지
// ============================================
const payCancel2 = async () => {
    const app = document.getElementById('app');

    Utils.showLoading(app);

    const data = await Utils.postData('/findPaymentList');

    if (!data) {
        Utils.showError(app);
        return;
    }

    if(data.result === "No Content") {
        showAlert2("취소할 결제내역이 없습니다.");
        setTimeout(() => {
            closeAlert2();
            homeLoad();
        }, 1000);
        return;
    }

    let resultArray = JSON.parse(data.result);

    app.innerHTML = `
        <div class="sub-box">
            <div class="logo-box">
                <h1 class="logo"><i><img src="./resources_kio/images/cont/msports-kio-logo.png" alt=""></i>영통복합체육센터</h1>
            </div>
            <div class="sub-box_in">
                <div class="cont-box page5">
                    
                    <h2>취소 결제건을 선택하세요</h2>
    
                    <div class="cancel-list">
                        <ul>
                            ${resultArray.map(item => {
                                const numericAmount = parseInt(item.TAMT || "0", 10);
                                const formattedAmount = numericAmount.toLocaleString("ko-KR");
                                return `
                                <li>
                                    <button id="${item.OFF_PAYMENT_MANAGEMENT_NO}" data-authno="${item.AUTHNO}" data-tamt="${numericAmount}" data-trandate="${item.TRANDATE}">
                                        ${item.AUTHNO}
                                        <span class="sum">(${formattedAmount} 원)</span>
                                    </button>
                                </li>
                            `;
                            }).join('')}
                        </ul>
                    </div>
    
                    <div class="bottom-btn">
                        <a href="#" onclick="reloadPage('cancel1'); return false;" class="back"><i></i>이전</a>
                        <a href="#" onmousedown="event.preventDefault();" onclick="cancelPayment(); return false;" class="check"><i></i>다음</a>
                        <a href="#" onclick="reloadPage('home'); return false;" class="home"><i></i>첫화면으로</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    Utils.loadScript('/js/pages/cancel2.js', () => {
        // 함수 실행
        pageCheck = "cancel2";
    });

};


