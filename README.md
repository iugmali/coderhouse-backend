## Checklist - aula08

Desenvolva o servidor baseado em Node.JS e express, escutando na porta 8080 e tendo dois grupos de rotas: /products e /carts. Esses endpoints serão implementados com o roteador expresso, com as seguintes especificações:​

### Para gerenciamento de produtos, que terá seu roteador em /api/products/ , configure as seguintes rotas:

- [x] O caminho raiz GET / deve listar todos os produtos no banco de dados. (Incluindo a restrição ?limit do desafio anterior)

- [x] A rota GET/:pid deve trazer apenas o produto com o id informado
- [x] A rota raiz POST / precisará adicionar um novo produto com os campos:

- - id: Number/String (À sua escolha, o id NÃO é enviado no body, ele é gerado automaticamente como vimos desde os primeiros entregáveis, garantindo que os ids NUNCA sejam repetidos no arquivo.)

- - title:String

- - description:String

- - code:String

- - price:Number

- - status:Boolean

- - stock:Number

- - category:String

- - thumbnails:Array de Strings que contém as rotas onde as imagens referentes ao referido produto são armazenadas

O status é true por padrão.

Todos os campos são obrigatórios, exceto thumbnails

- [x] A rota PUT /:pid deve pegar um produto e atualizá-lo pelos campos enviados no body. Você NUNCA deve atualizar ou remover o id no momento de fazer a atualização.

- [x] A rota DELETE /:pid deve deletar o produto com o pid indicado.

### Para o carrinho, que terá seu router em /api/carts/, configure duas rotas:

- [x] O caminho POST/raiz deve criar um novo carrinho com a seguinte estrutura:

- - id: Número/String (À sua escolha, da mesma forma que com os produtos, você deve garantir que os ids nunca sejam duplicados e que sejam gerados automaticamente).

- - products: Array que conterá os objetos que representam cada produto

- [x] A rota GET /:cid deve listar os produtos que pertencem ao carrinho com o parâmetro cid fornecido.

- [x] A rota POST /:cid/product/:pid deve adicionar o produto ao array "products" do carrinho selecionado, adicionando-o como um objeto no seguinte formato:

- - product: DEVE CONTER APENAS O ID DO PRODUTO (É fundamental que você não adicione o produto inteiro)

- - quantity: deve conter o número de exemplares do referido produto. Os produtos, por enquanto, serão adicionados um a um.

- [x] Além disso, se um produto existente tentar ser adicionado ao produto, incremente o campo de quantidade deste produto.

- [x] A persistência da informação será implementada através do file system, onde os arquivos "products,json" e "carts.json" guardam a informação.
