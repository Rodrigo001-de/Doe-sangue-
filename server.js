const express = require('express');
const server = express(); // No caso do express ele tmabém é um funcionalidade

server.use(express.static('public')); // configurando o servidor para apresentar arquivos estáticos

server.use(express.urlencoded({ extended: true })); // Habilitar o body do formulario

const Pool = require('pg').Pool; // Configurar a conexão com o banco de dados, Pool é um tipo de conexão que ele vai fazer mantendo a minha conexão ativa sem ser preciso conectar e desconectar
const db = new Pool({
    user: 'postgres',
    password: 'aparecida007',
    host: 'localhost',
    port: 5432,
    database: 'donation',
}); // new Pool é uma maneira de eu configurar o Pool de cima, esse Pool() tem a cara de uma função mas quando é colocado o new na frente em JavaScript estamos criando um novo objeto e colocando na variável db como o Pool() tem muito aver com função ele vai receber algumas propriedades

const nunjucks = require('nunjucks');
nunjucks.configure('./', { // configurando a template engine(motor para criar modelos de aplicações)
    express: server, // express: propriedade server: valor de propriedade
    noCache: true,
});

// const donors = [  Lista de doadores: Vetor ou Array
  // {
        
  // }
// ]

server.get('/', function(request, response) { // Configurar a apresentação da página
    
    db.query('SELECT * FROM donors', function(err, result) {
        if (err) return response.send("Erro de banco de dados.")

        const donors = result.rows;
        return response.render('index.html', { donors }) // render: renderizar, construir alguma coisa
    })

})

server.post('/', function(request, response) {
    // Pega dados do formulario
    const name = request.body.name;
    const email = request.body.email;
    const blood = request.body.blood;

    if (name == "" || email == "" || blood == "") { // == Verificando se a variável está vazia
        return response.send("Todos os campos são obrigatóros.");
    }

    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)` // Eu consigo substituir esses valores na db.query(query) como o $1 sendo o name, o $2 sendo o email e o $3 sendo o blood

    const values = [name, email, blood];

    db.query(query, values, function(err) {
        if (err) return response.send("erro no banco de dados.");
        
        return response.redirect('/'); // retornar uma resposta de redirecionamento
    })

    // donors.push({
        // name: name,
        //blood: blood,
    // }) // push é uma funcionalidade que vai colocar um valor dentro da minha variável, dentro do meu array

    
})

server.listen(3000) // Ligar o servidor e permitir o acesso na porta 3000