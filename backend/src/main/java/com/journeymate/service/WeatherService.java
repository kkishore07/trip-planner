package com.journeymate.service;

import com.journeymate.dto.WeatherDTOs;

public interface WeatherService {
    WeatherDTOs.WeatherResponse getWeatherForCity(String city);
}
