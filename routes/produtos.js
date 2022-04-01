//Esta parte é dedicadas as rotas Produtos

const express = require('express');
const router = express.Router();
const mysql = require('../db').pool;

router.get('/', (req, res, next) => {
   mysql.getConnection((error, conn) => {
       if(error){return res.status(500).send({error: error})}
       else{
           conn.query(
               'SELECT * FROM produtos',
               (error, result, field) => {
                    conn.release(); 
                   if(error){return res.status(500).send({error: error})}
                   const response = {
                       quantidade: result.lenght,
                       produtos: result.map(prod => {
                           return {
                               id_produto: prod.id_produto,
                               nome: prod.nome,
                               preco: prod.preco,
                               request: {
                                   tipo: 'GET',
                                   descricao: 'Retorna um produto especifico',
                                   url: 'http://localhost:3000/produtos/' + prod.id_produto
                               }
                           }
                       })
                   }
                   return res.status(200).send({response})
                   
               }
           )
       }
   })
});

router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if (error) {return res.status(500).send({error: error})}
        conn.query(
            "SELECT * FROM produtos WHERE id_produto = ?",
            [req.params.id_produto],
            (error, result, field) =>{
                if (error){return res.status(500).send({error: error})}
                
                if(result.lenght == 0){return res.status(404).send({message: "Não foi localizado produto com este ID"})}

                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: "GET",
                            descricao: "Retorna todos os produtos",
                            url: "http://localhost:3000/produtos"
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
   
    

});

router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
      if(error){return res.status(500).send({error: error})} 
      else{ conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?, ?)',
            [req.body.nome, req.body.preco],
            (error, result, field) => {
               conn.release(); 

               if(error){return res.status(500).send({error: error,response: null});} 
               const response = {
                message: "Produto inserido com sucesso",
                produtoCriado: {
                    id_produto: result.id_produto,
                    nome: req.body.nome,
                    preco: req.body.preco,
                    request: {
                        tipo: "GET",
                        descricao: "Retorna todos os produtos",
                        url:'http://localhost:3000/produtos'
                    }
                }
               }
               
               
               res.status(201).send({response})
               
            }
        );}
    });


});


router.patch('/', (req, res, next) =>{

    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error})}
        else{
            conn.query(
                'UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?',
                [req.body.nome, req.body.preco, req.body.id_produto],
                
                (error, result, field) => {
                    conn.release(); 
                    if(error){return res.status(500).send({error: error})}
                    return res.status(202).send({message: "Produto alterado com sucesso"})
                    
                }
            )
        }
    })
    
});


router.delete('/', (req, res, next) => {
    
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error})}
        else{
            conn.query(
                'DELETE FROM produtos WHERE id_produto = ?',
                [req.body.id_produto],
                (error, resultado, field) => {
                    conn.release(); 
                    if(error){return res.status(500).send({error: error})}
                    return res.status(202).send({message: "Produto removido com sucesso"})
                    
                }
            )
        }
    })

});

module.exports = router;

