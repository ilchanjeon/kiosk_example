package com.ne.kiosk.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Service
@RequiredArgsConstructor
public class BarcodeInputService {

    private final UltrasonicSensorService sensorService;
    private final PrinterService printerService;

    private final AtomicBoolean inputEnabled = new AtomicBoolean(false);

    public void processBarcodeInput(String barcode) {
        // 사용자가 감지되었을 때만 처리
        if (!sensorService.isUserDetected()) {
            log.info("사용자가 감지되지 않아 바코드 입력 무시: {}", barcode);
            inputEnabled.set(false);
            return;
        }

        log.info("바코드 입력 받음: {}", barcode);

        // 바코드 유효성 검증
        if (barcode == null || barcode.trim().isEmpty()) {
            log.info("빈 바코드 입력");
            inputEnabled.set(false);
            return;
        }

        // 바코드 처리
        try {
//            printerService.printReceipt(barcode);
            inputEnabled.set(true);

        } catch (Exception e) {
            log.error("바코드 처리 중 오류: {}", e.getMessage(), e);
            inputEnabled.set(false);
        }

    }

    public boolean isUserDetected() {
        return inputEnabled.get();
    }

}