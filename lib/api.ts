const baseUrl = process.env.NEXT_PUBLIC_API_URL;

/* products */
export const getAllProducts = () => fetch(`${baseUrl}products/`)
  .then(response => {
    if (!response.ok) throw new Error('Network error');
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));


  /* supliers */
  export const getAllSuppliers = () => fetch(`${baseUrl}suppliers/`)
    .then(response => {
      if (!response.ok) throw new Error('Network error');
      return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));



