package com.shuyuan.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pet {
    private Integer id;

    private String name;

    private String image;

    private Integer age;

    private BigDecimal price;

    private String description;
}