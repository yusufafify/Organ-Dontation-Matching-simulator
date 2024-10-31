// Define the base URL for the server (change this to your actual server address if needed)
const BASE_URL = "http://localhost:5000/api/persons";

export const getPerson = async (type) => {
  try {
    const response = await fetch(`${BASE_URL}/${type}`);
    if (!response.ok) throw new Error("Failed to fetch persons");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching persons:", error);
    throw error;
  }
};

export const addPerson = async (person, type) => {
  try {
    const response = await fetch(`http://localhost:5000/api/persons/${type.toLowerCase()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
    if (!response.ok) {
      throw new Error("Failed to add person");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding person:", error);
    throw error;
  }
};
