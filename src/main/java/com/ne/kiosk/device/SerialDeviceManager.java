package com.ne.kiosk.device;

import com.fazecast.jSerialComm.SerialPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class SerialDeviceManager {

    private final Map<String, SerialPort> ports = new HashMap<>();

    // 장치별 포트 설정
    private static final String ULTRASONIC_PORT = "COM3";
    private static final int ULTRASONIC_BAUD = 9600;

    private static final String PRINTER_PORT = "COM5";
    private static final int PRINTER_BAUD = 115200;

    @PostConstruct
    public void init() {
        log.info("시리얼 장치 초기화 시작");

        // 초음파 센서 초기화
        initPort("ultrasonic", ULTRASONIC_PORT, ULTRASONIC_BAUD);

        // 프린터 초기화
        initPort("printer", PRINTER_PORT, PRINTER_BAUD);

        log.info("시리얼 장치 초기화 완료");
    }

    private void initPort(String name, String portName, int baudRate) {
        try {
            SerialPort port = SerialPort.getCommPort(portName);
            port.setBaudRate(baudRate);
            port.setNumDataBits(8);
            port.setNumStopBits(1);
            port.setParity(SerialPort.NO_PARITY);
            port.setComPortTimeouts(SerialPort.TIMEOUT_READ_SEMI_BLOCKING, 0, 0);

            if (port.openPort()) {
                ports.put(name, port);
                log.info("{} 포트 열림: {} ({}bps)", name, portName, baudRate);
            } else {
                log.error("{} 포트 열기 실패: {}", name, portName);
            }

        } catch (Exception e) {
            log.error("{} 포트 초기화 중 오류: {}", name, e.getMessage());
        }
    }

    public SerialPort getPort(String name) {
        return ports.get(name);
    }

    public InputStream getInputStream(String name) {
        SerialPort port = ports.get(name);

        return port != null ? port.getInputStream() : null;
    }

    public OutputStream getOutputStream(String name) {
        SerialPort port = ports.get(name);
        return port != null ? port.getOutputStream() : null;
    }

    public boolean isPortOpen(String name) {
        SerialPort port = ports.get(name);
        return port != null && port.isOpen();
    }

    @PreDestroy
    public void cleanup() {
        log.info("시리얼 포트 정리 시작");
        ports.forEach((name, port) -> {
            if (port.isOpen()) {
                port.closePort();
                log.info("{} 포트 닫힘", name);
            }
        });
        ports.clear();
    }
}
