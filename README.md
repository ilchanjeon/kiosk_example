### 프로젝트 구조

````
kiosk-system/
├── src/
│   ├── main/
│   │   ├── java/com/kiosk/
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
│   │   │   │   └── BarcodeInputService.java
│   │   │   └── util
│   │   │       ├── ReplyFromResrc.java
│   │   │       └── RestUtil.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── templates/
│   │           └── index.html
└── pom.xml
````

### 필수 요구사항
- Java 17 이상
- Maven 3.6 이상

### 빌드 방법
1. Maven으로 JAR 파일 생성
   bashmvn clean package
   빌드 완료 후 target/kiosk-system-1.0.0.jar 파일 생성됨
2. 실행
   ```` java -jar target/kiosk-system-1.0.0.jar ````
   #### 또는 IDE에서 직접 실행:
- IntelliJ IDEA: KioskApplication 클래스 실행
- Eclipse: Run As > Java Application

### 장치 연결 확인
#### Windows에서 COM 포트 확인
1. 장치 관리자 실행
2. 포트(COM & LPT) 확인
3. 각 장치의 COM 포트 번호 확인

#### 필요시 SerialDeviceManager.java에서 포트 번호 수정:
````
private static final String ULTRASONIC_PORT = "COM3";
private static final String PRINTER_PORT = "COM5";
````

### 웹 인터페이스 접속
```` http://localhost:8083 ````

### 문제 해결
#### 포트를 열 수 없는 경우
- 다른 프로그램이 포트를 사용 중인지 확인
- 장치 관리자에서 드라이버 재설치
- 포트 번호가 올바른지 확인

#### 프린터가 작동하지 않는 경우

- 보레이트(115200) 확인
- ESC/POS 명령어 지원 프린터인지 확인
- 프린터 전원 및 용지 확인

#### 부팅 시 자동 실행 (Windows)

````
방법 1: 시작 프로그램에 등록 

Win + R → shell:startup
바로가기 생성

대상: java -jar C:\path\to\kiosk-system-1.0.0.jar

방법 2: Windows 서비스로 등록

NSSM (Non-Sucking Service Manager) 사용 권장
````

### 장치 연결 확인
#### Windows에서 COM 포트 확인
1. 장치 관리자 실행
2. 포트(COM & LPT) 확인
3. 각 장치의 COM 포트 번호 확인

#### 필요시 SerialDeviceManager.java에서 포트 번호 수정:
````
private static final String ULTRASONIC_PORT = "COM3";
private static final String PRINTER_PORT = "COM5";
````

### 주요 API 엔드포인트
````
GET / - 메인 화면
POST /api/barcode - 바코드 입력
GET /api/status - 현재 상태 조회
POST /api/test-print - 테스트 출력
POST /api/test2 - WebClient 를 이용한 RestAPI 예제
POST /api/test3  - WebClient 를 이용한 RestAPI 예제2
````
