package com.journeymate.service.impl;

import com.journeymate.dto.ExpenseDTOs;
import com.journeymate.entity.Expense;
import com.journeymate.entity.ExpenseCategory;
import com.journeymate.entity.Trip;
import com.journeymate.exception.ResourceNotFoundException;
import com.journeymate.repository.ExpenseRepository;
import com.journeymate.repository.TripRepository;
import com.journeymate.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final TripRepository tripRepository;

    @Override
    @Transactional
    public ExpenseDTOs.ExpenseResponse addExpense(String username, ExpenseDTOs.CreateExpenseRequest request) {
        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with ID: " + request.getTripId()));

        Expense expense = Expense.builder()
                .trip(trip)
                .category(request.getCategory())
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .description(request.getDescription())
                .expenseDate(request.getExpenseDate() != null ? request.getExpenseDate() : java.time.LocalDate.now())
                .build();

        Expense saved = expenseRepository.save(expense);

        // Recalculate trip total expense
        BigDecimal currentTotal = trip.getTotalExpense() != null ? trip.getTotalExpense() : BigDecimal.ZERO;
        trip.setTotalExpense(currentTotal.add(request.getAmount()));
        tripRepository.save(trip);

        return mapToResponse(saved);
    }

    @Override
    public List<ExpenseDTOs.ExpenseResponse> getTripExpenses(String username, Long tripId) {
        List<Expense> expenses = expenseRepository.findByTripIdOrderByExpenseDateDesc(tripId);
        return expenses.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ExpenseDTOs.BudgetSummary getBudgetSummary(String username, Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with ID: " + tripId));

        List<Expense> expenses = expenseRepository.findByTripIdOrderByExpenseDateDesc(tripId);
        BigDecimal budget = trip.getBudget() != null ? trip.getBudget() : BigDecimal.ZERO;

        BigDecimal totalSpent = BigDecimal.ZERO;
        Map<ExpenseCategory, BigDecimal> breakdown = new EnumMap<>(ExpenseCategory.class);

        for (ExpenseCategory cat : ExpenseCategory.values()) {
            breakdown.put(cat, BigDecimal.ZERO);
        }

        for (Expense e : expenses) {
            totalSpent = totalSpent.add(e.getAmount());
            breakdown.put(e.getCategory(), breakdown.get(e.getCategory()).add(e.getAmount()));
        }

        BigDecimal remaining = budget.subtract(totalSpent);

        Double spendingPct = 0.0;
        if (budget.compareTo(BigDecimal.ZERO) > 0) {
            spendingPct = totalSpent.divide(budget, 4, RoundingMode.HALF_UP).doubleValue() * 100;
        }

        ExpenseDTOs.BudgetSummary summary = new ExpenseDTOs.BudgetSummary();
        summary.setTotalBudget(budget);
        summary.setTotalSpent(totalSpent);
        summary.setRemainingBudget(remaining);
        summary.setCategoryBreakdown(breakdown);
        summary.setSpendingPercentage(spendingPct);

        return summary;
    }

    @Override
    @Transactional
    public void deleteExpense(String username, Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + expenseId));

        Trip trip = expense.getTrip();
        if (trip != null && trip.getTotalExpense() != null) {
            BigDecimal updatedTotal = trip.getTotalExpense().subtract(expense.getAmount());
            if (updatedTotal.compareTo(BigDecimal.ZERO) < 0) updatedTotal = BigDecimal.ZERO;
            trip.setTotalExpense(updatedTotal);
            tripRepository.save(trip);
        }

        expenseRepository.delete(expense);
    }

    private ExpenseDTOs.ExpenseResponse mapToResponse(Expense e) {
        ExpenseDTOs.ExpenseResponse res = new ExpenseDTOs.ExpenseResponse();
        res.setId(e.getId());
        res.setTripId(e.getTrip().getId());
        res.setCategory(e.getCategory());
        res.setAmount(e.getAmount());
        res.setCurrency(e.getCurrency());
        res.setDescription(e.getDescription());
        res.setExpenseDate(e.getExpenseDate());
        return res;
    }
}
