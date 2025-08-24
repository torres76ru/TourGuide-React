export let excursion = {
        title: "",
        price: "",
        min_people: "",
        max_people: "",
        description: "",
        date: "",
        min_time: "",
        max_time: "",
        phone: "",
        email: "",
        city: "",
        street: "",
        house: "",
        entrance: "",
        flat: "",
};

export const updateMockExcursion = (newData: any) => {
    excursion = { ...excursion, ...newData };
};