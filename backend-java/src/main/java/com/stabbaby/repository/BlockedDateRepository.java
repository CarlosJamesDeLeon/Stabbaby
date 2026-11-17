package com.stabbaby.repository;

import com.stabbaby.model.BlockedDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlockedDateRepository extends JpaRepository<BlockedDate, Long> {
    Optional<BlockedDate> findByDate(String date);
}
