import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      api.get('/foods').then(response => {
        setFoods(response.data);
      });
    }
    loadFoods();
  }, []);

  async function handleAddFood(food: IFoodPlate): Promise<void> {
    try {
      api.post('foods', food);
      setModalOpen(false);

      api.get('/foods').then(response => {
        setFoods(response.data);
      });

      setModalOpen(false);
      // TODO ADD A NEW FOOD PLATE TO THE API
    } catch (err) {
      api.get('/foods').then(response => {
        setFoods(response.data);
      });
    }
  }

  async function handleUpdateFood(food: IFoodPlate): Promise<void> {
    api.patch(`foods/${food.id}`, food);
    api.get('/foods').then(response => {
      setFoods(response.data);
    });
    // TODO UPDATE A FOOD PLATE ON THE API
  }

  async function handleDeleteFood(id: number): Promise<void> {
    async function deleteFoods(): Promise<void> {
      api.delete(`/foods/${id}`);
    }
    deleteFoods();

    async function loadFoods(): Promise<void> {
      api.get('/foods').then(response => {
        setFoods(response.data);
      });
    }
    loadFoods();
    // TODO DELETE A FOOD PLATE FROM THE API
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    setEditingFood(food);
    setEditModalOpen(!editModalOpen);
    api.get('/foods').then(response => {
      setFoods(response.data);
    });
    // TODO SET THE CURRENT EDITING FOOD ID IN THE STATE
  }
  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
