package com.journeymate.service.impl;

import com.journeymate.dto.WeatherDTOs;
import com.journeymate.entity.WeatherCache;
import com.journeymate.repository.WeatherCacheRepository;
import com.journeymate.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WeatherServiceImpl implements WeatherService {

    private final WeatherCacheRepository weatherCacheRepository;

    @Override
    public WeatherDTOs.WeatherResponse getWeatherForCity(String city) {
        String queryCity = (city == null || city.isBlank()) ? "Munnar" : city.trim();

        // Cached or mock generated
        WeatherCache cache = weatherCacheRepository.findByCityIgnoreCase(queryCity)
                .orElseGet(() -> {
                    WeatherCache newCache = WeatherCache.builder()
                            .city(queryCity)
                            .temperature(22.5)
                            .humidity(65)
                            .windSpeed(14.2)
                            .conditionText("Partly Cloudy")
                            .iconCode("02d")
                            .build();
                    return weatherCacheRepository.save(newCache);
                });

        List<WeatherDTOs.ForecastDay> forecast = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 0; i < 5; i++) {
            forecast.add(WeatherDTOs.ForecastDay.builder()
                    .date(today.plusDays(i).toString())
                    .maxTemp(cache.getTemperature() + (i % 3) - 1)
                    .minTemp(cache.getTemperature() - 5 - (i % 2))
                    .condition((i % 2 == 0) ? "Sunny" : "Partly Cloudy")
                    .build());
        }

        return WeatherDTOs.WeatherResponse.builder()
                .city(cache.getCity())
                .temperature(cache.getTemperature())
                .humidity(cache.getHumidity())
                .windSpeed(cache.getWindSpeed())
                .condition(cache.getConditionText())
                .iconCode(cache.getIconCode())
                .forecast(forecast)
                .build();
    }
}
