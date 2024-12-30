package com.shuyuan.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(description = "员工登录时传递的数据模型")
public class UserLogInDTO {
    @JsonProperty("password")
    private String password;

    @JsonProperty("phone")
    private String pnum;
}
