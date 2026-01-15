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
@RequestMapping("/api")
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
//        model.addAttribute("distance", sensorService.getCurrentDistance());
//        model.addAttribute("userDetected", sensorService.isUserDetected());
        return "index";
    }

    @PostMapping("/barcode")
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

    @GetMapping("/status")
    @ResponseBody
    public ResponseEntity<?> getStatus() {
        sensorService.checkDistance(); // 상태 갱신
        return ResponseEntity.ok(Map.of(
                "distance", sensorService.getCurrentDistance(),
                "userDetected", sensorService.isUserDetected()
        ));
    }

    @PostMapping("/test-print")
    @ResponseBody
    public ResponseEntity<?> testPrint() {
        log.info("테스트 프린트 요청");
        printerService.testPrint();
        return ResponseEntity.ok(Map.of("result", printerService.getStatus()));
    }

    @PostMapping("/test")
    @ResponseBody
    public ResponseEntity<?> apiTest() {
        ReplyFromResrc reply = restUtil.ofPost("/kiosk/api/test");
        Map<String, Object> data = new HashMap<>();
        if(reply.isEmpty()) data.put("result", "No Content");
        else data.put("result", reply.getReply());
        log.debug("API TEST 응답: {}", data);
        return ResponseEntity.ok(data);
    }

    @PostMapping("/test2")
    @ResponseBody
    public ResponseEntity<?> apiTest2() {
        ReplyFromResrc reply = restUtil.ofPost("/kiosk/api/test2");
        Map<String, Object> data = new HashMap<>();
        if(reply.isEmpty()) data.put("result", "No Content");
        else data.put("result", reply.getReply());
        log.debug("API TEST 응답: {}", data);
        return ResponseEntity.ok(data);
    }

    @PostMapping("/test3")
    @ResponseBody
    public ResponseEntity<?> apiTest3() {
        Map<String, Object> params = new HashMap<>();
        params.put("sampleKey", "sampleValue");
        ReplyFromResrc reply = restUtil.ofPost("/kiosk/api/test3", params);
        Map<String, Object> data = new HashMap<>();
        if(reply.isEmpty()) data.put("result", "No Content");
        else data.put("result", reply.getReply());
        log.debug("API TEST 응답: {}", data);
        return ResponseEntity.ok(data);
    }
}
