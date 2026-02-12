### 프로젝트 구조

````
kiosk-system/
├── src/
│   ├── main/
│   │   ├── java/com/ne/kiosk/
│   │   │   ├── KioskApplication.java
│   │   │   ├── config/
│   │   │   │   ├── WebSocketConfig.java
│   │   │   │   └── WebClientConfig.java
│   │   │   ├── controller/
│   │   │   │   └── KioskController.java
│   │   │   ├── device/
│   │   │   │   └── SerialDeviceManager.java
│   │   │   ├── service/
│   │   │   │   ├── UltrasonicSensorService.java
│   │   │   │   ├── PrinterService.java
│   │   │   │   ├── BarcodeInputService.java
│   │   │   │   └── UpdateService.java
│   │   │   └── util
│   │   │       ├── ReplyFromResrc.java
│   │   │       └── RestUtil.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static 
│   │       │   ├── css
│   │       │   │   └── index.css
│   │       │   ├── resources_kio/
│   │       │   └── js
│   │       │       │── app.js         
│   │       │       ├── global.js
│   │       │       └── utils.js
│   │       │       └── pages/
│   │       │           │── cancel1.js
│   │       │           │── cancel1.js
│   │       │           │── home.js
│   │       │           │── memberVisit.js
│   │       │           │── monthMember.js
│   │       │           └── onedayClass.js
│   │       └── templates/
│   │           └── index.html
└── pom.xml
````

### 접속 URL
```` http://localhost:8083 ````

### 프로젝트 버전
- Java 17 이상

### 빌드 방법
1. Maven으로 JAR 파일 생성
   bashmvn clean package
   빌드 완료 후 target/kiosk.jar 파일 생성됨
2. 실행
   ```` java -jar target/kiosk.jar ````, 
   ```` javaw -jar target/kiosk.jar ````

### 참고사항

#### 필요시 SerialDeviceManager.java에서 포트 번호 수정:
````
private static final String ULTRASONIC_PORT = "COM3";
private static final String PRINTER_PORT = "COM5";
````

#### Windows Bat Setting 내용

````
방법 1: 시작 프로그램에 등록 

Win + R → shell:startup
바로가기 생성

대상: java -jar C:\path\to\kiosk-system-1.0.0.jar

방법 2: Windows 서비스로 등록

NSSM (Non-Sucking Service Manager) 사용 권장
````

### 주요 API 엔드포인트
````
POST /api/barcode - 바코드 입력
GET /api/status - 현재 상태 조회
POST /api/test-print - 테스트 출력
POST /api/test - WebClient 를 이용한 RestAPI 예제1 (Data Response)
POST /api/test2 - WebClient 를 이용한 RestAPI 예제2 (Void Response)
POST /api/test3  - WebClient 를 이용한 RestAPI 예제3 (Parameter 전송)
POST /api/shutdown  - 서버 Shutdown 요청
POST /api/updateCheck  - jar 버전관리를 위한 update 상태 확인 요청
POST /api/startUpdate  - jar 버전관리를 위한 update 시작 요청
````
