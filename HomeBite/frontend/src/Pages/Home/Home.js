import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(()=>{
    fetchProducts();
  },[])
  const fetchProducts = () => {
    fetch("http://localhost:8000/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {});
  };
  return (
    <div className="row">
      <div className="col-12">
        <div className="container">
          {products.map((data) => {
            return (
              <div className="card">
                <div className="card-body">{data.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
