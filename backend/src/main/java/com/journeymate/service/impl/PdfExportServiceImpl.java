package com.journeymate.service.impl;

import com.journeymate.entity.ItineraryItem;
import com.journeymate.entity.Trip;
import com.journeymate.exception.ResourceNotFoundException;
import com.journeymate.repository.TripRepository;
import com.journeymate.service.PdfExportService;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class PdfExportServiceImpl implements PdfExportService {

    private final TripRepository tripRepository;

    @Override
    public byte[] generateTripItineraryPdf(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with ID: " + tripId));

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PDPage page = new PDPage();
            document.addPage(page);

            PDPageContentStream contentStream = new PDPageContentStream(document, page);

            // Title Header
            contentStream.beginText();
            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 20);
            contentStream.newLineAtOffset(50, 750);
            contentStream.showText("JourneyMate AI - Itinerary: " + trip.getDestination());
            contentStream.endText();

            // Trip Details Subtitle
            contentStream.beginText();
            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
            contentStream.newLineAtOffset(50, 725);
            contentStream.showText("Dates: " + trip.getStartDate() + " to " + trip.getEndDate() + " | Travelers: " + trip.getTravelersCount());
            contentStream.endText();

            contentStream.beginText();
            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
            contentStream.newLineAtOffset(50, 705);
            contentStream.showText("Budget: $" + trip.getBudget() + " | Travel Mode: " + trip.getTravelMode());
            contentStream.endText();

            int yOffset = 660;

            if (trip.getItineraries() != null && !trip.getItineraries().isEmpty()) {
                for (ItineraryItem item : trip.getItineraries()) {
                    if (yOffset < 100) {
                        contentStream.close();
                        page = new PDPage();
                        document.addPage(page);
                        contentStream = new PDPageContentStream(document, page);
                        yOffset = 750;
                    }

                    contentStream.beginText();
                    contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);
                    contentStream.newLineAtOffset(50, yOffset);
                    contentStream.showText("Day " + item.getDayNumber() + ": " + sanitize(item.getTitle()));
                    contentStream.endText();

                    yOffset -= 20;
                    contentStream.beginText();
                    contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                    contentStream.newLineAtOffset(60, yOffset);
                    contentStream.showText("Timing: " + sanitize(item.getSuggestedTiming()) + " | Est Cost: $" + item.getEstimatedCost());
                    contentStream.endText();

                    yOffset -= 15;
                    contentStream.beginText();
                    contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE), 10);
                    contentStream.newLineAtOffset(60, yOffset);
                    contentStream.showText("Activities: " + truncate(sanitize(item.getActivities()), 70));
                    contentStream.endText();

                    yOffset -= 35;
                }
            } else {
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE), 12);
                contentStream.newLineAtOffset(50, yOffset);
                contentStream.showText("No day-wise itinerary generated yet.");
                contentStream.endText();
            }

            contentStream.close();
            document.save(baos);
            return baos.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Error generating PDF itinerary", e);
        }
    }

    private String sanitize(String input) {
        if (input == null) return "";
        return input.replaceAll("[^\\x00-\\x7F]", ""); // Remove non-ASCII for PDFBox standard font compatibility
    }

    private String truncate(String input, int maxLen) {
        if (input == null) return "";
        if (input.length() <= maxLen) return input;
        return input.substring(0, maxLen - 3) + "...";
    }
}
