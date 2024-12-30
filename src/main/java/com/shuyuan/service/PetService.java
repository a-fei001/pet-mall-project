package com.shuyuan.service;

import com.shuyuan.entity.Pet;
import java.util.List;

public interface PetService {
    List<Pet> getAllPets();

    Pet addPet(Pet pet);

    void updatePet(Integer id, Pet pet);

    void deletePet(Integer id);
}