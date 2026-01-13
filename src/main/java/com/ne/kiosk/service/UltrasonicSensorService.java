package com.ne.kiosk.service;

import com.ne.kiosk.device.SerialDeviceManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.io.OutputStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class UltrasonicSensorService {

    private final SerialDeviceManager deviceManager;
    private final SimpMessagingTemplate messagingTemplate;

    private static final byte[] START = {0x0A};

    private static final int DETECTION_THRESHOLD = 50; // cm
    private boolean userDetected = false;
    private int currentDistance = 999;

    @Scheduled(fixedRate = 500)
    public void checkDistance() {
        if (!deviceManager.isPortOpen("ultrasonic")) {
            return;
        }

        try {
            OutputStream os = deviceManager.getOutputStream("ultrasonic");
            InputStream is = deviceManager.getInputStream("ultrasonic");

            if (os == null || is == null) return;

            os.write(0xA0);
            Thread.sleep(150);

            byte[] buffer = new byte[1024];
            int bytesRead = is.read(buffer);

            if (bytesRead >= 3) {
                // 거리 데이터 파싱 (3바이트)
                int dataH = buffer[0];
                int dataM = buffer[1];
                int dataL = buffer[2];

                // 거리 계산: (Data_h * 65536 + Data_m * 256 + Data_l) / 10000
                currentDistance = (int) ((dataH * 65536 + dataM * 256 + dataL) / 10000.0);
            }

            if (currentDistance < 170) {
                messagingTemplate.convertAndSend("/topic/sensor",
                        new SensorEvent("USER_DETECTED", currentDistance));
                userDetected = true;
            } else {
                messagingTemplate.convertAndSend("/topic/sensor",
                        new SensorEvent("USER_LEFT", currentDistance));
                userDetected = false;
            }


        } catch(Exception e){
            log.error("초음파 센서 읽기 오류: {}", e.getMessage());
        }
    }

    public boolean isUserDetected () {
        return userDetected;
    }

    public int getCurrentDistance () {
        return currentDistance;
    }

    // 이벤트 클래스
    public record SensorEvent(String type, int distance) {
    }

}