export async function register(previousState, formData) {
  try {
    const { email, password } = formData;
    console.log({ email, password });
    const res = await fetch("https://note-app-wd85.onrender.com/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data?.error) {
      return { ...previousState, error: data.error };
    }
    return { error: null, success: data };
  } catch (error) {
    console.log(error);
    return { ...previousState, error: "Something went wrong!" };
  }
}
export async function login(previousState, formData) {
  try {
    const { email, password } = formData;
    console.log({ email, password });
    const res = await fetch("https://note-app-wd85.onrender.com/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data?.error) {
      return { ...previousState, error: data.error };
    }
    return { error: null, success: data };
  } catch (error) {
    console.log(error);
    return { ...previousState, error: "Something went wrong!" };
  }
}
