import Amplify from 'aws-amplify';

async function getFromApi(apiUrl) {
  try {
    const session = await Amplify.Auth.currentSession();
    const token = session.idToken.jwtToken;

    const res = await fetch(apiUrl, {
      method: "get",
      headers: {
        "Authorization": token
      }
    });

    if (!res.ok) {
      const message = `An error has occurred: ${res.status} - ${res.statusText}`;
      throw new Error(message);
    }

    const data = await res.json();

    const result = {
      status: res.status + "-" + res.statusText,
      data: data,
      error: null
    };
    return result;
  } catch (err) {
    return { error: err.message }
  }
}

async function postToApi(apiUrl, data) {
  try {
    const session = await Amplify.Auth.currentSession();
    const token = session.idToken.jwtToken;

    const res = await fetch(apiUrl, {
      method: "post",
      headers: {
        "Authorization": token
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const msg = `An error has occurred: ${res.status} - ${res.statusText}`;
      throw new Error(msg);
    }

    await res.json();

    return { error: null }

  } catch (err) {
    return { error: err.message }
  }
}

export { getFromApi, postToApi };
