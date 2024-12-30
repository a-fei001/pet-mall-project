package com.shuyuan.mapper;

import com.shuyuan.entity.User;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface UserMapper {

    @Select("select * from user where pnum = #{pnum}")
    public User selectByPnum(String pnum);

    @Insert("insert into user (name, pnum, password, property) " +
            "values (#{name}, #{pnum}, #{password}, #{property})")
    void insert(User user);

    @Select("select * from user")
    List<User> selectAll();

    // 更新用户信息
    int update(User user);

    @Delete("delete from user where id = #{id}")
    int deleteById(Integer id);
}
