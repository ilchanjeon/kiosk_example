package com.ne.kiosk.service;

import com.ne.kiosk.device.SerialDeviceManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.nio.charset.Charset;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class PrinterService {

    private final SerialDeviceManager deviceManager;

    // ESC/POS 명령어
    private static final byte ESC = 0x1B;
    private static final byte GS = 0x1D;

    // 초기화
    private static final byte[] INIT = {ESC, '@'};

    // 텍스트 정렬
    private static final byte[] ALIGN_LEFT = {ESC, 'a', 0};
    private static final byte[] ALIGN_CENTER = {ESC, 'a', 1};

    // 강조
    private static final byte[] BOLD_ON = {ESC, 'E', 1};
    private static final byte[] BOLD_OFF = {ESC, 'E', 0};

    // 크기
    private static final byte[] SIZE_NORMAL = {GS, '!', 0};
    private static final byte[] SIZE_DOUBLE = {GS, '!', 0x11};

    // 용지 자르기
    private static final byte[] CUT_PAPER = {GS, 'V', 1};

    // 줄바꿈
    private static final byte[] LINE_FEED = {0x0A};

    private boolean status = false;

    public void printReceipt(String cardno, String tamt, String trandate, String trantime, String authno, String reqinst, String trantype) {
        if (!deviceManager.isPortOpen("printer")) {
            log.error("프린터가 연결되지 않았습니다");
            return;
        }

        try {
            OutputStream os = deviceManager.getOutputStream("printer");
            if (os == null) {
                log.error("프린터 출력 스트림을 가져올 수 없습니다");
                return;
            }

            String tax = String.valueOf(Integer.parseInt(tamt) / 10);
            String amt = String.valueOf(Integer.parseInt(tamt) - (Integer.parseInt(tax)));
            tamt = String.valueOf(Integer.parseInt(tamt));

            // 초기화
            os.write(INIT);
            Thread.sleep(100);

            // 헤더
            os.write(LINE_FEED);
            os.write(LINE_FEED);
            os.write(ALIGN_CENTER);
            os.write(SIZE_DOUBLE);
            os.write(BOLD_ON);
            if(trantype.equals("payment")) {
                printText(os, "[카드승인전표]");
            } else {
                printText(os, "[카드취소전표]");
            }
            os.write(LINE_FEED);
            os.write(BOLD_OFF);
            os.write(SIZE_NORMAL);
            os.write(LINE_FEED);

            // 구분선
            os.write(ALIGN_CENTER);
            printText(os, "===========================================");
            os.write(LINE_FEED);

            // 거래 정보
            os.write(ALIGN_LEFT);
            printText(os, "카드 종류: " + reqinst);
            os.write(LINE_FEED);
            printText(os, "카드 번호: " + cardno);
            os.write(LINE_FEED);
            printText(os, "거래 일시: " + trandate + " " + trantime);
            os.write(LINE_FEED);
            printText(os, "승인 번호: " + authno);
            os.write(LINE_FEED);

            // 구분선
            os.write(ALIGN_CENTER);
            printText(os, "--------------------------------------------");
            os.write(LINE_FEED);

            // 금액 정보
            os.write(ALIGN_LEFT);
            os.write(BOLD_ON);
            os.write(SIZE_DOUBLE);
            printText(os, "금 액          " + amt + " 원");
            os.write(LINE_FEED);
            printText(os, "부가세          " + tax + " 원");
            os.write(LINE_FEED);
            printText(os, "합 계          " + tamt  + " 원");
            os.write(BOLD_OFF);
            os.write(SIZE_NORMAL);
            os.write(LINE_FEED);

            // 구분선
            os.write(ALIGN_CENTER);
            printText(os, "--------------------------------------------");
            os.write(LINE_FEED);

            // 푸터
            os.write(ALIGN_LEFT);
            printText(os, "상호: 수원시체육회(영통복합체육관)");
            os.write(LINE_FEED);
            printText(os, "주소: 경기도 수원시 장안구 경수대로 893 (조원동 775)");
            os.write(LINE_FEED);
            printText(os, "대표자: 박광국");
            os.write(LINE_FEED);
            printText(os, "전화번호: 031-241-0334");
            os.write(LINE_FEED);
            printText(os, "사업자등록번호: 2558200310");
            os.write(LINE_FEED);
            os.write(LINE_FEED);
            os.write(LINE_FEED);
            os.write(LINE_FEED);
            os.write(LINE_FEED);
            os.write(LINE_FEED);
            // 용지 자르기
            os.write(CUT_PAPER);

            os.flush();
            log.info("영수증 출력 완료");
            status = true;

        } catch (Exception e) {
            log.error("프린터 출력 오류: {}", e.getMessage(), e);
            status = false;
        }
    }

    private void printText(OutputStream os, String text) throws Exception {
        byte[] bytes = text.getBytes(Charset.forName("EUC-KR"));
        os.write(bytes);
    }

    public boolean getStatus() {
        return status;
    }

    public void enterPrint(String name, Integer quantity) {
        if (!deviceManager.isPortOpen("printer")) {
            log.error("프린터가 연결되지 않았습니다");
            return;
        }

        try {
            OutputStream os = deviceManager.getOutputStream("printer");
            if (os == null) {
                log.error("프린터 출력 스트림을 가져올 수 없습니다");
                return;
            }

            // 초기화
            os.write(INIT);
            Thread.sleep(100);

            // 헤더
            os.write(LINE_FEED);
            os.write(LINE_FEED);
            os.write(ALIGN_CENTER);
            os.write(SIZE_DOUBLE);
            os.write(BOLD_ON);
            printText(os, "[입장권]");
            os.write(LINE_FEED);
            printText(os, name);
            os.write(LINE_FEED);
            os.write(BOLD_OFF);
            os.write(SIZE_NORMAL);
            os.write(LINE_FEED);

            // 구분선
            os.write(ALIGN_CENTER);
            printText(os, "===========================================");
            os.write(LINE_FEED);

            // 거래 정보
            os.write(ALIGN_CENTER);
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            printText(os, timestamp);
            os.write(LINE_FEED);
            printText(os, "구매 수량: " + quantity);
            os.write(LINE_FEED);

            // 구분선
            os.write(ALIGN_CENTER);
            printText(os, "--------------------------------------------");
            os.write(LINE_FEED);
            os.write(LINE_FEED);
            os.write(LINE_FEED);
            os.write(LINE_FEED);
            // 용지 자르기
            os.write(CUT_PAPER);

            os.flush();
            log.info("영수증 출력 완료");
            status = true;

        } catch (Exception e) {
            log.error("프린터 출력 오류: {}", e.getMessage(), e);
            status = false;
        }
    }
}