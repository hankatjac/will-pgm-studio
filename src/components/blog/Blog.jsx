import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Sider from "./Sider";
import DOMPurify from "dompurify";
import Spinner from "react-bootstrap/Spinner";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const cat = useLocation().search;
  // console.log(cat);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/posts${cat}`
        );
        setPosts(res.data);
      } catch (err) {
        console.log(err);
        alert(err.response.data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [cat]);

  return (
    <section className="overflow-hidden pt-4">
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            {isLoading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" size="30"/>
              </div>
            ) : (
              posts
                .slice()
                .reverse()
                .map((post) => (
                  <div key={post.id} className="card mb-4">
                    <Link
                      className="text-muted text-decoration-none"
                      to={`/posts/${post.id}`}
                      state={post}
                    >
                      <h1>{post.title}</h1>
                      <LazyLoadImage
                        alt={post.title}
                        src={post.imgUrl}
                        className="img-fluid"
                      />
                      {/* <img className="img-fluid" src={post.imgUrl} alt="" /> */}
                    </Link>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          post.desc?.substring(0, 200)
                        ),
                      }}
                    ></p>
                    {/* <p>{getText(post.desc).substring(0, 200)}</p> */}
                  </div>
                ))
            )}
          </div>
          <div className="col-md-3 ms-auto">
            <Sider />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
