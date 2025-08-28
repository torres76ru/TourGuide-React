import type { RootState } from 'app/store/mainStore';
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from 'shared/config/constants';

export function useAddExcursionForm() {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    max_people: '',
    description: '',
    date: '',
    min_time: '',
    max_time: '',
    phone: '',
    email: '',
    city: '',
    street: '',
    house: '',
    entrance: '',
    flat: '',
  });

  const [errors, setErrors] = useState({
    title: '',
    price: '',
    max_people: '',
    description: '',
    date: '',
    min_time: '',
    max_time: '',
    phone: '',
    email: '',
    city: '',
    street: '',
    house: '',
    entrance: '',
    flat: '',
  });

  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    const requiredFields = [
      'title',
      'price',
      'max_people',
      'description',
      'date',
      'phone',
      'email',
      'city',
      'street',
    ] as const;

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'Пустое поле';
        valid = false;
      }
    });

    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Некорректный email';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  const [photo, setPhoto] = useState<File | null>(null);
  const handlePhotoChange = (file: File | null) => {
    if (file) setPhoto(file);
  };

  // Создание массива времени с интервалом 30 минут
  const timeArray = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = (i % 2) * 30;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  // Создание массива чисел от 1 до 100
  const numbArray = Array.from({ length: 100 }, (_, index) => (index + 1).toString());

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      setErrors((prev) => ({ ...prev, [field]: '' }));
    };

  const handleSubmit = async (handleBack: () => void) => {
    if (validate()) {
      try {
        const formDataClean = new FormData();
        formDataClean.append('title', formData.title);
        formDataClean.append('content', formData.description);
        formDataClean.append('date', formData.date);
        formDataClean.append('meeting_email', formData.email);
        formDataClean.append('meeting_phone', formData.phone);
        formDataClean.append(
          'meeting_address',
          `${formData.city}, ${formData.street}, ${formData.house}, ${formData.entrance}, ${formData.flat}`
        );
        formDataClean.append('max_participants', formData.max_people);
        formDataClean.append('title', formData.title);
        formDataClean.append(
          'schedules',
          JSON.stringify([
            {
              day_of_week: 1,
              start_time: '10:00:00',
              end_time: '12:00:00',
            },
            {
              day_of_week: 2,
              start_time: '15:00:00',
              end_time: '17:00:00',
            },
            {
              day_of_week: 3,
              start_time: '10:00:00',
              end_time: '12:00:00',
            },
            {
              day_of_week: 4,
              start_time: '15:00:00',
              end_time: '17:00:00',
            },
            {
              day_of_week: 5,
              start_time: '15:00:00',
              end_time: '17:00:00',
            },
          ])
        );
        if (photo) formDataClean.append('image', photo);

        await axios.post(`${API_BASE_URL}/tours/`, formDataClean, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        handleBack();
      } catch (error) {
        console.error(error);
      }

      console.log(formData);
    } else {
      handleBack();
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    handlePhotoChange,
    setFormData,
    setErrors,
    timeArray,
    numbArray,
    photo,
  };
}
