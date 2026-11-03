describe('2. Autenticação, Cadastro, Proteção de Rotas e UX de Modais', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });

  it('deve bloquear acesso direto a rotas protegidas sem login', () => {
    cy.visit('/home');
    cy.url().should('include', '/login');

    cy.visit('/biblioteca');
    cy.url().should('include', '/login');

    cy.visit('/perfil');
    cy.url().should('include', '/login');

    cy.visit('/notificacoes');
    cy.url().should('include', '/login');
  });

  it('deve validar campos obrigatórios e formato de email no login', () => {
    cy.visit('/login');
    cy.contains('button', 'Entrar').click();
    cy.contains('Informe seu email institucional.').should('be.visible');
    cy.contains('Informe sua senha.').should('be.visible');

    cy.get('input[type="email"]').type('email-invalido');
    cy.contains('button', 'Entrar').click();
    cy.contains('Digite um email válido.').should('be.visible');

    cy.get('input[type="email"]').clear().type('naoexiste@fatec.edu.br');
    cy.get('input[type="password"]').type('123456');
    cy.contains('button', 'Entrar').click();
    cy.contains('Email ou senha incorretos').should('be.visible');
  });

  it('deve permitir digitar normalmente no modal "Esqueci minha senha" sem perder foco', () => {
    cy.visit('/login');
    cy.contains('button', 'Esqueci minha senha').click();
    cy.get('[role="dialog"]').should('be.visible');
    // Digitar vários caracteres seguidos sem que o modal roube o foco a cada tecla
    cy.get('[role="dialog"] input[type="email"]').click().type('aluno@fatec.edu.br');
    cy.get('[role="dialog"] input[type="email"]').should('have.value', 'aluno@fatec.edu.br');
    cy.get('[role="dialog"]').contains('button', 'Enviar instruções').should('not.be.disabled').click();
    cy.contains('Instruções enviadas (simulação)').should('be.visible');
  });

  it('deve validar formulário de cadastro e criar nova conta de aluno', () => {
    cy.visit('/cadastro');
    cy.contains('button', 'Criar minha conta').click();
    cy.contains('Informe seu nome completo (nome e sobrenome).').should('be.visible');
    cy.contains('Informe seu email institucional.').should('be.visible');
    cy.contains('Informe sua matrícula.').should('be.visible');
    cy.contains('Selecione seu curso.').should('be.visible');
    cy.contains('A senha deve ter no mínimo 6 caracteres.').should('be.visible');

    // Testar email não institucional
    cy.contains('label', 'Nome completo').parent().find('input').type('Lucas Ferreira');
    cy.contains('label', 'Email institucional').parent().find('input').type('lucas@gmail.com');
    cy.contains('label', 'Matrícula').parent().find('input').type('20250199');
    cy.contains('label', 'Curso').parent().find('select').select('Logística');
    cy.contains('label', 'Senha').parent().find('input').type('senha123');
    cy.contains('label', 'Confirmar senha').parent().find('input').type('senha123');
    cy.contains('button', 'Criar minha conta').click();
    cy.contains('Use seu email institucional (@fatec.edu.br ou @fatec.sp.gov.br).').should('be.visible');

    // Corrigir email e concluir cadastro
    cy.contains('label', 'Email institucional').parent().find('input').clear().type('lucas.ferreira@fatec.edu.br');
    cy.contains('button', 'Criar minha conta').click();
    cy.contains('h1', 'Conta criada!').should('be.visible');
    cy.contains('button', 'Entrar agora').click();
    cy.url().should('include', '/home');
    cy.contains('Olá, Lucas!').should('be.visible');
  });
});
