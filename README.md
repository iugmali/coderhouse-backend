# coderhouse-backend

Projeto feito para desafios das aulas de Coderhouse - Backend, turma 54560.
Aplicativo backend de ecommerce desenvolvido utilizando Node.js, Express, Mongoose, Handlebars e Socket.io.

## Versão em produção

Versão em produção disponível em: [https://coder.iugmali.com/](https://coder-backend.iugmali.com/)

## Instalação

Para instalar as dependências do projeto, execute o comando:
```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:
```
PERSIST_MODE=
MONGODB_CONNECTION=
```
- `PERSIST_MODE="filesystem"` para persistir os datos de produtos e carts em arquivos, ou `PERSIST_MODE="mongodb"` para persistir em um banco de dados MongoDB.
- `MONGODB_CONNECTION` precisa ser a string de conexão do seu banco de dados MongoDB, caso opte pela persistência via mongodb.

## Execução

Para executar o projeto, execute o comando:
```bash
npm start
```
O projeto estará disponível em `http://localhost:8080`.


## API endpoints (com exemplos)

- **Listando Produtos**
  ```
  GET /api/products
  ```

- **Listando produtos limitando o número em 1**
  ```
  GET /api/products?limit=1
  ```

- **Adicionando um Produto**
  ```
  POST /api/products
  Content-Type: application/json
  ```
  ```json
    {
      "title": "Nome do produto",
      "description": "Descrição do produto",
      "code": "codigo-unico",
      "price": 1000,
      "stock": 20,
      "category": "Category 1"
    }
  ```

- **Recuperando um produto pelo id {productId}**
  ```
  GET /api/products/{productId}
  ```

- **Atualizando um ou mais campos de um produto de id {productId}**
  ```
  PUT /api/products/{productId}
  Content-Type: application/json
  ```
  ```json
    {
      "title": "Título do produto atualizado"
    }
  ```

- **Removendo um produto pelo id {productId}**
  ```
  DELETE /api/products/{productId}
  ```

- **Adicionando um carrinho sem produtos**
  ```
  POST /api/carts
  ```

- **Recuperando um carrinho pelo id {cartId}**
  ```
  GET /api/carts/{cartId}
  ```

- **Adicionando um produto de id {productId} ao carrinho de id {cartId}**
  ```
  POST /api/carts/{cartId}/product/{productId}
  ```

- **Adicionando 10 unidades de um produto de id {productId} ao carrinho {cartId}**
  ```
  POST /api/carts/{cartId}/product/{productId}
  Content-Type: application/json
  ```
   ```json
    {
      "quantity": 10
    }
  ```
