package com.journeymate.testing.selenium;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class E2ETestSuite {

    private WebDriver driver;

    @BeforeEach
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().window().maximize();
    }

    @Test
    public void testUserLoginAndTripGenerationFlow() throws InterruptedException {
        // Step 1: Open Login Page
        driver.get("http://localhost:3000/login");
        assertEquals("JourneyMate AI – Intelligent Travel Planning System", driver.getTitle());

        // Step 2: Click Quick Demo Login Button
        WebElement userDemoBtn = driver.findElement(By.xpath("//button[contains(text(),'User Demo')]"));
        userDemoBtn.click();

        WebElement submitBtn = driver.findElement(By.xpath("//button[contains(text(),'Sign In')]"));
        submitBtn.click();

        // Step 3: Verify Navigation to Dashboard
        Thread.sleep(2000);
        assertTrue(driver.getCurrentUrl().contains("/dashboard"));

        // Step 4: Navigate to Trip Planner
        WebElement plannerLink = driver.findElement(By.xpath("//a[contains(@href, '/planner')]"));
        plannerLink.click();

        // Step 5: Verify AI Generator form exists
        WebElement generateBtn = driver.findElement(By.xpath("//button[contains(text(),'Generate Smart Itinerary')]"));
        assertNotNull(generateBtn);
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
