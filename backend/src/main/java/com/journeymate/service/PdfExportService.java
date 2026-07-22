package com.journeymate.service;

public interface PdfExportService {
    byte[] generateTripItineraryPdf(Long tripId);
}
