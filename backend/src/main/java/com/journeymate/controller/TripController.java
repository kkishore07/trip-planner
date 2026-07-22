package com.journeymate.controller;

import com.journeymate.dto.TripDTOs;
import com.journeymate.service.PdfExportService;
import com.journeymate.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;
    private final PdfExportService pdfExportService;

    @PostMapping
    public ResponseEntity<TripDTOs.TripResponse> createTrip(
            Authentication authentication,
            @Valid @RequestBody TripDTOs.CreateTripRequest request) {
        return ResponseEntity.ok(tripService.createTrip(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<TripDTOs.TripResponse>> getUserTrips(Authentication authentication) {
        return ResponseEntity.ok(tripService.getUserTrips(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripDTOs.TripResponse> getTripById(
            Authentication authentication,
            @PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTripById(authentication.getName(), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripDTOs.TripResponse> updateTrip(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody TripDTOs.CreateTripRequest request) {
        return ResponseEntity.ok(tripService.updateTrip(authentication.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(
            Authentication authentication,
            @PathVariable Long id) {
        tripService.deleteTrip(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generate")
    public ResponseEntity<TripDTOs.TripResponse> generateAiTrip(
            Authentication authentication,
            @Valid @RequestBody TripDTOs.GenerateItineraryRequest request) {
        return ResponseEntity.ok(tripService.generateAiTrip(authentication.getName(), request));
    }

    @GetMapping("/{id}/export-pdf")
    public ResponseEntity<byte[]> exportPdf(@PathVariable Long id) {
        byte[] pdfBytes = pdfExportService.generateTripItineraryPdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=journey_itinerary_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
