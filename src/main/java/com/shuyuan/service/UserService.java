package com.shuyuan.service;

import com.shuyuan.DTO.UserLogInDTO;
import com.shuyuan.entity.User;

import java.util.List;

public interface UserService {
    User login(UserLogInDTO userLogInDTO);

    void register(User user);

    List<User> getAllUsers();

    void updateUser(Integer id, User user);

    void deleteUser(Integer id);

}
