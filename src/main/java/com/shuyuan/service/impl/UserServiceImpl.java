package com.shuyuan.service.impl;

import com.shuyuan.DTO.UserLogInDTO;
import com.shuyuan.entity.User;
import com.shuyuan.mapper.UserMapper;
import com.shuyuan.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
    @Autowired
    UserMapper userMapper;

    @Override
    public User login(UserLogInDTO userLogInDTO) {
        User user = userMapper.selectByPnum(userLogInDTO.getPnum());
        if (user != null && user.getPassword().equals(userLogInDTO.getPassword())) {
            return user;
        } else {
            return null;
        }
    }

    @Override
    public void register(User user) {
        // TODO 参数校验--可以使用全局异常处理器
        userMapper.insert(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userMapper.selectAll();
    }

    @Override
    public void updateUser(Integer id, User user) {
        user.setId(id);
        int rows = userMapper.update(user);
        if (rows == 0) {
            throw new RuntimeException("用户不存在");
        }
    }

    @Override
    public void deleteUser(Integer id) {
        int rows = userMapper.deleteById(id);
        if (rows == 0) {
            throw new RuntimeException("用户不存在");
        }
    }
}
