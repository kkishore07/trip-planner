package com.journeymate.dto;

import com.journeymate.entity.ExpenseCategory;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

public class ExpenseDTOs {

    @Data
    public static class CreateExpenseRequest {
        @NotNull(message = "Trip ID is required")
        private Long tripId;

        @NotNull(message = "Expense category is required")
        private ExpenseCategory category;

        @NotNull(message = "Amount is required")
        private BigDecimal amount;

        private String currency = "INR";
        private String description;
        private LocalDate expenseDate;
    }

    @Data
    public static class ExpenseResponse {
        private Long id;
        private Long tripId;
        private ExpenseCategory category;
        private BigDecimal amount;
        private String currency;
        private String description;
        private LocalDate expenseDate;
    }

    @Data
    public static class BudgetSummary {
        private BigDecimal totalBudget;
        private BigDecimal totalSpent;
        private BigDecimal remainingBudget;
        private Map<ExpenseCategory, BigDecimal> categoryBreakdown;
        private Double spendingPercentage;
    }
}
