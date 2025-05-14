import axios from 'axios';

const WIT_API_KEY = 'ZXMDPFUEJHZ2LPN7HEX7RQY7X4VVXCBC';  // Replace with your Wit.ai API Key

const getWitResponse = async (message) => {
  try {
    const response = await axios.get('https://api.wit.ai/message', {
      params: {
        q: message,
      },
      headers: {
        Authorization: `Bearer ${WIT_API_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data from Wit.ai:', error);
    return null;
  }
};

export { getWitResponse };
