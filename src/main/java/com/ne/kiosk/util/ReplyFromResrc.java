package com.ne.kiosk.util;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReplyFromResrc {
    private boolean isEmpty;
    private String reply;
}
