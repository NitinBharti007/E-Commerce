import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState({
    min: "",
    max: "",
  });
  const [resetFilter, setResetFilter] = useState(false);

  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted) {
        setData(await response.clone().json());
        setFilter(await response.json());
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const filterByCategory = (category) => {
    const updatedList = data.filter((item) => item.category === category);
    setFilter(updatedList);
    setResetFilter(false); // Reset the filter flag when applying category filter
  };

  const filterByPriceRange = (minPrice, maxPrice) => {
    const updatedList = data.filter(
      (item) =>
        item.price >= parseFloat(minPrice) && item.price <= parseFloat(maxPrice)
    );
    setFilter(updatedList);
    setResetFilter(false); // Reset the filter flag when applying price filter
  };

  const resetPriceFilter = () => {
    setSelectedPriceRange({ min: "", max: "" });
    setResetFilter(true);
  };

  useEffect(() => {
    if (resetFilter) {
      setFilter(data);
      setResetFilter(false);
    }
  }, [resetFilter, data]);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterByCategory("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterByCategory("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterByCategory("jewelery")}
          >
            Jewelry
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterByCategory("electronics")}
          >
            Electronics
          </button>
        </div>

        <div className="text-center">
          <label>Price Range: </label>
          <input
            type="number"
            placeholder="Min Price"
            value={selectedPriceRange.min}
            onChange={(e) =>
              setSelectedPriceRange({
                ...selectedPriceRange,
                min: e.target.value,
              })
            }
          />
          <input
            type="number"
            placeholder="Max Price"
            value={selectedPriceRange.max}
            onChange={(e) =>
              setSelectedPriceRange({
                ...selectedPriceRange,
                max: e.target.value,
              })
            }
          />
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() =>
              filterByPriceRange(selectedPriceRange.min, selectedPriceRange.max)
            }
          >
            Filter by Price
          </button>
          <button
            className="btn btn-outline-danger btn-sm m-2"
            onClick={resetPriceFilter}
          >
            Reset Filter
          </button>
        </div>

        {filter.map((product) => {
          return (
            <div
              id={product.id}
              key={product.id}
              className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
            >
              <div className="card text-center h-100" key={product.id}>
                <img
                  className="card-img-top p-3"
                  src={product.image}
                  alt="Card"
                  height={300}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {product.title.substring(0, 12)}...
                  </h5>
                  <p className="card-text">
                    {product.description.substring(0, 90)}...
                  </p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item lead">$ {product.price}</li>
                </ul>
                <div className="card-body">
                  <Link
                    to={"/product/" + product.id}
                    className="btn btn-dark m-1"
                  >
                    Buy Now
                  </Link>
                  <button
                    className="btn btn-dark m-1"
                    onClick={() => addProduct(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
