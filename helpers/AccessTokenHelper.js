import * as SecureStore from 'expo-secure-store';

//get access token
export async function getAccessToken() {
  try {
    const value = await SecureStore.getItemAsync('accessToken');
    return value;
  } catch (e) {
    return null
  }
}

export function fetchValidTokenCheck(accessToken) {
  return new Promise(async (resolve) => {
    try {
      
      let url = process.env.EXPO_PUBLIC_API_URL + 'api/auth/token-check'; 
      console.log(url)
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'authorization': accessToken,
        },
        redirect: 'follow',
        referrer: 'client',
      });

      if (!response.ok) {
        console.log(response)
        throw new Error('Network response was not ok');
      }

      const jsonResponse = await response.json();
      console.log(jsonResponse)
      if (jsonResponse !== undefined) {
        resolve(true); //valid token
      } else {
        resolve(false); //invalid token
      }
    } catch (error) {
      console.error('Fetch error:', error);
      resolve(false);
    }
  });
}
