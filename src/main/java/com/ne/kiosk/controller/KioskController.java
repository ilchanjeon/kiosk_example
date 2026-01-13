package com.ne.kiosk.controller;

import com.ne.kiosk.service.BarcodeInputService;
import com.ne.kiosk.service.PrinterService;
import com.ne.kiosk.service.UltrasonicSensorService;
import com.ne.kiosk.util.ReplyFromResrc;
import com.ne.kiosk.util.RestUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Controller
public class KioskController {

    private final UltrasonicSensorService sensorService;
    private final BarcodeInputService barcodeService;
    private final PrinterService printerService;
    private final RestUtil restUtil;

    public KioskController(UltrasonicSensorService sensorService, BarcodeInputService barcodeService, PrinterService printerService, RestUtil restUtil) {
        this.sensorService = sensorService;
        this.barcodeService = barcodeService;
        this.printerService = printerService;
        this.restUtil = restUtil;
    }


    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("distance", sensorService.getCurrentDistance());
        model.addAttribute("userDetected", sensorService.isUserDetected());
        return "index";
    }

    @PostMapping("/api/barcode")
    @ResponseBody
    public ResponseEntity<?> submitBarcode(@RequestBody Map<String, String> request) {
        String barcode = request.get("barcode");
        log.info("API 바코드 입력: {}", barcode);

        barcodeService.processBarcodeInput(barcode);

        return ResponseEntity.ok(Map.of(
                "result", barcodeService.isUserDetected(),
                "barcode", barcode
        ));
    }

    @GetMapping("/api/status")
    @ResponseBody
    public ResponseEntity<?> getStatus() {
        sensorService.checkDistance(); // 상태 갱신
        return ResponseEntity.ok(Map.of(
                "distance", sensorService.getCurrentDistance(),
                "userDetected", sensorService.isUserDetected()
        ));
    }

    @PostMapping("/api/test-print")
    @ResponseBody
    public ResponseEntity<?> testPrint() {
        log.info("테스트 프린트 요청");
        printerService.testPrint();
        return ResponseEntity.ok(Map.of("result", printerService.getStatus()));
    }

    @PostMapping("/api/test")
    @ResponseBody
    public ResponseEntity<?> apiTest() {
        ReplyFromResrc reply = restUtil.ofPost("/kiosk/api/test");
        String result = "";
        if(reply.isEmpty()) result = "No Content";
        else result = reply.getReply();
        return ResponseEntity.ok(Map.of("result", result));
    }

    @PostMapping("/api/test2")
    @ResponseBody
    public ResponseEntity<?> apiTest2() {
        ReplyFromResrc reply = restUtil.ofPost("/kiosk/api/test2");
        String result = "";
        if(reply.isEmpty()) result = "No Content";
        else result = reply.getReply();
        return ResponseEntity.ok(Map.of("result", result));
    }

    @PostMapping("/api/test3")
    @ResponseBody
    public ResponseEntity<?> apiTest3() {
        Map<String, Object> params = new HashMap<>();
        params.put("sampleKey", "sampleValue");
        ReplyFromResrc reply = restUtil.ofPost("/kiosk/api/test3", params);
        String result = "";
        if(reply.isEmpty()) result = "No Content";
        else result = reply.getReply();
        return ResponseEntity.ok(Map.of("result", result));
    }
}
