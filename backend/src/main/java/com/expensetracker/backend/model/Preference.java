package com.expensetracker.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "preferences")
public class Preference {
    @Id
    private Long id; // same as user id for one-to-one mapping

    @OneToOne(optional = false)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String currency = "USD";

    @Column(nullable = false)
    private String theme = "neon";
}

