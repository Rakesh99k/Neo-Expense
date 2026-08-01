package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.LendingDtos.*;
import com.expensetracker.backend.exception.EntityNotFoundException;
import com.expensetracker.backend.model.Lending;
import com.expensetracker.backend.model.LendingPayment;
import com.expensetracker.backend.model.LendingStatus;
import com.expensetracker.backend.model.LendingType;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.LendingPaymentRepository;
import com.expensetracker.backend.repository.LendingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class LendingService {

    private final LendingRepository lendingRepository;
    private final LendingPaymentRepository paymentRepository;
    private final CurrentUserService currentUserService;

    public LendingService(
            LendingRepository lendingRepository,
            LendingPaymentRepository paymentRepository,
            CurrentUserService currentUserService
    ) {
        this.lendingRepository = lendingRepository;
        this.paymentRepository = paymentRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public List<LendingResponse> list() {
        User user = currentUserService.getCurrentUser();
        return lendingRepository.findAllByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public LendingSummaryResponse summary() {
        User user = currentUserService.getCurrentUser();
        List<Lending> all = lendingRepository.findAllByUserId(user.getId());

        BigDecimal totalLent = BigDecimal.ZERO;
        BigDecimal totalBorrowed = BigDecimal.ZERO;
        BigDecimal owedToYou = BigDecimal.ZERO;
        BigDecimal youOwe = BigDecimal.ZERO;
        int activeLentCount = 0;
        int activeBorrowedCount = 0;

        for (Lending l : all) {
            BigDecimal remaining = l.getOriginalAmount().subtract(l.getReturnedAmount());
            boolean isActive = !LendingStatus.SETTLED.equals(l.getStatus());

            if (LendingType.LENT.equals(l.getType())) {
                totalLent = totalLent.add(l.getOriginalAmount());
                if (isActive) {
                    owedToYou = owedToYou.add(remaining);
                    activeLentCount++;
                }
            } else if (LendingType.BORROWED.equals(l.getType())) {
                totalBorrowed = totalBorrowed.add(l.getOriginalAmount());
                if (isActive) {
                    youOwe = youOwe.add(remaining);
                    activeBorrowedCount++;
                }
            }
        }

        BigDecimal netPosition = owedToYou.subtract(youOwe);
        List<String> knownPersons = lendingRepository.findDistinctPersonNamesByUserId(user.getId());

        return new LendingSummaryResponse(
                totalLent,
                totalBorrowed,
                owedToYou,
                youOwe,
                netPosition,
                activeLentCount,
                activeBorrowedCount,
                knownPersons
        );
    }

    @Transactional
    public LendingResponse add(LendingRequest request) {
        User user = currentUserService.getCurrentUser();
        validateType(request.type());

        Lending l = Lending.builder()
                .user(user)
                .type(request.type().toUpperCase())
                .personName(request.personName().trim())
                .originalAmount(request.originalAmount())
                .returnedAmount(BigDecimal.ZERO)
                .status(LendingStatus.ACTIVE)
                .notes(request.notes())
                .date(request.date())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return toResponse(lendingRepository.save(l));
    }

    @Transactional
    public LendingResponse update(UUID id, LendingRequest request) {
        User user = currentUserService.getCurrentUser();
        Lending l = findOwned(id, user);
        validateType(request.type());

        // Validate: original amount can't be less than what's already returned
        if (request.originalAmount().compareTo(l.getReturnedAmount()) < 0) {
            throw new IllegalArgumentException(
                    "Amount cannot be less than what has already been returned (" +
                            l.getReturnedAmount() + ")"
            );
        }

        l.setType(request.type().toUpperCase());
        l.setPersonName(request.personName().trim());
        l.setOriginalAmount(request.originalAmount());
        l.setNotes(request.notes());
        l.setDate(request.date());
        l.setUpdatedAt(Instant.now());

        // Recalculate status
        l.setStatus(computeStatus(l));

        return toResponse(lendingRepository.save(l));
    }

    @Transactional
    public void delete(UUID id) {
        User user = currentUserService.getCurrentUser();
        Lending l = findOwned(id, user);
        lendingRepository.delete(l);
    }

    @Transactional
    public LendingResponse recordPayment(UUID id, PaymentRequest request) {
        User user = currentUserService.getCurrentUser();
        Lending l = findOwned(id, user);

        // Validate: payment doesn't exceed remaining
        BigDecimal remaining = l.getOriginalAmount().subtract(l.getReturnedAmount());
        if (request.amount().compareTo(remaining) > 0) {
            throw new IllegalArgumentException(
                    "Payment amount (" + request.amount() +
                            ") exceeds remaining balance (" + remaining + ")"
            );
        }

        // Create payment record
        LendingPayment payment = LendingPayment.builder()
                .lending(l)
                .amount(request.amount())
                .date(request.date())
                .notes(request.notes())
                .createdAt(Instant.now())
                .build();

        l.getPayments().add(payment);

        // Update lending totals
        l.setReturnedAmount(l.getReturnedAmount().add(request.amount()));
        l.setStatus(computeStatus(l));
        l.setUpdatedAt(Instant.now());

        return toResponse(lendingRepository.save(l));
    }

    // ── Helpers ──────────────────────────────────────

    private Lending findOwned(UUID id, User user) {
        Lending l = lendingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lending not found"));
        if (!l.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Cannot access another user's lending");
        }
        return l;
    }

    private void validateType(String type) {
        if (type == null || !LendingType.ALL.contains(type.toUpperCase())) {
            throw new IllegalArgumentException("Type must be LENT or BORROWED");
        }
    }

    private String computeStatus(Lending l) {
        BigDecimal returned = l.getReturnedAmount();
        BigDecimal original = l.getOriginalAmount();

        if (returned.compareTo(BigDecimal.ZERO) == 0) {
            return LendingStatus.ACTIVE;
        }
        if (returned.compareTo(original) >= 0) {
            return LendingStatus.SETTLED;
        }
        return LendingStatus.PARTIAL;
    }

    private LendingResponse toResponse(Lending l) {
        BigDecimal remaining = l.getOriginalAmount().subtract(l.getReturnedAmount());
        List<PaymentResponse> paymentResponses = l.getPayments().stream()
                .map(p -> new PaymentResponse(
                        p.getId(),
                        p.getAmount(),
                        p.getDate(),
                        p.getNotes(),
                        p.getCreatedAt()
                ))
                .toList();

        return new LendingResponse(
                l.getId(),
                l.getType(),
                l.getPersonName(),
                l.getOriginalAmount(),
                l.getReturnedAmount(),
                remaining,
                l.getStatus(),
                l.getNotes(),
                l.getDate(),
                l.getCreatedAt(),
                l.getUpdatedAt(),
                paymentResponses
        );
    }
}