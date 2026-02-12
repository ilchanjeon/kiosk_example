$(function () {
    const $focusables = $('.cancel-list button, .bottom-btn a');
    let idx = -1;

    function focusAt(newIdx) {
        if (!$focusables.length) return;

        idx = (newIdx + $focusables.length) % $focusables.length;
        $focusables.removeClass('is-focus');
        $focusables.eq(idx).addClass('is-focus').trigger('focus');
    }

    function focusNext() {
        focusAt(idx === -1 ? 0 : idx + 1);
    }

    function focusPrev() {
        focusAt(idx === -1 ? $focusables.length - 1 : idx - 1);
    }

    $(document).on('keydown', function (e) {
        const key = e.key;

        if (key === 'ArrowRight' || key === 'ArrowDown') {
            e.preventDefault();
            focusNext();
            return;
        }

        if (key === 'ArrowLeft' || key === 'ArrowUp') {
            e.preventDefault();
            focusPrev();
            return;
        }

        if (key === 'Enter' || key === 'NumpadEnter') {
            e.preventDefault();

            const targetIdx = (idx === -1) ? 0 : idx;
            const el = $focusables.get(targetIdx);

            if (el) el.click();
        }
    });

    // 마우스 / 터치 / 탭 포커스 동기화
    $focusables.on('focus', function () {
        idx = $focusables.index(this);
        $focusables.removeClass('is-focus');
        $(this).addClass('is-focus');
    });
});

// 전역변수 ( 결제 Key 값 저장 )
let PaymentKey = '';

function cancelPayment() {
    const focusedButton = document.querySelector('.cancel-list button.is-focus');

    if (!focusedButton) {
        showAlert('취소할 결제건을 선택해주세요.');
        return false;
    }

    // focus된 버튼의 값 가져오기
    const selectedPayment = {
        offPaymentManagementNo: focusedButton.id,
        authno: focusedButton.getAttribute('data-authno'),
        tamt: focusedButton.getAttribute('data-tamt'),
        trandate: focusedButton.getAttribute('data-trandate')
    };

    PaymentKey = selectedPayment.offPaymentManagementNo;

    Transaction(2, selectedPayment.authno, selectedPayment.tamt, selectedPayment.trandate);

}

// 알림창 보이기
function showOverRay() {
    document.getElementById('overRay').style.display = 'flex';
}

// 알림창 숨기기
function closeOverRay() {
    document.getElementById('overRay').style.display = 'none';
}

/**
 * ----------------
 * 결제 관련 함수
 * ----------------
 * */
var webSocket = new WebSocket("ws://localhost:9419/WebSocketEx/websocket");
webSocket.onopen = function(message) {
    console.log("연결 되었습니다.")
}
webSocket.onclose = function(message) {
    console.log("단말기와 연결이 실패하였습니다. 잠시만 기다려주새요.");
}
webSocket.onerror = function(message) {
    showAlert("통신오류가 발생하였습니다.");
}
webSocket.onmessage = async function (message) {
    var ret = message.data;

    if (ret.substr(4, 4) == '0000') {
        var trantype = "전문구분 : " + substrByte(ret, 0, 4);
        var errcode = "\n응답코드 : " + substrByte(ret, 4, 4);
        var cardno = "\n카드번호 : " + substrByte(ret, 8, 18);
        var halbu = "\n할부개월 : " + substrByte(ret, 26, 2);
        var tamt = "\n승인금액 : " + substrByte(ret, 28, 9);
        var trandate = "\n승인일자 : " + substrByte(ret, 37, 6);
        var trantime = "\n승인시간 : " + substrByte(ret, 43, 6);
        var authno = "\n승인번호 : " + substrByte(ret, 49, 12);
        var merno = "\n가맹점번호 : " + substrByte(ret, 61, 15);
        var tran_serial = "\n가맹점일련번호 : " + substrByte(ret, 76, 12);
        var stlinst = "\n발급사명 : " + substrByte(ret, 88, 30);
        var reqinst = "\n매입사명 : " + substrByte(ret, 118, 30);
        var signpath = "\n사인경로 : " + substrByte(ret, 148, 50);
        var msg1 = "\n메시지1 : " + substrByte(ret, 198, 100);
        var msg2 = "\n메시지2 : " + substrByte(ret, 298, 100);
        var msg3 = "\n메시지3 : " + substrByte(ret, 398, 100);
        var msg4 = "\n메시지4 : " + substrByte(ret, 498, 100);
        var filler1 = "\n발급사코드 : " + substrByte(ret, 598, 2);
        var filler2 = "\n매입사코드 : " + substrByte(ret, 600, 2);
        var PGdata = "\nPG데이터 : " + substrByte(ret, 700, 329);

        // result.value = trantype+errcode+cardno+halbu+tamt+trandate+trantime+authno+merno+tran_serial+stlinst+reqinst+signpath+msg1+msg2+msg3+msg4+filler1+filler2+PGdata;

        const data = await Utils.postData('/paymentResult', {
            'trantype': substrByte(ret, 0, 4),
            'errcode': substrByte(ret, 4, 4),
            'cardno': substrByte(ret, 8, 18),
            'tamt': substrByte(ret, 28, 9),
            'trandate': substrByte(ret, 37, 6),
            'trantime': substrByte(ret, 43, 6),
            'authno': substrByte(ret, 49, 12),
            'merno': substrByte(ret, 61, 15),
            'tranSerial': substrByte(ret, 76, 12),
            'msg1': substrByte(ret, 198, 100),
            'msg2': substrByte(ret, 298, 100),
            'msg3': substrByte(ret, 398, 100),
            'msg4': substrByte(ret, 498, 100),
            'pgdata' : substrByte(ret, 700, 329)
        });

        const payPaperPrint = await Utils.postData('/paymentPrint', {
            'cardno': substrByte(ret, 8, 18),
            'tamt': substrByte(ret, 28, 9),
            'trandate': substrByte(ret, 37, 6),
            'trantime': substrByte(ret, 43, 6),
            'authno': substrByte(ret, 49, 12),
            'reqinst': substrByte(ret, 118, 30),
            'trantype': 'cancel'
        });
        const resultUpdate = await Utils.postData('/paymentResultUpdate', {
            'paymentKey': PaymentKey
        });

        if (data.result == 'success') {
            closeOverRay();
            showAlert2('거래가 취소되었습니다.');
            setTimeout(() => {
                closeAlert2();
                homeLoad();
            }, 3000);
        }

    } else {
        const data = await Utils.postData('/paymentResult', {
            'trantype': substrByte(ret, 0, 4),
            'errcode': substrByte(ret, 4, 4),
            'cardno': substrByte(ret, 8, 18),
            'tamt': substrByte(ret, 28, 9),
            'trandate': substrByte(ret, 37, 6),
            'trantime': substrByte(ret, 43, 6),
            'authno': substrByte(ret, 49, 12),
            'merno': substrByte(ret, 61, 15),
            'tranSerial': substrByte(ret, 76, 12),
            'msg1': substrByte(ret, 198, 100),
            'msg2': substrByte(ret, 298, 100),
            'msg3': substrByte(ret, 398, 100),
            'msg4': substrByte(ret, 498, 100),
            'pgdata' : substrByte(ret, 700, 329)
        });

        if (data.result == 'success') {
            closeOverRay();
            showAlert2("거래가 실패하였습니다. [" + substrByte(ret, 4, 4) + "] 사유 : " + substrByte(ret, 198, 100).trim());
            setTimeout(() => {
                closeAlert2();
                payCancel2();
            }, 3000);
        } else {
            closeOverRay();
            showAlert2("거래가 실패하였습니다. [" + substrByte(ret, 4, 4) + "] 사유 : " + substrByte(ret, 198, 100).trim());
            setTimeout(() => {
                closeAlert2();
                payCancel2();
            }, 3000);
        }
    }
}


//tpye - 승인 : 1, 승인취소 : 2
function Transaction(type, cancel_authno, cancel_tamt, cancel_trandate) {
    showOverRay();

    // 거래구분 (S0:신용승인, E0:은련승인, 41:현금)
    var tcode = "S0"
    if(tcode == "S0" && type == 2)
    {
        tcode = "S1";
    }
    else if(tcode == "E0" && type == 2)
    {
        tcode = "E1";
    }
    else if(tcode =="41" && type == 2)
    {
        tcode = "42";
    }

    // 단말기 번호 : TID
    var tid = '8830058412';

    // 할부 : 할부 개월 수 2자리 고정
    var halbu = "00"

    // 결제금액 : 9자리
    var tamt_value = cancel_tamt;
    var tamt = padl(tamt_value, 9, '0');

    // 취소시 원거래일자 : YYMMDD , 원거래승인번호 : 12자리
    if(type == 2) {
        var ori_date = cancel_trandate;
        if(ori_date.length == 6){
        }
        else {
            showAlert("원거래일자 입력값을 확인해주세요.");
            return false;
        }
        var ori_authno = cancel_authno;
        if(ori_authno.length == 12) {
        }
        else if(ori_authno.length <12 ) {
            ori_authno = padr(ori_authno, 12, ' ');
        }
        else
        {
            showAlert("승인번호 입력값을 확인해주세요");
            return false;
        }
    }
    //승인시 원거래일자 : 스페이스 6자리 , 원거래승인번호 : 스페이스 12자리
    else {
        var ori_date = "      ";
        var ori_authno = "            ";
    }
    // 거래고유번호 : 숫자앞에 0으로 채워서 6자리 + 공백 6자리
    let today = new Date();
    let Hours = today.getHours();
    let Minutes = today.getMinutes();
    let date = today.getDate();
    var tran_serial = padl(Hours,2,'0')+''+padl(Minutes,2,'0')+''+padl(date,2,'0');
    tran_serial = padr(tran_serial,12,' ');

    //다중TID사용여부 : 미사용 0, 사용 1
    var mTID = "0";
    //직전사인사용여부 : 금액이 5만원 이상일경우 1, 미만일경우 0
    var Sign = "0";
    if(tamt_value >= 50000) Sign = "1";

    //미사용공백
    var flag= " ";
    if( type == 2)
    {
        flag= "N";
    }

    // 세금
    var tax_amt = padl("0", 9, '0');
    // 봉사료
    var sfee_amt = padl("0", 9, '0');
    // 비과세
    var free_amt = padl("0", 9, '0');
    // EnposApp.dll 사용여부
    var use_EnPos = "0";
    // 다중사업자
    var multi_auth = padl("00", 2, '0');
    // 현금/수표조회 식별번호 : 스페이스(33자리)
    var idno = padr('', 33, ' ');
    // 컵보증금
    var cup_deposit = padl('0', 8, '0');

    //PG구분값
    let Year = today.getFullYear();
    let Month = today.getMonth() + 1;
    let Seconds = today.getSeconds();
    var orderno_value = "gyeonggi72_" + padl(Year, 4, '0') + '' + padl(Month, 2, '0') + '' + padl(date, 2, '0') + '' +
        padl(Hours, 2, '0') + '' + padl(Minutes, 2, '0') + '' + padl(Seconds, 2, '0');
    var orderno = padr(orderno_value,64,' ');
    var ordername = padr("",30,' '); //한글인 경우 길이 2바이트 처리 예: 홍길동(6바이트)나머지 24바이트를 스페이스로 채움
    var orderproduct = padr("suwonsports",80,' ');
    var orderphone = padr("",40,' ');
    var ordermail = padr("",60,' ');
    var ordermid = padr("gyeonggi72",10,' ');

    var pgdata = "OFFPG"+orderno+ordername+orderproduct+orderphone+ordermail+ordermid;

    //요청전문
    var input = tcode+halbu+tamt+ori_date+ori_authno
        +tran_serial+idno+mTID+Sign+flag+tax_amt+sfee_amt+free_amt+tid+pgdata+cup_deposit+use_EnPos+multi_auth;


    webSocket.send(input);
}
//문자열 오른쪽에 문자 채우기
function padl(n, width, c)
{
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(c) + n;
}
//문자열 왼쪽에 문자 채우기
function padr(n, width, c)
{
    n = n + '';
    return n.length >= width ? n : n + new Array(width - n.length + 1).join(c);
}
//Byte로 문자열 자르기
function substrByte(str, start, end)
{
    by = i = 0;
    while(1)
    {
        c=str.charCodeAt(i);
        by+=c>>7?2:1;
        if(by>start){
            n = i;
            i++;
            break;
        }
        i++;
    }
    while(1)
    {
        c=str.charCodeAt(i);
        by+=c>>7?2:1;
        if(by>start+end){
            m = i;
            break;
        }
        i++;
    }
    return str.substring(n,m);
}