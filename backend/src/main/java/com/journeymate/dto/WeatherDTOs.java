package com.journeymate.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

public class WeatherDTOs {

    @Data
    @Builder
    public static class WeatherResponse {
        private String city;
        private Double temperature; // In Celsius
        private Integer humidity;
        private Double windSpeed; // km/h
        private String condition;
        private String iconCode;
        private List<ForecastDay> forecast;
    }

    @Data
    @Builder
    public static class ForecastDay {
        private String date;
        private Double maxTemp;
        private Double minTemp;
        private String condition;
    }
}
