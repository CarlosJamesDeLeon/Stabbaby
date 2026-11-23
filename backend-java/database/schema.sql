-- =====================================================================
-- Stabbaby: database setup for the Customer Booking Management module
-- Run this script once in MySQL Workbench (File > Open SQL Script > Run).
-- It is safe to run again: it only creates what does not exist yet.
-- =====================================================================

-- 1. Database
CREATE DATABASE IF NOT EXISTS stabbaby_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Application user (the app should not connect as root)
--    CHANGE THE PASSWORD below, then put the same one in
--    backend-java/application-local.properties (never commit that file).
CREATE USER IF NOT EXISTS 'stabbaby_user'@'localhost' IDENTIFIED BY 'ChangeMe_123';
GRANT ALL PRIVILEGES ON stabbaby_db.* TO 'stabbaby_user'@'localhost';
FLUSH PRIVILEGES;

USE stabbaby_db;

-- 3. Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  reference_code  VARCHAR(20)  NOT NULL UNIQUE,
  full_name       VARCHAR(100) NOT NULL,
  contact_number  VARCHAR(20)  NOT NULL,
  preferred_date  DATE         NOT NULL,
  preferred_time  VARCHAR(10)  NOT NULL,
  piercing_type   VARCHAR(20)  NOT NULL,
  notes           VARCHAR(500) NULL,
  status          ENUM('PENDING','CONFIRMED','CANCELLED','COMPLETED')
                  NOT NULL DEFAULT 'PENDING',
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_booking_slot (preferred_date, preferred_time),
  INDEX idx_booking_contact (contact_number)
);

-- Note: the blocked_dates table (calendar module) is created automatically
-- by Spring Boot/Hibernate on first run (spring.jpa.hibernate.ddl-auto=update).