package com.ne.kiosk.controller;

import com.ne.kiosk.service.BarcodeInputService;
import com.ne.kiosk.service.PrinterService;
import com.ne.kiosk.service.UltrasonicSensorService;
import com.ne.kiosk.service.UpdateService;
import com.ne.kiosk.util.ReplyFromResrc;
import com.ne.kiosk.util.RestUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api")
public class KioskController {

    private final UltrasonicSensorService sensorService;
    private final BarcodeInputService barcodeService;
    private final PrinterService printerService;
    private final RestUtil restUtil;
    private final UpdateService updateService;

    public KioskController(UltrasonicSensorService sensorService, BarcodeInputService barcodeService, PrinterService printerService, RestUtil restUtil, UpdateService updateService) {
        this.sensorService = sensorService;
        this.barcodeService = barcodeService;
        this.printerService = printerService;
        this.restUtil = restUtil;
        this.updateService = updateService;
    }

    private String updateStatus = "none";


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
//        printerService.testPrint();
        return ResponseEntity.ok(Map.of("result", printerService.getStatus()));
    }

    @PostMapping("/test")
    @ResponseBody
    public ResponseEntity<?> apiTest() {
        ReplyFromResrc reply = restUtil.ofPost("/kiosk/api/test");
        Map<String, Object> data = new HashMap<>();
        if(reply.isEmpty()) data.put("result", "No Content");
        else data.put("result", reply.getReply());
        return ResponseEntity.ok(data);
    }

    @PostMapping("/test2")
    @ResponseBody
    public ResponseEntity<?> apiTest2(@RequestBody Map<String, Object> params) {
        ReplyFromResrc reply = restUtil.ofPost("/kiosk/api/test2");
        Map<String, Object> data = new HashMap<>();
        if(reply.isEmpty()) data.put("result", "No Content");
        else data.put("result", reply.getReply());
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
        return ResponseEntity.ok(data);
    }

    @PostMapping("/paymentResult")
    @ResponseBody
    public ResponseEntity<?> paymentResult(@RequestBody Map<String, Object> paymentData) {
        ReplyFromResrc reply = restUtil.ofPost("/kiosk/api/paymentResult", paymentData);
        Map<String, Object> data = new HashMap<>();
        if(reply.isEmpty()) data.put("result", "No Content");
        else data.put("result", reply.getReply());
        return ResponseEntity.ok(data);
    }

    @PostMapping("/paymentPrint")
    @ResponseBody
    public ResponseEntity<?> paymentPrint(@RequestBody Map<String, Object> paymentData) {
        String cardno = paymentData.get("cardno").toString();
        String tamt = paymentData.get("tamt").toString();
        String trandate = paymentData.get("trandate").toString();
        String trantime = paymentData.get("trantime").toString();
        String authno = paymentData.get("authno").toString();
        String reqinst = paymentData.get("reqinst").toString();
        String trantype = paymentData.get("trantype").toString();
        printerService.printReceipt(cardno, tamt, trandate, trantime, authno, reqinst, trantype);
        return ResponseEntity.ok(Map.of("result", printerService.getStatus()));
    }

    @PostMapping("/enterPrint")
    @ResponseBody
    public ResponseEntity<?> enterPrint(@RequestBody List<Map<String, Object>> items) {
        for (Map<String, Object> item : items) {
            String name = (String) item.get("name");
            Integer quantity = (Integer) item.get("quantity");

            printerService.enterPrint(name, quantity);
        }
        return ResponseEntity.ok(Map.of("result", printerService.getStatus()));
    }

    @PostMapping("/findPaymentList")
    @ResponseBody
    public ResponseEntity<?> findPaymentList() {
        ReplyFromResrc reply = restUtil.ofPost("/kiosk/api/findPaymentList");
        Map<String, Object> data = new HashMap<>();
        if(reply.getReply() == null) data.put("result", "No Content");
        else data.put("result", reply.getReply());
        return ResponseEntity.ok(data);
    }

    @PostMapping("/paymentResultUpdate")
    @ResponseBody
    public ResponseEntity<?> paymentResultUpdate(@RequestBody Map<String, Object> paymentData) {
        ReplyFromResrc reply = restUtil.ofPost("/kiosk/api/paymentResultUpdate", paymentData);
        Map<String, Object> data = new HashMap<>();
        if(reply.getReply() == null) data.put("result", "No Content");
        else data.put("result", reply.getReply());
        return ResponseEntity.ok(data);
    }

    // 시스템 종료 API
    @PostMapping("/shutdown")
    public void shutdown() {
        System.exit(0);
    }

    // 상태 체크 API
    @PostMapping("updateCheck")
    public ResponseEntity<?> updateCheck() {
        return ResponseEntity.ok(updateStatus);
    }

    // 업데이트 시작 API
    @PostMapping("/startUpdate")
    public ResponseEntity<?> startUpdate() {
        try {
            updateStatus = updateService.checkAndDownloadUpdate();
        } catch (Exception e) {
            updateStatus = "failed";
        }
        return ResponseEntity.ok(updateStatus);
    }

}
