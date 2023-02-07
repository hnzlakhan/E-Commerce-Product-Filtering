import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,

    Container,
    Form,
    Row,
} from "react-bootstrap";
import axios from 'axios';
import {  useNavigate, useSearchParams } from 'react-router-dom';
import Rating from '../components/Rating';

const SearchProductScreen = () => {
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search");

    const [allProducts, setAllProducts] = useState([]);

   

    console.log({ allProducts });

    const urlOpener = url => {
        if (url.includes('www.daraz.pk')) {
            const lastPart = url.split('/');
            const newUrl = `https://www.daraz.pk/products/${lastPart[lastPart.length - 1]}`;
            window.open(newUrl, '_blank');
        }
        else {
            window.open(url, '_blank');
        }
    };

    useEffect(() => {
        const data = {
            search: search
        };
        axios.post('/api/products/search-products', data)
            .then(response => {
                setAllProducts(response.data.allProducts);
            })
            .catch(error => {
                console.log({ error });
            });
    }, [search]);
    const [searchProd, setSearchProd] = useState('');
    
      const navigate = useNavigate();
      const searchHandler = () => {
    if (searchProd) {
      navigate(`/search-products?search=${searchProd}`);
    }
  };
    return (

        <>
         <Form className='mb-5'>
        <fieldset>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="searchProduct">Search Products </Form.Label>
            <Form.Control id="searchProduct" placeholder="Enter Product Name" onChange={e => setSearchProd(e.target.value)} />
          </Form.Group>
          <Button onClick={searchHandler} >Search</Button>
        </fieldset>
            </Form>
            <Container fluid >
           
                <Row  lg="3" xl="3" >
                    
                {allProducts.map((product, index) => {
                    return <Card className='scrap-card' key={index} >
                            
                        <Card.Img className='img-fluid' variant="top" src={product.imageURL} alt='Product' />
                        <Card.Body>
                            <Card.Title>
                                
                                <h6>{product.productName}</h6>
                                </Card.Title>
                            <Card.Text>

                                <h6 className='price'>{
                                
                                `Price: ${product.price}`}</h6>
                            </Card.Text>
                            <Card.Text>
                                <h6>{`Rating: ${product.rating}`} </h6>
                                
                            <Rating
              rating={product.rating}
     
            />

                            </Card.Text>
                               <Card.Text>

                                <h6 className='tag_style'>{
                                
                                `Available on: ${product.tag}`}</h6>
                            </Card.Text>
                          
                       </Card.Body>
                        <Button onClick={() => urlOpener(product.productURL)} target='_blank' rel='noreferrer' className='btn-success scrap-card-button'>VIEW PRODUCT</Button>

                    </Card>
                })}
                    </Row>
                   
            </Container>
            
        </>
      
    )
}

export default SearchProductScreen;
