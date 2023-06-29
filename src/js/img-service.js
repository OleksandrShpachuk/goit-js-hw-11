import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37971748-3e0caacc737f5477b690a3c59';
const searchParams = {
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 40,
};

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getImage() {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          key: API_KEY,
          q: this.searchQuery,
          ...searchParams,
          page: this.page,
        },
      });
      this.page += 1;
      return response.data;
    } catch (error) {
      Notify.failure('Failed to fetch images. Please try again later.');
      throw error;
    }
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
