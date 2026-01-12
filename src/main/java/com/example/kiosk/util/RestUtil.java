package com.example.kiosk.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.Optional;

@Component
public class RestUtil {

    private final WebClient webClient;
    private final MessageSource messageSource;
    private final HttpServletRequest request;

    private static String resrc = "https://ytsports.or.kr";


    public RestUtil(WebClient webClient, MessageSource messageSource, HttpServletRequest request) {
        this.webClient = webClient;
        this.messageSource = messageSource;
        this.request = request;
    }

    public ReplyFromResrc ofPost(String apiUri, Map<String, Object> param) {
        boolean checkEmpty = true;
        String content = "no Content";

        var requestApiUrl = resrc + apiUri;

        ResponseEntity<String> responseEntity = null;

        responseEntity = Optional.ofNullable(this.webClient
                        .post()
                        .uri(requestApiUrl)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML)
                        .header("KIOSK-NAME", "ytkiosk")
                        .bodyValue(param)
                        .retrieve().toEntity(String.class)
                        .block())
                .orElseGet(()->ResponseEntity.noContent().build());


        if(!responseEntity.getStatusCode().equals(HttpStatus.NO_CONTENT)){
            checkEmpty = false;
            content = responseEntity.getBody();
        }


        return ReplyFromResrc.builder().isEmpty(checkEmpty).reply(content).build();
    }

    /**
     *
     */
    public ReplyFromResrc ofPost(String apiUri) {
        boolean checkEmpty = true;
        String content = "no Content";
        var requestApiUrl = resrc + apiUri;

        ResponseEntity<String> responseEntity = null;

        responseEntity = Optional.ofNullable(this.webClient
                        .post()
                        .uri(requestApiUrl)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("KIOSK-NAME", "ytkiosk")
                        .accept(MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML)
                        .retrieve().toEntity(String.class)
                        .block())
                .orElseGet(()->ResponseEntity.noContent().build());

        if(!responseEntity.getStatusCode().equals(HttpStatus.NO_CONTENT)){
            checkEmpty = false;
            content = responseEntity.getBody();
        }


        return ReplyFromResrc.builder().isEmpty(checkEmpty).reply(content).build();
    }

}
