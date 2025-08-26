import { useState } from "react";
import { excursion } from "features/AddExcursionForm/lib/getExcursion";

export function useJoinForm() {

const [formData, setFormData] = useState({
        people: "",
        name: "",
        phone: "",
        email: "",
        comment: "",
      });

    const [errors, setErrors] = useState({
        people: "",
        name: "",
        phone: "",
        email: "",
        comment: "",
    });

    const formattedDate = excursion.date.replace(/-/g, '.');

    const minPeople = parseInt(excursion.min_people);
    const maxPeople = parseInt(excursion.max_people);

    const peopleArray = minPeople === 0
        ? Array.from({ length: maxPeople }, (_, i) => (i + 1).toString())
        : Array.from({ length: maxPeople - minPeople + 1 }, (_, i) => (minPeople + i).toString());
   

    const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    const requiredFields = ['people', 'name', 'phone', 'email', 'comment'] as const;
    
    requiredFields.forEach(field => {
        if (!formData[field]) {
        newErrors[field] = "Пустое поле";
        valid = false;
        }
    });

    if (formData.email && !formData.email.includes("@")) {
        newErrors.email = "Некорректный email";
        valid = false;
    }

    setErrors(newErrors);
    return valid;
    };
        

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
     setFormData(prev => ({
       ...prev,
       [field]: e.target.value
     }));
     setErrors((prev) => ({ ...prev, [field]: "" }));
   };

   const handleSubmit = () => {
    if (validate()) {
      console.log(formData)
    }
      
     };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    setFormData,
    setErrors,
    formattedDate,
    peopleArray
  };
}
