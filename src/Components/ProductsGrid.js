import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from "../UserContext";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Grid,
  Typography,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Box
} from '@mui/material';

const ProductsGrid = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ brand: [], type: [] });
  const [favorites, setFavorites] = useState([]);
  const { user, userid } = useContext(UserContext);
  const navigate = useNavigate();

  const brands = [
    { _id: '655a8ca5401bc308fbcf3c6d', name: 'BrandA' },
    { _id: '655a8ca5401bc308fbcf3c6e', name: 'BrandB' },
    { _id: '655a8ca5401bc308fbcf3c6f', name: 'BrandC' },
    { _id: '655a8ca5401bc308fbcf3c70', name: 'BrandD' },
    { _id: '655a8ca5401bc308fbcf3c71', name: 'BrandE' }
  ];
  const productTypes = ['Type1', 'Type2', 'Type3'];

  const cardStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const cardMediaStyle = {
    paddingTop: '56.25%', // 16:9 aspect ratio
  };

  useEffect(() => {
    if (userid) {
      axios.get(`/users/${userid}/favorites`)
        .then(response => setFavorites(response.data))
        .catch(error => console.log(error));
    }
  }, [userid]);

  useEffect(() => {
    const fetchProducts = async () => {
      const brandQuery = filters.brand.join(';');
      const typeQuery = filters.type.join(';');
      try {
        const response = await axios.get(`/products?page=${page}&brand=${brandQuery}&type=${typeQuery}`);
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [page, filters]);

  const handleProductClick = (productId) => {
    navigate(`/products/details/${productId}`);
  };

  const handleFilterChange = (e, filterType) => {
    const newFilters = { ...filters };
    if (e.target.checked) {
      newFilters[filterType].push(e.target.value);
    } else {
      newFilters[filterType] = newFilters[filterType].filter(value => value !== e.target.value);
    }
    setFilters(newFilters);
  };

  const unfavoriteProduct = (productId) => {
    if (user) {
      axios.post(`/users/${userid}/favorites/remove`, { productId })
      .then(() => {
        // Update the favorites list after removing the product
        setFavorites(favorites.filter(favorite => favorite.productId !== productId));
      })
        .catch(error => console.log(error));
    } else {
      console.log("用户未登录");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>Filters</Typography>
            <FormGroup>
              <Typography variant="subtitle1">Brands</Typography>
              {brands.map(brand => (
                <FormControlLabel
                  key={brand._id}
                  control={
                    <Checkbox value={brand._id} onChange={(e) => handleFilterChange(e, 'brand')} />
                  }
                  label={brand.name}
                />
              ))}
              <Typography variant="subtitle1" sx={{ marginTop: 2 }}>Types</Typography>
              {productTypes.map((type, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox value={type} onChange={(e) => handleFilterChange(e, 'type')} />
                  }
                  label={type}
                />
              ))}
            </FormGroup>
          </Paper>

          <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
            <Typography variant="h6">Favorites</Typography>
            {favorites.map(favorite => (
              <Box key={favorite.productId} sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                <img src={favorite.image} alt={favorite.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                <Typography variant="body2">{favorite.name}</Typography>
                <RemoveCircleOutlineIcon
                  sx={{ marginLeft: 'auto', cursor: 'pointer' }}
                  onClick={() => unfavoriteProduct(favorite.productId)}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            {products.map(product => (
              <Grid item key={product._id} xs={12} sm={6} md={4}>
                <Card sx={cardStyle}>
                  <CardActionArea onClick={() => handleProductClick(product._id)}>
                    <CardMedia
                      style={cardMediaStyle}
                      image={product.image}
                      title={product.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h2">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {product.description}
                      </Typography>
                      <Typography variant="body1" color="textPrimary">
                        Price: ${product.price}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
            <Button
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              className='button'
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              sx={{ marginLeft: 2 }}
              onClick={() => setPage(prev => prev + 1)}
              className='button'
            >
              Next
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductsGrid;

