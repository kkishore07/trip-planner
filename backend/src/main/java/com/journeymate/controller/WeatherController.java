package com.journeymate.controller;

import com.journeymate.dto.WeatherDTOs;
import com.journeymate.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping
    public ResponseEntity<WeatherDTOs.WeatherResponse> getWeather(@RequestParam(required = false, defaultValue = "Munnar") String city) {
        return ResponseEntity.ok(weatherService.getWeatherForCity(city));
    }
}
