package com.shuyuan.service.impl;

import com.shuyuan.entity.Pet;
import com.shuyuan.mapper.PetMapper;
import com.shuyuan.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetServiceImpl implements PetService {

    @Autowired
    private PetMapper petMapper;

    @Override
    public List<Pet> getAllPets() {
        return petMapper.selectAll();
    }

    @Override
    public Pet addPet(Pet pet) {
        petMapper.insert(pet);
        return pet;
    }

    @Override
    public void updatePet(Integer id, Pet pet) {
        pet.setId(id);
        int rows = petMapper.update(pet);
        if (rows == 0) {
            throw new RuntimeException("宠物不存在");
        }
    }

    @Override
    public void deletePet(Integer id) {
        int rows = petMapper.deleteById(id);
        if (rows == 0) {
            throw new RuntimeException("宠物不存在");
        }
    }
}