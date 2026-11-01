# ACHEI — Achados e Perdidos da FATEC

MVP em Next.js (App Router), React, TypeScript e Tailwind CSS. Sem banco de dados: tudo fica no `localStorage` do navegador.

## Como rodar
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # versão de produção
```

## Usuários de demonstração
| Perfil | Email | Senha |
|---|---|---|
| Aluno | aluno@fatec.edu.br | aluno123 |
| Funcionário | biblioteca@fatec.edu.br | biblioteca123 |

Novos cadastros sempre criam alunos. Para voltar ao estado inicial: botão "Restaurar dados de demonstração" na tela de login ou em Biblioteca > Configurações.

## Roteiro rápido de teste
1. Entre como aluno, cadastre um objeto encontrado e veja o prazo de 3 dias úteis (sem fins de semana e feriados).
2. Em Comunicados, use busca e filtros; abra um item e clique em "Acredito que este objeto é meu".
3. Entre como biblioteca: confirme recebimentos, valide a solicitação, registre a devolução e a destinação.
4. Volte ao aluno e confira as notificações.

## Estrutura
`src/lib` (storage, dias úteis, dados mock) · `src/services` (regras de negócio) · `src/contexts` (Auth, dados, toasts, formulário) · `src/components` · `src/app` (rotas).

Aviso: autenticação simulada, sem segurança real. Use apenas dados fictícios.
# ProjetoAchei
# ProjetoAchei
