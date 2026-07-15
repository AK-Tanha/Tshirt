const baseUrl = "http://localhost:8080/"

/* products */
export const getAllProducts = () => fetch(`${baseUrl}products/`)
  .then(response => {
    if (!response.ok) throw new Error('Network error');
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
