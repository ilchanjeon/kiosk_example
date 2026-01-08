package com.example.kiosk.service;

import com.example.kiosk.device.SerialDeviceManager;
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

    public void printReceipt(String barcode) {
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

            log.info("영수증 출력 시작 - 바코드: {}", barcode);

            // 초기화
            os.write(INIT);
            Thread.sleep(100);

            // 헤더
            os.write(ALIGN_CENTER);
            os.write(SIZE_DOUBLE);
            os.write(BOLD_ON);
            printText(os, "키오스크 테스트");
            os.write(LINE_FEED);
            os.write(BOLD_OFF);
            os.write(SIZE_NORMAL);
            os.write(LINE_FEED);

            // 구분선
            os.write(ALIGN_LEFT);
            printText(os, "================================");
            os.write(LINE_FEED);

            // 바코드 정보
            printText(os, "스캔된 바코드:");
            os.write(LINE_FEED);
            os.write(BOLD_ON);
            os.write(SIZE_DOUBLE);
            printText(os, barcode);
            os.write(LINE_FEED);
            os.write(BOLD_OFF);
            os.write(SIZE_NORMAL);
            os.write(LINE_FEED);

            // 시간 정보
            String timestamp = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            printText(os, "출력 시간: " + timestamp);
            os.write(LINE_FEED);

            // 푸터
            printText(os, "================================");
            os.write(LINE_FEED);
            os.write(ALIGN_CENTER);
            printText(os, "감사합니다!");
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

    public void testPrint() {
        printReceipt("TESTPRINT123456");
    }

    public boolean getStatus() {
        return status;
    }
}