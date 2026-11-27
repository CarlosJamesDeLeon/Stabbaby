package com.stabbaby;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StabbabyApplication {

    public static void main(String[] args) {
        SpringApplication.run(StabbabyApplication.class, args);
    }
}
