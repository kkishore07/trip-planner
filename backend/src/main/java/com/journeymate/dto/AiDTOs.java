package com.journeymate.dto;

import lombok.Builder;
import lombok.Data;

public class AiDTOs {

    @Data
    public static class ChatRequest {
        private String message;
        private String destinationContext;
    }

    @Data
    @Builder
    public static class ChatResponse {
        private String reply;
        private String suggestedDestination;
    }
}
