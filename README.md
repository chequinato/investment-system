# Sistema Interno de Pagamentos (Backoffice) – Case Técnico Itaú Unibanco

## Sumário
- [Resumo do Projeto](#resumo-do-projeto)
- [Requisitos Funcionais e Não Funcionais](#requisitos)
- [Modelagem Relacional](#modelagem-relacional)
- [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Explicação das Camadas](#explicacao-das-camadas)
- [Fluxo do Sistema](#fluxo-do-sistema)
- [Organização e Planejamento](#organizacao-e-planejamento)
- [Perguntas para o Cliente](#perguntas-para-o-cliente)


## <a name="resumo-do-projeto"></a>Resumo do Projeto
Este projeto é um sistema interno (backoffice) para registrar compras de ações e processar pagamentos dessas compras, conforme o case técnico do processo seletivo de Estágio em Engenharia de Software do Itaú Unibanco. O sistema foi desenvolvido com foco em clareza, organização, boas práticas e demonstração de raciocínio lógico.

## <a name="requisitos"></a>Requisitos
### Requisitos Funcionais
1. Permitir o cadastro de usuários (autenticação).
2. Registrar compras de ações (ticker, quantidade, preço unitário, valor total, data).
3. Registrar pagamentos para compras, com status (PENDENTE, EXECUTADO, CANCELADO) e data/hora de execução.
4. Exibir todas as compras, pagamentos e o resumo da carteira do usuário autenticado.

### Requisitos Não Funcionais
1. Persistência dos dados em banco relacional (SQLite via Prisma ORM).
2. API RESTful organizada em camadas (controllers, services, routes).
3. Frontend React com autenticação JWT e navegação protegida.
4. Código limpo, modular e documentado.

## <a name="modelagem-relacional"></a>Modelagem Relacional
Entidades principais:
- **User**: id, email, senha (hash), nome
- **Compra**: id, ticker, quantidade, preço unitário, valor total, data de criação, userId (FK)
- **Pagamento**: id, valor, status, dataExecucao, compraId (FK), userId (FK)
- **Carteira**: id, ticker, quantidade, precoMedio, totalInvestido

Relacionamentos:
• Um usuário pode possuir várias compras.
• Uma compra pertence a um único usuário.
• Um usuário pode possuir vários pagamentos.
• Um pagamento pertence a um único usuário.
• Uma compra pode possuir um pagamento associado.
• Um pagamento pertence a uma única compra.

## <a name="arquitetura-e-tecnologias"></a>Arquitetura e Tecnologias
- **Backend**: Node.js, Express, Prisma ORM, SQLite, JWT, bcryptjs
- **Frontend**: React, TypeScript, Vite, React Router DOM
- **Organização**: Separação clara entre controllers, services, rotas, middleware de autenticação, models Prisma

## <a name="funcionalidades-implementadas"></a>Funcionalidades Implementadas
- Cadastro e login de usuários com autenticação JWT
- CRUD de compras de ações (apenas do usuário logado)
- Registro e processamento de pagamentos (status: PENDENTE, EXECUTADO, CANCELADO)
- Resumo da carteira do usuário (total investido, quantidade, preço médio por ação)
- Frontend com telas de login, cadastro, home protegida, formulários e tabelas interativas
- Filtros: cada usuário só vê e manipula seus próprios dados
- Filtros avançados:
	- Compras: filtrar por status e por ticker (nome da compra)
	- Pagamentos: filtrar por valor e mesclar com status
- Dashboard com estatísticas principais do sistema
- Seção de notificações para alertas e atualizações

## <a name="explicacao-das-camadas"></a>Explicação das Camadas
- **Models (Prisma)**: Definem as entidades e relacionamentos do banco.
- **Controllers**: Recebem as requisições, validam dados e chamam os services.
- **Services**: Implementam as regras de negócio e interagem com o banco via Prisma.
- **Routes**: Definem os endpoints da API e aplicam middlewares de autenticação.
- **Middleware**: `auth.ts` protege rotas usando JWT.
- **Frontend**: Telas React para login, cadastro, home (compras, pagamentos, carteira), navegação protegida.

## <a name="fluxo-do-sistema"></a>Fluxo do Sistema
1. Usuário se cadastra e faz login.
2. Usuário registra uma compra de ação.
3. Usuário registra um pagamento para a compra (status inicial: PENDENTE).
4. Usuário processa o pagamento (EXECUTADO ou CANCELADO).
5. Sistema exibe o status atualizado e a data/hora do processamento.
6. Usuário pode ver o resumo da carteira com totais por ação.

## <a name="organizacao-e-planejamento"></a>Organização e Planejamento
- Organização em camadas para facilitar manutenção e testes.
- Uso de JWT para garantir segurança e isolamento dos dados por usuário.
- Próximas funcionalidades: testes automatizados, logs detalhados, exportação de relatórios, permissões de acesso.
- Planejamento: cada nova feature é implementada em branch separada, revisada e testada antes de integrar.

## <a name="perguntas-para-o-cliente"></a>Perguntas para o Cliente
1. O sistema deve permitir editar ou excluir compras/pagamentos?
2. Como deve ser tratado um pagamento cancelado: pode ser reprocessado?
3. O usuário pode cadastrar outros tipos de investimento além de ações no futuro?
4. Há necessidade de relatórios/exportação dos dados?


## Observações Finais
- O projeto foi feito com foco em clareza, segurança e boas práticas.
- Toda a lógica de negócio está centralizada nos services.
- O frontend é simples, mas cobre todo o fluxo solicitado e pode ser expandido facilmente.
- O uso de SQLite e Prisma facilita a portabilidade e entendimento da modelagem.


**Demonstração:**
- Cadastro/login de usuário
- Criação de compra
- Pagamento criado (PENDENTE)
- Pagamento processado (EXECUTADO/CANCELADO)
- Visualização de status, datas e resumo da carteira

