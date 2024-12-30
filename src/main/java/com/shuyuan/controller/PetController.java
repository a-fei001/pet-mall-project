package com.shuyuan.controller;

import com.shuyuan.entity.Pet;
import com.shuyuan.result.Result;
import com.shuyuan.service.PetService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pet")
@Slf4j
@Api(tags = "宠物相关接口")
public class PetController {

    @Autowired
    private PetService petService;

    @ApiOperation("获取宠物列表")
    @GetMapping("/all")
    public Result<List<Pet>> getAllPets() {
        log.info("获取所有宠物信息");
        List<Pet> pets = petService.getAllPets();
        return Result.success(pets);
    }

    @ApiOperation("添加宠物")
    @PostMapping("/add")
    public Result<Pet> addPet(@RequestBody Pet pet) {
        log.info("添加宠物：{}", pet);
        Pet savedPet = petService.addPet(pet);
        Result<Pet> success = Result.success(savedPet);
        success.setMessage("添加成功");
        return success;
    }

    @ApiOperation("更新宠物信息")
    @PutMapping("/{id}")
    public Result updatePet(@PathVariable Integer id, @RequestBody Pet pet) {
        log.info("更新宠物信息：id={}, pet={}", id, pet);
        petService.updatePet(id, pet);
        Result success = Result.success();
        success.setMessage("更新成功");
        return success;
    }

    @ApiOperation("删除宠物")
    @DeleteMapping("/{id}")
    public Result deletePet(@PathVariable Integer id) {
        log.info("删除宠物：id={}", id);
        petService.deletePet(id);
        Result success = Result.success();
        success.setMessage("删除成功");
        return success;
    }
}