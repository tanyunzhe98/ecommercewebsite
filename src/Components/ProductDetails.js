// ProductDetails.js
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from "../UserContext";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Grid
} from '@mui/material';

const ProductDetails = () => {
  const { productId } = useParams();
  const { user, setUser, userid, setUserid } = useContext(UserContext);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && productId) {
      axios.get(`/users/${userid}/favorites/check/${productId}`)
        .then(response => {
          setIsFavorite(response.data.isFavorite);
        })
        .catch(error => console.log(error));
    }
  }, [user, productId, userid]);

  useEffect(() => {
    // 获取产品详情
    axios.get(`/products/details/${productId}`)
      .then(response => {
        setProduct(response.data);
        // 获取同一品牌的其他产品
        fetchRelatedProducts(response.data.brand._id);
      })
      .catch(error => console.log(error));
  }, [productId]);

  useEffect(() => {
    if (user && product) {
      setIsFavorite((user.favorites || []).includes(product._id));
    }
  }, [user, product]);

  const fetchRelatedProducts = (brandId) => {
    axios.get(`/products/brand/${brandId}`)
      .then(response => setRelatedProducts(response.data))
      .catch(error => console.log(error));
  };

  const handleProductClick = (productId) => {
    navigate(`/products/details/${productId}`);
  };

  const toggleFavorite = () => {
    if (user) {
      const action = isFavorite ? 'remove' : 'add';
      axios.post(`/users/${userid}/favorites/${action}`, { productId })
        .then(response => {
          setUser(response.data);
          setIsFavorite(!isFavorite);
        })
        .catch(error => console.log(error));
    } else {
      console.log("用户未登录");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1, m: 3 }}>
      <Card sx={{ maxWidth: 600, margin: 'auto' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
          <Typography variant="h6">
            Price: ${product.price}
          </Typography>
          {user && (
            <Button
              variant="contained"
              color="primary"
              startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={toggleFavorite}
              sx={{ mt: 2 }}
            >
              {isFavorite ? 'Unfavorite' : 'Favorite'}
            </Button>
          )}
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Related Products:</Typography>
      <Grid container spacing={2}>
        {relatedProducts.map(relatedProduct => (
          <Grid item xs={12} sm={6} md={4} key={relatedProduct._id} onClick={() => handleProductClick(relatedProduct._id)}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="140"
                image={relatedProduct.image}
                alt={relatedProduct.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {relatedProduct.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductDetails;
