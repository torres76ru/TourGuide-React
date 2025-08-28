import { store } from 'app/store/mainStore';
import axios from 'axios';
import { API_BASE_URL } from 'shared/config/constants';

export const reviewApi = {
  //     sendComment: async (attractionID: number, comment: string, rating: number, photo?: File) => {
  //   const accessToken = store.getState().user.accessToken;
  //   const formData = new FormData();
  //   formData.append('attraction', String(attractionID));
  //   formData.append('comment', comment);
  //   formData.append('value', String(rating));
  //   if (photo) formData.append('photo', photo);

  //   const { data } = await axios.post(
  //     `${API_BASE_URL}/ratings/create/`,
  //     formData,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     }
  //   );
  //   return data;
  // },
  sendPhoto: async (attractionID: number, photo: File) => {
    const accessToken = store.getState().user.accessToken;
    const formData = new FormData();
    if (photo) formData.append('photo', photo);

    const { data } = await axios.post(
      `${API_BASE_URL}/attractions/${attractionID}/photos/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },
  sendComment: async (attractionID: number, comment: string, rating: number) => {
    const accessToken = store.getState().user.accessToken;
    const { data } = await axios.post(
      `${API_BASE_URL}/ratings/create/`,
      {
        attraction: attractionID,
        comment,
        value: rating,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  },
  updateComment: async (id: number, attractionID: number, comment: string, rating: number) => {
    const accessToken = store.getState().user.accessToken;
    const { data } = await axios.post(
      `${API_BASE_URL}/ratings/${id}/update/`,
      {
        attraction: attractionID,
        comment,
        value: rating,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  },
};
