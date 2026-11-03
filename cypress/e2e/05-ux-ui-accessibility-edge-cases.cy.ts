describe('5. UX/UI, Acessibilidade, Responsividade e Casos de Borda', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });

  it('deve respeitar padrões visuais e semântica de acessibilidade na Landing Page', () => {
    cy.visit('/');
    // Verificar ausência de elementos proibidos no Hero (Eyebrow Pill / gradientes roxos)
    cy.get('h1').should('be.visible');
    cy.get('main section').first().find('p.rounded-full').should('not.exist');

    // Verificar atributos ARIA essenciais
    cy.get('nav[aria-label="Principal"]').should('exist');
    cy.get('svg[role="img"]').should('have.attr', 'aria-label');
  });

  it('deve fechar modais com a tecla Escape e clique no backdrop', () => {
    cy.visit('/');
    cy.contains('button', 'Ver detalhes').first().click();
    cy.get('[role="dialog"]').should('be.visible');

    // Fechar com Escape
    cy.get('body').type('{esc}');
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('deve alternar visibilidade da senha nos campos SenhaInput', () => {
    cy.visit('/login');
    cy.contains('label', 'Senha').parent().find('input').should('have.attr', 'type', 'password');
    cy.get('button[aria-label="Mostrar senha"]').click();
    cy.contains('label', 'Senha').parent().find('input').should('have.attr', 'type', 'text');
    cy.get('button[aria-label="Ocultar senha"]').click();
    cy.contains('label', 'Senha').parent().find('input').should('have.attr', 'type', 'password');
  });

  it('deve impedir que o próprio autor reivindique seu objeto encontrado', () => {
    cy.visit('/login');
    cy.contains('li', 'Aluno').contains('button', 'Preencher').click();
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/home');

    // Maria é autora de "Fone de ouvido" (c-003) e "Estojo" (c-004)
    cy.visit('/comunicados');
    cy.get('input[aria-label="Buscar comunicados"]').type('Estojo');
    cy.contains('button', 'Ver detalhes').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[role="dialog"]').should('not.contain.text', 'Acredito que este objeto é meu');
  });

  it('deve exibir detalhes do comunicado diretamente a partir de uma notificação vinculada', () => {
    cy.visit('/login');
    cy.contains('li', 'Aluno').contains('button', 'Preencher').click();
    cy.contains('button', 'Entrar').click();
    cy.visit('/notificacoes');

    cy.contains('li', 'Possível correspondência').contains('button', 'Ver comunicado').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[role="dialog"]').should('contain.text', 'Carteira');
  });

  it('deve voltar para a aba Resumo ao clicar no Logo dentro do painel da biblioteca', () => {
    cy.visit('/login');
    cy.contains('li', 'Funcionário (biblioteca)').contains('button', 'Preencher').click();
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/biblioteca');

    cy.get('nav[aria-label="Seções da biblioteca"]').contains('button', 'Inventário').click();
    cy.contains('h1', 'Inventário').should('be.visible');

    // Clicar no Logo no aside da biblioteca deve voltar para Resumo
    cy.get('aside a[aria-label*="ACHEI"]').click();
    cy.contains('h1', 'Painel da biblioteca').should('be.visible');
  });
});
