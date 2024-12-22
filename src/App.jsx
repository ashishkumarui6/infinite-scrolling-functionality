import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const loderRef = useRef();
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);

  const fechImages = async (index) => {
    try {
      const url = `https://jsonplaceholder.typicode.com/photos?_page=${index}&_limit=9`;
      const result = await fetch(url);
      const data = result.json();
      return data;
    } catch (err) {
      console.log("Error", err);
    }
  };

  const getData = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const data = await fechImages(page); /// 33
    console.log("page", page);
    setImages((prevImages) => [...prevImages, ...data]); // 27 + 4
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    setPage((prevePgae) => prevePgae + 1);
  }, [page, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver((enteris) => {
      const target = enteris[0];
      if (target.isIntersecting) {
        // call nest page data
        getData();
      }
    });

    if (loderRef.current) {
      observer.observe(loderRef.current);
    }

    return () => {
      if (loderRef.current) {
        observer.unobserve(loderRef.current);
      }
    };
  }, [getData]);

  const fetchFirstPage = async () => {
    const data = await fechImages(1);
    setImages(data);
  };
  useEffect(() => {
    fetchFirstPage();
  }, []);

  console.log("Images", images);
  return (
    <>
      <div className="main">
        <h1 className="top">Infinte Scroling</h1>
        <div className="imgcont">
          {images?.map((it, ix) => {
            return <img key={ix} src={it.thumbnailUrl} alt={it.title} />;
          })}
        </div>
        <div className="bot" ref={loderRef}>
          {loading && <h2>Loading...</h2>}
        </div>
      </div>
    </>
  );
};

export default App;
