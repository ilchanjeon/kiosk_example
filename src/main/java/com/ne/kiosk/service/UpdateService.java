package com.ne.kiosk.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ne.kiosk.dto.VersionResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@Service
public class UpdateService {

    private String storageUrl = "https://ytsports.or.kr/storage/kiosk";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 바탕화면 경로
    private String getDesktopPath() {
        String userHome = System.getProperty("user.home");
        return userHome + File.separator + "Desktop";
    }

    // 로컬 버전 JSON 파일 경로
    private String getLocalVersionFilePath() {
        return getDesktopPath() + File.separator + "kiosk-version.json";
    }

    // 로컬 JAR 파일 경로
    private String getLocalJarFilePath() {
        return getDesktopPath() + File.separator + "kiosk.jar";
    }

    public String checkAndDownloadUpdate() {
        try {
            String currentVersion = getCurrentVersionFromLocal();
            VersionResponse latestVersion = downloadVersionJson();

            System.out.println("현재 버전: " + currentVersion);
            System.out.println("최신 버전: " + latestVersion.getVersion());

            // 2. 업데이트 필요 여부 확인
            if (isUpdateNeeded(currentVersion, latestVersion.getVersion())) {

                // 3. JAR 파일 다운로드
                downloadJarFile();

                return "update";
            }

            return "latest";

        } catch (Exception e) {
            return "error";
        }
    }

    // 서버에서 버전 정보만 덮어쓰기
    private VersionResponse downloadVersionJson() throws IOException {
        String versionUrl = storageUrl + "/kiosk-version.json";

        ResponseEntity<VersionResponse> response =
                restTemplate.getForEntity(versionUrl, VersionResponse.class);

        VersionResponse versionInfo = response.getBody();

        if (versionInfo == null) {
            throw new IOException("버전 정보를 가져올 수 없습니다.");
        }

        File versionFile = new File(getLocalVersionFilePath());
        objectMapper.writerWithDefaultPrettyPrinter()
                .writeValue(versionFile, versionInfo);

        return versionInfo;
    }

    // 서버에서 JAR 파일 다운로드
    private void downloadJarFile() throws IOException {
        String jarUrl = storageUrl + "/kiosk.jar";
        // 기존 파일 경로
        String oldJarPath = getLocalJarFilePath();

        // 새 파일 경로 (임시)
        String newJarPath = oldJarPath.replace(".jar", "_new.jar");
        File newJar = new File(newJarPath);

        ResponseEntity<byte[]> response = restTemplate.getForEntity(jarUrl, byte[].class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new IOException("JAR 다운로드 실패");
        }

        byte[] jarBytes = response.getBody();

        // 새 파일로 저장
        Files.write(newJar.toPath(), jarBytes);
    }

    // 로컬 버전 JSON에서 버전 읽기
    private String getCurrentVersionFromLocal() {
        try {
            File versionFile = new File(getLocalVersionFilePath());

            if (!versionFile.exists()) {
                return "0.0";
            }

            VersionResponse versionInfo = objectMapper.readValue(versionFile, VersionResponse.class);
            return versionInfo.getVersion();

        } catch (IOException e) {
            return "0.0";
        }
    }

    // 버전 비교
    private boolean isUpdateNeeded(String current, String latest) {
        try {
            String[] currentParts = current.split("\\.");
            String[] latestParts = latest.split("\\.");

            for (int i = 0; i < Math.min(currentParts.length, latestParts.length); i++) {
                int currentNum = Integer.parseInt(currentParts[i]);
                int latestNum = Integer.parseInt(latestParts[i]);
                if (latestNum > currentNum) return true;
                if (latestNum < currentNum) return false;
            }
            return false;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}