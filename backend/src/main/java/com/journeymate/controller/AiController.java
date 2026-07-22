package com.journeymate.controller;

import com.journeymate.dto.AiDTOs;
import com.journeymate.service.AiItineraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiItineraryService aiItineraryService;

    @PostMapping("/chat")
    public ResponseEntity<AiDTOs.ChatResponse> chat(@RequestBody AiDTOs.ChatRequest request) {
        String reply = aiItineraryService.generateChatReply(request.getMessage(), request.getDestinationContext());
        AiDTOs.ChatResponse response = AiDTOs.ChatResponse.builder()
                .reply(reply)
                .suggestedDestination(request.getDestinationContext())
                .build();
        return ResponseEntity.ok(response);
    }
}
