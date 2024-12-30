package com.shuyuan.controller;

import com.shuyuan.DTO.UserLogInDTO;
import com.shuyuan.VO.UserLoginVO;
import com.shuyuan.entity.User;
import com.shuyuan.properties.JwtProperties;
import com.shuyuan.result.Result;
import com.shuyuan.service.UserService;
import com.shuyuan.utils.JwtUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@Slf4j
@Api(tags = "用户相关接口")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtProperties jwtProperties;

    @ApiOperation("用户登录")
    @PostMapping("/login")
    public Result<UserLoginVO> login(@RequestBody UserLogInDTO userLogInDTO) {
        log.info("用户登录：{}", userLogInDTO);
        User user = userService.login(userLogInDTO);
        if (user == null) {
            return Result.error("用户名或密码错误");
        }
        // 登录成功后，生成jwt令牌
        Map<String, Object> claims = new HashMap<>();
        // 注意这里 JWT密钥的payout部分加入了员工的Id
        claims.put("userId", user.getId());
        String token = JwtUtil.createJWT(
                jwtProperties.getAdminSecretKey(),
                jwtProperties.getAdminTtl(),
                claims);
        UserLoginVO userLoginVO = new UserLoginVO();
        userLoginVO.setToken(token);
        userLoginVO.setUser(user);
        Result<UserLoginVO> success = Result.success(userLoginVO);
        success.setMessage("登录成功");
        return success;
    }

    @ApiOperation("用户注册")
    @PostMapping("/register")
    public Result register(@RequestBody User user) {
        log.info("用户注册:{}", user);
        userService.register(user);
        Result success = Result.success();
        success.setMessage("注册成功");
        return success;
    }

    @ApiOperation("获取用户列表")
    @GetMapping("/all")
    public Result<List<User>> getAllUsers() {
        log.info("获取所有用户信息");
        List<User> users = userService.getAllUsers();
        return Result.success(users);
    }

    @ApiOperation("更新用户信息")
    @PutMapping("/{id}")
    public Result updateUser(@PathVariable Integer id, @RequestBody User user) {
        log.info("更新用户信息：id={}, user={}", id, user);
        userService.updateUser(id, user);
        Result success = Result.success();
        success.setMessage("更新成功");
        return success;
    }

    @ApiOperation("删除用户")
    @DeleteMapping("/{id}")
    public Result deleteUser(@PathVariable Integer id) {
        log.info("删除用户：id={}", id);
        userService.deleteUser(id);
        Result success = Result.success();
        success.setMessage("删除成功");
        return success;
    }
}
