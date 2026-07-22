package com.journeymate.controller;

import com.journeymate.dto.ExpenseDTOs;
import com.journeymate.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseDTOs.ExpenseResponse> addExpense(
            Authentication authentication,
            @Valid @RequestBody ExpenseDTOs.CreateExpenseRequest request) {
        return ResponseEntity.ok(expenseService.addExpense(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDTOs.ExpenseResponse>> getTripExpenses(
            Authentication authentication,
            @RequestParam Long tripId) {
        return ResponseEntity.ok(expenseService.getTripExpenses(authentication.getName(), tripId));
    }

    @GetMapping("/summary")
    public ResponseEntity<ExpenseDTOs.BudgetSummary> getBudgetSummary(
            Authentication authentication,
            @RequestParam Long tripId) {
        return ResponseEntity.ok(expenseService.getBudgetSummary(authentication.getName(), tripId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(
            Authentication authentication,
            @PathVariable Long id) {
        expenseService.deleteExpense(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
