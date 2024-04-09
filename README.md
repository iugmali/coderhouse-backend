# coderhouse-backend

Projeto feito para desafios das aulas de Coderhouse - Backend, turma 54560.
Aplicativo de ecommerce com Node.js, Express, MongoDB e Handlebars.

## Versão em produção

Versão em produção disponível em: [https://coder-backend.iugmali.com/](https://coder-backend.iugmali.com/)

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
- PERSIST_MODE="filesystem" para persistir os datos de produtos e carts em arquivos, ou PERSIST_MODE="mongodb" para persistir em um banco de dados MongoDB.
- MONGODB_CONNECTION precisa ser a string de conexão do seu banco de dados MongoDB, caso opte pela conexão ao mongodb.

## Execução

Para executar o projeto, execute o comando:
```bash
npm start
```
O projeto estará disponível em `http://localhost:8080`.


## API endpoints (com exemplos)

- **GetProducts**
  ```
  GET /api/products
  ```

- **Recuperando produtos limitando o número**
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

- **GetProduct**
  ```
  GET /api/products/{id}
  ```

- **UpdateProduct**
  ```
  PUT /api/products/{id}
  Content-Type: application/json
  ```

- **DeleteProduct**
  ```
  DELETE /api/products/{id}
  ```

- **AddCart**
  ```
  POST /api/carts
  ```

- **GetCart**
  ```
  GET /api/carts/{id}
  ```

- **AddProductToCart**
  ```
  POST /api/carts/{cartId}/product/{productId}
  ```

- **AddProductToCartWithQuantity**
  ```
  POST /api/carts/{cartId}/product/{productId}
  Content-Type: application/json
  ```

Substitua `{id}`, `{cartId}`, and `{productId}` pelos IDs quando usar esses endpoints.
