package com.journeymate.service;

import com.journeymate.dto.ExpenseDTOs;
import java.util.List;

public interface ExpenseService {
    ExpenseDTOs.ExpenseResponse addExpense(String username, ExpenseDTOs.CreateExpenseRequest request);
    List<ExpenseDTOs.ExpenseResponse> getTripExpenses(String username, Long tripId);
    ExpenseDTOs.BudgetSummary getBudgetSummary(String username, Long tripId);
    void deleteExpense(String username, Long expenseId);
}
