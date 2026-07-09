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
### 프로젝트 설명
해당 프로젝트는 키오스크 기반 무인 결제 시스템으로, Java를 활용하여 키오스크 기기와 시리얼(Serial) 통신을 구현하고 카드 결제 및 영수증 출력 기능을 개발하였습니다.

화면은 바닐라 JavaScript(Vanilla JavaScript)를 사용하여 SPA(Single Page Application) 방식과 유사하게 구현하여 화면 전환 시 페이지 새로고침 없이 사용자 경험을 향상시켰습니다. 또한 키오스크에 탑재된 초음파 센서를 활용해 사용자를 감지하고, 화면 자동 활성화 기능을 제공하여 편의성을 높였습니다.

주요 기능은 다음과 같습니다.

일일 입장권 발권 및 결제
월 수강권 및 월 이용권 결제
수강 출석 체크
당일 결제 취소

화면은 

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

#### 프로젝트 구조 및 주요 기능 설명
````
- app.js : KIOSK의 프론트엔드 로직을 담당하는 JavaScript 파일로, 페이지 간 이동, API 호출, UI 업데이트 등을 처리
- pages/ : KIOSK의 각 페이지별 JavaScript 파일이 위치하는 디렉토리로, cancel1.js, home.js, memberVisit.js, monthMember.js, onedayClass.js 등이 포함
- global.js : KIOSK 전체에서 공통으로 사용되는 JavaScript 함수나 변수를 정의하는 파일
- utils.js : KIOSK에서 자주 사용되는 유틸리티 함수들을 모아놓은 파일
````


#### Windows Bat Setting 내용
````
1. KIOSK STARTUP
   - COMMAND 로 javaw -jar kiosk.jar 실행 (백그라운드 실행)
   - 서버 실행 후 영통복합체육센터 서버에서 kiosk-version.json 파일의 버전 정보 읽고 현재 버전과 비교하여 업데이트 필요 여부 판단
   
   1-1 업데이트 필요 시 KIOSK 내에서 업데이트 진행 (업데이트 완료 후 kiosk-version.json 파일의 버전 정보 업데이트, kiosk.jar 파일 교체)
   1-2 업데이트 이후 서버 API 호출하여 KIOSK 종료 요청 (POST /api/shutdown)
   1-3 이후 KIOSK에서 bat 파일 실행하여 KIOSK 재시작
   or
   2-1 업데이트 필요 없을 시 기존 버전으로 KIOSK 실행

2. KIOSK SHUTDOWN
    - 서버 API 호출하여 KIOSK 종료 요청 (POST /api/shutdown)
````

#### KIOSK 업데이트 반영 방법
````
1. 새로운 JAR 파일로 교체
   - 새로운 JAR 파일을 빌드하여 기존 JAR 파일과 교체
   - 서버 저장소 ROOT > storage > kiosk > kiosk.jar 위치에 새로운 JAR 파일 업로드 (FTP 등 사용) * kiosk.jar 명 유지
2. 버전 정보 업데이트
   - 같은 경로 내에 kiosk-version.json 파일 내 VERSION 상수 업데이트 (예: "1.0.1 -> 1.0.2")
3. KIOSK 재시작
   - KIOSK 내에 로컬로 실행 중인 서버 종료 후 재실행
````

### 주요 API 엔드포인트
#### KIOSK에서 서버로 요청하는 API 엔드포인트
````
GET /api/status - 초음파 거리 조회
POST /api/paymentResult - OFFLINE 결제 결과 수신
POST /api/paymentPrint - OFFLINE 결제 영수증 프린트 요청
POST /api/enterPrint - 일일입장 프린트 요청
POST /api/oneDayPersonData - 일일입장 인원 데이터 수신
POST /api/findPaymentList  - OFFLINE 결제 내역 조회 요청
POST /api/paymentResultUpdate  - OFFLINE 결제 취소 업데이트 요청
POST /api/findMemberEducation  - 월권/정기교육 출석 요청 (1건 일시 출석체크 외 조회)
POST /api/insertAttendance  - 월권/정기교육 회원 출석 등록 요청
POST /api/findMonthlyRegist  - 월권 연장/정기교육 선접수 조회 요청
POST /api/updateMonthlyRegist  - 월권 연장/정기교육 선접수 업데이트 요청
POST /api/holiydayCheck  - 공휴일 여부 조회 요청
POST /api/shutdown  - 시스템 종료 요청
POST /api/updateCheck  - jar 버전관리 위한 업데이트 상태 요청
POST /api/startUpdate  - jar 버전관리 위한 업데이트 시작 요청
````
