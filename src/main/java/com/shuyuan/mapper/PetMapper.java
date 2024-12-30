package com.shuyuan.mapper;

import com.shuyuan.entity.Pet;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PetMapper {

    @Select("select * from pet")
    List<Pet> selectAll();

    @Insert("insert into pet (name, image, age, price, description) " +
            "values (#{name}, #{image}, #{age}, #{price}, #{description})")
    void insert(Pet pet);

    // 更新宠物信息
    int update(Pet pet);

    @Delete("delete from pet where id = #{id}")
    int deleteById(Integer id);
}