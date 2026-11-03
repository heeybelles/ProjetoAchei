describe('1. Navegação Pública, Landing Page e Comunicados Públicos', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });

  it('deve carregar a Landing Page com todas as seções, cabeçalho e rodapé', () => {
    cy.visit('/');
    cy.contains('h1', 'Perdeu ou encontrou algo na FATEC?').should('be.visible');
    cy.contains('h2', 'Como funciona').should('be.visible');
    cy.contains('h2', 'Comunicados recentes').should('be.visible');
    cy.contains('h2', 'Sobre o Projeto Achei').should('be.visible');
    cy.get('footer').should('be.visible').and('contain.text', 'Biblioteca FATEC');
  });

  it('deve abrir detalhes públicos de um comunicado na Landing Page sem expor dados privados', () => {
    cy.visit('/');
    cy.contains('button', 'Ver detalhes').first().click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[role="dialog"]').should('contain.text', 'Como proceder');
    // Não deve exibir seção de informações privadas no modo público
    cy.get('[role="dialog"]').should('not.contain.text', 'Informações privadas (somente você e a biblioteca)');
    cy.get('[role="dialog"]').find('button[aria-label="Fechar janela"]').click();
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('deve redirecionar para /login ao clicar em "Registrar objeto" sem sessão', () => {
    cy.visit('/');
    cy.contains('button', 'Registrar objeto').click();
    cy.url().should('include', '/login');
  });

  it('deve filtrar, buscar, ordenar e paginar comunicados na página pública /comunicados', () => {
    cy.visit('/comunicados');
    cy.contains('h1', 'Comunicados').should('be.visible');
    cy.contains('13 comunicados encontrados').should('be.visible');

    // Paginação inicial (13 itens, 6 por página = 3 páginas)
    cy.get('nav[aria-label="Paginação"]').should('be.visible');
    cy.get('nav[aria-label="Paginação"]').contains('button', '2').click();
    cy.get('nav[aria-label="Paginação"]').contains('button', '2').should('have.attr', 'aria-current', 'page');

    // Busca textual com acento/normalização
    cy.get('input[aria-label="Buscar comunicados"]').type('garrafa termica');
    cy.contains('1 comunicado encontrado').should('be.visible');
    cy.contains('h3', 'Garrafa térmica').should('be.visible');

    // Limpar filtros
    cy.contains('button', 'Limpar filtros').click();
    cy.contains('13 comunicados encontrados').should('be.visible');

    // Filtro por categoria
    cy.get('select[aria-label="Filtrar por categoria"]').select('Eletrônicos');
    cy.contains('3 comunicados encontrados').should('be.visible');

    // Filtro por tipo
    cy.get('select[aria-label="Filtrar por tipo"]').select('PERDIDO');
    cy.contains('1 comunicado encontrado').should('be.visible');
    cy.contains('h3', 'Pen drive').should('be.visible');

    // Busca sem resultados -> EmptyState
    cy.get('input[aria-label="Buscar comunicados"]').type('objeto inexistente xyz');
    cy.contains('Nenhum comunicado encontrado').should('be.visible');
  });

  it('deve funcionar o menu mobile na navegação pública', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.get('button[aria-label="Abrir menu"]').should('be.visible').click();
    cy.get('nav[aria-label="Principal (celular)"]').should('be.visible');
    cy.get('nav[aria-label="Principal (celular)"]').contains('a', 'Comunicados').click();
    cy.url().should('include', '/comunicados');
  });
});
