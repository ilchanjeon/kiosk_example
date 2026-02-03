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

    const barcode = sessionStorage.getItem('barcode');

    Utils.showLoading(app);

    const data = await Utils.postData('/test2');

    if (!data) {
        Utils.showError(app);
        return;
    }

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
    const data = await Utils.postData('/barcode', { barcode: barcode });

    if (!data) {
        Utils.showError(app);
        return;
    }

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
                                <button class="item-box">
                                    <p class="item1">탁구(탁구일반)</p>
                                    <p class="item2">2025-08-20</p>
                                    <p class="item3">2025-09-19</p>
                                    <p class="item4">44,000</p>
                                </button>
                                <button class="item-box">
                                    <p class="item1">탁구(탁구할인)</p>
                                    <p class="item2">2025-08-15</p>
                                    <p class="item3">2025-08-30</p>
                                    <p class="item4">35,000</p>
                                </button>
                                <button class="item-box">
                                    <p class="item1">배드민턴(배드민턴일반)</p>
                                    <p class="item2">2025-09-01</p>
                                    <p class="item3">2025-09-20</p>
                                    <p class="item4">56,000</p>
                                </button>
                                <button class="item-box">
                                    <p class="item1">배드민턴(배드민턴할인)</p>
                                    <p class="item2">2025-09-21</p>
                                    <p class="item3">2025-09-30</p>
                                    <p class="item4">22,000</p>
                                </button>
                                <button class="item-box">
                                    <p class="item1">배드민턴(일일할인)</p>
                                    <p class="item2">2025-10-10</p>
                                    <p class="item3">2025-10-17</p>
                                    <p class="item4">44,000</p>
                                </button>
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
                        <a href="#" onclick="reloadPage('home'); return false;" class="check">등록</a>
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

    const data = await Utils.postData('/test');

    if (!data) {
        Utils.showError(app);
        return;
    }

    app.innerHTML = `
        <div class="sub-box">
            <div class="logo-box">
                <h1 class="logo"><i><img src="/resources_kio/images/cont/msports-kio-logo.png" alt=""></i>영통복합체육센터</h1>
            </div>
            <div class="sub-box_in">
                <div class="cont-box page3">
                    <h2>회원인증</h2>
    
                    <div class="num-box">
                        <div class="numbers-box_txt">
                            <p class="label"><i><img src="/resources_kio/images/cont/label_ico.png" alt=""></i>휴대폰
                                번호<span>(뒤 4자리)</span></p>
                            <div class="numbers-box_num">
                                <input type="text" name="first" id="first" maxlength="1" min="0" max="9" onlyNumber
                                    placeholder="5">
                                <input type="text" name="second" id="second" maxlength="1" min="0" max="9" onlyNumber
                                    placeholder="6">
                                <input type="text" name="third" id="third" maxlength="1" min="0" max="9" onlyNumber
                                    placeholder="7">
                                <input type="text" name="fourth" id="fourth" maxlength="1" min="0" max="9" onlyNumber
                                    placeholder="8">
                            </div>
                            <div class="numbers-box_check">
                                <a href="#">
                                    <p>회원조회</p>
                                </a>
                            </div>
                            <div class="numbers-box_mes">
                                <p>휴대폰번호 뒤 4자리를 우측에 키패드로<br>
                                    선택해 주세요.<br>
                                    (회원카드를 사용하시려면 리더기에<br>
                                    카드를 대 주세요.)</p>
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
                            <button type="button" class="item-btn delete"><i><img src="/resources_kio/images/cont/delete.png" alt="정정 아이콘"></i></button>
                        </div>
                    </div>
    
                    <div class="mem-box">
                        <div class="mem-list">
                            <div class="top">
                                <div class="item-box">
                                    <p class="item1">회원명</p>
                                    <p class="item2">휴대폰번호</p>
                                    <p class="item3">생년월일</p>
                                    <p class="item4">선택</p>
                                </div>
                            </div>
                            <div class="bottom js-list-box">
                                <button class="item-box">
                                    <p class="item1">홍길동</p>
                                    <p class="item2">010-****-5678</p>
                                    <p class="item3">1981.08.20</p>
                                    <p class="item4"><input type="radio" name="member" id="member1"></p>
                                </button>
                                <button class="item-box">
                                    <p class="item1">탕수육</p>
                                    <p class="item2">010-****-5678</p>
                                    <p class="item3">1992.09.09</p>
                                    <p class="item4"><input type="radio" name="member" id="member2"></p>
                                </button>
                                <button class="item-box">
                                    <p class="item1">김말이</p>
                                    <p class="item2">010-****-5678</p>
                                    <p class="item3">2001.10.05</p>
                                    <p class="item4"><input type="radio" name="member" id="member3"></p>
                                </button>
                                <button class="item-box">
                                    <p class="item1">새우깡</p>
                                    <p class="item2">010-****-5678</p>
                                    <p class="item3">1985.03.12</p>
                                    <p class="item4"><input type="radio" name="member" id="member4"></p>
                                </button>
                                <button class="item-box">
                                    <p class="item1">비타민</p>
                                    <p class="item2">010-****-5678</p>
                                    <p class="item3">1998.05.31</p>
                                    <p class="item4"><input type="radio" name="member" id="member5"></p>
                                </button>
                            </div>
                            <div class="right">
                                <button type="button" class="up"><i><img src="/resources_kio/images/cont/up.png" alt="위로 이동 아이콘"></i></button>
                                <button type="button" class="down"><i><img src="/resources_kio/images/cont/down.png" alt="아래로 이동 아이콘"></i></button>
                            </div>
                        </div>
                    </div>
    
                    <div class="bottom-btn">
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

    const data = await Utils.postData('/test');

    if (!data) {
        Utils.showError(app);
        return;
    }

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
                                            <button type="button">
                                                <p>탁구 주간<br>(화/목)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button type="button">
                                                <p>탁구 주간<br>(월/수)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button type="button">
                                                <p>탁구 주간<br>(목/금)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button type="button">
                                                <p>탁구 주간<br>(화/목)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="product-box__cont__item">
                                        <div>
                                            <button type="button" class="event1">
                                                <p>탁구 주간<br>(화/목)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button type="button" class="event2">
                                                <p>탁구 주간<br>(월/수)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                    
                                    </div>
                                </div>
                                <div class="slide-nav">
                                    <span class="s_prev"><a href="#"
                                            onclick="jQuery('.js-product-box--1').slick('slickPrev');return false;">이전</a></span>
                                    <span class="s_next"><a href="#"
                                            onclick="jQuery('.js-product-box--1').slick('slickNext');return false;">다음</a></span>
                                </div>
                            </article>
                        </div>
                        <div class="js-box">
                            <article class="product-box">
                                <div class="product-box__cont js-product-box--2">
                                    <div class="product-box__cont__item">
                                        <div>
                                            <button type="button">
                                                <p>배드민턴 주간<br>(화/목)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button type="button">
                                                <p>배드민턴 주간<br>(월/수)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button type="button">
                                                <p>배드민턴 주간<br>(목/금)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button type="button">
                                                <p>배드민턴 주간<br>(화/목)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="product-box__cont__item">
                                        <div>
                                            <button type="button">
                                                <p>배드민턴 주간<br>(화/목)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button type="button">
                                                <p>배드민턴 주간<br>(월/수)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button type="button">
                                                <p>배드민턴 주간<br>(목/금)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button type="button">
                                                <p>배드민턴 주간<br>(화/목)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="product-box__cont__item">
                                        <div>
                                            <button type="button" class="event1">
                                                <p>배드민턴 주간<br>(화/목)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button type="button" class="event2">
                                                <p>배드민턴 주간<br>(월/수)</p>
                                                <span>1,200원</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="slide-nav">
                                    <span class="s_prev"><a href="#"
                                            onclick="jQuery('.js-product-box--2').slick('slickPrev');return false;">이전</a></span>
                                    <span class="s_next"><a href="#"
                                            onclick="jQuery('.js-product-box--2').slick('slickNext');return false;">다음</a></span>
                                </div>
                            </article>
                        </div>
                    </div>
    
                    <script>
                        productSlide('.js-product-box--1');
                        productSlide('.js-product-box--2');
                        // productSlide('.js-product-box--3');
                        // productSlide('.js-product-box--4');
                        // productSlide('.js-product-box--5');
                        // productSlide('.js-product-box--6');
                    </script>
                    <script>
                        function ProductTab(tabName) {
                            var oldIndex = 0
    
                            var firstTabItem = $(tabName).find('.js-nav__list.on')
    
                            $(tabName)
                                .find('.js-nav__list')
                                .on('click', function () {
                                    var thisIndex = $(tabName).find('.js-nav__list').index(this)
                                    var tabItem = $(tabName).find('.js-nav__list')
                                    var boxItem = $(tabName).find('.js-box')
    
                                    tabItem.removeClass('on');
                                    boxItem.removeClass('on')
                                    tabItem.eq(thisIndex).addClass('on');
                                    boxItem.eq(thisIndex).addClass('on');
    
                                    $('.js-product-box--1').get(0).slick.setPosition()
                                    $('.js-product-box--2').get(0).slick.setPosition()
                                    $('.js-product-box--3').get(0).slick.setPosition()
                                    $('.js-product-box--4').get(0).slick.setPosition()
                                    $('.js-product-box--5').get(0).slick.setPosition()
                                    $('.js-product-box--6').get(0).slick.setPosition()
                                    return false
                                })
                        }
                        ProductTab('.js-tab-box--2') // 탭 작동
                    </script>
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
                                <em>1,200원</em>
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
                                <div class="bottom">
                                    <div class="item-box">
                                        <button type="button">
                                            <p class="item1">피트니스 주간</p>
                                            <p class="item2">1</p>
                                            <p class="item3">1,200원</p>
                                        </button>
                                    </div>
                                    <div class="item-box">
                                        <button type="button">
                                            <p class="item1">피트니스할인<br>
                                                (남자대인)</p>
                                            <p class="item2">1</p>
                                            <p class="item3">1,200원</p>
                                        </button>
                                    </div>
                                    <div class="item-box">
                                        <button type="button">
                                            <p class="item1">피트니스할인<br>
                                                (남자대인)</p>
                                            <p class="item2">1</p>
                                            <p class="item3">1,200원</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="payment-bottom-right">
                            <div class="check">
                                <a href="#" onclick="reloadPage('home'); retrun false;">
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

    const data = await Utils.postData('/test');

    if (!data) {
        Utils.showError(app);
        return;
    }

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
                        <a href="#" onclick="reloadPage('cancel2'); return false;" class="check"><i></i>확인</a>
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

    const data = await Utils.postData('/test');

    if (!data) {
        Utils.showError(app);
        return;
    }

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
                            <li><button>28630752 202860126151657<span class="sum">(3000원)</span></button></li>
                            <li><button>28630752 202860126151657<span class="sum">(3000원)</span></button></li>
                            <li><button>28630752 202860126151657<span class="sum">(3000원)</span></button></li>
                            <li><button>28630752 202860126151657<span class="sum">(3000원)</span></button></li>
                        </ul>
                    </div>
    
                    <div class="bottom-btn">
                        <a href="#" onclick="reloadPage('cancel1'); return false;" class="back"><i></i>이전</a>
                        <a href="#" onclick="return false;" class="check"><i></i>다음</a>
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


