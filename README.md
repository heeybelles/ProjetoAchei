🔎 Achei — Achados e Perdidos | FATEC

Perdeu ou encontrou? A gente te ajuda!

O Achei é uma aplicação web desenvolvida para simplificar e organizar o processo de achados e perdidos da FATEC, conectando alunos e funcionários da biblioteca em um único ambiente digital.

O sistema permite registrar objetos perdidos ou encontrados, acompanhar comunicados, receber notificações e gerenciar os itens armazenados na biblioteca.

🎯 Objetivo do projeto

Facilitar a comunicação entre a comunidade acadêmica e a biblioteca, tornando o processo de localização, armazenamento e devolução de objetos mais organizado, acessível e eficiente.

✨ Funcionalidades
👨‍🎓 Área do aluno
Cadastro e login.
Registro de objetos perdidos.
Registro de objetos encontrados.
Consulta de comunicados.
Pesquisa e filtros por categoria e localização.
Acompanhamento dos próprios comunicados.
Notificações sobre atualizações e prazos.
Gerenciamento do perfil.
📚 Área da biblioteca
Painel administrativo.
Visualização de comunicados completos.
Gerenciamento de objetos aguardando entrega.
Confirmação de recebimento físico.
Gerenciamento de solicitações de retirada.
Validação da propriedade dos objetos.
Controle de inventário.
Gerenciamento de objetos com prazo de retirada vencido.
⏰ Regras de negócio
Prazo de até 3 dias úteis para o aluno entregar objetos encontrados à biblioteca.
Registro automático de data e horário.
Notificação quando o prazo de entrega vencer.
Objetos atrasados permanecem pendentes para análise da biblioteca.
Informações detalhadas e imagens de objetos encontrados não são exibidas publicamente.
🎨 Identidade visual

A identidade visual do Achei foi pensada para transmitir confiança, organização, praticidade e modernidade.

Cor	Código
Azul-marinho	#142B4A
Azul principal	#2563EB
Verde-água	#14B8A6
Amarelo	#F5B942
Fundo	#F3F5F8
Branco	#FFFFFF
🛠️ Tecnologias utilizadas
Next.js — Framework React.
React — Biblioteca de interface.
TypeScript — Tipagem estática.
Tailwind CSS — Estilização.
Lucide React — Biblioteca de ícones.
LocalStorage — Persistência local dos dados de demonstração.
🚀 Como executar o projeto
Pré-requisitos
Node.js.
npm.
Git.
1. Clone o repositório
bash
git clone https://github.com/SEU-USUARIO/achei.git

2. Entre na pasta
bash
cd achei

3. Instale as dependências
bash
npm install

4. Execute o projeto
bash
npm run dev

5. Acesse no navegador
text
http://localhost:3000

🔐 Acesso para demonstração

O projeto possui usuários fictícios para testar os diferentes perfis.

Perfil	Email	Senha
Aluno	aluno@fatec.edu.br	aluno123
Biblioteca	biblioteca@fatec.edu.br	biblioteca123

Observação: a autenticação desta versão é simulada e os dados são armazenados localmente no navegador, sem integração com banco de dados.

Não utilizar credenciais ou informações pessoais reais nesta versão.

📂 Estrutura do projeto
text
achei/
├── public/
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── cadastro/
│   │   ├── home/
│   │   ├── comunicados/
│   │   ├── perfil/
│   │   ├── notificacoes/
│   │   └── biblioteca/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── comunicados/
│   │   └── dashboard/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── types/
├── package.json
└── README.md

🔒 Sobre o armazenamento de dados

Nesta primeira versão, o Achei utiliza dados mockados e localStorage para simular o funcionamento da aplicação.

Isso permite demonstrar os fluxos de cadastro, autenticação, comunicados, notificações e gerenciamento da biblioteca sem a necessidade de um backend.

Limitação: os dados são armazenados individualmente em cada navegador e não são compartilhados entre usuários.

Uma futura evolução poderá incluir backend, banco de dados e autenticação real.

📌 Status do projeto

MVP em desenvolvimento.

O objetivo desta versão é validar a experiência do usuário, os fluxos principais e as regras de negócio do sistema.

👩‍💻 Desenvolvimento

Projeto acadêmico desenvolvido para a FATEC.

ACHEI — Achados e Perdidos

Conectando pessoas aos seus objetos perdidos.
